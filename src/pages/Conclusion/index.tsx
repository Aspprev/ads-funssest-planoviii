/* eslint-disable no-nested-ternary */
import { Form, Formik } from 'formik'
import { Base64 } from 'js-base64'
import React, { useCallback, useEffect, useState } from 'react'
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import Collapse from '../../components/Collapse'
import InputSMSCode from '../../components/InputSMSCode'
import ModalBox from '../../components/Modal'
import ModalActionButton from '../../components/ModalActionButton'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import Spinner from '../../components/Spinner'
import useConfigData from '../../hooks/useConfigData'
import usePersistedState from '../../hooks/usePersistedState'
import api from '../../services/api'
import { persistErrorAndRedirect } from '../../utils/apiError'
import { sanitizeCpf, sanitizePhone, scrollToTop } from '../../utils/browser'
import {
  removeStorageItems,
} from '../../utils/storage'
import {
  ErroProps,
  Participant,
  UserData,
  UserDetails,
} from '../../utils/interfaces'

interface ConfirmationCodeValues {
  codeSMS: string
}

const Timer = ({ children }: React.PropsWithChildren): React.JSX.Element => (
  <span className="my-3 text-xs text-brand-400 md:text-sm">{children}</span>
)

const Conclusion: React.FC = () => {
  const [configData, setConfigData] = useConfigData()
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [userDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [selectedReceive] = usePersistedState<'PD' | 'PS' | null>(
    'receiveTypeSelected',
    'PD',
  )
  const [participants] = usePersistedState<Participant[]>(
    'participantsGroup',
    [],
  )
  const [flagAssistencial] = usePersistedState('flagAssistencial', '')
  const [, setErroProps] = usePersistedState<ErroProps>(
    'erroProps',
    {} as ErroProps,
  )
  const [aguarde, setAguarde] = useState(false)
  const [timer, setTimer] = useState(60)
  const [reSend, setReSend] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [warningText, setWarningText] = useState('')
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [sizeCode] = useState(4)
  const contato = configData.tipoContato === 'S' ? 'SMS' : 'e-mail'
  const history = useHistory()

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const resetCodeInput = useCallback(() => {
    setOpen(false)
    setFormKey(current => current + 1)
  }, [])

  const redirectMissingToken = useCallback(() => {
    setErroProps({
      title: 'Não foi possível validar o código',
      description: 'Sua sessão de autenticação expirou. Revise seus dados e solicite um novo código.',
    })
    history.push('/resume')
  }, [history, setErroProps])

  const handleConfirmaAdesao = useCallback(async () => {
    setAguarde(true)

    const parametros = Base64.encode(
      `{
        "token": "${configData.token}",
        "versao": "${configData.tipo}",
        "plano": "${configData.plano}",
        "cliente": "${configData.codCliente}",
        "nome": "${(userData.name ?? '').toLowerCase()}",
        "cpf": "${sanitizeCpf(userData.cpf)}",
        "nascimento": "${userData.birthdate ?? ''}",
        "admissao":"${userData.admission ?? ''}",
        "email": "${userData.email ?? ''}",
        "telefone": "55${sanitizePhone(userData.phone)}",
        "patrocinadora":"${userData.patrocinadora ?? ''}",
        "nomeMae": "${(userData.parental ?? '').toLowerCase()}",
        "salario": "${userDetails.salario}",
        "valor": "${userDetails.contribuicaoBasica
          .toString()
          .replace('.', ',')}",
        "pctCtbBasica": "${userDetails.pctContribuicaoBasica
          .toFixed(2)
          .toString()
          .replace('.', ',')}",
        "valorPatroc": "${userDetails.contribuicaoPatrocinadora
          .toString()
          .replace('.', ',')}",
        "pctCtbPatroc": "${userDetails.pctContribuicaoBasica
          .toFixed(2)
          .toString()
          .replace('.', ',')}",
        "valorsuplementar": "${userDetails.contribuicaoSuplementar
          .toString()
          .replace('.', ',')}",
        "pctCtbSuplementar": "${userDetails.pctContribuicaoSuplementar
          .toFixed(2)
          .toString()
          .replace('.', ',')}",
        "idade_apos":"${userDetails.age}",
        "tempo_contribuicao": "${userDetails.years}",
        "politicamenteexposto": "${userDetails.ppe}",
        "usperson": "${userDetails.usperson}",
        "perfilInvest": "${userDetails.investor}",
        "forma_resgate": "${selectedReceive ?? ''}",
        "assistencial":"${flagAssistencial}",
        "beneficiarios": [${participants.map(
          participant => `
          {"nome": "${participant.data.name.toLowerCase()}",
          "nascimento": "${participant.data.birthdate}",
          "parentesco":"${
            participant.details.grauParentesco === undefined
              ? 0
              : participant.details.grauParentesco
          }",
          "tipo":"${participant.details.tipoBen}",
          "cpf": "${sanitizeCpf(participant.data.cpf)}",
          "mrcInvalidez":"${
            participant.details.mrcInvalidez === undefined
              ? ''
              : participant.details.mrcInvalidez
          }",
          "fator":"${
            participant.details.proporcao === undefined
              ? '0'
              : participant.details.proporcao.toString().replace('.', ',')
          }"}`,
        )}]
      }`,
    )

    const parametrosFinal = Base64.encode(parametros)

    try {
      await api.post(`wsAdesao.rule?sys=ADZ&Entrada=${parametrosFinal}`)

      removeStorageItems([
        'configData',
        'participantsGroup',
        'PercentualValuePercent',
        'receiveTypeSelected',
        'TimeValueYears',
        'totalBalance',
        'userData',
        'userDetails',
        'erroProps',
        'acceptTerms',
        'RendaFixaValue',
        'flagEdit',
        'aportAccept',
        'aportFlag',
        'flagAssistencial',
        'flagTubarao',
      ])

      history.push('/end')
    } catch (error) {
      const status =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined

      if (status === 401 || status === 408) {
        setErroProps({
          title: 'Sessão expirada',
          description: 'Sua sessão expirou. Preencha seus dados novamente para continuar.',
        })
        setAguarde(false)
        history.push('/register')
        return
      }

      if (status === 406) {
        setWarningText(
          'Adesão não autorizada. Verifique se você já possui cadastro no plano.',
        )
        setIsModalOpen(true)
        setReSend(false)
        setTimer(20)
        setAguarde(false)
        return
      }

      setReSend(false)
      setTimer(20)
      setAguarde(false)

      if (status && status < 500) {
        setWarningText('Ops, algo deu errado. Tente novamente mais tarde.')
        setIsModalOpen(true)
        return
      }

      persistErrorAndRedirect(history, setErroProps, error)
    }
  }, [
    configData,
    flagAssistencial,
    history,
    participants,
    selectedReceive,
    setErroProps,
    userData,
    userDetails,
  ])

  const handleConfirmaCodigo = useCallback(
    async (data: ConfirmationCodeValues) => {
      if (data.codeSMS.length !== sizeCode) {
        return
      }

      setAguarde(true)

      const currentToken = configData.token

      if (!currentToken) {
        setAguarde(false)
        redirectMissingToken()
        return
      }

      const parametros = Base64.encode(
        `{"token": "${currentToken}",
          "codigoValidador": "${data.codeSMS}",
          "cliente": "${configData.codCliente}"}`,
      )

      const parametrosFinal = Base64.encode(parametros)

      try {
        const res = await api.post(
          `wsAutenticacaoV5.rule?sys=ADZ&Entrada=${parametrosFinal}`,
        )

        setConfigData(current => ({
          ...current,
          token: res.data?.token ?? current.token,
        }))
        await handleConfirmaAdesao()
      } catch (error) {
        const status =
          error && typeof error === 'object' && 'response' in error
            ? (error as { response?: { status?: number } }).response?.status
            : undefined

        if (status === 401) {
          setOpen(true)
          setAguarde(false)
          return
        }

        setAguarde(false)
        persistErrorAndRedirect(history, setErroProps, error)
      }
    },
    [
      configData.codCliente,
      configData.token,
      handleConfirmaAdesao,
      history,
      redirectMissingToken,
      setConfigData,
      setErroProps,
      sizeCode,
    ],
  )

  const handleReSend = useCallback(async () => {
    const parametrosGet = Base64.encode(
      `{"versao":"${configData.tipo}",
        "plano": "${configData.plano}",
        "cliente":"${configData.codCliente}",
        "cpf":"${sanitizeCpf(userData.cpf)}",
        "email":"${userData.email ?? ''}",
        "telefone":"55${sanitizePhone(userData.phone)}",
        "patrocinadora":"${userData.patrocinadora ?? ''}",
        "admissao":"${userData.admission ?? ''}",
        "envio":"${configData.tipoContato}"}`,
    )

    const parametrosFinalGet = Base64.encode(parametrosGet)

    try {
      const res = await api.get(
        `wsAutenticacaoV5.rule?sys=ADZ&Entrada=${parametrosFinalGet}`,
      )
      const nextToken = res.data?.token

      if (!nextToken) {
        redirectMissingToken()
        return
      }

      setConfigData(current => ({
        ...current,
        token: nextToken,
      }))
      setReSend(false)
      setTimer(60)
      setAguarde(false)
      resetCodeInput()
    } catch (error) {
      setAguarde(false)
      persistErrorAndRedirect(history, setErroProps, error)
    }
  }, [
    configData.codCliente,
    configData.plano,
    configData.tipo,
    configData.tipoContato,
    history,
    redirectMissingToken,
    resetCodeInput,
    setConfigData,
    setErroProps,
    userData.admission,
    userData.cpf,
    userData.email,
    userData.phone,
  ])

  useEffect(() => {
    if (timer <= 0) {
      setReSend(true)
      return
    }

    const interval = window.setInterval(() => {
      setTimer(current => {
        if (current <= 1) {
          window.clearInterval(interval)
          setReSend(true)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [timer])

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout containerClassName="mb-0 max-md:max-w-[500px]">
      <PageCard className="flex flex-col items-center px-0 py-4">
        <strong className="text-center text-lg font-bold text-brand-400">
          Confirmação de adesão
        </strong>
        <span className="mt-3 px-6 text-center text-base text-ink-900">
          Eu <b style={{ textTransform: 'uppercase' }}>{userData.name}</b>,
          inscrito no CPF <b>{userData.cpf}</b>, declaro que, ao{' '}
          <b>preencher o código validador</b>, confirmo minha adesão ao{' '}
          <b>Plano VIII Funssest</b> e que as informações prestadas são
          verídicas.
        </span>
        <Formik<ConfirmationCodeValues>
          key={formKey}
          initialValues={{ codeSMS: '' }}
          onSubmit={handleConfirmaCodigo}
        >
          <Form className="my-6">
            <InputSMSCode name="codeSMS" size={sizeCode} />
          </Form>
        </Formik>

        <Collapse in={open}>
          <div className="relative mb-3 flex max-w-60 flex-col items-center rounded-sm p-2 font-bold text-danger">
            <div className="mb-1 flex max-w-50 items-center justify-between">
              <FiAlertCircle className="absolute text-[20px]" />
              <p className="pl-7 text-sm">Código incorreto.</p>
            </div>
            <button
              className="border-0 bg-transparent text-xs text-ink-900"
              type="button"
              onClick={resetCodeInput}
            >
              Limpar
            </button>
          </div>
        </Collapse>
        {aguarde ? (
          <>
            <Spinner />
            <span>Aguarde</span>
          </>
        ) : (
          <>
            <Timer>00:{timer < 10 ? `0${timer}` : timer}</Timer>
            <p className="w-9/10 text-center text-sm leading-5">
              Não está recebendo o código? Sem problemas!
            </p>
            <p className="mb-3 w-9/10 text-center text-sm leading-5">
              Clique em <strong>reenviar</strong> para receber um novo código
              via {contato}.
            </p>
            <Button
              onClick={handleReSend}
              type="button"
              color="orange"
              disabled={!reSend}
              fontSize="normal"
            >
              Reenviar
            </Button>
          </>
        )}
      </PageCard>
      <BackButton
        type="button"
        className="m-4"
        onClick={() => history.push('/resume')}
      >
        <FiArrowLeft /> Quero trocar a forma de contato
      </BackButton>

      <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        <p>{warningText}</p>
        <ModalActionButton onClick={() => history.push('/resume')}>
          Ok
        </ModalActionButton>
      </ModalBox>
    </PageLayout>
  )
}

export default Conclusion
