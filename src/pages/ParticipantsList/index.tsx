/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useRef, useCallback, useState, useEffect } from 'react'
import { FormHandles, Scope } from '@unform/core'
import { useHistory } from 'react-router-dom'
import { Form } from '@unform/web'
import _cloneDeep from 'lodash/cloneDeep'

import { FiCheck, FiX } from 'react-icons/fi'
import usePersistedState from '../../hooks/usePersistedState'
import calculaIdade from '../../utils/calculaIdade'

import Header from '../../components/Header'
import Button from '../../components/Button'

import { Container, Content, ContentBenef, BenefBox, Line } from './styles'
import { UserData, Participant } from '../../utils/interfaces'

interface CopyDependent {
  data: {
    name: string
    cpf: string
    birthdate: string
  }
  details: {
    tipVinculo: string
    tipoBen: string
    grauParentesco: string
    dcrGrauParentesco: string
    proporcao: number
    mrcInvalidez: string
  }
}

const ParticipantsList: React.FC = () => {
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)

  const [participants, setParticipants] = usePersistedState<Participant[]>(
    'participantsGroup',
    [],
  )

  const [partLength] = useState(participants.length)

  const arrBnfInd = participants.filter(p => p.details.tipoBen === '1')
  const soma = arrBnfInd.reduce((t, p) => t + p.details.proporcao, 0)

  const [totalProporcao, setTotalProporcao] = useState(soma)

  const dependentsListCopy: CopyDependent[] = _cloneDeep(participants)

  const [partIndLength] = useState(arrBnfInd.length)

  const formRef = useRef<FormHandles>(null)
  const history = useHistory()

  const handleAddNovo = useCallback(() => {
    history.push('/new-participant')
  }, [history])

  const handleRemove = useCallback(
    id => {
      setParticipants(() =>
        participants.filter((participant, idx) => idx !== id),
      )
    },
    [participants, setParticipants],
  )

  const handleSubmit = useCallback(() => {
    userData.patrocinadora === '2' || userData.patrocinadora === '3'
      ? history.push('/care-plan')
      : history.push('/resume')
  }, [history, userData])

  const teste = useCallback(
    async arrAux => {
      await setParticipants([...arrAux])
      setTotalProporcao(100)
    },
    [setParticipants],
  )

  const handleClickSubmit = useCallback(() => formRef.current?.submitForm(), [])

  const handleProporcionalizar = useCallback(async () => {
    const value = (100 / partIndLength).toFixed(2)

    const contador = partLength

    for (let i = 0; i < contador; i += 1) {
      if (dependentsListCopy[i].details.tipoBen === '1') {
        dependentsListCopy[i].details.proporcao = parseFloat(value)
      }
    }
    teste(dependentsListCopy)
  }, [partIndLength, partLength, teste, dependentsListCopy])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <BenefBox>
              {participants.length > 0 ? (
                <h3>Confira seus beneficiários</h3>
              ) : (
                <h3>Nenhum beneficiário informado.</h3>
              )}

              {participants.map((participant, idx) => (
                <ContentBenef key={Math.random()}>
                  <Scope path={`parts[${idx}]`}>
                    <div>
                      <FiX onClick={() => handleRemove(idx)} />
                      <div>
                        <small>
                          {`${idx + 1} - Beneficiário ${
                            participant.details.tipoBen === '1'
                              ? 'Indicado'
                              : ''
                          }`}
                        </small>
                      </div>
                      <div>
                        <strong>Nome: </strong>
                        <label>{participant.data.name}</label>
                      </div>
                      <div>
                        <strong>Idade: </strong>
                        <label>
                          {calculaIdade(participant.data.birthdate)} anos
                        </label>
                      </div>
                      <div>
                        <strong>CPF: </strong>
                        <label>{participant.data.cpf}</label>
                      </div>
                      <div>
                        <strong>Vínculo: </strong>
                        <label>{participant.details.dcrGrauParentesco}</label>
                      </div>
                      {participant.details.tipoBen === '2' ? (
                        <div>
                          <strong>Pessoa inválida?: </strong>
                          <label>
                            {participant.details.mrcInvalidez === 'S'
                              ? 'Sim'
                              : 'Não'}
                          </label>
                        </div>
                      ) : (
                        <div>
                          <strong>Proporção: </strong>
                          <label>{`${participant.details.proporcao} %`}</label>
                        </div>
                      )}
                    </div>
                  </Scope>
                  <Line />
                </ContentBenef>
              ))}
            </BenefBox>
          </Form>
        </Content>

        {totalProporcao < 100 && partIndLength > 0 ? (
          <BenefBox>
            <p>
              Você ainda não distribuiu <b>100% da proporção</b> entre seus{' '}
              <b>beneficiários indicados</b>. Adicione mais beneficiários ou{' '}
              <span onClick={() => handleProporcionalizar()}>clique aqui</span>{' '}
              para distribuir igualmente entre todos os informados.
            </p>
          </BenefBox>
        ) : (
          <Button
            type="button"
            fontSize="normal"
            color="orange"
            width="large"
            onClick={handleClickSubmit}
          >
            {partLength === 0 ? (
              <span>Não possuo beneficiários</span>
            ) : (
              <>
                <FiCheck size={45} />
                <span>Pronto! Avançar</span>
              </>
            )}
          </Button>
        )}

        <Button
          type="button"
          fontSize="normal"
          onClick={handleAddNovo}
          color="green"
        >
          {participants.length > 0
            ? 'Adicionar mais um beneficiário'
            : 'Adicionar um beneficiário'}
        </Button>
      </Container>
    </>
  )
}

export default ParticipantsList
