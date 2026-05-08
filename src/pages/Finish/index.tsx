import React, { useEffect } from 'react'

import Header from '../../components/Header'

import { Container, Content, Line } from './styles'

const Finish: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          <strong>Agradecemos pelo interesse em nosso Plano.</strong>

          <Line />

          <strong>Para mais informações, entre em contato conosco:</strong>
          <div>
            <div>
              <p>Telefone: </p>
              {/* <span>0800 702-1210</span> */}
              <span> (27) 3348-1214</span>
            </div>

            <div>
              <p>Site: </p>
              <span>
                <a href="https://www.funssest.com.br/">www.funssest.com.br</a>
              </span>
            </div>
          </div>
        </Content>
      </Container>
    </>
  )
}

export default Finish
