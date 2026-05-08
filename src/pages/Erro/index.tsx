import React from 'react'

import { useHistory } from 'react-router-dom'
import { FiAlertTriangle } from 'react-icons/fi'
import { Container, BtnVoltar } from './styles'
import Header from '../../components/Header'
import usePersistedState from '../../hooks/usePersistedState'

interface ErroProps {
  title: string
  description?: string
}

const Erro: React.FC = () => {
  const [erroProps] = usePersistedState<ErroProps>('erroProps', {} as ErroProps)
  const history = useHistory()

  return (
    <>
      <Header />
      <Container>
        <FiAlertTriangle color="#FF612E" size={100} />
        <h2>{erroProps.title}</h2>
        {erroProps.description ? (
          <strong>{erroProps.description}</strong>
        ) : (
          <></>
        )}
        <BtnVoltar type="button" onClick={() => history.goBack()}>
          &lt; Voltar
        </BtnVoltar>
      </Container>
    </>
  )
}

export default Erro
