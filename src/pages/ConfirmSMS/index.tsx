import { Form, Formik } from 'formik'
import { Base64 } from 'js-base64'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiAlertCircle } from 'react-icons/fi'
import Button from '../../components/Button'
import Collapse from '../../components/Collapse'
import InputSMSCode from '../../components/InputSMSCode'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import Spinner from '../../components/Spinner'
import useConfigData from '../../hooks/useConfigData'
import usePersistedState from '../../hooks/usePersistedState'
import api from '../../services/api'
import { persistErrorAndRedirect } from '../../utils/apiError'
import { sanitizeCpf, sanitizePhone, scrollToTop } from '../../utils/browser'
import { UserData, ErroProps } from '../../utils/interfaces'

interface ConfirmSmsFormValues {
  codeSMS: string
}

const ConfirmSMS: React.FC = () => {
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [configData, setConfigData] = useConfigData()
  const [, setErroProps] = usePersistedState<ErroProps>(
    'erroProps',
    {} as ErroProps,
  )

  const [reSend, setReSend] = useState(false)
  const [open, setOpen] = useState(false)
  const [sizeCode] = useState(4)
  const [timer, setTimer] = useState(60)
  const [formKey, setFormKey] = useState(0)
  const [aguarde, setAguarde] = useState(false)

  const history = useHistory()
  const contato = configData.tipoContato === 'S' ? 'SMS' : 'e-mail'
  const firstName = useMemo(
    () => userData?.name?.split(' ')[0] ?? 'Participante',
    [userData?.name],
  )

  const resetCodeInput = useCallback(() => {
    setOpen(false)
    setFormKey(current => current + 1)
  }, [])

  const redirectMissingToken = useCallback(() => {
    setErroProps({
      title: 'Não foi possível validar o código',
      description: 'Sua sessão de autenticação expirou. Preencha seus dados novamente para continuar.',
    })
    history.push('/register')
  }, [history, setErroProps])

  const handleSubmit = useCallback(
    async (data: ConfirmSmsFormValues) => {
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
        history.push('/contribution')
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
      history,
      redirectMissingToken,
      setConfigData,
      setErroProps,
      sizeCode,
    ],
  )

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

  const handleReSend = useCallback(async () => {
    setAguarde(true)

    const parametrosGet = Base64.encode(
      `{"versao":"${configData.tipo}",
        "plano": "${configData.plano}",
        "cliente":"${configData.codCliente}",
        "cpf":"${sanitizeCpf(userData.cpf)}",
        "email":"${userData.email ?? ''}",
        "telefone":"55${sanitizePhone(userData.phone)}",
        "patrocinadora":"${userData.patrocinadora}",
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
        setAguarde(false)
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
    scrollToTop()
  }, [])

  return (
    <PageLayout containerClassName="mb-[10px] max-md:max-w-[500px]">
      <PageCard className="flex flex-col items-center px-0 py-4">
        <span className="mt-3 w-86 text-center text-base text-ink-900">
          <strong className="text-base text-ink-900">{firstName}</strong>,
          digite aqui o código de verificação que acabamos de enviar via{' '}
          {contato}
        </span>
        <Formik<ConfirmSmsFormValues>
          key={formKey}
          initialValues={{ codeSMS: '' }}
          onSubmit={handleSubmit}
        >
          <Form className="my-6">
            <InputSMSCode name="codeSMS" size={sizeCode} />
          </Form>
        </Formik>

        <Collapse in={open}>
          <div className="relative mb-3 flex max-w-62.5 flex-col items-center rounded-sm p-2 font-bold text-danger">
            <div className="mb-1.25 flex max-w-50 items-center justify-between gap-2">
              <FiAlertCircle className="text-[20px]" />
              <p>Código incorreto.</p>
            </div>
            <button
              className="border-0 bg-transparent text-xs text-ink-900 hover:underline focus:underline"
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
            <span className="my-3 text-xs text-brand-400 md:text-sm">
              00:{timer < 10 ? `0${timer}` : timer}
            </span>
            <p className="text-center text-sm leading-5">
              Não está recebendo o código? Sem problemas!
            </p>
            <p className="w-9/10 text-center text-sm leading-5">
              Clique em <strong className="text-sm">reenviar</strong> para receber
              um novo código.
            </p>
            <Button
              onClick={handleReSend}
              type="button"
              color="orange"
              disabled={!reSend}
            >
              Reenviar
            </Button>
          </>
        )}
        <Link
          className="mt-3 flex flex-col items-center justify-center bg-transparent p-2 text-xs text-brand-400 no-underline transition hover:text-ink-900 focus:underline md:p-2 md:text-sm"
          to="/register"
        >
          Quero trocar a forma de contato
        </Link>
      </PageCard>
    </PageLayout>
  )
}

export default ConfirmSMS

