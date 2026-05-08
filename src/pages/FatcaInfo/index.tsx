import React, { useCallback, useEffect, useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiInfo } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import ChoiceField from '../../components/ChoiceField'
import ModalBox from '../../components/Modal'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import SegmentedOptionButton from '../../components/SegmentedOptionButton'
import usePersistedState from '../../hooks/usePersistedState'
import { scrollToTop } from '../../utils/browser'
import { UserDetails } from '../../utils/interfaces'

const FatcaInfo: React.FC = () => {
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [ppe, setPPE] = useState(userDetails.ppe)
  const [usperson, setUsperson] = useState(userDetails.usperson)
  const history = useHistory()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [textoModal, setTextoModal] = useState('')

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const openPepModal = useCallback(() => {
    setTextoModal('pep-info')
    setIsModalOpen(true)
  }, [])

  const handleSubmit = useCallback(() => {
    if (ppe === '' || usperson === '') {
      setTextoModal('Informe se você é PEP ou cidadão reportável.')
      setIsModalOpen(true)
      return
    }

    setUserDetails(current => ({
      ...current,
      ppe,
      usperson,
    }))

    history.push('/investor')
  }, [history, ppe, setUserDetails, usperson])

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout>
      <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        {textoModal === 'pep-info' ? (
          <div className="px-2 text-justify text-sm">
            <p>
              Uma Pessoa Exposta Politicamente (PEP) é alguém que, atualmente ou
              nos últimos 5 anos, ocupou cargos ou funções importantes na
              administração pública, política ou em organizações internacionais.
            </p>
            <br />
            <p>
              Exemplos: presidentes, governadores, prefeitos, deputados,
              senadores, ministros, secretários, membros de tribunais superiores,
              dirigentes de autarquias, fundações, empresas públicas e chefes de
              estado estrangeiros.
            </p>
            <br />
            <p>
              Se você tem vínculo familiar como cônjuge, companheiro(a),
              enteado(a), pai, mãe, filho(a), avó(ô) ou neto(a), ou é
              representante de uma PEP, também deve informar.
            </p>
          </div>
        ) : (
          textoModal
        )}
      </ModalBox>

      <PageCard>
        <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
          PEP (Pessoa Exposta Politicamente)
        </strong>
        <p>
          Você ou algum familiar seu (até 2º grau, incluindo cônjuge,
          companheiro(a) ou representante) ocupa ou já ocupou, nos últimos 5
          anos, cargo público relevante no Brasil ou no exterior?
        </p>
        <ChoiceField variant="segmented">
          <div className="my-3 flex w-4/5 flex-row self-center rounded-full bg-[#AEAEAE]/20 shadow-md">
            <SegmentedOptionButton
              type="button"
              className="p-1"
              isActive={ppe === 'S'}
              onClick={() => setPPE('S')}
            >
              Sim
            </SegmentedOptionButton>
            <SegmentedOptionButton
              type="button"
              className="p-1"
              isActive={ppe === 'N'}
              onClick={() => setPPE('N')}
            >
              Não
            </SegmentedOptionButton>
          </div>
        </ChoiceField>
        <div className="my-3 flex flex-row items-start gap-4 rounded-lg bg-brand-100 p-5 text-sm">
          <FiInfo size={20} className="text-brand-500" />
          <p className="w-fit">
            Conforme a Instrução Previc nº 34, de 28/10/2020, art. 15, PEP é
            uma pessoa que, nos últimos 5 anos, tenha desempenhado cargo,
            emprego ou função pública de destaque no Brasil ou no exterior.
            <br />
            <button
              type="button"
              className="mt-2 text-brand-400 underline transition-colors hover:text-brand-500"
              onClick={openPepModal}
            >
              Dúvidas sobre PEP? Clique aqui para saber mais.
            </button>
          </p>
        </div>
      </PageCard>

      <PageCard>
        <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
          FATCA (Foreign Account Tax Compliance Act)
        </strong>
        <p>
          Você é cidadão dos Estados Unidos, residente fiscal dos EUA ou se
          enquadra em outra categoria semelhante que tenha obrigações fiscais
          nos EUA?
        </p>

        <ChoiceField>
          <div className="my-3 flex w-4/5 flex-row self-center rounded-full bg-[#AEAEAE]/20 shadow-md">
            <SegmentedOptionButton
              type="button"
              className="p-1"
              isActive={usperson === 'S'}
              onClick={() => setUsperson('S')}
            >
              Sim
            </SegmentedOptionButton>
            <SegmentedOptionButton
              type="button"
              className="p-1"
              isActive={usperson === 'N'}
              onClick={() => setUsperson('N')}
            >
              Não
            </SegmentedOptionButton>
          </div>
        </ChoiceField>
        <div className="my-3 flex flex-row items-start gap-4 rounded-lg bg-brand-100 p-5 text-sm">
          <FiInfo size={20} className="text-brand-500" />
          <p className="w-fit">
            A FATCA é uma lei dos EUA que visa combater a evasão fiscal de
            cidadãos e residentes fiscais dos Estados Unidos, exigindo que
            instituições financeiras estrangeiras informem sobre contas de
            pessoas com obrigações fiscais naquele país.
          </p>
        </div>
      </PageCard>

      <Button
        type="button"
        fontSize="normal"
        color="orange"
        onClick={handleSubmit}
        disabled={!ppe || !usperson}
      >
        Continuar <FiArrowRight size={20} />
      </Button>
      <BackButton type="button" onClick={() => history.goBack()}>
        <FiArrowLeft /> Voltar
      </BackButton>
    </PageLayout>
  )
}

export default FatcaInfo
