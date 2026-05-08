/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import usePersistedState from '../../hooks/usePersistedState'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import ChoiceField from '../../components/ChoiceField'
import Collapse from '../../components/Collapse'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import SectionDivider from '../../components/SectionDivider'
import SegmentedOptionButton from '../../components/SegmentedOptionButton'
import { scrollToTop } from '../../utils/browser'

const CarePlan: React.FC = () => {
  const [flagTubarao, setFlagTubarao] = usePersistedState('flagTubarao', '')
  const [flagAssistencial, setFlagAssistencial] = usePersistedState(
    'flagAssistencial',
    '',
  )
  const history = useHistory()

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout>
      <PageCard>
        <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
          Você está alocado na unidade Tubarão?
        </strong>

        <ChoiceField>
          <div className="my-3 flex w-9/10 flex-row self-center rounded-full bg-[#AEAEAE]/20 shadow-md">
            <SegmentedOptionButton
              type="button"
              className="p-1"
              isActive={flagTubarao === 'S'}
              onClick={() => setFlagTubarao('S')}
            >
              Sim
            </SegmentedOptionButton>
            <SegmentedOptionButton
              type="button"
              className="p-1"
              isActive={flagTubarao === 'N'}
              onClick={() => setFlagTubarao('N')}
            >
              Não
            </SegmentedOptionButton>
          </div>
        </ChoiceField>

        <div className="mt-6 text-center">
          <Collapse in={flagTubarao === 'S'}>
            <SectionDivider className="mb-4 mt-7 w-2/3" />

            <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
              Deseja aderir à Cobertura Suplementar Funssest?
            </strong>
            <p className="m-3 text-center text-sm">
              Ao clicar em &quot;sim&quot;, você autoriza sua inclusão e a
              inclusão de seus dependentes no produto assistencial Cobertura
              Suplementar, conforme detalhado na palestra de adesão.
            </p>

            <ChoiceField>
              <div className="my-3 flex w-9/10 flex-row self-center rounded-full bg-[#AEAEAE]/20 shadow-md">
                <SegmentedOptionButton
                  type="button"
                  className="p-1"
                  isActive={flagAssistencial === 'S'}
                  onClick={() => setFlagAssistencial('S')}
                >
                  Sim
                </SegmentedOptionButton>
                <SegmentedOptionButton
                  type="button"
                  className="p-1"
                  isActive={flagAssistencial === 'N'}
                  onClick={() => setFlagAssistencial('N')}
                >
                  Não
                </SegmentedOptionButton>
              </div>
            </ChoiceField>

            <p className="m-6 text-center text-sm">
              Para saber mais, acesse{' '}
              <a
                className="text-ink-900 no-underline hover:text-brand-400 focus:text-brand-400"
                href="https://www.funssest.com.br/wp-content/uploads/2023/07/Funssest_SUPLEMENTAR_Jan2021-ONLINE.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.funssest.com.br
              </a>
            </p>
          </Collapse>
        </div>
      </PageCard>

      <Button
        color="orange"
        onClick={() => history.push('/resume')}
        width="medium"
        disabled={
          flagTubarao === '' || (flagTubarao === 'S' && flagAssistencial === '')
        }
      >
        Continuar <FiArrowRight size={20} />
      </Button>
      <BackButton type="button" onClick={() => history.goBack()}>
        <FiArrowLeft /> Voltar
      </BackButton>
    </PageLayout>
  )
}

export default CarePlan
