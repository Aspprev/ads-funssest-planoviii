import React, { useState, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import usePersistedState from '../../hooks/usePersistedState'

import Button from '../../components/Button'
import Header from '../../components/Header'

import { UserDetails } from '../../utils/interfaces'
import { Container, Content, TaxationBox, GoalItem, Line, BtnVoltar } from './styles'

const Taxation: React.FC = () => {
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )

  const history = useHistory()

  const today = new Date()
  const dataAdesao = new Date(
    today.getFullYear(),
    today.getMonth() + 2,
    0,
  ).toLocaleDateString()

  const [selected, setSelected] = useState(userDetails.tributacao)
  const [descricTrib, setDescricTrib] = useState('')
  // const [descricTrib, setDescricTrib] = useState(
  //   `Conforme legislação (Lei nº 11.053/2004) a opção selecionada poderá ser
  //   alterada até o dia ${dataAdesao}. Caso queira alterar, favor entrar em contato
  //   com o seu empregador.`,
  // )

  const handleGoalItem = useCallback(valor => {
    if (valor === 'P') {
      setSelected(valor)
      setDescricTrib(
        `Nessa tabela, a tributação é feita de acordo com a renda acumulada pelo
          participante, ou seja, a progressão da porcentagem da alíquota é em relação
          às rendas, independente do prazo de acumulação e resgate.`,
      )
    } else if (valor === 'R') {
      setSelected(valor)
      setDescricTrib(
        `Importo de renda na fonte com alíquotas regressivas determinadas em função
          do prazo de acumulação de recursos, conforme legislação vigente. Esta tabela
          leva em consideração o tempo de permanência de cada contribuição no plano.
          Isto é, quanto maior for o prazo, menor será a tributação até o limite
          mínimo de 10%.`,
      )
    }
  }, [])

  useEffect(() => handleGoalItem(selected), [handleGoalItem, selected])

  const handleContinue = useCallback(async () => {
    await setUserDetails({
      ...userDetails,
      tributacao: selected,
    })

    history.push('/pep-fatca')
  }, [history, selected, setUserDetails, userDetails])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          <strong>Regime de Tributação:</strong>
          <p>
            Você deve definir qual regime de tributação será aplicado no momento
            em que receber o benefício ou resgatar o dinheiro aplicado.
          </p>
          <TaxationBox>
            <GoalItem
              key="1"
              isSelected={selected === 'P'}
              onClick={() => handleGoalItem('P')}
            >
              <span>Progressivo</span>
            </GoalItem>
            <GoalItem
              key="2"
              isSelected={selected === 'R'}
              onClick={() => handleGoalItem('R')}
            >
              <span>Regressivo</span>
            </GoalItem>
          </TaxationBox>

          <Line />
          <footer>
            <p>{descricTrib}</p>
            {/* {selected === 'R'
              ? `Importo de renda na fonte com alíquotas regressivas determinadas em função
          do prazo de acumulação de recursos, conforme legislação vigente. Esta tabela
          leva em consideração o tempo de permanência de cada contribuição no plano.
          Isto é, quanto maior for o prazo, menor será a tributação até o limite
          mínimo de 10%.`
              : `Nessa tabela, a tributação é feita de acordo com a renda acumulada pelo
          participante, ou seja, a progressão da porcentagem da alíquota é em relação
          às rendas, independente do prazo de acumulação e resgate.`} */}
          </footer>
        </Content>
        <Button
          type="button"
          color="orange"
          onClick={handleContinue}
          disabled={!selected}
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

export default Taxation
