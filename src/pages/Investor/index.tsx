import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import usePersistedState from '../../hooks/usePersistedState'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import ModalBox from '../../components/Modal'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import SectionDivider from '../../components/SectionDivider'
import { scrollToTop } from '../../utils/browser'
import { UserDetails } from '../../utils/interfaces'

const InvestorBox = ({
  children,
}: React.PropsWithChildren): React.JSX.Element => (
  <div className="mx-auto my-5 grid grid-cols-[1fr_1fr] items-center justify-evenly gap-4">
    {children}
  </div>
)

const GoalItem = ({
  isSelected,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected: boolean
}): React.JSX.Element => (
  <button
    type="button"
    className={`h-16 w-50 rounded-sm border ${
      isSelected
        ? 'border-brand-400/60 bg-brand-100 font-bold'
        : 'border-[#AEAEAE]/60 font-normal'
    }`}
    {...props}
  >
    {children}
  </button>
)

const Investor: React.FC = () => {
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const history = useHistory()
  const [selected, setSelected] = useState(userDetails.investor)
  const [descrInvest, setDescInvest] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [textoModal, setTextoModal] = useState('')

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleInvestItem = useCallback((valor: string) => {
    if (valor === 'S') {
      setSelected(valor)
      setDescInvest(
        'O recurso é aplicado em renda fixa (títulos públicos, CDBs, fundos DI etc.) e não há alocação em renda variável.',
      )
      return
    }

    if (valor === 'C') {
      setSelected(valor)
      setDescInvest(
        'Parte do saldo (de 3% a 7% do total) poderá ser aplicada em renda variável, como ações em bolsa.',
      )
      return
    }

    if (valor === 'M') {
      setSelected(valor)
      setDescInvest(
        'Parte do saldo (de 12% a 18% do total) poderá ser aplicada em renda variável, como ações em bolsa.',
      )
      return
    }

    if (valor === 'A') {
      setSelected(valor)
      setDescInvest(
        'Parte do saldo (de 25% a 35% do total) poderá ser aplicada em renda variável, como ações em bolsa.',
      )
    }
  }, [])

  useEffect(() => {
    handleInvestItem(selected)
  }, [handleInvestItem, selected])

  const handleContinue = useCallback(() => {
    if (selected === '') {
      setIsModalOpen(true)
      setTextoModal('Informe seu perfil de investidor.')
      return
    }

    setUserDetails(current => ({
      ...current,
      investor: selected,
    }))
    history.push('/new-participant')
  }, [history, selected, setUserDetails])

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout>
      <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        {textoModal}
      </ModalBox>
      <PageCard className="flex flex-col items-center text-center">
        <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
          Perfil de investimento
        </strong>
        <p>Selecione abaixo a opção do seu perfil de investimento.</p>

        <InvestorBox>
          <GoalItem isSelected={selected === 'S'} onClick={() => handleInvestItem('S')}>
            <span>Superconservador</span>
          </GoalItem>
          <GoalItem isSelected={selected === 'C'} onClick={() => handleInvestItem('C')}>
            <span>Conservador</span>
          </GoalItem>
          <GoalItem isSelected={selected === 'M'} onClick={() => handleInvestItem('M')}>
            <span>Moderado</span>
          </GoalItem>
          <GoalItem isSelected={selected === 'A'} onClick={() => handleInvestItem('A')}>
            <span>Agressivo</span>
          </GoalItem>
        </InvestorBox>

        <SectionDivider className="mb-5 mt-4 w-2/3" />
        <div className="text-sm">
          <p>{descrInvest}</p>
        </div>
      </PageCard>
      <Button
        type="button"
        color="orange"
        onClick={handleContinue}
        disabled={!selected}
      >
        Continuar <FiArrowRight size={20} />
      </Button>
      <BackButton type="button" onClick={() => history.goBack()}>
        <FiArrowLeft /> Voltar
      </BackButton>
    </PageLayout>
  )
}

export default Investor
