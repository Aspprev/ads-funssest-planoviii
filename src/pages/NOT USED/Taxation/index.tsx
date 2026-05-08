import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import usePersistedState from '../../../hooks/usePersistedState'
import BackButton from '../../../components/BackButton'
import Button from '../../../components/Button'
import PageCard from '../../../components/PageCard'
import PageLayout from '../../../components/PageLayout'
import SectionDivider from '../../../components/SectionDivider'
import { UserDetails } from '../../../utils/interfaces'

const Taxation: React.FC = () => {
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const history = useHistory()
  const [selected, setSelected] = useState(userDetails.tributacao)
  const [descricTrib, setDescricTrib] = useState('')

  const handleGoalItem = useCallback((valor: string) => {
    if (valor === 'P') {
      setSelected(valor)
      setDescricTrib(
        `Nessa tabela, a tributação é feita de acordo com a renda acumulada pelo participante, ou seja, a progressão da alíquota é em relação às rendas, independentemente do prazo de acumulação e resgate.`,
      )
    } else if (valor === 'R') {
      setSelected(valor)
      setDescricTrib(
        `Imposto de renda na fonte com alíquotas regressivas determinadas em função do prazo de acumulação de recursos, conforme legislação vigente. Quanto maior for o prazo, menor será a tributação até o limite mínimo de 10%.`,
      )
    }
  }, [])

  useEffect(() => handleGoalItem(selected), [handleGoalItem, selected])

  const handleContinue = useCallback(() => {
    setUserDetails(current => ({
      ...current,
      tributacao: selected,
    }))

    history.push('/pep-fatca')
  }, [history, selected, setUserDetails])

  return (
    <PageLayout>
      <PageCard className="flex flex-col items-center text-center">
        <strong className="mb-4 flex justify-center text-lg text-brand-400">
          Regime de tributação:
        </strong>
        <p className="mb-4">
          Você deve definir qual regime de tributação será aplicado no momento
          em que receber o benefício ou resgatar o dinheiro aplicado.
        </p>
        <div className="my-5 flex w-full items-center justify-evenly">
          <button
            type="button"
            className={`h-15 w-35 rounded-sm border bg-transparent ${
              selected === 'P'
                ? 'border-brand-400/60 font-bold'
                : 'border-[#AEAEAE]/60 font-normal'
            }`}
            onClick={() => handleGoalItem('P')}
          >
            <span>Progressivo</span>
          </button>
          <button
            type="button"
            className={`h-15 w-35 rounded-sm border bg-transparent ${
              selected === 'R'
                ? 'border-brand-400/60 font-bold'
                : 'border-[#AEAEAE]/60 font-normal'
            }`}
            onClick={() => handleGoalItem('R')}
          >
            <span>Regressivo</span>
          </button>
        </div>

        <SectionDivider className="mb-5 mt-4 w-4/5" />
        <footer className="text-[11px]">
          <p>{descricTrib}</p>
        </footer>
      </PageCard>
      <Button
        type="button"
        color="orange"
        onClick={handleContinue}
        disabled={!selected}
      >
        Continuar
      </Button>
      <BackButton type="button" onClick={() => history.goBack()}>
        <FiArrowLeft /> Anterior
      </BackButton>
    </PageLayout>
  )
}

export default Taxation
