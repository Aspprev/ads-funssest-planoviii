/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiArrowRight, FiX } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import SectionDivider from '../../components/SectionDivider'
import usePersistedState from '../../hooks/usePersistedState'
import { scrollToTop } from '../../utils/browser'
import calculaIdade from '../../utils/calculaIdade'
import { Participant, UserData } from '../../utils/interfaces'

const ParticipantsList: React.FC = () => {
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [participants, setParticipants] = usePersistedState<Participant[]>(
    'participantsGroup',
    [],
  )
  const history = useHistory()
  const [totalProporcao, setTotalProporcao] = useState(
    participants
      .filter(participant => participant.details.tipoBen === '1')
      .reduce((total, participant) => total + participant.details.proporcao, 0),
  )

  const arrBnfInd = useMemo(
    () => participants.filter(participant => participant.details.tipoBen === '1'),
    [participants],
  )
  const partLength = participants.length
  const partIndLength = arrBnfInd.length
  const handleAddNovo = useCallback(() => {
    history.push('/new-participant')
  }, [history])

  const handleRemove = useCallback(
    (id: number) => {
      setParticipants(current =>
        current.filter((participant, idx) => idx !== id),
      )
    },
    [setParticipants],
  )

  const handleSubmit = useCallback(() => {
    if (userData.patrocinadora === '2' || userData.patrocinadora === '3') {
      history.push('/care-plan')
      return
    }

    history.push('/resume')
  }, [history, userData.patrocinadora])

  const handleProporcionalizar = useCallback(async () => {
    const value = (100 / partIndLength).toFixed(2)

    setParticipants(current =>
      current.map(participant =>
        participant.details.tipoBen === '1'
          ? {
              ...participant,
              details: {
                ...participant.details,
                proporcao: parseFloat(value),
              },
            }
          : participant,
      ),
    )
    setTotalProporcao(100)
  }, [partIndLength, setParticipants])

  useEffect(() => {
    scrollToTop()
  }, [])

  useEffect(() => {
    setTotalProporcao(
      participants
        .filter(participant => participant.details.tipoBen === '1')
        .reduce((total, participant) => total + participant.details.proporcao, 0),
    )
  }, [participants])

  return (
    <PageLayout containerClassName="max-md:max-w-[500px]">
      <div className="w-full">
        <PageCard className="relative my-3 pb-3 pt-4 max-md:pt-5">
          {participants.length > 0 ? (
            <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
              Confira seus beneficiários
            </strong>
          ) : (
            <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
              Nenhum beneficiário informado.
            </strong>
          )}

          {participants.map((participant, idx) => (
            <div className="w-full" key={`${participant.data.cpf}-${idx}`}>
              <div className="relative my-2">
                <FiX
                  className="absolute right-1.25 top-0 size-5 cursor-pointer text-danger"
                  onClick={() => handleRemove(idx)}
                />
                <div className="my-2">
                  <small>
                    {`${idx + 1} - Beneficiário ${
                      participant.details.tipoBen === '1' ? 'indicado' : ''
                    }`}
                  </small>
                </div>
                <div className="my-2">
                  <strong>Nome: </strong>
                  <label>{participant.data.name}</label>
                </div>
                <div className="my-2">
                  <strong>Idade: </strong>
                  <label>{calculaIdade(participant.data.birthdate)} anos</label>
                </div>
                <div className="my-2">
                  <strong>CPF: </strong>
                  <label>{participant.data.cpf}</label>
                </div>
                <div className="my-2">
                  <strong>Vínculo: </strong>
                  <label>{participant.details.dcrGrauParentesco}</label>
                </div>
                {participant.details.tipoBen === '2' ? (
                  <div className="my-2">
                    <strong>Pessoa inválida? </strong>
                    <label>
                      {participant.details.mrcInvalidez === 'S' ? 'Sim' : 'Não'}
                    </label>
                  </div>
                ) : (
                  <div className="my-2">
                    <strong>Proporção: </strong>
                    <label>{`${participant.details.proporcao} %`}</label>
                  </div>
                )}
              </div>
              <SectionDivider className="mb-5 mt-6 w-2/3" />
            </div>
          ))}
        </PageCard>
      </div>

      {totalProporcao < 100 && partIndLength > 0 ? (
        <PageCard className="relative my-2 pb-2 pt-3 max-md:pt-4">
          <p className="text-center text-sm">
            Você ainda não distribuiu <b>100% da proporção</b> entre seus{' '}
            <b>beneficiários indicados</b>. Adicione mais beneficiários ou{' '}
            <span
              className="cursor-pointer text-sm text-brand-400 underline"
              onClick={handleProporcionalizar}
            >
              clique aqui
            </span>{' '}
            para distribuir igualmente entre todos os informados.
          </p>
        </PageCard>
      ) : (
        <Button
          type="button"
          fontSize="normal"
          color="orange"
          width="large"
          onClick={handleSubmit}
        >
          {partLength === 0 ? (
            <span>Não possuo beneficiários</span>
          ) : (
            <>
              <span>Pronto! Avançar</span>
              <FiArrowRight size={20} />
            </>
          )}
        </Button>
      )}

      <Button
        type="button"
        fontSize="normal"
        onClick={handleAddNovo}
        width="large"
        color="green"
      >
        {participants.length > 0
          ? 'Adicionar mais um beneficiário'
          : 'Adicionar um beneficiário'}
      </Button>
    </PageLayout>
  )
}

export default ParticipantsList
