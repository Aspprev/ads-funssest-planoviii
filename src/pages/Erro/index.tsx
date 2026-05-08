import React from 'react'

import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import usePersistedState from '../../hooks/usePersistedState'

interface ErroProps {
  title: string
  description?: string
}

const Erro: React.FC = () => {
  const [erroProps] = usePersistedState<ErroProps>('erroProps', {} as ErroProps)
  const history = useHistory()
  const title = erroProps.title || 'Não foi possível concluir a solicitação'
  const description =
    erroProps.description ||
    'Tente novamente em instantes. Se o problema persistir, volte ao início e refaça o fluxo.'

  return (
    <PageLayout containerClassName="mt-[-25px] h-full max-w-[420px] px-0 pt-[25px] md:max-w-[500px]">
      <PageCard className="flex flex-col items-center px-0 py-4">
        <FiAlertTriangle color="#FF612E" size={100} />
        <h2 className="my-5 text-start text-brand-400 font-bold">{title}</h2>
        <strong className="mb-3 text-start">{description}</strong>
      </PageCard>
      <BackButton className="" type="button" onClick={() => history.goBack()}>
        <FiArrowLeft /> Voltar
      </BackButton>
    </PageLayout>
  )
}
export default Erro
