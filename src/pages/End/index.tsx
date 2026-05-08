import React, { useCallback, useEffect } from 'react'

import Header from '../../components/Header'

import Img11 from '../../assets/ilustracao_tela11.png'

import { Container, Content, Line } from './styles'
import Button from '../../components/Button'
import usePersistedState from '../../hooks/usePersistedState'

const End: React.FC = () => {
  const [flagAssistencial] = usePersistedState('flagAssistencial', '')
  const handleClick = useCallback(() => {
    window.open('https://funssest.greendocs.net/', '_self')
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          <strong>
            Pronto! Seu pedido de aquisição do Plano V Funssest foi salvo com
            sucesso!
          </strong>

          <img src={Img11} alt="img11" />

          <p>
            Vamos avaliar seus dados e em breve você receberá a confirmação da
            adesão ao Plano V Funssest por e-mail!
          </p>
          {/* {flagAssistencial === 'S' ? (
            <>
              <Line />
              <p>
                Você está alocado na unidade Tubarão? Agora você já pode
                contratar a Cobertura Suplementar, produto da gestão do Plano de
                Saúde da Funssest. <br />
              </p>
              <Button
                color="orange"
                width="medium"
                onClick={handleClick}
                fontSize="small"
              >
                Adquirir Cobertura Supelentar
              </Button>
              <br />
            </>
          ) : (
            <></>
          )} */}
          <Line />
          <div>
            <strong>Acesse o nosso site:</strong>
            <a href="https://www.funssest.com.br/">www.funssest.com.br</a>
          </div>
        </Content>
      </Container>
    </>
  )
}

export default End
