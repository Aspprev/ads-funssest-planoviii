/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { Collapse } from '@material-ui/core'
import usePersistedState from '../../hooks/usePersistedState'

import Header from '../../components/Header'
import Button from '../../components/Button'

import {
  Container,
  Content,
  Line,
  BtnVoltar,
  RadioButton,
  BtnContato,
} from './styles'

const CarePlan: React.FC = () => {
  const [flagTubarao, setFlagTubarao] = usePersistedState('flagTubarao', '')
  const [flagAssistencial, setFlagAssistencial] = usePersistedState(
    'flagAssistencial',
    '',
  )

  const history = useHistory()

  // const handleClick = useCallback(() => {
  //   window.open('https://www.funssest.com.br/planos-assistenciais/', '_blank')
  // }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          <strong>Você está alocado na unidade Tubarão?</strong>

          <RadioButton>
            <div>
              <BtnContato
                type="button"
                isActive={flagTubarao === 'S'}
                onClick={() => setFlagTubarao('S')}
              >
                Sim
              </BtnContato>
              <BtnContato
                type="button"
                isActive={flagTubarao === 'N'}
                onClick={() => setFlagTubarao('N')}
              >
                Não
              </BtnContato>
            </div>
          </RadioButton>
          <div className="care">
            <Collapse in={flagTubarao === 'S'}>
              <Line />

              <strong>Deseja aderir à Cobertura Suplementar Funssest?</strong>
              <p>
                Ao clicar em &quot;sim&quot;, você autoriza sua inclusão e a
                inclusão de seus dependentes no produto assistencial Cobertura
                Suplementar, conforme detalhado na palestra de adesão.
              </p>
              <RadioButton>
                <div>
                  <BtnContato
                    type="button"
                    isActive={flagAssistencial === 'S'}
                    onClick={() => setFlagAssistencial('S')}
                  >
                    Sim
                  </BtnContato>
                  <BtnContato
                    type="button"
                    isActive={flagAssistencial === 'N'}
                    onClick={() => setFlagAssistencial('N')}
                  >
                    Não
                  </BtnContato>
                </div>
              </RadioButton>
              <p>
                Para saber mais acesse{' '}
                <a
                  href="https://www.funssest.com.br/wp-content/uploads/2023/07/Funssest_SUPLEMENTAR_Jan2021-ONLINE.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.funssest.com.br
                </a>
              </p>
            </Collapse>
          </div>
        </Content>

        <Button
          color="orange"
          onClick={() => history.push('/resume')}
          width="medium"
          disabled={
            flagTubarao === '' ||
            (flagTubarao === 'S' && flagAssistencial === '')
          }
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

export default CarePlan
