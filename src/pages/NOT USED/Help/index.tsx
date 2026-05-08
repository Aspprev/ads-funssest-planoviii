import React, { useCallback } from 'react'

import { useLocation, useHistory } from 'react-router-dom'
import { Container } from './styles'
import Button from '../../../components/Button'
import Header from '../../../components/Header'

const Help: React.FC = () => {
  const { state }: { state: { backTo: string } } = useLocation()
  const history = useHistory()

  const handleBack = useCallback(() => {
    if (state?.backTo) {
      history.push('/confirm-ownership')
    } else {
      history.push('/')
    }
  }, [history, state])
  return (
    <>
      <Header>Ajuda</Header>
      <Container>
        <h2>
          Para obter ajuda via atendimento online, entre em contato com o
          0800.123.123
        </h2>

        <Button type="button" onClick={handleBack} color="green">
          Ok! Avançar
        </Button>
      </Container>
    </>
  )
}

export default Help
