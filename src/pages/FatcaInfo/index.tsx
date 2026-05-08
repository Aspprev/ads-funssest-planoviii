import React, { useState, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { FiCheck } from 'react-icons/fi'
import usePersistedState from '../../hooks/usePersistedState'

import Button from '../../components/Button'
import Header from '../../components/Header'

import { UserDetails } from '../../utils/interfaces'
import {
  Container,
  Content,
  RadioButton,
  BtnVoltar,
  BtnContato,
} from './styles'
import ModalBox from '../../components/Modal'

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

  function handleCloseModal(): void {
    setIsModalOpen(false)
  }

  const handleSubmit = useCallback(async () => {
    if (ppe === '' || usperson === '') {
      setIsModalOpen(true)
      setTextoModal('Informe se vc é PPE ou Cidadão Reportável')
    }
    await setUserDetails({
      ...userDetails,
      ppe,
      usperson,
    })

    history.push('/investor')
  }, [history, usperson, ppe, setUserDetails, userDetails])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        {textoModal}
      </ModalBox>
      <Container>
        <Content>
          <strong>Pessoa Exposta Politicamente (PEP)?</strong>
          <span>
            São pessoas expostas politicamente (PEP) aqueles eu atualmente ou
            nos últimos 5 anos:
          </span>

          <div>
            <ul>
              <li>
                Detentores de mandatos eletivos dos Poderes Executivo e
                Legislativo da União;
              </li>
              <li>
                Ocupantes de cargo no Poder Executivo da União como ministro de
                Estado ou equiparado, de natureza especial ou equivalente;
              </li>
              <li>
                Presidente, vice-presidente e diretor, ou equivalentes de
                entidades da administração pública indireta;
              </li>
              <li>
                Exercentes de função pública federal com Direção e
                Assessoramento Superiores (DAS), nível 6, ou equivalente;
              </li>
              <li>
                Membros do CNJ, STF, STJ e outros tribunais superiores, TRF,
                TRT, TRE, CSJT e CJF;
              </li>
              <li>Membros do Conselho Nacional do MP;</li>
              <li>Procurador-Geral ou Vice-Procurador-Geral da República;</li>
              <li>Procurador-Geral do Trabalho e/ou da Justiça Militar;</li>
              <li>Subprocuradores-Gerais da República</li>
              <li>
                Procuradores-Gerais de Justiça dos Estados e do Distrito
                Federal;
              </li>
              <li>
                Membros do TCU, Procurador-Geral e/ou Subprocuradores-Gerais do
                MP junto ao TCU;
              </li>
              <li>
                Presidentes e os tesoureiros nacionais ou equivalentes, de
                partidos políticos;
              </li>
              <li>
                Governadores e os secretários de Estados e do Distrito Federal;
              </li>
              <li>Deputados estaduais e distritais;</li>
              <li>
                Presidentes ou equivalentes de entidades da administração
                pública indireta estadual e distrital;
              </li>
              <li>
                Presidentes de Tribunais de Justiça, Tribunais Militares,
                Tribunais de Contas ou equivalentes dos Estados e do Distrito
                Federal;
              </li>
              <li>Prefeitos, os vereadores, os secretários municipais;</li>
              <li>
                Presidentes ou equivalentes de entidades da administração
                pública indireta municipal;
              </li>
              <li>
                Presidentes de Tribunais de Contas ou equivalentes dos
                municípios;
              </li>
              <li>
                Pessoas que, no exterior, sejam chefes de estado ou de governo,
                políticos de escalões superiores, ocupantes de cargos
                governamentais de escalões superiores, oficiais-generais e
                membros de escalões superiores do Poder Judiciário, executivos
                de escalões superiores de empresas públicas ou dirigentes de
                partidos políticos;
              </li>
              <li>
                Dirigentes de escalões superiores de entidades de direito
                internacional público ou privado.
              </li>
            </ul>
          </div>

          <span>
            Marque se tiver relação próxima, como representantes ou familiar* de
            PEP.
          </span>
          <small>
            *Familiar = cônjuge, companheiro(a), enteado(a), pai, mãe, filho,
            avô/avó, neto(a).
          </small>

          <RadioButton>
            <div>
              <BtnContato
                type="button"
                isActive={ppe === 'S'}
                onClick={() => setPPE('S')}
              >
                Sim
              </BtnContato>
              <BtnContato
                type="button"
                isActive={ppe === 'N'}
                onClick={() => setPPE('N')}
              >
                Não
              </BtnContato>
            </div>
          </RadioButton>
        </Content>

        <Content>
          <span>É residente no exterior para fins fiscais?</span>

          <RadioButton>
            <div>
              <BtnContato
                type="button"
                isActive={usperson === 'S'}
                onClick={() => setUsperson('S')}
              >
                Sim
              </BtnContato>
              <BtnContato
                type="button"
                isActive={usperson === 'N'}
                onClick={() => setUsperson('N')}
              >
                Não
              </BtnContato>
            </div>
          </RadioButton>
        </Content>

        <Button
          type="button"
          fontSize="normal"
          color="orange"
          onClick={handleSubmit}
          disabled={!ppe || !usperson}
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

export default FatcaInfo
