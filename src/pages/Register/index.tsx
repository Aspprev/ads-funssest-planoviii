/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Formik, FormikProps, yupToFormErrors } from 'formik'
import { Base64 } from 'js-base64'
import moment from 'moment'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaFemale } from 'react-icons/fa'
import {
  FiArrowRight,
  FiCalendar,
  FiMail,
  FiSmartphone,
  FiUser,
} from 'react-icons/fi'
import { MdSecurity } from 'react-icons/md'
import { useHistory } from 'react-router-dom'
import Switch from 'react-switch'
import * as Yup from 'yup'
import Button from '../../components/Button'
import ChoiceField from '../../components/ChoiceField'
import Input from '../../components/Input'
import InputSelect from '../../components/InputSelect'
import ModalBox from '../../components/Modal'
import ModalActionButton from '../../components/ModalActionButton'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import SectionDivider from '../../components/SectionDivider'
import SegmentedOptionButton from '../../components/SegmentedOptionButton'
import Spinner from '../../components/Spinner'
import useConfigData from '../../hooks/useConfigData'
import usePersistedState from '../../hooks/usePersistedState'
import api from '../../services/api'
import { persistErrorAndRedirect } from '../../utils/apiError'
import { sanitizeCpf, sanitizePhone, scrollToTop } from '../../utils/browser'
import calculaIdade from '../../utils/calculaIdade'
import { ErroProps, UserData } from '../../utils/interfaces'
import validaCPF from '../../utils/validaCPF'

interface RegisterFormValues {
  name: string
  cpf: string
  admission: string
  patrocinadora: string
  parental: string
  phone: string
  email: string
  tipContato: string
}

const patrocinadoraOptions = [
  { label: 'ArcelorMittal Brasil S.A.', value: '2' },
  { label: 'Funssest', value: '3' },
  { label: 'ArcelorMittal Plano Comercial LTDA', value: '6' },
  { label: 'ArcelorMittal Sistemas S.A.', value: '806' },
  { label: 'ArcelorMittal Pecém S.A.', value: '709009' },
  { label: 'Perfilor S.A.', value: '12' },
  { label: 'Abertta Saúde', value: '13' },
  { label: 'Fundação ArcelorMittal Brasil ', value: '712474' },
  { label: 'ArcelorMittal Bioflorestas ', value: '712475' },
  { label: 'Sitrel Siderúrgica Três Lagoas', value: '712476' },
]

const Register: React.FC = () => {
  const [configData, setConfigData] = useConfigData()
  const [userData, setUserData] = usePersistedState<UserData>(
    'userData',
    {} as UserData,
  )
  const [, setErroProps] = usePersistedState<ErroProps>(
    'erroProps',
    {} as ErroProps,
  )
  const [acceptTerms, setAcceptTerms] = usePersistedState('acceptTerms', false)
  const [clicado, setClicado] = useState(false)
  const [aguarde, setAguarde] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [txtModal, setTxtModal] = useState('')
  const history = useHistory()
  const formikRef = useRef<FormikProps<RegisterFormValues>>(null)

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const validate = useCallback(async (values: RegisterFormValues) => {
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
          () => validaCPF(sanitizeCpf(values.cpf)) || values.cpf === '',
        ),
      admission: Yup.string()
        .required('Data de admissão obrigatória')
        .test(
          '',
          'A data de admissão não pode ser maior que hoje.',
          () =>
            moment() >
              moment(values.admission.split('/').reverse().join('-')) ||
            values.admission === '',
        )
        .test(
          '',
          'Data de admissão inválida',
          () =>
            moment(values.admission.split('/').reverse().join('-')).isValid() ||
            values.admission === '',
        )
        .test(
          '',
          'Data de admissão inválida',
          () =>
            calculaIdade(values.admission.split('/').reverse().join('-')) <=
              115 || values.admission === '',
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
        .matches(/\s/g, 'Digite o nome completo da mãe')
        .min(3, 'Digite o nome completo da mãe'),
      patrocinadora: Yup.string().required('Patrocinadora é obrigatória'),
    })

    try {
      await schema.validate(values, { abortEarly: false })
      return {}
    } catch (err) {
      return yupToFormErrors(err as Yup.ValidationError)
    }
  }, [])

  const handleSubmit = useCallback(
    async (values: RegisterFormValues) => {
      setClicado(true)
      setAguarde(true)

      const dia = values.admission.split('/')[0]
      const mes = values.admission.split('/')[1]
      const ano = values.admission.split('/')[2]
      const dataForm = `${ano}-${`0${mes}`.slice(-2)}-${`0${dia}`.slice(-2)}`
      const patrocinadoraLabel =
        patrocinadoraOptions.find(
          option => option.value === values.patrocinadora,
        )?.label ?? ''

      setUserData(current => ({
        ...current,
        name: values.name.trim(),
        cpf: values.cpf,
        admission: dataForm,
        email: values.email,
        phone: values.phone,
        patrocinadora: values.patrocinadora,
        dcrPatrocinadora: patrocinadoraLabel,
        parental: values.parental.trim(),
      }))

      const parametros = Base64.encode(
        `{"versao":"${configData.tipo}",
          "plano": "${configData.plano}",
          "cliente":"${configData.codCliente}",
          "cpf":"${sanitizeCpf(values.cpf)}",
          "email":"${values.email}",
          "telefone":"55${sanitizePhone(values.phone)}",
          "admissao":"${dataForm}",
          "envio":"${values.tipContato}",
          "patrocinadora":"${values.patrocinadora}"}`,
      )

      const parametrosFinal = Base64.encode(parametros)

      try {
        const res = await api.get(
          `wsAutenticacaoV5.rule?sys=ADZ&Entrada=${parametrosFinal}`,
        )
        const nextToken = res.data?.token

        if (!nextToken) {
          setClicado(false)
          setAguarde(false)
          setErroProps({
            title: 'Não foi possível iniciar a autenticação',
            description: 'Tente novamente em instantes.',
          })
          history.push('/erro')
          return
        }

        setConfigData(current => ({
          ...current,
          token: nextToken,
          tipoContato: values.tipContato,
        }))

        history.push('/register/confirm-sms')
      } catch (error) {
        const status =
          error && typeof error === 'object' && 'response' in error
            ? (error as {
                response?: {
                  status?: number
                  data?: {
                    codigo?: string | number
                    descricao?: string
                    titulo?: string
                  }
                }
              }).response?.status
            : undefined
        const responseData =
          error && typeof error === 'object' && 'response' in error
            ? (error as {
                response?: {
                  data?: {
                    codigo?: string | number
                    descricao?: string
                    titulo?: string
                  }
                }
              }).response?.data
            : undefined

        if (responseData?.codigo) {
          const message = `${responseData.descricao} (cód. ${responseData.codigo})`

          setErroProps({
            title: responseData.titulo ?? 'Erro na autenticação',
            description: message,
          })
          setTxtModal(message)
          setIsModalOpen(true)
          setClicado(false)
          setAguarde(false)
          return
        }

        if (status === 404) {
          setTxtModal(
            error.response?.data?.mensagem ||
              'Não localizamos os seus dados na base cadastral. Por favor, confira as informações digitadas ou entre em contato com a área de atendimento.',
          )
          setIsModalOpen(true)
          setClicado(false)
          setAguarde(false)
          return
        }

        if (status === 401) {
          setTxtModal(
            error.response?.data?.mensagem ||
              'Você já é participante do plano.',
          )
          setIsModalOpen(true)
          setClicado(false)
          setAguarde(false)
          return
        }

        setClicado(false)
        setAguarde(false)
        persistErrorAndRedirect(history, setErroProps, error)
      }
    },
    [configData, history, setConfigData, setErroProps, setUserData],
  )

  const toggleAcceptTerms = useCallback(() => {
    setAcceptTerms(current => !current)
  }, [setAcceptTerms])

  const handleConfirmar = useCallback(() => {
    formikRef.current?.submitForm()
  }, [])

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout>
      <Formik<RegisterFormValues>
        enableReinitialize
        innerRef={formikRef}
        initialValues={{
          name: userData.name ?? '',
          cpf: userData.cpf ?? '',
          admission:
            userData.admission === undefined
              ? ''
              : userData.admission.split('-').reverse().join('/'),
          phone: userData.phone ?? '',
          email: userData.email ?? '',
          parental: userData.parental ?? '',
          patrocinadora: userData.patrocinadora ?? '',
          tipContato: configData.tipoContato || 'S',
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="w-full">
            <PageCard>
              <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
                Informe seus dados para prosseguir
              </strong>

              <Input name="name" placeholder="Nome completo" icon={FiUser} />
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
                options={patrocinadoraOptions}
                placeholder="Patrocinadora"
              />
              <Input
                name="parental"
                placeholder="Nome completo da mãe"
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

              <ChoiceField>
                <label className="mb-3 text-xs font-bold text-ink-700">
                  Enviar código de confirmação por:
                </label>

                <div className="my-3 flex w-4/5 flex-row self-center rounded-full bg-[#AEAEAE]/20 shadow-md">
                  <SegmentedOptionButton
                    type="button"
                    className="p-1"
                    isActive={values.tipContato === 'S'}
                    onClick={() => setFieldValue('tipContato', 'S')}
                  >
                    SMS
                  </SegmentedOptionButton>
                  <SegmentedOptionButton
                    type="button"
                    className="p-1"
                    isActive={values.tipContato === 'E'}
                    onClick={() => setFieldValue('tipContato', 'E')}
                  >
                    E-mail
                  </SegmentedOptionButton>
                </div>
              </ChoiceField>

              <div className="mt-6 flex items-center justify-end text-right">
                <small className="mr-3 font-bold">
                  Ao continuar navegando no site, você concorda com as condições
                  de{' '}
                  <a
                    className="no-underline hover:underline focus:underline"
                    href="https://www.funssest.com.br/wp-content/uploads/2022/02/08092021100721_FUNSSEST_Politica-de-Protecao-de-DadosV2.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacidade
                  </a>
                  {' e '}
                  <a
                    className="no-underline hover:underline focus:underline"
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

              <SectionDivider className="mb-4 mt-8 w-2/3" />

              <small className="mx-auto mt-2 flex w-4/5 text-center text-[11px] italic max-md:w-9/10">
                Alguns dados pessoais foram recebidos do seu empregador para
                cumprimento de obrigação legal de oferta deste plano. Caso
                precise retificar essas informações, contate o seu empregador.
              </small>
            </PageCard>
          </Form>
        )}
      </Formik>

      <Button
        type="submit"
        color="orange"
        onClick={handleConfirmar}
        disabled={!acceptTerms || clicado || aguarde}
      >
        {aguarde ? (
          <>
            <Spinner />
            <span>Aguarde</span>
          </>
        ) : (
          <>
            <span>Próximo</span>
            <FiArrowRight size={20} />
          </>
        )}
      </Button>
      <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        {txtModal}
        <ModalActionButton onClick={handleCloseModal}>Ok</ModalActionButton>
      </ModalBox>
    </PageLayout>
  )
}

export default Register
