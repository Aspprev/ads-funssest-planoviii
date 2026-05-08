import React, { useState, useCallback, useEffect } from 'react'

import { useHistory } from 'react-router-dom'
import { Container, Content, Main, GoalItem, Arrow } from './styles'

import usePersistedState from '../../../hooks/usePersistedState'
import Button from '../../../components/Button'

import goalRetirement from '../../../assets/goal-retirement.svg'
import goalTravel from '../../../assets/goal-travel.svg'
import goalHouse from '../../../assets/goal-house.svg'
import goalSuccessors from '../../../assets/goal-successors.svg'
import goalOther from '../../../assets/goal-other.svg'
import goalChildrenEducation from '../../../assets/goal-children-education.svg'
import Header from '../../../components/Header'

const GoalSelection: React.FC = () => {
  const goalItems = [
    {
      name: 'Aposentar',
      icon: goalRetirement,
    },
    {
      name: 'Viajar',
      icon: goalTravel,
    },
    {
      name: 'Educar os filhos',
      icon: goalChildrenEducation,
    },
    {
      name: 'Comprar imóveis',
      icon: goalHouse,
    },
    {
      name: 'Deixar bens para herdeiros',
      icon: goalSuccessors,
    },
    {
      name: 'Outros',
      icon: goalOther,
    },
  ]

  const [goalsSelected, setGoalsSelected] = usePersistedState<number[]>(
    'goalsSelected',
    [],
  )

  const history = useHistory()

  const toggleSelected = useCallback(
    index => {
      if (goalsSelected.filter(val => val === index).length) {
        setGoalsSelected(() => goalsSelected.filter(val => val !== index))
      } else {
        setGoalsSelected([...goalsSelected, index])
      }
    },
    [goalsSelected, setGoalsSelected],
  )

  const handleContinue = useCallback(() => {
    history.push('/aab')
  }, [history])

  return (
    <>
      <Header>
        Quais são os seus principais objetivos ao investir em previdência
        privada?
      </Header>
      <Container>
        <Content>
          <p>Selecione uma ou mais opções</p>
          <Main>
            {goalItems.map((value, index) => (
              <GoalItem
                key={value.name}
                isSelected={
                  !!(
                    goalsSelected.length &&
                    goalsSelected.filter(val => {
                      return val === index
                    }).length
                  )
                }
                onClick={() => toggleSelected(index)}
              >
                <div>
                  <img src={value.icon} alt={value.name} />
                  <span>{value.name}</span>
                </div>
              </GoalItem>
            ))}
          </Main>
          <footer>
            <p>
              O Plano BRF Previdência Família é uma opção inteligente e segura
              de você juntar dinheiro para realizar seus sonhos de longo prazo.{' '}
            </p>
            <p>
              Por isso, o ideal é que pense nos seus planos para daqui, no
              mínimo, dez anos.
            </p>
          </footer>
          <Arrow />
        </Content>
        {/* <Button
          type="button"
          color="green"
          onClick={handleContinue}
          disabled={!goalsSelected.length}
        >
          Continuar
        </Button> */}
      </Container>
    </>
  )
}

export default GoalSelection
