import React, { useCallback, useRef } from 'react'

import { useHistory, useLocation } from 'react-router-dom'
import { Base64 } from 'js-base64'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { FiUser, FiCalendar, FiCheck } from 'react-icons/fi'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { MdSecurity } from 'react-icons/md'
import { BiDollar } from 'react-icons/bi'
import Switch from 'react-switch'
import * as Yup from 'yup'
import Alert from '@material-ui/lab/Alert'
import { Container, Content, BtnVoltar } from './styles'
import Header from '../../../components/Header'
import usePersistedState from '../../../hooks/usePersistedState'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import InputSelect from '../../../components/InputSelect'

import api from '../../../services/api'

interface UserData {
  name: string
  phone: string
  cpf: string
}

interface UserDetails {
  email: string
  birthdate: Date
  contribution: number
  years: number
  // bestDayPayment: number
  // paymentType: string
}
interface FormToken {
  token: string
}

const ConfirmOwnership: React.FC = () => {
  const [userData, setUserData] = usePersistedState<UserData>(
    'userData',
    {} as UserData,
  )
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [token, setToken] = usePersistedState<FormToken>(
    'token',
    {} as FormToken,
  )

  const [
    authorizeTitularPayment,
    setAuthorizeTitularPayment,
  ] = usePersistedState('authorizeTitularPayment', false)

  const { pathname } = useLocation()
  const history = useHistory()

  const formRef = useRef<FormHandles>(null)

  const toggleAuthorizeTitularPayment = useCallback(() => {
    setAuthorizeTitularPayment(!authorizeTitularPayment)
  }, [authorizeTitularPayment, setAuthorizeTitularPayment])

  const handleSubmit = useCallback(
    async data => {
      try {
        await setUserData({ ...userData, name: data.name, cpf: data.cpf })
        await setUserDetails({
          ...userDetails,
          // bestDayPayment: data.bestDayPayment,
          contribution: data.contribution,
          // paymentType: data.paymentType,
        })
      } catch (err) {
        console.log(err)
      }
      if (data.cpf === '') alert('O campo CPF é obrigatório.')
      else {
        let telTrat = userData.phone.replace('(', '')
        telTrat = telTrat.replace(')', '')
        telTrat = telTrat.replace(' ', '')
        telTrat = telTrat.replace('-', '')

        let cpfTrat = data.cpf.replace('.', '')
        cpfTrat = cpfTrat.replace('.', '')
        cpfTrat = cpfTrat.replace('-', '')

        console.log('entrou')
        const parametros = Base64.encode(
          `{
        "token": "${token}",
        "nome": "${userData.name}",
        "cpf": "${cpfTrat}",
        "nascimento": "${userDetails.birthdate}",
        "email": "${userDetails.email}",
        "telefone": "55${telTrat}",
        "valor": "${userDetails.contribution}"
        }`,
        )

        const parametrosFinal = Base64.encode(parametros)

        await api
          .post(`wsAdesao.rule?sys=ADZ&Entrada=${parametrosFinal}`)
          .then(res => console.log('deu bom hein'))
          .catch(err => console.log(err.err))

        history.push('/end')
      }
    },
    [history, setUserData, setUserDetails, userData, userDetails],
  )

  const handleHelp = useCallback(() => {
    history.push('/help', { backTo: pathname })
  }, [history, pathname])

  return (
    <>
      <Header>
        Parabéns! <br />
        Agora, só confirme abaixo os dados de quem será o titular do plano.
      </Header>
      <Container>
        <Content>
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={{
              name: userData.name,
              cpf: userData.cpf,
              // bestDayPayment: userDetails.bestDayPayment,
              contribution: userDetails.contribution,
              // paymentType: userDetails.paymentType,
            }}
          >
            <Input
              placeholder="Nome completo do TITULAR"
              name="name"
              icon={FiUser}
            />
            <Input
              placeholder="CPF do TITULAR"
              name="cpf"
              icon={MdSecurity}
              type="tel"
              mask="cpf"
            />
            <div>
              <Input
                type="number"
                prefix="R$"
                step={0.01}
                name="contribution"
                icon={FaRegMoneyBillAlt}
                placeholder="Aporte mensal"
              />
              {/* <InputSelect
                name="paymentType"
                options={[
                  { label: 'Boleto', value: 'boleto' },
                  { label: 'Cartão de crédito', value: 'credit' },
                  { label: 'Débito em conta', value: 'debito' },
                ]}
                placeholder="Forma de pagamento"
                icon={BiDollar}
              /> */}
            </div>
            {/* <Input
              placeholder="Melhor dia para pagamento"
              min={1}
              max={30}
              name="bestDayPayment"
              icon={FiCalendar}
              type="number"
              prefix="Dia"
            /> */}
          </Form>

          <div>
            <span>
              Autorizo a cobrança recorrente no valor informado acima.
            </span>
            <Switch
              onChange={toggleAuthorizeTitularPayment}
              checked={authorizeTitularPayment}
              checkedIcon={false}
              uncheckedIcon={false}
              height={22}
              width={44}
              handleDiameter={18}
              offColor="#EB6A9F"
              offHandleColor="#fff"
              onHandleColor="#fff"
              onColor="#31D19E"
            />
          </div>
        </Content>

        <Button
          type="button"
          fontSize="normal"
          color="green"
          width="large"
          disabled={!authorizeTitularPayment}
          onClick={() => formRef.current?.submitForm()}
        >
          <FiCheck size={45} />
          <span>Confirmo a aquisição do Plano BRF Previdência Família</span>
        </Button>
        <BtnVoltar type="button" onClick={() => history.goBack()}>
          &lt; Anterior
        </BtnVoltar>

        <Button type="button" fontSize="small" onClick={handleHelp}>
          Ops! Estou com dúvidas, preciso de ajudar para concluir
        </Button>
      </Container>
    </>
  )
}

export default ConfirmOwnership
