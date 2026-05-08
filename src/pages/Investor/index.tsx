import React, { useState, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import usePersistedState from '../../hooks/usePersistedState'

import Button from '../../components/Button'
import Header from '../../components/Header'

import { UserDetails } from '../../utils/interfaces'
import {
  Container,
  Content,
  InvestorBox,
  GoalItem,
  BtnVoltar,
  Line,
} from './styles'
import ModalBox from '../../components/Modal'

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

  function handleCloseModal(): void {
    setIsModalOpen(false)
  }

  const handleInvestItem = useCallback(valor => {
    if (valor === 'S') {
      setSelected(valor)
      setDescInvest(
        `O recurso é aplicado em renda fixa (títulos públicos, CDBs, fundos DI, etc) e não há alocação em renda variável.`,
      )
    } else if (valor === 'C') {
      setSelected(valor)
      setDescInvest(
        `Parte do saldo (de 3% a 7% do total) poderá ser aplicada em renda variável (ações em bolsas de valores, por exemplo).`,
      )
    } else if (valor === 'M') {
      setSelected(valor)
      setDescInvest(
        `Parte do saldo (de 12% a 18% do total) poderá ser aplicada em renda variável (ações em bolsas de valores, por exemplo).`,
      )
    } else if (valor === 'A') {
      setSelected(valor)
      setDescInvest(
        `Parte do saldo (de 25% a 35% do total) poderá ser aplicada em renda variável (ações em bolsas de valores, por exemplo).`,
      )
    }
  }, [])

  useEffect(() => {
    handleInvestItem(selected)
  }, [handleInvestItem, selected])

  const handleContinue = useCallback(async () => {
    if (selected === '') {
      setIsModalOpen(true)
      setTextoModal('Informe seu perfil de investidor')
    } else {
      await setUserDetails({
        ...userDetails,
        investor: selected,
      })
      // history.push('/new-participant')
      history.push('/attachment')
    }
  }, [history, selected, setUserDetails, userDetails])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        {textoModal}
      </ModalBox>
      <Container>
        <Content>
          <strong>Perfil de Investimento</strong>
          <p>Selecione abaixo a opção do seu Perfil de Investimento</p>

          <InvestorBox>
            <GoalItem
              key="1"
              isSelected={selected === 'S'}
              onClick={() => handleInvestItem('S')}
            >
              <span>Superconservador</span>
            </GoalItem>
            <GoalItem
              key="2"
              isSelected={selected === 'C'}
              onClick={() => handleInvestItem('C')}
            >
              <span>Conservador</span>
            </GoalItem>
            <GoalItem
              key="3"
              isSelected={selected === 'M'}
              onClick={() => handleInvestItem('M')}
            >
              <span>Moderado</span>
            </GoalItem>
            <GoalItem
              key="4"
              isSelected={selected === 'A'}
              onClick={() => handleInvestItem('A')}
            >
              <span>Agressivo</span>
            </GoalItem>
          </InvestorBox>

          <Line />
          <footer>
            <p>{descrInvest}</p>
          </footer>
        </Content>
        <Button
          type="button"
          color="orange"
          onClick={handleContinue}
          disabled={!selected}
        >
          Continuar
        </Button>
        <BtnVoltar type="button" onClick={() => history.goBack()}>
          &lt; Anterior
        </BtnVoltar>
      </Container>
    </>
  )
}

export default Investor
