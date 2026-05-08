/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Base64 } from 'js-base64'
import { CircularProgress } from '@material-ui/core'
import { FiAlertCircle } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import Collapse from '@material-ui/core/Collapse'
import usePersistedState from '../../hooks/usePersistedState'
import api from '../../services/api'
import Header from '../../components/Header'
import Button from '../../components/Button'
import {
  ConfigData,
  UserData,
  UserDetails,
  Participant,
  ErroProps,
} from '../../utils/interfaces'
import {
  Container,
  Content,
  BtnVoltar,
  AlertContent,
  Timer,
  BtnModal,
} from './styles'
import ModalBox from '../../components/Modal'
import InputSMSCode from '../../components/InputSMSCode'

const Conclusion: React.FC = () => {
  const [configData, setConfigData] = usePersistedState<ConfigData>(
    'configData',
    {} as ConfigData,
  )
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
  const contato = configData.tipoContato === 'S' ? 'SMS' : 'e-mail'
  const [open, setOpen] = useState(false)
  const [sizeCode] = useState(4)

  const formRef = useRef<FormHandles>(null)

  function handleCloseModal(): void {
    setIsModalOpen(false)
  }
  const history = useHistory()

  const handleConfirmaAdesao = useCallback(async () => {
    setAguarde(true)
    const parametros = Base64.encode(
      `{
        "token": "${configData.token}",
        "versao": "${configData.tipo}",
        "plano": "${configData.plano}",
        "nome": "${userData.name.toLowerCase()}",
        "cpf": "${userData.cpf.replaceAll('.', '').replace('-', '')}",
        "nascimento": "${userData.birthdate}",
        "admissao":"${userData.admission}",
        "email": "${userData.email}",
        "telefone": "55${userData.phone
          .replace('(', '')
          .replace(') ', '')
          .replace('-', '')}",
        "patrocinadora":"${userData.patrocinadora}",
        "nomeMae": "${userData.parental.toLowerCase()}",
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
        "forma_resgate": "${
          selectedReceive === undefined ? '' : selectedReceive
        }",
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
          "cpf": "${participant.data.cpf.replaceAll('.', '').replace('-', '')}",
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

    // history.push('/end')

    await api
      .post(`wsAdesao.rule?sys=ADZ&Entrada=${parametrosFinal}`)
      .then(() => {
        localStorage.removeItem('@Funssest:configData')
        localStorage.removeItem('@Funssest:participantsGroup')
        localStorage.removeItem('@Funssest:PercentualValuePercent')
        localStorage.removeItem('@Funssest:receiveTypeSelected')
        localStorage.removeItem('@Funssest:TimeValueYears')
        localStorage.removeItem('@Funssest:totalBalance')
        localStorage.removeItem('@Funssest:userData')
        localStorage.removeItem('@Funssest:userDetails')
        localStorage.removeItem('@Funssest:erroProps')
        localStorage.removeItem('@Funssest:acceptTerms')
        localStorage.removeItem('@Funssest:RendaFixaValue')
        localStorage.removeItem('@Funssest:flagEdit')
        localStorage.removeItem('@Funssest:aportAccept')
        localStorage.removeItem('@Funssest:aportFlag')
        localStorage.removeItem('@Funssest:flagAssistencial')
        localStorage.removeItem('@Funssest:flagTubarao')

        history.push('/end')
      })
      .catch(res => {
        if (res.message === 'Request failed with status code 401') {
          alert('Tempo de sessão expirado')
          history.push('/register')
        } else if (res.message === 'Request failed with status code 406') {
          setWarningText(
            'Adesão não autorizada. Verifique se você já possui cadastro no plano.',
          )
          setIsModalOpen(true)
          setReSend(false)
          setTimer(20)
          setAguarde(false)
        } else if (res.message === 'Network Error') {
          setErroProps({
            title: res.message,
            description: 'Falha na conexão como servidor',
          })
          history.push('/erro')
        } else if (res.message === 'Request failed with status code 500') {
          setErroProps({
            title: 'Erro interno no servidor',
            description: res.message,
          })
          history.push('/erro')
        } else if (res.message === 'Request failed with status code 408') {
          alert('Tempo de sessão expirado')
          history.push('/register')
        } else {
          setReSend(false)
          setTimer(20)
          setAguarde(false)
          setWarningText('Ops, algo deu errado. Tente novamente mais tarde.')
          setIsModalOpen(true)
        }
      })
  }, [
    configData,
    history,
    participants,
    selectedReceive,
    setErroProps,
    userData,
    userDetails,
    flagAssistencial,
  ])

  const handleConfirmaCodigo = useCallback(
    async data => {
      if (data.codeSMS.length === sizeCode) {
        const parametros = Base64.encode(
          `{"token": "${configData.token}",
          "codigoValidador": "${data.codeSMS}",
          "cliente": "${configData.codCliente}"}`,
        )

        const parametrosFinal = Base64.encode(parametros)

        await api
          .post(`wsAutenticacao.rule?sys=ADZ&Entrada=${parametrosFinal}`)
          .then(() => {
            handleConfirmaAdesao()
          })
          .catch(res => {
            if (res.message === 'Request failed with status code 401') {
              setOpen(true)
            } else {
              // eslint-disable-next-line no-alert
              alert('Ops, algo deu errado. Tente novamente mais tarde.')
            }
          })
      }
    },
    [configData.codCliente, configData.token, handleConfirmaAdesao, sizeCode],
  )

  const handleReSend = useCallback(async () => {
    const parametrosGet = Base64.encode(
      `{"versao":"${configData.tipo}",
        "plano": "${configData.plano}",
        "cliente":"${configData.codCliente}",
        "cpf":"${
          userData.cpf === undefined
            ? ''
            : userData.cpf.replaceAll('.', '').replace('-', '')
        }",
        "email":"${userData.email === undefined ? '' : userData.email}",
        "telefone":"${
          userData.phone === undefined
            ? ''
            : `55${userData.phone
                .replace('(', '')
                .replace(') ', '')
                .replace('-', '')}`
        }",
        "admissao":"${userData.admission}",
        "envio":"${configData.tipoContato}"}`,
    )

    const parametrosFinalGet = Base64.encode(parametrosGet)

    await api
      .get(`wsAutenticacao.rule?sys=ADZ&Entrada=${parametrosFinalGet}`)
      .then(res =>
        setConfigData({
          ...configData,
          token: res.data.token,
        }),
      )
      .catch(() => alert('Ops, algo deu errado. Tente novamente mais tarde.'))

    history.push('/register/confirm-sms')

    setReSend(false)
    setTimer(60)
    window.location.reload()
  }, [userData, configData, history, setConfigData])

  useEffect(() => {
    const countTimer = (): void => {
      if (timer > 1) {
        setTimer(timer - 1)
      } else if (timer === 1) {
        setTimer(timer - 1)
        setReSend(true)
      }
    }

    const interval = setInterval(countTimer, 1000)

    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          <strong>Confirmação de Adesão</strong>
          <span>
            Eu <b style={{ textTransform: 'uppercase' }}>{userData.name}</b>,
            inscrito no CPF <b>{userData.cpf}</b>, declaro que ao{' '}
            <b>preencher o código validador</b>, confirmo minha adesão ao{' '}
            <b>Plano V Funssest</b> e que as informações prestadas são
            verídicas.
          </span>
          <Form ref={formRef} onSubmit={handleConfirmaCodigo}>
            <InputSMSCode name="codeSMS" size={sizeCode} formRef={formRef} />
          </Form>

          <Collapse in={open}>
            <AlertContent>
              <div>
                <FiAlertCircle />
                <p>Código incorreto!</p>
              </div>
              <button type="button" onClick={() => window.location.reload()}>
                Limpar
              </button>
            </AlertContent>
          </Collapse>
          {aguarde ? (
            <>
              <CircularProgress color="inherit" />
              <span>Aguarde</span>
            </>
          ) : (
            <>
              <Timer>00:{timer < 10 ? `0${timer}` : timer}</Timer>
              <p>Não está recebendo o código? Sem problemas!</p>
              <p>
                Clique em <strong>reenviar</strong> para receber um novo código
                via {contato}
              </p>
              <Button
                onClick={handleReSend}
                type="button"
                color="white"
                disabled={!reSend}
                fontSize="small"
              >
                Reenviar
              </Button>
            </>
          )}
        </Content>
        <BtnVoltar type="button" onClick={() => history.push('resume')}>
          Quero trocar a forma de contato
        </BtnVoltar>

        <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
          <p>{warningText}</p>
          <BtnModal isActive onClick={() => history.push('/resume')}>
            Ok
          </BtnModal>
        </ModalBox>
      </Container>
    </>
  )
}

export default Conclusion
