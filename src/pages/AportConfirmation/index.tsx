/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import Switch from 'react-switch'
import usePersistedState from '../../hooks/usePersistedState'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import SectionDivider from '../../components/SectionDivider'
import { scrollToTop } from '../../utils/browser'
import { UserDetails } from '../../utils/interfaces'

const AportConfirmation: React.FC = () => {
  const [userDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [, setAportFlag] = usePersistedState('aportFlag', false)
  const [acceptAport, setAcceptAport] = usePersistedState('aportAccept', false)
  const history = useHistory()

  const toggleAcceptAport = useCallback(() => {
    setAcceptAport(current => !current)
  }, [setAcceptAport])

  const handleChangeValues = useCallback(() => {
    setAportFlag(true)
    history.push('/contribution')
  }, [history, setAportFlag])

  useEffect(() => {
    setAportFlag(false)
  }, [setAportFlag])

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout>
      <PageCard>
        <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
          Confirmação de contribuição adicional
        </strong>
        <p className="text-center">
          Diferentemente da contribuição básica, a contribuição adicional tem o
          percentual livremente definido pelo participante e pode ser alterada
          mensalmente no portal do participante.
        </p>

        <div className="aport mt-6 flex items-center justify-evenly text-right">
          <p>Contribuição adicional:</p>
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

        <SectionDivider className="mb-4 mt-7 w-2/3" />

        <div className="mt-6 flex items-center justify-end text-right">
          <small className="mr-3 font-bold">
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
      </PageCard>

      <Button
        color="orange"
        onClick={() => history.push('/pep-fatca')}
        width="medium"
        disabled={!acceptAport}
      >
        Prosseguir
        <FiArrowRight size={24} />
      </Button>
      <BackButton type="button" onClick={() => history.goBack()}>
        <FiArrowLeft /> Voltar
      </BackButton>
    </PageLayout>
  )
}

export default AportConfirmation
