import { Base64 } from 'js-base64'
import React, { useCallback, useEffect, useState } from 'react'
import { FiArrowLeft, FiArrowRightCircle } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import ModalBox from '../../components/Modal'
import ModalActionButton from '../../components/ModalActionButton'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import useConfigData from '../../hooks/useConfigData'
import usePersistedState from '../../hooks/usePersistedState'
import api from '../../services/api'
import { persistErrorAndRedirect } from '../../utils/apiError'
import {
  closePendingWindow,
  openPendingWindow,
  openResolvedWindow,
  sanitizeCpf,
  sanitizePhone,
  scrollToTop,
} from '../../utils/browser'
import { ErroProps, UserData, UserDetails } from '../../utils/interfaces'

const Welcome: React.FC = () => {
  const [configData] = useConfigData()
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

  const handleStart = useCallback(() => {
    if (userDetails.pctContribuicaoSuplementar !== 0) {
      history.push('/aport-confirmation')
      return
    }

    history.push('/pep-fatca')
  }, [history, userDetails.pctContribuicaoSuplementar])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleFinish = useCallback(async () => {
    const pendingWindow = openPendingWindow()
    const parametros = Base64.encode(
      `{"token": "${configData.token}",
        "versao":"${configData.tipo}",
        "plano": "${configData.plano}",
        "cliente":"${configData.codCliente}",
        "nome": "${(userData.name ?? '').toLowerCase()}",
        "nascimento":"${userData.birthdate ?? ''}",
        "cpf":"${sanitizeCpf(userData.cpf)}",
        "admissao":"${userData.admission ?? ''}",
        "telefone":"55${sanitizePhone(userData.phone)}",
        "email":"${userData.email ?? ''}",
        "nomeMae": "${(userData.parental ?? '').toLowerCase()}",
        "patrocinadora":"${userData.patrocinadora ?? ''}"
      }`,
    )

    const parametrosFinal = Base64.encode(parametros)

    try {
      const res = await api.get(
        `wsTermoRecusa.rule?sys=ADZ&Entrada=${parametrosFinal}`,
      )

      if (res.data.urlTermo && res.data.urlTermo !== 'N') {
        openResolvedWindow(pendingWindow, `${res.data.urlTermo}`)
      } else {
        closePendingWindow(pendingWindow)
      }

      history.push('/finish')
    } catch (error) {
      closePendingWindow(pendingWindow)

      const status =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined

      if (status === 406) {
        setTxtModal(
          'Você já aderiu ao Plano VIII. Em caso de dúvida, procure o atendimento.',
        )
        setIsModalOpen(true)
        return
      }

      if (status === 409) {
        setTxtModal(
          'Opção já escolhida. Caso queira aderir, clique no botão "Quero aderir ao Plano VIII".',
        )
        setIsModalOpen(true)
        return
      }

      if (status === 408) {
        setErroProps({
          title: 'Sessão expirada',
          description: 'Sua sessão expirou. Preencha seus dados novamente para continuar.',
        })
        history.push('/register')
        return
      }

      persistErrorAndRedirect(history, setErroProps, error)
    }
  }, [configData, history, setErroProps, userData])

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout>
      <PageCard className="flex flex-col items-center text-center">
        <span className="mb-4">
          Agora que você conhece um pouco mais o nosso plano, comece a planejar
          o seu futuro fazendo sua adesão.
        </span>
        <Button
          color="orange"
          onClick={handleStart}
          width="large"
          fontSize="normal"
        >
          Quero aderir ao Plano VIII!
          <FiArrowRightCircle size={40} />
        </Button>
        <Button
          color="white"
          onClick={handleFinish}
          width="small"
          fontSize="small"
        >
          Por enquanto não tenho interesse.
        </Button>
        <small className="mt-4">
          O Plano VIII da Funssest é um plano de previdência complementar
          oferecido aos empregados de suas patrocinadoras. Você contribui com uma
          parte e a empresa com o mesmo valor, dentro das regras do plano. O
          objetivo principal é formar uma reserva de poupança e garantir mais
          tranquilidade para o seu futuro, como complemento de renda aos valores
          recebidos pelo INSS.
        </small>
      </PageCard>
      <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        {txtModal}
        <ModalActionButton onClick={handleCloseModal}>Ok</ModalActionButton>
      </ModalBox>
      <BackButton type="button" onClick={() => history.push('/simulation')}>
        <FiArrowLeft /> Voltar
      </BackButton>
    </PageLayout>
  )
}

export default Welcome
