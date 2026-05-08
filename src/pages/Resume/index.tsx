/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'
// import { Base64 } from 'js-base64'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { CircularProgress } from '@material-ui/core'
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiMail,
  FiSmartphone,
  FiUser,
} from 'react-icons/fi'
import * as Yup from 'yup'
import { MdSecurity } from 'react-icons/md'
import { FaFemale } from 'react-icons/fa'
import { Base64 } from 'js-base64'
import usePersistedState from '../../hooks/usePersistedState'
import calculaIdade from '../../utils/calculaIdade'
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
  Participants,
  InfoContent,
  Line,
  RadioButton,
  RadioButton2,
  BtnOption,
  BtnContato,
  BtnModal,
} from './styles'
import ModalBox from '../../components/Modal'
import Input from '../../components/Input'
import getValidationErrors from '../../utils/getValidationErrors'
import InputHidden from '../../components/InputHidden'
import api from '../../services/api'

const Resume: React.FC = () => {
  const [configData, setConfigData] = usePersistedState<ConfigData>(
    'configData',
    {} as ConfigData,
  )
  const [userData, setUserData] = usePersistedState<UserData>(
    'userData',
    {} as UserData,
  )
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [selectedReceive] = usePersistedState<'PD' | 'PS' | 'VF' | 'null'>(
    'receiveTypeSelected',
    'PD',
  )

  const [participants] = usePersistedState<Participant[]>(
    'participantsGroup',
    [],
  )

  const [flagEdit, setFlagEdit] = usePersistedState<'S' | 'N' | ''>(
    'flagEdit',
    'N',
  )

  const [, setErroProps] = usePersistedState<ErroProps>(
    'erroProps',
    {} as ErroProps,
  )
  const [aguarde, setAguarde] = useState(false)
  const [timer, setTimer] = useState(0)
  const [reSend, setReSend] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tipoContato, setTipoContato] = useState('S')
  const [clicado, setClicado] = useState(false)
  const [txtModal, setTxtModal] = useState('')

  const formRef = useRef<FormHandles>(null)

  function handleCloseModal(): void {
    setIsModalOpen(false)
  }
  const history = useHistory()

  const handleConfirmaAdesao = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({})
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

        await schema.validate(data, { abortEarly: false })

        await setUserData({
          ...userData,
          email: data.email,
          phone: data.phone,
          parental: data.parental,
        })

        localStorage.removeItem('@Funssest:flagEdit')

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
            "admissao":"${userData.admission}",
            "envio":"${tipoContato}"}`,
        )

        const parametrosFinal = Base64.encode(parametros)

        await api
          .get(`wsAutenticacao.rule?sys=ADZ&Entrada=${parametrosFinal}`)
          .then(res => {
            setConfigData({ ...configData, token: res.data.token, tipoContato })

            history.push('/conclusion')
          })
          .catch(res => {
            if (res.message === 'Network Error') {
              setErroProps({
                title: res.message,
                description: 'Falha na conexão como servidor',
              })
              setAguarde(false)
              history.push('/erro')
            } else if (res.message === 'Request failed with status code 500') {
              setErroProps({
                title: 'Erro interno no servidor',
                description: res.message,
              })
              setAguarde(false)
              history.push('/erro')
            } else if (res.message === 'Request failed with status code 404') {
              setTxtModal(
                'Não localizamos os seus dados na base cadastral. Por favor, confira as informações digitadas ou entre em contato com a área de atendimento.',
              )
              setIsModalOpen(true)
              setAguarde(false)
            } else if (res.message === 'Request failed with status code 401') {
              setTxtModal('Você já é participante.')
              setIsModalOpen(true)
              setAguarde(false)
            } else {
              setTxtModal('Ops, algo deu errado. Tente novamente mais tarde.')
              setIsModalOpen(true)
              setAguarde(false)
            }
          })
      } catch (err) {
        formRef.current?.setErrors(getValidationErrors(err))
      }
    },
    [
      setUserData,
      userData,
      configData,
      tipoContato,
      history,
      setConfigData,
      setErroProps,
    ],
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
    async e => {
      await setFlagEdit('S')

      if (e === 'S') {
        // console.log(e)
        history.push('/')
      } else {
        history.push('/new-participant')
      }
    },
    [history, setFlagEdit],
  )

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
        <Form
          onSubmit={handleConfirmaAdesao}
          ref={formRef}
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
          <Content>
            <strong>Resumo de Adesão</strong>
            <Participants>
              <h4>Dados pessoais</h4>
              <div className="titular">
                <Input
                  name="name"
                  placeholder="nome"
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
                  placeholder="Nome Completo da Mãe"
                  icon={FaFemale}
                  sizeBox="small"
                />
              </div>
            </Participants>

            <Line />

            <Participants>
              <h4>Informações adicionais</h4>
              {/* <RadioButton>
                <label>Regime de Tributação</label>
                <div>
                  <BtnOption
                    type="button"
                    isActive={userDetails.tributacao === 'P'}
                    onClick={() => {
                      setUserDetails({
                        ...userDetails,
                        tributacao: 'P',
                      })
                    }}
                  >
                    Progressivo
                  </BtnOption>
                  <BtnOption
                    type="button"
                    isActive={userDetails.tributacao === 'R'}
                    onClick={() => {
                      setUserDetails({
                        ...userDetails,
                        tributacao: 'R',
                      })
                    }}
                  >
                    Regressivo
                  </BtnOption>
                </div>
              </RadioButton> */}

              <RadioButton>
                <label>Pessoa politicamente exposta (PPE)?</label>
                <div>
                  <BtnOption
                    type="button"
                    isActive={userDetails.ppe === 'S'}
                    onClick={() => {
                      setUserDetails({
                        ...userDetails,
                        ppe: 'S',
                      })
                    }}
                  >
                    Sim
                  </BtnOption>
                  <BtnOption
                    type="button"
                    isActive={userDetails.ppe === 'N'}
                    onClick={() => {
                      setUserDetails({
                        ...userDetails,
                        ppe: 'N',
                      })
                    }}
                  >
                    Não
                  </BtnOption>
                </div>
              </RadioButton>

              <RadioButton>
                <label>É residente no exterior para fins fiscais?</label>
                <div>
                  <BtnOption
                    type="button"
                    isActive={userDetails.usperson === 'S'}
                    onClick={() => {
                      setUserDetails({
                        ...userDetails,
                        usperson: 'S',
                      })
                    }}
                  >
                    Sim
                  </BtnOption>
                  <BtnOption
                    type="button"
                    isActive={userDetails.usperson === 'N'}
                    onClick={() => {
                      setUserDetails({
                        ...userDetails,
                        usperson: 'N',
                      })
                    }}
                  >
                    Não
                  </BtnOption>
                </div>
              </RadioButton>

              <RadioButton>
                <label>Perfil de Investidor</label>
                <div>
                  <BtnOption
                    type="button"
                    isActive={userDetails.investor === 'S'}
                    onClick={() => {
                      setUserDetails({
                        ...userDetails,
                        investor: 'S',
                      })
                    }}
                  >
                    Superconservador
                  </BtnOption>
                  <BtnOption
                    type="button"
                    isActive={userDetails.investor === 'C'}
                    onClick={() => {
                      setUserDetails({
                        ...userDetails,
                        investor: 'C',
                      })
                    }}
                  >
                    Conservador
                  </BtnOption>
                  <BtnOption
                    type="button"
                    isActive={userDetails.investor === 'M'}
                    onClick={() => {
                      setUserDetails({
                        ...userDetails,
                        investor: 'M',
                      })
                    }}
                  >
                    Moderado
                  </BtnOption>
                  <BtnOption
                    type="button"
                    isActive={userDetails.investor === 'A'}
                    onClick={() => {
                      setUserDetails({
                        ...userDetails,
                        investor: 'A',
                      })
                    }}
                  >
                    Agressivo
                  </BtnOption>
                </div>
              </RadioButton>
            </Participants>

            <Line />

            <Participants>
              <h4>Contribuição</h4>
              <InfoContent>
                {/* <div>
                  <p>Contribuição básica ao Plano:</p>
                  <strong>{parseFloat(userDetails.pctContribuicaoBasica.toFixed(2))}%</strong>
                </div> */}
                <div>
                  <p>Contribuição do aporte voluntário:</p>
                  <strong>{userDetails.pctContribuicaoSuplementar}%</strong>
                </div>
                <button
                  className="edit"
                  type="button"
                  onClick={() => {
                    setFlagEdit('S')
                    goback('S')
                  }}
                >
                  Simular novamente
                </button>
              </InfoContent>
            </Participants>
            <Line />

            <Participants>
              {participants.length > 0 ? (
                <>
                  <h4>Beneficiários</h4>
                  <InfoContent>
                    {dependents.map(d => (
                      <div key={Math.random()} className="dependents">
                        <div className="infos">
                          <p>{d.data.name}</p>
                          <small>
                            {d.details.dcrGrauParentesco}
                            {', '}
                            {calculaIdade(d.data.birthdate)}{' '}
                            {calculaIdade(d.data.birthdate) > 1
                              ? 'anos'
                              : 'ano'}
                          </small>
                        </div>
                      </div>
                    ))}
                    <button
                      className="edit"
                      type="button"
                      onClick={() => goback('b')}
                    >
                      Incluir novo beneficiário
                    </button>
                  </InfoContent>
                  <Line />
                </>
              ) : (
                <></>
              )}
            </Participants>
            <Participants>
              <RadioButton2>
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
              </RadioButton2>
              <InputHidden
                name="tipContato"
                value={tipoContato}
                type="hidden"
              />
            </Participants>
          </Content>
        </Form>
        <Button
          type="button"
          color="orange"
          width="large"
          disabled={!reSend || aguarde}
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
                <FiCheck size={36} />
                <span>Confirmar informações</span>
              </>
            )
          ) : (
            <>
              <CircularProgress color="inherit" />
              <span>Aguarde</span>
            </>
          )}
        </Button>
        <BtnVoltar type="button" onClick={() => history.goBack()}>
          &lt; Anterior
        </BtnVoltar>

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

export default Resume
