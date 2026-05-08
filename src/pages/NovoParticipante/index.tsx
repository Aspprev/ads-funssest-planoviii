/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  yupToFormErrors,
} from 'formik'
import moment from 'moment'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { BiCake } from 'react-icons/bi'
import {
  FiArrowLeft,
  FiArrowRight,
  FiPercent,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { MdSecurity } from 'react-icons/md'
import Modal from 'react-modal'
import { useHistory, useLocation } from 'react-router-dom'
import * as Yup from 'yup'
import BackButton from '../../components/BackButton'
import BeneficiaryCard from '../../components/BeneficiaryCard'
import BeneficiaryContent from '../../components/BeneficiaryContent'
import Button from '../../components/Button'
import ChoiceField from '../../components/ChoiceField'
import Input from '../../components/Input'
import InputSelect from '../../components/InputSelect'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import SectionDivider from '../../components/SectionDivider'
import SegmentedOptionButton from '../../components/SegmentedOptionButton'
import usePersistedState from '../../hooks/usePersistedState'
import { sanitizeCpf, scrollToPosition } from '../../utils/browser'
import calculaIdade from '../../utils/calculaIdade'
import { Participant, UserData } from '../../utils/interfaces'
import validaCPF from '../../utils/validaCPF'

Modal.setAppElement('#root')

const RadioButton = ({
  children,
}: React.PropsWithChildren): React.JSX.Element => (
  <ChoiceField variant="outlined">{children}</ChoiceField>
)

const BenefBox = BeneficiaryCard

const ContentBenef = BeneficiaryContent

const legalOptions = [
  { label: 'Conjuge', value: '1' },
  { label: 'Companheiro(a)', value: '2' },
  { label: 'Filho(a) não emancipado menor de 21 anos', value: '3' },
  { label: 'Filho(a) inválido(a)', value: '4' },
  {
    label: 'Enteado não emancipado menor de 21 anos com dependência econômica',
    value: '8',
  },
  { label: 'Enteado inválido com dependência econômica', value: '9' },
]

const indicadoOptions = [
  { label: 'Pai/Mãe', value: '12' },
  { label: 'Neto', value: '13' },
  { label: 'Avô/Avó', value: '14' },
  { label: 'Tio(a)', value: '15' },
  { label: 'Cunhado(a)', value: '16' },
  { label: 'Amigo(a)', value: '17' },
  { label: 'Primo(a)', value: '18' },
  { label: 'Filho(a)', value: '19' },
  { label: 'Irmão(ã)', value: '20' },
  { label: 'Outros', value: '0' },
]

interface NovoParticipanteFormValues {
  addNew: 'true' | 'false'
  name: string
  cpf: string
  birthdate: string
  grauParentesco: string
  proporcao: string
  mrcInvalidez: string
}

const NovoParticipante: React.FC = () => {
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [participants, setParticipants] = usePersistedState<Participant[]>(
    'participantsGroup',
    [],
  )
  const [tipoBenef, setTipoBenef] = useState('2')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formikRef = useRef<FormikProps<NovoParticipanteFormValues>>(null)
  const history = useHistory()
  const location = useLocation()

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleRemove = useCallback(
    (id: number) => {
      setParticipants(() =>
        participants.filter((participant, idx) => idx !== id),
      )
    },
    [participants, setParticipants],
  )

  useEffect(() => {
    const benefBox = document.getElementById(
      'benefBox',
    ) as HTMLDivElement | null

    if (benefBox) {
      scrollToPosition(benefBox.clientHeight, 0)
    }
  }, [])

  const soma = participants
    .filter(participant => participant.details.tipoBen === '1')
    .reduce((total, participant) => total + participant.details.proporcao, 0)

  const remainingProporcao = soma === 0 ? 100 : 100 - soma
  const currentOptions = tipoBenef === '2' ? legalOptions : indicadoOptions

  const validate = useCallback(
    async (values: NovoParticipanteFormValues) => {
      const schema = Yup.object().shape({
        name: Yup.string()
          .required('Campo obrigatório')
          .matches(/\s/g, 'Digite o nome completo')
          .min(3, 'Digite o nome completo'),
        birthdate: Yup.string()
          .min(10, 'Data de nascimento inválida')
          .required('Campo obrigatório')
          .test(
            '',
            'A data de nascimento não pode ser maior que hoje.',
            () =>
              moment() >
                moment(values.birthdate.split('/').reverse().join('-')) ||
              values.birthdate === '',
          )
          .test(
            '',
            'Data de nascimento inválida',
            () =>
              moment(
                values.birthdate.split('/').reverse().join('-'),
              ).isValid() || values.birthdate === '',
          )
          .test(
            '',
            'Data de nascimento inválida',
            () =>
              calculaIdade(values.birthdate.split('/').reverse().join('-')) <=
                115 || values.birthdate === '',
          ),
        cpf: Yup.string()
          .required('CPF é obrigatório.')
          .test('', 'CPF já utilizado em outro cadastro', () => {
            return (
              (participants.filter(
                participant => participant.data.cpf === values.cpf,
              ).length <= 0 &&
                values.cpf !== userData.cpf) ||
              values.cpf === ''
            )
          })
          .test(
            '',
            'CPF inválido',
            () =>
              validaCPF(sanitizeCpf(values.cpf)) || values.cpf === '',
          ),
        proporcao: Yup.string().test('', 'Campo obrigatório', () => {
          if (tipoBenef === '2') {
            return true
          }

          const value = Number(values.proporcao)
          return value > 0 && value <= remainingProporcao
        }),
        mrcInvalidez: Yup.string().test('', 'Campo obrigatório', () => {
          return (
            (tipoBenef === '2' && values.mrcInvalidez !== '') ||
            tipoBenef === '1'
          )
        }),
        grauParentesco: Yup.string().required('Campo obrigatório'),
      })

      try {
        await schema.validate(values, { abortEarly: false })
        return {}
      } catch (err) {
        return yupToFormErrors(err as Yup.ValidationError)
      }
    },
    [participants, remainingProporcao, tipoBenef, userData.cpf],
  )

  const handleSubmit = useCallback(
    async (
      values: NovoParticipanteFormValues,
      helpers: FormikHelpers<NovoParticipanteFormValues>,
    ) => {
      const dia = values.birthdate.split('/')[0]
      const mes = values.birthdate.split('/')[1]
      const ano = values.birthdate.split('/')[2]
      const dataForm = `${ano}-${`0${mes}`.slice(-2)}-${`0${dia}`.slice(-2)}`
      const grauParentescoLabel =
        currentOptions.find(option => option.value === values.grauParentesco)
          ?.label ?? ''

      setParticipants([
        ...participants,
        {
          data: {
            name: values.name,
            cpf: values.cpf,
            birthdate: values.birthdate === '' ? '' : dataForm,
          },
          details: {
            tipoBen: tipoBenef,
            grauParentesco: values.grauParentesco,
            dcrGrauParentesco: grauParentescoLabel,
            proporcao: tipoBenef === '1' ? Number(values.proporcao) : 0,
            mrcInvalidez: values.mrcInvalidez,
          },
        } as Participant,
      ])

      if (values.addNew === 'true') {
        helpers.resetForm()
        setTipoBenef('2')
        history.push(location.pathname)
      } else {
        history.push('/participants-list')
      }
    },
    [
      currentOptions,
      history,
      location.pathname,
      participants,
      setParticipants,
      tipoBenef,
    ],
  )

  const handleAddNovo = useCallback(() => {
    formikRef.current?.setFieldValue('addNew', 'true')
    formikRef.current?.submitForm()
  }, [])

  const handleJustSave = useCallback(() => {
    formikRef.current?.setFieldValue('addNew', 'false')
    formikRef.current?.submitForm()
  }, [])

  return (
    <PageLayout>
      <div id="benefBox" style={{ width: '100%' }}>
        {participants.length > 0 ? (
          <BenefBox>
            <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
              Beneficiários
            </strong>
            {participants.map((participant, index) => (
              <ContentBenef key={`${participant.data.cpf}-${index}`}>
                <div className="relative flex flex-col gap-2">
                  <FiX
                    className="absolute right-1.25 top-0 size-5 cursor-pointer text-danger"
                    onClick={() => handleRemove(index)}
                  />
                  <div className="">
                    <small className="text-xs leading-5 text-[#636363]">
                      {`${index + 1} - Beneficiário ${
                        participant.details.tipoBen === '1' ? 'Indicado' : ''
                      }`}
                    </small>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-sm text-ink-900">
                    <strong className="font-bold">Nome:</strong>
                    <label className="text-sm text-ink-900">
                      {participant.data.name}
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-sm text-ink-900">
                    <strong className="font-bold">Idade:</strong>
                    <label className="text-sm text-ink-900">
                      {calculaIdade(participant.data.birthdate)} anos
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-sm text-ink-900">
                    <strong className="font-bold">CPF:</strong>
                    <label className="text-sm text-ink-900">
                      {participant.data.cpf}
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-sm text-ink-900">
                    <strong className="font-bold">Vínculo:</strong>
                    <label className="text-sm text-ink-900">
                      {participant.details.dcrGrauParentesco}
                    </label>
                  </div>
                  {participant.details.tipoBen === '2' ? (
                    <div className="flex flex-wrap items-center gap-1 text-sm text-ink-900">
                      <strong className="font-bold">Pessoa inválida:</strong>
                      <label className="text-sm text-ink-900">
                        {participant.details.mrcInvalidez === 'S'
                          ? 'Sim'
                          : 'Não'}
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-1 text-sm text-ink-900">
                      <strong className="font-bold">Proporção:</strong>
                      <label className="text-sm text-ink-900">
                        {`${participant.details.proporcao} %`}
                      </label>
                    </div>
                  )}
                </div>
                <SectionDivider className="mb-5 mt-6 w-2/3" />
              </ContentBenef>
            ))}
          </BenefBox>
        ) : null}
      </div>

      <Formik<NovoParticipanteFormValues>
        innerRef={formikRef}
        initialValues={{
          addNew: 'false',
          name: '',
          cpf: '',
          birthdate: '',
          grauParentesco: '',
          proporcao: '',
          mrcInvalidez: '',
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="w-full">
            <PageCard className="flex flex-col items-center">
              <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
                Adicione um beneficiário:
              </strong>

              <RadioButton>
                <AiOutlineQuestionCircle
                  className="absolute right-1.25 top-1.25 cursor-pointer text-lg text-brand-400"
                  onClick={handleOpenModal}
                />
                <label className="mb-3 text-xs font-bold text-ink-700">
                  Tipo de beneficiário
                </label>
                <div className="w-9/10 flex flex-row my-3 shadow-md rounded-full bg-[#AEAEAE]/20 self-center">
                  <SegmentedOptionButton
                    type="button"
                    isActive={tipoBenef === '2'}
                    className="p-2"
                    onClick={() => {
                      setTipoBenef('2')
                      setFieldValue('grauParentesco', '')
                      setFieldValue('mrcInvalidez', '')
                      setFieldValue('proporcao', '')
                    }}
                  >
                    Beneficiário legal
                  </SegmentedOptionButton>
                  <SegmentedOptionButton
                    type="button"
                    isActive={tipoBenef === '1'}
                    className="p-2"
                    onClick={() => {
                      setTipoBenef('1')
                      setFieldValue('grauParentesco', '')
                      setFieldValue('mrcInvalidez', '')
                      setFieldValue('proporcao', '')
                    }}
                  >
                    Beneficiário indicado
                  </SegmentedOptionButton>
                </div>
              </RadioButton>

              <InputSelect
                name="grauParentesco"
                options={currentOptions}
                placeholder="Tipo de vínculo"
              />
              <Input placeholder="Nome completo" name="name" icon={FiUser} />
              <Input
                placeholder="CPF"
                name="cpf"
                id="cpf"
                icon={MdSecurity}
                type="tel"
                mask="cpf"
                required
              />
              <Input
                icon={BiCake}
                name="birthdate"
                placeholder="Data de nascimento"
                mask="date"
              />

              {tipoBenef === '1' ? (
                <Input
                  placeholder="Proporção"
                  icon={FiPercent}
                  name="proporcao"
                  type="number"
                  min="1"
                  max={remainingProporcao}
                  value={values.proporcao}
                />
              ) : (
                <InputSelect
                  name="mrcInvalidez"
                  options={[
                    { label: 'Sim', value: 'S' },
                    { label: 'Não', value: 'N' },
                  ]}
                  placeholder="Pessoa inválida?"
                />
              )}
              <Button type="button" fontSize="small" onClick={handleAddNovo}>
                Adicionar mais um beneficiário
              </Button>
            </PageCard>
          </Form>
        )}
      </Formik>
      {participants.length > 0 ? (
        <Button
          type="button"
          fontSize="normal"
          color="orange"
          onClick={() => history.push('/participants-list')}
        >
          Continuar <FiArrowRight size={20} />
        </Button>
      ) : (
        <>
          <Button
            type="button"
            fontSize="normal"
            color="orange"
            onClick={handleJustSave}
          >
            Continuar <FiArrowRight size={20} />
          </Button>
          <Button
            type="button"
            fontSize="normal"
            color="pink"
            onClick={() => {
              userData.patrocinadora === '2' || userData.patrocinadora === '3'
                ? history.push('/care-plan')
                : history.push('/resume')
            }}
          >
            <span>Não tenho beneficiários</span>
          </Button>
        </>
      )}

      <BackButton type="button" onClick={() => history.goBack()}>
        <FiArrowLeft /> Voltar
      </BackButton>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        overlayClassName="fixed inset-0 z-20 flex items-center justify-center bg-black/55 px-4"
        className="relative w-full max-w-125 rounded bg-panel-muted px-6 py-8 outline-none max-md:max-w-100"
        ariaHideApp={false}
      >
        <FiX onClick={handleCloseModal} />
        <h3 className="mb-4 text-center text-lg font-bold text-brand-400">
          Qual a diferença entre os tipos de beneficiários?
        </h3>
        <div className="flex flex-col gap-3 text-sm leading-6 text-ink-900">
          <strong className="text-base font-bold text-ink-900">
            Beneficiário
          </strong>
          <ul className="list-disc pl-5">
            <li>Cônjuge ou companheiro;</li>
            <li>
              Filhos e enteados menores de 21 anos que se enquadrarem nas
              condições de dependentes na Previdência Social;
            </li>
            <li>
              Filhos e enteados solteiros menores de 24 anos que estejam
              cursando ensino superior reconhecido pelo Ministério da Educação;
            </li>
            <li>
              Filhos inválidos de qualquer idade que se enquadrarem nas
              condições de dependentes na Previdência Social.
            </li>
          </ul>
        </div>

        <SectionDivider className="mb-5 mt-6 w-2/3" />

        <div className="flex flex-col gap-3 text-sm leading-6 text-ink-900">
          <strong className="text-base font-bold text-ink-900">
            Beneficiário Indicado
          </strong>
          <ul className="list-disc pl-5">
            <li>
              Pessoas físicas indicadas no caso de inexistência de beneficiário.
            </li>
            <li>
              Este só será acionado em caso de ausência do beneficiário legal
            </li>
          </ul>
        </div>
      </Modal>
    </PageLayout>
  )
}

export default NovoParticipante
