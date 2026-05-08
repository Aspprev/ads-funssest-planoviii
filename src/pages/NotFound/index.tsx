import React from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content } from './styles'
import Header from '../../components/Header'
import Button from '../../components/Button'
import notFoundImg from '../../assets/not-found.png'

const NotFound: React.FC = () => {
  const history = useHistory()

  return (
    <>
      <Header />
      <Container>
        <Content>
          <img src={notFoundImg} alt="404 error" />
          <h3>Ops, não tem nada por aqui...</h3>

          <Button type="button" color="orange" onClick={() => history.goBack()}>
            VOLTAR
          </Button>
        </Content>
      </Container>
    </>
  )
}

export default NotFound
