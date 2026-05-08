/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { FiArrowRightCircle } from 'react-icons/fi'
import Switch from 'react-switch'
import usePersistedState from '../../hooks/usePersistedState'

import Header from '../../components/Header'
import Button from '../../components/Button'

import { UserDetails } from '../../utils/interfaces'
import { Container, Content, Line, BtnVoltar } from './styles'

const AportConfirmation: React.FC = () => {
  const [userDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )

  const [aportFlag, setAportFlag] = usePersistedState('aportFlag', false)
  const [acceptAport, setAcceptAport] = usePersistedState('aportAccept', false)

  const history = useHistory()

  const toggleAcceptAport = useCallback(() => {
    setAcceptAport(!acceptAport)
  }, [acceptAport, setAcceptAport])

  const handleChangeValues = useCallback(async () => {
    await setAportFlag(true)
    history.push('/')
  }, [])

  useEffect(() => {
    setAportFlag(false)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          <strong>Confirmação de Aporte:</strong>
          <p>
            Diferentemente da contribuição básica, a contribuição voluntária tem
            o percentual livremente definido pelo participante e pode ser
            alterada mensalmente, no portal do participante.
          </p>

          <div className="aport">
            <p>Contribuição de aporte voluntário:</p>
            <h2>{userDetails.pctContribuicaoSuplementar}%</h2>
          </div>

          <Button
            color="white"
            onClick={handleChangeValues}
            width="small"
            fontSize="small"
            style={{ fontWeight: 'bold', margin: '15px auto 0' }}
          >
            Desejo alterar o valor
          </Button>

          <Line />

          <div>
            <small>
              Confirmo que desejo contribuir mensalmente com a porcentagem
              informada acima.
            </small>
            <Switch
              onChange={toggleAcceptAport}
              checked={acceptAport}
              checkedIcon={false}
              uncheckedIcon={false}
              height={20}
              width={40}
              handleDiameter={16}
              offColor="#DEE3E1"
              offHandleColor="#fff"
              onHandleColor="#fff"
              onColor="#31D19E"
            />
          </div>
        </Content>

        <Button
          color="orange"
          // onClick={() => history.push('/taxation')}
          onClick={() => history.push('/pep-fatca')}
          width="medium"
          disabled={!acceptAport}
        >
          Prosseguir
          <FiArrowRightCircle size={45} />
        </Button>
        <BtnVoltar type="button" onClick={() => history.goBack()}>
          &lt; Anterior
        </BtnVoltar>
      </Container>
    </>
  )
}

export default AportConfirmation
