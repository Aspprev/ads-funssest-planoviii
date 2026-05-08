/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import Modal from 'react-modal'
import moment from 'moment'
import * as Yup from 'yup'

import { FiUser, FiX, FiPercent } from 'react-icons/fi'
import { MdSecurity } from 'react-icons/md'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { BiCake } from 'react-icons/bi'
import getValidationErrors from '../../utils/getValidationErrors'
import usePersistedState from '../../hooks/usePersistedState'
import validaCPF from '../../utils/validaCPF'

import InputSelect from '../../components/InputSelect'
import InputHidden from '../../components/InputHidden'
import Header from '../../components/Header'
import Button from '../../components/Button'
import Input from '../../components/Input'

import {
  Container,
  Content,
  RadioButton,
  BtnVoltar,
  BtnContato,
  Line,
  BenefBox,
  ContentBenef,
} from './styles'
import {
  UserData,
  Participant,
  ParticipantDetails,
} from '../../utils/interfaces'
import calculaIdade from '../../utils/calculaIdade'

Modal.setAppElement('#root')

const NovoParticipante: React.FC = () => {
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [userDetails] = usePersistedState<ParticipantDetails>(
    'userDetails',
    {} as ParticipantDetails,
  )

  const [participants, setParticipants] = usePersistedState<Participant[]>(
    'participantsGroup',
    [],
  )

  const [vlrProporcao, setVlrProporcao] = useState(1)
  const [, setSaveAndAddNew] = useState(false)
  const [tipoBenef, setTipoBenef] = useState('2')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [thisParticipantData] = useState<UserData>({} as UserData)
  const [thisParticipantDetails] = useState<ParticipantDetails>(
    {} as ParticipantDetails,
  )
  const [thisParticipant, setThisParticipant] = useState<Participant>(
    {} as Participant,
  )

  const [grauParent, setGrauParent] = useState({
    label: userDetails.dcrGrauParentesco,
    value: userDetails.grauParentesco,
  })

  const formRef = useRef<FormHandles>(null)
  const history = useHistory()
  const location = useLocation()

  // const [dtNasc, setDtNasc] = useState('')

  const handleAddNovo = useCallback(() => {
    setSaveAndAddNew(true)
    const field = formRef.current?.getFieldRef('addNew')
    field.value = true
    formRef.current?.submitForm()
  }, [])

  const handleJustSave = useCallback(() => {
    setSaveAndAddNew(false)
    const field = formRef.current?.getFieldRef('addNew')
    field.value = false
    formRef.current?.submitForm()
  }, [])

  const handleChangeGrauParentesco = useCallback(e => {
    const t = e
    setGrauParent(t)
  }, [])

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleRemove = useCallback(
    id => {
      setParticipants(() =>
        participants.filter((participant, idx) => idx !== id),
      )
    },
    [participants, setParticipants],
  )

  useEffect(() => {
    const benefBox = document.getElementById('benefBox') as HTMLDivElement
    const altura = benefBox.clientHeight
    window.scrollTo({
      top: altura,
      left: 0,
      behavior: 'smooth',
    })
  }, [])

  const handleSubmit = useCallback(
    async formData => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string()
            .required('Seu nome é obrigatório.')
            .matches(/\s/g, 'Digite o nome completo')
            .min(3, 'Digite o nome completo'),
          birthdate: Yup.string()
            .min(10, 'Data de nascimento inválida')
            .required('Data de nascimento é obrigatória.')
            .test(
              '',
              'A data de nascimento não pode ser maior que hoje.',
              () =>
                moment() >
                  moment(formData.birthdate.split('/').reverse().join('-')) ||
                formData.birthdate === '',
            )
            .test(
              '',
              'Data de nascimento inválida',
              () =>
                moment(
                  formData.birthdate.split('/').reverse().join('-'),
                ).isValid() || formData.birthdate === '',
            )
            .test(
              '',
              'Data de nascimento inválida',
              () =>
                calculaIdade(
                  formData.birthdate.split('/').reverse().join('-'),
                ) <= 115 || formData.birthdate === '',
            ),
          cpf: Yup.string()
            .required('CPF é obrigatório.')
            .test('', 'CPF já utilizado em outro cadastro', function v() {
              const t2 =
                (participants.filter(
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  (participant, idx) => participant.data.cpf === formData.cpf,
                ).length <= 0 &&
                  formData.cpf !== userData.cpf) ||
                formData.cpf === ''
              return t2
            })
            .test('', 'CPF inválido', function t() {
              const teste =
                validaCPF(formData.cpf.replaceAll('.', '').replace('-', '')) ||
                formData.cpf === ''
              return teste
            }),
          proporcao: Yup.string().test(
            '',
            'Campo obrigatório',
            () =>
              (tipoBenef === '1' && formData.proporcao > 0) ||
              tipoBenef === '2',
          ),
          mrcInvalidez: Yup.string().test(
            '',
            'Campo obrigatório',
            () =>
              (tipoBenef === '2' && formData.mrcInvalidez !== '') ||
              tipoBenef === '1',
          ),
          grauParentesco: Yup.string().required('Campo obrigatório'),
        })

        await schema.validate(formData, { abortEarly: false })

        const aa = formData.birthdate
        const dia = aa.split('/')[0]
        const mes = aa.split('/')[1]
        const ano = aa.split('/')[2]
        const dataForm = `${ano}-${`0${mes}`.slice(-2)}-${`0${dia}`.slice(-2)}`

        setThisParticipant({
          ...thisParticipant,
          data: {
            ...thisParticipantData,
            name: formData.name,
            cpf: formData.cpf,
            birthdate: formData.birthdate === '' ? '' : dataForm,
          },
          details: {
            ...thisParticipantDetails,
            tipoBen: tipoBenef,
            grauParentesco: grauParent.value,
            dcrGrauParentesco: grauParent.label,
            proporcao: tipoBenef === '1' ? vlrProporcao : 0,
            mrcInvalidez: formData.mrcInvalidez,
          },
        })

        setParticipants([
          ...participants,
          {
            ...thisParticipant,
            data: {
              ...thisParticipantData,
              name: formData.name,
              cpf: formData.cpf,
              birthdate: formData.birthdate === '' ? '' : dataForm,
            },
            details: {
              ...thisParticipantDetails,
              tipoBen: tipoBenef,
              grauParentesco: grauParent.value,
              dcrGrauParentesco: grauParent.label,
              proporcao: tipoBenef === '1' ? vlrProporcao : 0,
              mrcInvalidez: formData.mrcInvalidez,
            },
          },
        ])
        if (formData.addNew === 'true') {
          history.push(`${location.pathname}`)
          formRef.current?.reset()
        } else {
          history.push('/participants-list')
        }
      } catch (err) {
        formRef.current?.setErrors(getValidationErrors(err))
      }
    },
    [
      grauParent,
      history,
      location.pathname,
      participants,
      setParticipants,
      thisParticipant,
      thisParticipantData,
      thisParticipantDetails,
      tipoBenef,
      userData,
      vlrProporcao,
    ],
  )

  const arr = participants.map(participant => participant.details.proporcao)
  let soma = 0
  for (let i = 0; i < arr.length; i += 1) {
    soma += arr[i]
  }
  const handleValidaProporcao = useCallback((prop, s) => {
    if (prop < 1 || prop > s) {
      const msg = `A proporção deve ser maior que 1 e menor que ${s}`
      // eslint-disable-next-line no-alert
      alert(msg)
    } else {
      setVlrProporcao(prop)
    }
  }, [])

  return (
    <>
      <Header />
      <Container>
        <div id="benefBox" style={{ width: '100%' }}>
          {participants.length > 0 ? (
            <BenefBox>
              <h3>Beneficiários</h3>
              {participants.map((participant, index) => (
                <ContentBenef key={index}>
                  <div>
                    <FiX onClick={() => handleRemove(index)} />
                    <div>
                      <small>
                        {`${index + 1} - Beneficiário ${
                          participant.details.tipoBen === '1' ? 'Indicado' : ''
                        }`}
                      </small>
                    </div>
                    <div>
                      <strong>Nome: </strong>
                      <label>{participant.data.name}</label>
                    </div>
                    <div>
                      <strong>Idade: </strong>
                      <label>
                        {calculaIdade(participant.data.birthdate)} anos
                      </label>
                    </div>
                    <div>
                      <strong>CPF: </strong>
                      <label>{participant.data.cpf}</label>
                    </div>
                    <div>
                      <strong>Vínculo: </strong>
                      <label>{participant.details.dcrGrauParentesco}</label>
                    </div>
                    {participant.details.tipoBen === '2' ? (
                      <div>
                        <strong>Pessoa inválida: </strong>
                        <label>
                          {participant.details.mrcInvalidez === 'S'
                            ? 'Sim'
                            : 'Não'}
                        </label>
                      </div>
                    ) : (
                      <div>
                        <strong>Proporção: </strong>
                        <label>{`${participant.details.proporcao} %`}</label>
                      </div>
                    )}
                  </div>
                  <Line />
                </ContentBenef>
              ))}
            </BenefBox>
          ) : null}
        </div>

        <Content>
          <strong>Adicione um beneficiário: </strong>
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={{
              name: thisParticipantData.name,
              cpf: thisParticipantData.cpf,
              tipoBen: thisParticipantDetails.tipoBen,
              birthdate:
                thisParticipantData.birthdate === undefined
                  ? ''
                  : thisParticipantData.birthdate
                      .split('-')
                      .reverse()
                      .join('/'),
              grauParentesco: grauParent.value,
              dcrGrauParentesco: grauParent.label,
            }}
          >
            <InputHidden name="addNew" type="hidden" />
            <InputHidden name="contribution" type="hidden" />
            <InputHidden name="years" type="hidden" />

            <RadioButton>
              <AiOutlineQuestionCircle onClick={handleOpenModal} />
              <label>Tipo de Beneficiário</label>
              <div>
                <BtnContato
                  type="button"
                  isActive={tipoBenef === '2'}
                  onClick={() => {
                    setTipoBenef('2')
                    setGrauParent({ label: '', value: '' })
                  }}
                >
                  Beneficiário legal
                </BtnContato>
                <BtnContato
                  type="button"
                  isActive={tipoBenef === '1'}
                  onClick={() => {
                    setTipoBenef('1')
                    setGrauParent({ label: '', value: '' })
                  }}
                >
                  Beneficiário indicado
                </BtnContato>
              </div>
            </RadioButton>

            {tipoBenef === '2' ? (
              <InputSelect
                name="grauParentesco"
                value={grauParent}
                options={[
                  { label: 'Conjuge', value: '1' },
                  { label: 'Companheiro(a)', value: '2' },
                  {
                    label: 'Filho(a) não emancipado menor de 21 anos',
                    value: '3',
                  },
                  { label: 'Filho(a) inválido(a)', value: '4' },
                  {
                    label:
                      'Enteado não emancipado menor de 21 anos com dependência econômica',
                    value: '8',
                  },
                  {
                    label: 'Enteado inválido com dependência econômica',
                    value: '9',
                  },
                ]}
                placeholder="Tipo de Vínculo"
                onChange={e => handleChangeGrauParentesco(e)}
              />
            ) : (
              <InputSelect
                name="grauParentesco"
                value={grauParent}
                options={[
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
                ]}
                placeholder="Tipo de Vínculo"
                onChange={e => handleChangeGrauParentesco(e)}
              />
            )}
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
            {/* <Input
              icon={FiCalendar}
              name="birthdate"
              value={dtNasc}
              placeholder="Data de nascimento"
              min="1930-01-01"
              max={new Date().toISOString().split('T')[0]}
              onChange={e => handleOnChange(e)}
              onKeyDown={e => handleOnKeyDown(e)}
            /> */}
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
                value={vlrProporcao}
                name="proporcao"
                type="number"
                min="1"
                max={soma === 0 ? 100 : 100 - soma}
                onChange={e => {
                  handleValidaProporcao(
                    e.target.valueAsNumber,
                    soma === 0 ? 100 : 100 - soma,
                  )
                }}
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
          </Form>
          <Button type="button" fontSize="small" onClick={handleAddNovo}>
            Adicionar mais um beneficiário
          </Button>
        </Content>

        {participants.length > 0 ? (
          // <Button
          //   type="button"
          //   fontSize="normal"
          //   color="white"
          //   onClick={() => history.push('/participants-list')}
          // >
          //   Ver beneficiários
          // </Button>
          <>
            <Button
              type="button"
              fontSize="normal"
              color="orange"
              onClick={() => history.push('/participants-list')}
            >
              <span>Continuar</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              fontSize="normal"
              color="orange"
              onClick={handleJustSave}
            >
              <span>Continuar</span>
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

        <BtnVoltar type="button" onClick={() => history.goBack()}>
          &lt; Anterior
        </BtnVoltar>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          overlayClassName="react-modal-overlay"
          className="react-modal-content"
        >
          <FiX onClick={handleCloseModal} />
          <h3>Qual a diferença entre os tipos de beneficiários?</h3>
          <div>
            <strong>Beneficiário</strong>
            <ul>
              <li>Cônjuge ou companheiro;</li>
              <li>
                Filhos e enteados menores de 21 anos que se enquadrarem nas
                condições de dependentes na Previdência Social;
              </li>
              <li>
                Filhos e enteados solteiros menores de 24 anos que estejam
                cursando ensino superior reconhecido pelo Ministério da
                Educação;
              </li>
              <li>
                Filhos inválidos de qualquer idade que se enquadrarem nas
                condições de dependentes na Previdência Social.
              </li>
            </ul>
          </div>

          <Line />

          <div>
            <strong>Beneficiário Indicado</strong>
            <ul>
              <li>
                Pessoas físicas indicadas no caso de inexistência de
                beneficiário.
              </li>
              <li>
                Este só será acionado em caso de ausência do beneficiário legal
              </li>
            </ul>
          </div>
        </Modal>
      </Container>
    </>
  )
}

export default NovoParticipante
