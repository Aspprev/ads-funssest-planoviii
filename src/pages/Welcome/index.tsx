import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { FiArrowRightCircle } from 'react-icons/fi'
import { Base64 } from 'js-base64'
import Button from '../../components/Button'
import Header from '../../components/Header'
import usePersistedState from '../../hooks/usePersistedState'
import api from '../../services/api'

import { Container, Content, BtnModal } from './styles'
import ModalBox from '../../components/Modal'
import {
  ConfigData,
  UserData,
  UserDetails,
  ErroProps,
} from '../../utils/interfaces'

const BemVindo: React.FC = () => {
  const [configData] = usePersistedState<ConfigData>(
    'configData',
    {} as ConfigData,
  )
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [userDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [, setErroProps] = usePersistedState<ErroProps>(
    'erroProps',
    {} as ErroProps,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [txtModal, setTxtModal] = useState('')
  const history = useHistory()

  const handleStart = useCallback(async () => {
    if (userDetails.pctContribuicaoSuplementar !== 0) {
      history.push('/aport-confirmation')
    } else {
      // history.push('/taxation')
      history.push('/pep-fatca')
    }
  }, [history, userDetails])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleFinish = useCallback(async () => {
    const parametros = Base64.encode(
      `{"token": "${configData.token}",
        "versao":"${configData.tipo}",
        "plano": "${configData.plano}",
        "cliente":"${configData.codCliente}",
        "nome": "${userData.name.toLowerCase()}",
        "nascimento":"${userData.birthdate}",
        "cpf":"${
          userData.cpf === undefined
            ? ''
            : userData.cpf.replaceAll('.', '').replace('-', '')
        }",
        "admissao":"${
          userData.admission === undefined ? '' : userData.admission
        }",
        "telefone":"${
          userData.phone === undefined
            ? ''
            : `55${userData.phone
                .replace('(', '')
                .replace(') ', '')
                .replace('-', '')}`
        }",
        "email":"${userData.email === undefined ? '' : userData.email}",
        "nomeMae": "${
          userData.parental === undefined ? '' : userData.parental.toLowerCase()
        }",
        "patrocinadora":"${userData.patrocinadora}"
      }`,
    )

    const parametrosFinal = Base64.encode(parametros)

    await api
      .get(`wsTermoRecusa.rule?sys=ADZ&Entrada=${parametrosFinal}`)
      .then(res => {
        if (res.data.urlTermo !== 'N') {
          window.open(`${res.data.urlTermo}`, '_blank')
        }
        history.push('/finish')
      })
      .catch(res => {
        if (res.message === 'Network Error') {
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
        } else if (res.message === 'Request failed with status code 406') {
          setTxtModal(
            'Você já aderiu ao Plano V. Em caso de dúvida procure o atendimento.',
          )
          setIsModalOpen(true)
        } else if (res.message === 'Request failed with status code 409') {
          setTxtModal(
            'Opção já escolida. Caso queria aderir clique no botão "Quero aderir ao Plano V"',
          )
          setIsModalOpen(true)
        } else if (res.message === 'Request failed with status code 408') {
          // eslint-disable-next-line no-alert
          alert('Tempo de sessão expirado')
          history.push('/register')
        } else {
          setTxtModal('Ops, algo deu errado. Tente novamente mais tarde.')
          setIsModalOpen(true)
        }
      })
  }, [configData, history, setErroProps, userData])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          {/* <strong>Você é colaborador?</strong> */}
          <span>
            Agora que você conhece um pouco mais o nosso plano, comece a
            planejar o seu futuro fazendo sua adesão.
          </span>
          <Button
            color="orange"
            onClick={handleStart}
            width="large"
            fontSize="normal"
          >
            Quero aderir ao Plano V!
            <FiArrowRightCircle size={45} />
          </Button>
          <Button
            color="white"
            onClick={handleFinish}
            width="small"
            fontSize="small"
          >
            Por enquanto não tenho interesse.
          </Button>
          <small>
            O Plano V da Funssest é um plano de previdência complementar
            oferecido aos empregados de suas patrocinadoras. Você contribui com
            uma parte e a empresa com o mesmo valor, dentro das regras do plano.
            O objetivo principal é formar uma reserva de poupança e garantir
            mais tranquilidade para o seu futuro. Um complemento de renda aos
            valores que serão recebidos pelo INSS.
          </small>
        </Content>
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

export default BemVindo
