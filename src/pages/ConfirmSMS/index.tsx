/* eslint-disable no-alert */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useRef, useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { Base64 } from 'js-base64'

import { FiAlertCircle } from 'react-icons/fi'
import Collapse from '@material-ui/core/Collapse'

import usePersistedState from '../../hooks/usePersistedState'
import api from '../../services/api'

import InputSMSCode from '../../components/InputSMSCode'
import Button from '../../components/Button'
import Header from '../../components/Header'

import { ConfigData, UserData, UserDetails } from '../../utils/interfaces'
import { Container, Content, AlertContent, Timer, LinkBack } from './styles'

const ConfirmSMS: React.FC = () => {
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [userDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [configData, setConfigData] = usePersistedState<ConfigData>(
    'configData',
    {} as ConfigData,
  )

  const [reSend, setReSend] = useState(false)
  const [open, setOpen] = useState(false)
  const [sizeCode] = useState(4)
  const [timer, setTimer] = useState(60)

  const history = useHistory()
  const formRef = useRef<FormHandles>(null)
  const contato = configData.tipoContato === 'S' ? 'SMS' : 'e-mail'

  const handleSubmit = useCallback(
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
            // if (userDetails.pctContribuicaoSuplementar !== 0) {
            //   history.push('/aport-confirmation')
            // } else {
            history.push('/welcome')
            // }
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
    [configData, history, sizeCode, userDetails],
  )

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
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />

      <Container>
        <Content>
          <span>
            <strong>{userData?.name.split(' ')[0]}</strong>, digite aqui o
            código de verificação que acabamos de te enviar via {contato}
          </span>
          <Form ref={formRef} onSubmit={handleSubmit}>
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

          <Timer>00:{timer < 10 ? `0${timer}` : timer}</Timer>
          <p>Não está recebendo o código? Sem problemas!</p>
          <p>
            Clique em <strong>reenviar</strong> para receber um novo código
          </p>
          <Button
            onClick={handleReSend}
            type="button"
            color="orange"
            disabled={!reSend}
          >
            Reenviar
          </Button>
          <LinkBack to="/register">Quero trocar a forma de contato</LinkBack>
        </Content>
      </Container>
    </>
  )
}

export default ConfirmSMS
