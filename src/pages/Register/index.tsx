/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { Base64 } from 'js-base64'
import Switch from 'react-switch'
import moment from 'moment'
import * as Yup from 'yup'

import { FiCalendar, FiSmartphone, FiMail, FiUser } from 'react-icons/fi'
import { MdSecurity } from 'react-icons/md'
import { FaFemale } from 'react-icons/fa'

import getValidationErrors from '../../utils/getValidationErrors'
import usePersistedState from '../../hooks/usePersistedState'
import validaCPF from '../../utils/validaCPF'
import api from '../../services/api'

import InputSelect from '../../components/InputSelect'
import InputHidden from '../../components/InputHidden'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Input from '../../components/Input'

import { UserData, ConfigData, ErroProps } from '../../utils/interfaces'
import {
  Container,
  Content,
  RadioButton,
  BtnContato,
  Line,
  BtnModal,
} from './styles'
import calculaIdade from '../../utils/calculaIdade'
import ModalBox from '../../components/Modal'

const Register: React.FC = () => {
  const [configData, setConfigData] = usePersistedState<ConfigData>(
    'configData',
    {} as ConfigData,
  )
  const [userData, setUserData] = usePersistedState<UserData>(
    'userData',
    {} as UserData,
  )
  const [, setErroProps] = usePersistedState<ErroProps>(
    'erroProps',
    {} as ErroProps,
  )

  const [acceptTerms, setAcceptTerms] = usePersistedState('acceptTerms', false)
  const [patrocinadora, setPatrocinadora] = useState({
    label: `${
      userData.patrocinadora === undefined ? '' : userData.dcrPatrocinadora
    }`,
    value: `${
      userData.patrocinadora === undefined ? '' : userData.patrocinadora
    }`,
  })
  const [tipoContato, setTipoContato] = useState('S')
  // const [dtAdm, setDtAdm] = useState(
  //   userData.admission
  //     ? userData.admission.split('-').reverse().join('-').replaceAll('-', '/')
  //     : '',
  // )

  const [clicado, setClicado] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [txtModal, setTxtModal] = useState('')
  const history = useHistory()
  const formRef = useRef<FormHandles>(null)

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  // const handleAdmissao = useCallback(
  //   async (cpf) => {
  //     const parametros = Base64.encode(
  //       `{
  //         "cliente": "${configData.codCliente}",
  //         "cpf": "${cpf.replaceAll('.', '').replace('-', '')}"
  //       }`,
  //     )

  //     const parametrosFinal = Base64.encode(parametros)

  //     await api
  //       .get(`wsAdmissao.rule?sys=ADZ&Entrada=${parametrosFinal}`)
  //       .then(res => {
  //         setDtAdm(res.data.dataAdmissao)
  //       })
  //       .catch(() => {
  //         alert('Ops, algo deu errado. Tente novamente mais tarde.')
  //       })
  //   }, [])

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          name: Yup.string()
            .required('Seu nome é obrigatório.')
            .matches(/\s/g, 'Digite o nome completo')
            .min(3, 'Digite o nome completo'),
          cpf: Yup.string()
            .required('Digite o CPF do titular')
            .test(
              '',
              'CPF inválido',
              () =>
                validaCPF(data.cpf.replaceAll('.', '').replace('-', '')) ||
                data.cpf === '',
            ),
          admission: Yup.string()
            .required('Data de admissão obrigatória')
            .test(
              '',
              'A data de admissão não pode ser maior que hoje.',
              () =>
                moment() >
                  moment(data.admission.split('/').reverse().join('-')) ||
                data.admission === '',
            )
            .test(
              '',
              'Data de admissão inválida',
              () =>
                moment(
                  data.admission.split('/').reverse().join('-'),
                ).isValid() || data.admission === '',
            )
            .test(
              '',
              'Data de admissão inválida',
              () =>
                calculaIdade(data.admission.split('/').reverse().join('-')) <=
                  115 || data.admission === '',
            ),
          tipContato: Yup.string().required(),
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          phone: Yup.string()
            .max(15, 'Telefone inválido')
            .min(14, 'Telefone inválido')
            .required('Celular obrigatório'),
          parental: Yup.string()
            .required('Nome da mãe é obrigatório.')
            .matches(/\s/g, 'Digite o nome da mãe completo')
            .min(3, 'Digite o nome da mãe completo'),
          patrocinadora: Yup.string().required('Patrocinadora é obrigatória'),
        })

        await schema.validate(data, { abortEarly: false })

        const aa = data.admission
        const dia = aa.split('/')[0]
        const mes = aa.split('/')[1]
        const ano = aa.split('/')[2]

        const dataForm = `${ano}-${`0${mes}`.slice(-2)}-${`0${dia}`.slice(-2)}`

        await setUserData({
          ...userData,
          name: data.name.trim(),
          cpf: data.cpf,
          admission: dataForm,
          email: data.email,
          phone: data.phone,
          patrocinadora: data.patrocinadora,
          dcrPatrocinadora: patrocinadora.label,
          parental: data.parental.trim(),
        })

        const parametros = Base64.encode(
          `{"versao":"${configData.tipo}",
            "plano": "${configData.plano}",
            "cliente":"${configData.codCliente}",
            "cpf":"${data.cpf.replaceAll('.', '').replace('-', '')}",
            "email":"${data.email === undefined ? '' : data.email}",
            "telefone":"${
              data.phone === undefined
                ? ''
                : `55${data.phone
                    .replace('(', '')
                    .replace(') ', '')
                    .replace('-', '')}`
            }",
            "admissao":"${dataForm}",
            "envio":"${tipoContato}",
            "patrocinadora":"${data.patrocinadora}"}`,
        )

        const parametrosFinal = Base64.encode(parametros)

        // history.push('/register/confirm-sms')
        await api
          .get(`wsAutenticacao.rule?sys=ADZ&Entrada=${parametrosFinal}`)
          .then(res => {
            setConfigData({ ...configData, token: res.data.token, tipoContato })

            history.push('/register/confirm-sms')
          })
          .catch(error => {
            if (error.response.data.codigo === 90003) {
              setErroProps({
                title: error.response.data.titulo,
                description: `${error.response.data.descricao} (cod ${error.response.data.codigo})`,
              })
              setTxtModal(
                `${error.response.data.descricao} (cod ${error.response.data.codigo})`,
              )
              setIsModalOpen(true)
              setClicado(false)
            } else if (error.response.data.codigo === 90004) {
              setErroProps({
                title: error.response.data.titulo,
                description: `${error.response.data.descricao} (cod ${error.response.data.codigo})`,
              })
              setTxtModal(
                `${error.response.data.descricao} (cod ${error.response.data.codigo})`,
              )
              setIsModalOpen(true)
              setClicado(false)
            } else if (error.response.data.codigo === 90005) {
              setErroProps({
                title: error.response.data.titulo,
                description: `${error.response.data.descricao} (cod ${error.response.data.codigo})`,
              })
              setTxtModal(
                `${error.response.data.descricao} (cod ${error.response.data.codigo})`,
              )
              setIsModalOpen(true)
              setClicado(false)
            } else if (error.response.data.codigo === 90006) {
              setErroProps({
                title: error.response.data.titulo,
                description: `${error.response.data.descricao} (cod ${error.response.data.codigo})`,
              })
              setTxtModal(
                `${error.response.data.descricao} (cod ${error.response.data.codigo})`,
              )
              setIsModalOpen(true)
              setClicado(false)
            } else if (error.message === 'Network Error') {
              setErroProps({
                title: error.message,
                description: 'Falha na conexão como servidor',
              })
              setClicado(false)
              history.push('/erro')
            } else if (
              // error.message === 'Request failed with status code 500'
              error.response.status === 500
            ) {
              setErroProps({
                title: 'Erro interno no servidor',
                description: error.message,
              })
              setClicado(false)
              history.push('/erro')
            } else if (
              error.response.status === 404
              // error.message === 'Request failed with status code 404'
            ) {
              setTxtModal(
                'Não localizamos os seus dados na base cadastral. Por favor, confira as informações digitadas ou entre em contato com a área de atendimento.',
              )
              setIsModalOpen(true)
              setClicado(false)
            } else if (
              error.response.status === 401
              // error.message === 'Request failed with status code 401'
            ) {
              setTxtModal('Você já é participante do plano.')
              setIsModalOpen(true)
              setClicado(false)
            } else {
              setTxtModal(
                error.response.data.descricao
                  ? `${error.response.data.descricao} (cod ${error.response.data.codigo})`
                  : 'Ops, algo deu errado. Tente novamente mais tarde.',
              )
              setIsModalOpen(true)
              setClicado(false)
            }
          })
      } catch (err) {
        formRef.current?.setErrors(
          getValidationErrors(err as Yup.ValidationError),
        )
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
    },
    [
      setUserData,
      userData,
      patrocinadora,
      configData,
      tipoContato,
      setConfigData,
      history,
      setErroProps,
    ],
  )

  const toggleAcceptTerms = useCallback(() => {
    setAcceptTerms(!acceptTerms)
  }, [acceptTerms, setAcceptTerms])

  const handleChangePatrocinadora = useCallback(e => {
    const t = e

    setPatrocinadora(t)
  }, [])

  const handleConfirmar = useCallback(event => {
    event.preventDefault()
    formRef.current?.submitForm()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          <strong>Informe seus dados para prosseguir</strong>

          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={{
              name: userData.name,
              cpf: userData.cpf,
              admission:
                userData.admission === undefined
                  ? ''
                  : userData.admission.split('-').reverse().join('/'),
              phone: userData.phone,
              email: userData.email,
              parental: userData.parental,
            }}
          >
            <Input name="name" placeholder="Nome Completo" icon={FiUser} />
            <Input
              placeholder="CPF"
              name="cpf"
              icon={MdSecurity}
              type="tel"
              mask="cpf"
            />
            <Input
              icon={FiCalendar}
              name="admission"
              placeholder="Data de admissão"
              mask="date"
            />
            <InputSelect
              name="patrocinadora"
              value={patrocinadora}
              options={[
                { label: 'ArcelorMittal Brasil S.A.', value: '2' },
                { label: 'Funssest', value: '3' },
                { label: 'ArcelorMittal Plano Comercial LTDA', value: '6' },
                { label: 'ArcelorMittal Sistemas S.A.', value: '806' },
                { label: 'ArcelorMittal Pecém S.A.', value: '709009' },
                { label: 'Perfilor S.A.', value: '12' },
                { label: 'Abertta Saúde', value: '13' },
              ]}
              onChange={e => handleChangePatrocinadora(e)}
              placeholder="Patrocinadora"
            />
            <Input
              name="parental"
              placeholder="Nome Completo da Mãe"
              icon={FaFemale}
            />
            <Input
              name="phone"
              mask="phone"
              prefix="+55 | "
              placeholder="Celular com DDD"
              icon={FiSmartphone}
            />
            <Input
              icon={FiMail}
              name="email"
              type="email"
              placeholder="E-mail"
            />

            <RadioButton>
              <label>Enviar código de confirmação por: </label>
              <div>
                <BtnContato
                  type="button"
                  isActive={tipoContato === 'S'}
                  onClick={() => setTipoContato('S')}
                >
                  SMS
                </BtnContato>
                <BtnContato
                  type="button"
                  isActive={tipoContato === 'E'}
                  onClick={() => setTipoContato('E')}
                >
                  E-mail
                </BtnContato>
              </div>
            </RadioButton>
            <InputHidden name="tipContato" value={tipoContato} type="hidden" />
          </Form>

          <div>
            <small>
              Ao continuar navegando no site, você concorda com as condições de{' '}
              <a
                href="https://www.funssest.com.br/wp-content/uploads/2022/02/08092021100721_FUNSSEST_Politica-de-Protecao-de-DadosV2.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacidade
              </a>
              {' e '}
              <a
                href="https://www.funssest.com.br/wp-content/uploads/2022/02/08092021100721_FUNSSEST_Termo-de-UsoV2.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Termos de uso
              </a>
              {' do site Funssest.'}
            </small>
            <Switch
              onChange={toggleAcceptTerms}
              checked={acceptTerms}
              checkedIcon={false}
              uncheckedIcon={false}
              height={20}
              width={40}
              handleDiameter={16}
              offColor="#DEE3E1"
              offHandleColor="#fff"
              onHandleColor="#fff"
              onColor="#31D19E"
            />
          </div>
          <Line />
          <small>
            Alguns dados pessoais foram recebidos do seu empregador para
            cumprimento de obrigação legal de ofertas deste plano. Caso
            necessite retificar estes dados, favor contatar o seu empregador.
          </small>
        </Content>

        <Button
          type="submit"
          color="orange"
          onClick={handleConfirmar}
          disabled={!acceptTerms || clicado}
        >
          Próximo
        </Button>
        <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
          {txtModal}
          <BtnModal isActive onClick={() => handleCloseModal()}>
            Ok
          </BtnModal>
        </ModalBox>
      </Container>
    </>
  )
}

export default Register
