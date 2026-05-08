/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Formik, FormikProps, yupToFormErrors } from 'formik'
import { Base64 } from 'js-base64'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaFemale } from 'react-icons/fa'
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiClock,
  FiMail,
  FiSmartphone,
  FiUser,
} from 'react-icons/fi'
import { MdSecurity } from 'react-icons/md'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import ChoiceField from '../../components/ChoiceField'
import InfoContentCard from '../../components/InfoContentCard'
import Input from '../../components/Input'
import ModalBox from '../../components/Modal'
import ModalActionButton from '../../components/ModalActionButton'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import ParticipantsSection from '../../components/ParticipantsSection'
import SectionDivider from '../../components/SectionDivider'
import SegmentedOptionButton from '../../components/SegmentedOptionButton'
import Spinner from '../../components/Spinner'
import useConfigData from '../../hooks/useConfigData'
import usePersistedState from '../../hooks/usePersistedState'
import api from '../../services/api'
import { persistErrorAndRedirect } from '../../utils/apiError'
import { sanitizeCpf, sanitizePhone, scrollToTop } from '../../utils/browser'
import { removeStorageItem } from '../../utils/storage'
import calculaIdade from '../../utils/calculaIdade'
import {
  ErroProps,
  Participant,
  UserData,
  UserDetails,
} from '../../utils/interfaces'

const Participants = ParticipantsSection

const InfoContent = InfoContentCard

const RadioButton = ({
  children,
}: React.PropsWithChildren): React.JSX.Element => (
  <ChoiceField variant="outlined">{children}</ChoiceField>
)

const BtnOption = ({
  isActive,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive: boolean
}): React.JSX.Element => (
  <button
    type="button"
    className={`flex min-w-25 items-center justify-center rounded-sm px-3 py-1 focus:underline max-[540px]:text-xs max-[360px]:text-[11px] ${
      isActive
        ? 'border-0 bg-linear-to-r from-[#FF612E] to-[#FF8F61] text-white'
        : 'border border-[#AEAEAE] bg-transparent text-ink-700'
    }`}
    {...props}
  >
    {children}
  </button>
)

interface ResumeFormValues {
  name: string
  cpf: string
  admission: string
  phone: string
  email: string
  parental: string
  tipContato: string
}

const Resume: React.FC = () => {
  const [configData, setConfigData] = useConfigData()
  const [userData, setUserData] = usePersistedState<UserData>(
    'userData',
    {} as UserData,
  )
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  // const [selectedReceive] = usePersistedState<'PD' | 'PS' | 'VF' | 'null'>(
  //   'receiveTypeSelected',
  //   'PD',
  // )
  const [participants] = usePersistedState<Participant[]>(
    'participantsGroup',
    [],
  )
  const [, setFlagEdit] = usePersistedState<'S' | 'N' | ''>('flagEdit', 'N')
  const [, setErroProps] = usePersistedState<ErroProps>(
    'erroProps',
    {} as ErroProps,
  )
  const [aguarde, setAguarde] = useState(false)
  const [timer, setTimer] = useState(0)
  const [reSend, setReSend] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clicado, setClicado] = useState(false)
  const [txtModal, setTxtModal] = useState('')
  const history = useHistory()
  const formikRef = useRef<FormikProps<ResumeFormValues>>(null)

  function handleCloseModal(): void {
    setIsModalOpen(false)
  }

  const validate = useCallback(async (values: ResumeFormValues) => {
    const schema = Yup.object().shape({
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
      tipContato: Yup.string().required(),
    })

    try {
      await schema.validate(values, { abortEarly: false })
      return {}
    } catch (err) {
      return yupToFormErrors(err as Yup.ValidationError)
    }
  }, [])

  const handleConfirmaAdesao = useCallback(
    async (values: ResumeFormValues) => {
      setClicado(true)
      setAguarde(true)

      setUserData(current => ({
        ...current,
        email: values.email,
        phone: values.phone,
        parental: values.parental,
      }))

      removeStorageItem('flagEdit')

      const parametros = Base64.encode(
        `{"versao":"${configData.tipo}",
          "plano": "${configData.plano}",
          "cliente":"${configData.codCliente}",
          "cpf":"${sanitizeCpf(values.cpf)}",
          "email":"${values.email}",
          "telefone":"55${sanitizePhone(values.phone)}",
          "patrocinadora":"${userData.patrocinadora}",
          "admissao":"${userData.admission}",
          "envio":"${values.tipContato}"}`,
      )

      const parametrosFinal = Base64.encode(parametros)

      try {
        const res = await api.get(
          `wsAutenticacaoV5.rule?sys=ADZ&Entrada=${parametrosFinal}`,
        )
        const nextToken = res.data?.token

        if (!nextToken) {
          setErroProps({
            title: 'Não foi possível iniciar a autenticação',
            description: 'Tente novamente em instantes.',
          })
          setAguarde(false)
          setClicado(false)
          history.push('/erro')
          return
        }

        setConfigData(current => ({
          ...current,
          token: nextToken,
          tipoContato: values.tipContato,
        }))
        history.push('/conclusion')
      } catch (error) {
        const status =
          error && typeof error === 'object' && 'response' in error
            ? (error as { response?: { status?: number } }).response?.status
            : undefined

        if (status === 404) {
          setTxtModal(
            'Não localizamos os seus dados na base cadastral. Por favor, confira as informações digitadas ou entre em contato com a área de atendimento.',
          )
          setIsModalOpen(true)
          setAguarde(false)
          setClicado(false)
          return
        }

        if (status === 401) {
          setTxtModal('Você já é participante.')
          setIsModalOpen(true)
          setAguarde(false)
          setClicado(false)
          return
        }

        setAguarde(false)
        setClicado(false)
        persistErrorAndRedirect(history, setErroProps, error)
      }
    },
    [configData, history, setConfigData, setErroProps, setUserData, userData],
  )

  const dependents = participants.filter(
    participant => participant.details.grauParentesco !== undefined,
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

  const goback = useCallback(
    async (origin: string) => {
      setFlagEdit('S')

      if (origin === 'S') {
        history.push('/contribution')
      } else {
        history.push('/new-participant')
      }
    },
    [history, setFlagEdit],
  )

  const handleConfirmar = useCallback(() => {
    formikRef.current?.submitForm()
  }, [])

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout containerClassName="mb-0">
      <Formik<ResumeFormValues>
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
          tipContato: configData.tipoContato ?? 'S',
        }}
        validate={validate}
        onSubmit={handleConfirmaAdesao}
      >
        {({ values, setFieldValue }) => (
          <Form className="w-full">
            <PageCard as="main">
              <strong className="flex justify-center pb-4 text-center text-lg font-bold text-brand-400">
                Resumo da adesão
              </strong>
              <Participants>
                <h4 className="pb-2 text-base text-ink-900 font-bold">
                  Dados pessoais
                </h4>
                <div className="mb-3 grid px-1 py-1">
                  <Input
                    name="name"
                    placeholder="Nome"
                    sizeBox="small"
                    icon={FiUser}
                    disabled
                  />
                  <Input
                    placeholder="CPF"
                    name="cpf"
                    icon={MdSecurity}
                    type="tel"
                    mask="cpf"
                    sizeBox="small"
                    disabled
                  />
                  <Input
                    icon={FiCalendar}
                    name="admission"
                    placeholder="Data de admissão"
                    mask="date"
                    sizeBox="small"
                    disabled
                  />
                  <Input
                    name="phone"
                    mask="phone"
                    placeholder="Celular com DDD"
                    icon={FiSmartphone}
                    sizeBox="small"
                  />
                  <Input
                    icon={FiMail}
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    sizeBox="small"
                  />
                  <Input
                    name="parental"
                    placeholder="Nome completo da mãe"
                    icon={FaFemale}
                    sizeBox="small"
                  />
                </div>
              </Participants>

              <SectionDivider className="mb-5 mt-4 w-4/5" />

              <Participants>
                <h4 className="pb-2 text-base text-ink-900 font-bold">
                  Informações adicionais
                </h4>

                <RadioButton>
                  <label className="mb-3 text-xs font-bold text-ink-700">
                    Pessoa Exposta Politicamente (PEP)?
                  </label>
                  <div className="flex w-full flex-wrap gap-2">
                    <BtnOption
                      type="button"
                      isActive={userDetails.ppe === 'S'}
                      onClick={() => {
                        setUserDetails(current => ({ ...current, ppe: 'S' }))
                      }}
                    >
                      Sim
                    </BtnOption>
                    <BtnOption
                      type="button"
                      isActive={userDetails.ppe === 'N'}
                      onClick={() => {
                        setUserDetails(current => ({ ...current, ppe: 'N' }))
                      }}
                    >
                      Não
                    </BtnOption>
                  </div>
                </RadioButton>

                <RadioButton>
                  <label className="mb-3 text-xs font-bold text-ink-700">
                    É residente no exterior para fins fiscais (FATCA)?
                  </label>
                  <div className="flex w-full flex-wrap gap-2">
                    <BtnOption
                      type="button"
                      isActive={userDetails.usperson === 'S'}
                      onClick={() => {
                        setUserDetails(current => ({
                          ...current,
                          usperson: 'S',
                        }))
                      }}
                    >
                      Sim
                    </BtnOption>
                    <BtnOption
                      type="button"
                      isActive={userDetails.usperson === 'N'}
                      onClick={() => {
                        setUserDetails(current => ({
                          ...current,
                          usperson: 'N',
                        }))
                      }}
                    >
                      Não
                    </BtnOption>
                  </div>
                </RadioButton>

                <RadioButton>
                  <label className="mb-3 text-xs font-bold text-ink-700">
                    Perfil de investidor
                  </label>
                  <div className="flex w-full flex-wrap gap-2">
                    <BtnOption
                      type="button"
                      isActive={userDetails.investor === 'S'}
                      onClick={() => {
                        setUserDetails(current => ({
                          ...current,
                          investor: 'S',
                        }))
                      }}
                    >
                      Superconservador
                    </BtnOption>
                    <BtnOption
                      type="button"
                      isActive={userDetails.investor === 'C'}
                      onClick={() => {
                        setUserDetails(current => ({
                          ...current,
                          investor: 'C',
                        }))
                      }}
                    >
                      Conservador
                    </BtnOption>
                    <BtnOption
                      type="button"
                      isActive={userDetails.investor === 'M'}
                      onClick={() => {
                        setUserDetails(current => ({
                          ...current,
                          investor: 'M',
                        }))
                      }}
                    >
                      Moderado
                    </BtnOption>
                    <BtnOption
                      type="button"
                      isActive={userDetails.investor === 'A'}
                      onClick={() => {
                        setUserDetails(current => ({
                          ...current,
                          investor: 'A',
                        }))
                      }}
                    >
                      Agressivo
                    </BtnOption>
                  </div>
                </RadioButton>
              </Participants>

              <SectionDivider className="mb-5 mt-4 w-4/5" />

              <Participants>
                <h4 className="pb-2 text-base text-ink-900 font-bold">
                  Contribuição
                </h4>
                <InfoContent>
                  <div className="mb-3 flex w-full items-center justify-between gap-3 max-[540px]:flex-col max-[540px]:items-start">
                    <p>Contribuição do adicional:</p>
                    <strong className="text-base font-extrabold text-brand-400">
                      {userDetails.pctContribuicaoSuplementar}%
                    </strong>
                  </div>
                  <button
                    className="rounded-full border border-[#FF8F61] bg-white px-1 py-1 text-center text-xs font-normal text-ink-900 shadow-[0_6px_8px_rgba(101,101,101,0.09)]"
                    type="button"
                    onClick={() => goback('S')}
                  >
                    Simular novamente
                  </button>
                </InfoContent>
              </Participants>

              <SectionDivider className="mb-5 mt-4 w-4/5" />

              <Participants>
                {participants.length > 0 ? (
                  <>
                    <h4 className="pb-2 text-base text-ink-900">
                      Beneficiários
                    </h4>
                    <InfoContent>
                      {dependents.map(dependent => (
                        <div
                          key={`${dependent.data.cpf}-${dependent.details.grauParentesco}`}
                          className="mb-3 flex items-center justify-between px-1 py-1"
                        >
                          <div className="flex flex-col">
                            <p>{dependent.data.name}</p>
                            <small className="text-xs leading-5 text-[#636363]">
                              {dependent.details.dcrGrauParentesco}
                              {', '}
                              {calculaIdade(dependent.data.birthdate)}{' '}
                              {calculaIdade(dependent.data.birthdate) > 1
                                ? 'anos'
                                : 'ano'}
                            </small>
                          </div>
                        </div>
                      ))}
                      <button
                        className="rounded-full border border-[#FF8F61] bg-white px-1 py-1 text-center text-xs font-normal text-ink-900 shadow-[0_6px_8px_rgba(101,101,101,0.09)]"
                        type="button"
                        onClick={() => goback('b')}
                      >
                        Incluir novo beneficiário
                      </button>
                    </InfoContent>
                    <SectionDivider className="mb-5 mt-4 w-4/5" />
                  </>
                ) : null}
              </Participants>

              <Participants>
                <ChoiceField>
                  <label className="mb-3 text-xs font-bold text-ink-700">
                    Enviar código de confirmação por:
                  </label>

                  <div className="w-4/5 flex flex-row my-3 shadow-md rounded-full bg-[#AEAEAE]/20 self-center">
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
              </Participants>
            </PageCard>
          </Form>
        )}
      </Formik>

      <Button
        type="button"
        color="orange"
        width="fit"
        disabled={!reSend || aguarde || clicado}
        onClick={handleConfirmar}
      >
        {!aguarde ? (
          !reSend ? (
            <>
              <FiClock size={36} />
              <span>
                Tente novamente em {timer < 10 ? `0${timer}` : timer} segundos
              </span>
            </>
          ) : (
            <>
              <span>Confirmar informações</span>
              <FiCheck size={36} />
            </>
          )
        ) : (
          <>
            <Spinner />
            <span>Aguarde</span>
          </>
        )}
      </Button>
      <BackButton type="button" onClick={() => history.goBack()}>
        <FiArrowLeft /> Voltar
      </BackButton>

      <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        {txtModal}
        <ModalActionButton onClick={() => handleCloseModal()}>
          Ok
        </ModalActionButton>
      </ModalBox>
    </PageLayout>
  )
}

export default Resume
