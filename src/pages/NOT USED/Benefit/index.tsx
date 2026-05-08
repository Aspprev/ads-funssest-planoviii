/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useEffect, useCallback, useMemo } from 'react'

import { FiCheck } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import ColoredBox from '../../../components/ColoredBox'

import {
  Container,
  Content,
  GraphWrapper,
  ReceiveTypes,
  BoxButtons,
  ColoredBoxInfo,
  ReceiveBox,
  ButtonSelectBox,
  ButtonSimulationCalc,
  BtnVoltar,
  LogoContent,
} from './styles'
import usePersistedState from '../../../hooks/usePersistedState'
import Logo from '../../../components/Logo'
import {formatValue} from '../../../utils/formatValues'
// import LineGraph from '../../components/LineGraph'
import Button from '../../../components/Button'

import simulationPercentageInfo from '../../assets/simulation-percentage-info.svg'
import simulationYearsInfo from '../../assets/simulation-years-info.svg'
import simulationWithdrawInfo from '../../assets/welcome-wallet.svg'
import simulationSelectPercentIcon from '../../assets/simulation-select-percent-icon.svg'
import simulationSelectTimeIcon from '../../assets/simulation-select-time-icon.svg'
import simulationSelectWithdrawIcon from '../../assets/withdraw.png'
import { UserData, UserDetails } from '../../../utils/interfaces'
/*
interface UserData {
  name: string
  phone: string
}

interface UserDetails {
  salario: number
  contribuicaoBasica: number
  contribuicaoPatrocinadora: number
  pctContribuicaoBasica: number
  contribuicaoSuplementar: number
  pctContribuicaoSuplementar: number
  years: number

  tributacao: string
} */

interface Values {
  year: number
  invested: number
  finalBalance: number
  rentability: number
}

const Benefit: React.FC = () => {
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [userDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const history = useHistory()

  const [displayPercent, setDisplayPercent] = useState(false)
  const [displayTime, setDisplayTime] = useState(false)
  const [selectedReceive, setSelectedReceive] = usePersistedState<
    'PD' | 'PS' | null
  >('receiveTypeSelected', 'PD')

  const [values, setValues] = useState<Values[]>([])
  const [totalInvested, setTotalInvested] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)
  const [launched, setLaunched] = useState(false)
  /* const [totalRentability, setTotalRentability] = usePersistedState(
    'totalRentability',
    0,
  )

  useEffect(() => setTotalRentability((totalBalance * 100) / totalInvested), [
    totalInvested,
    totalBalance,
    setTotalRentability,
  ]) */

  const [timeValueYears, setTimeValueYears] = usePersistedState<number>(
    'TimeValueYears',
    5,
  )
  const [percentualValuePercent, setPercentualValuePercent] = usePersistedState<
    number
  >('PercentualValuePercent', 0.1)

  const [percentualValueSaque, setPercentualValueSaque] = usePersistedState<
    number
  >('PercentualValueSaque', 0)

  const saqueValue = useMemo(
    () => formatValue(totalBalance * (percentualValueSaque / 100)),
    [percentualValueSaque, totalBalance],
  )
  const percentualValue = useMemo(
    () =>
      formatValue(
        (totalBalance - totalBalance * (percentualValueSaque / 100)) *
          (percentualValuePercent / 100),
      ),
    [percentualValuePercent, percentualValueSaque, totalBalance],
  )
  const timeValue = useMemo(
    () =>
      formatValue(
        (totalBalance - totalBalance * (percentualValueSaque / 100)) /
          (timeValueYears * 12),
      ),
    [percentualValueSaque, timeValueYears, totalBalance],
  )

  const createValues = useCallback(() => {
    // const { contribution, years } = userDetails

    const contribution =
      userDetails.contribuicaoBasica + userDetails.contribuicaoSuplementar
    // const contribution = 200.0
    const { years } = userDetails

    const actualYear = new Date().getFullYear()
    const lastYear = actualYear + parseInt(years.toString(), 10)

    const valuesCalculated: Values[] = []

    const investedByYear = 12 * contribution

    let totalInvestedTemp = totalInvested

    let temporaryFinalBalance = 0

    for (let i = actualYear; i < lastYear; i += 1) {
      const yearInvested = investedByYear
      const rentability = 4 // -10 + 28 * Math.random()

      totalInvestedTemp += yearInvested

      const finalBalance =
        ((temporaryFinalBalance + yearInvested) * (rentability + 100)) / 100

      temporaryFinalBalance = finalBalance

      const val: Values = {
        year: i,
        invested: totalInvestedTemp,
        rentability,
        finalBalance,
      }

      valuesCalculated.push(val)
    }

    setTotalInvested(contribution * parseInt(years.toString(), 10) * 12)
    setTotalBalance(temporaryFinalBalance)

    setValues(valuesCalculated)
    setLaunched(true)
  }, [totalInvested, userDetails])

  useEffect(() => {
    if (!launched) createValues()
  }, [createValues, launched])

  const toggleSelectedReceive = useCallback(
    (selectedReceiveNow: 'PD' | 'PS' | null) => {
      setSelectedReceive(selectedReceiveNow)
      if (selectedReceiveNow === 'PD') {
        setDisplayTime(true)
        setDisplayPercent(false)
      } else if (selectedReceiveNow === 'PS') {
        setDisplayTime(false)
        setDisplayPercent(true)
      } else {
        setDisplayPercent(false)
        setDisplayTime(false)
      }
    },
    [setSelectedReceive],
  )

  function adicPerct() {
    if (percentualValuePercent >= 1.5) {
      setPercentualValuePercent(1.5)
    } else {
      setPercentualValuePercent(percentualValuePercent + 0.05)
    }
  }

  function tiraPerct() {
    if (percentualValuePercent <= 0.1) {
      setPercentualValuePercent(0.1)
    } else {
      setPercentualValuePercent(percentualValuePercent - 0.05)
    }
  }
  function adicPerctSaque() {
    if (percentualValueSaque >= 25) {
      setPercentualValueSaque(25)
    } else {
      setPercentualValueSaque(percentualValueSaque + 1)
    }
  }

  function tiraPerctSaque() {
    if (percentualValueSaque <= 0) {
      setPercentualValueSaque(0)
    } else {
      setPercentualValueSaque(percentualValueSaque - 1)
    }
  }

  function adicAno() {
    if (timeValueYears >= 30) {
      setTimeValueYears(30)
    } else {
      setTimeValueYears(timeValueYears + 5)
    }
  }

  function tiraAno() {
    if (timeValueYears <= 5) {
      setTimeValueYears(5)
    } else {
      setTimeValueYears(timeValueYears - 5)
    }
  }

  useEffect(() => {
    toggleSelectedReceive(selectedReceive)
  }, [selectedReceive, toggleSelectedReceive])

  const handleChangeValues = useCallback(() => {
    history.push('/contribuition')
  }, [history])

  const handleConfirmValues = useCallback(() => {
    // history.push('/taxation')
    history.push('/pep-fatca')
  }, [history])

  return (
    <>
      <Container>
        <LogoContent>
          <div>
            <Logo />
          </div>
        </LogoContent>
        <Content>
          <ReceiveTypes>
            <ReceiveBox>
              <ButtonSelectBox
                type="button"
                // onClick={() => toggleSelectedReceive('PS')}
                // selected={selectedReceive === 'PS'}
                selected
              >
                <img
                  src={simulationSelectWithdrawIcon}
                  width="34.309"
                  height="34.309"
                  alt="Saque"
                />
                <span>Saque à vista</span>
              </ButtonSelectBox>
              <BoxButtons displayed>
                <ButtonSimulationCalc
                  type="button"
                  onClick={() => tiraPerctSaque()}
                >
                  -
                </ButtonSimulationCalc>
                <ButtonSimulationCalc type="button">
                  {percentualValueSaque}
                </ButtonSimulationCalc>
                <ButtonSimulationCalc
                  type="button"
                  onClick={() => adicPerctSaque()}
                >
                  +
                </ButtonSimulationCalc>
              </BoxButtons>

              <ColoredBoxInfo
                size="large"
                color="white"
                gradientDirection="right"
                displayed={percentualValueSaque > 0}
              >
                <div>
                  <p>{saqueValue}*</p>
                  <small>Você receberá à vista</small>
                </div>
                <small>
                  *Valor simulado referente a {percentualValueSaque.toFixed(2)}%
                  do seu saldo projetado, para saque à vista no momento da
                  aposentadoria.
                </small>
                <img src={simulationWithdrawInfo} alt="Percentual" />
              </ColoredBoxInfo>
            </ReceiveBox>
          </ReceiveTypes>
          <ReceiveTypes>
            <p>Desejo receber o valor mensalmente via:</p>
            <ReceiveBox>
              <ButtonSelectBox
                type="button"
                onClick={() => toggleSelectedReceive('PS')}
                selected={selectedReceive === 'PS'}
              >
                <img src={simulationSelectPercentIcon} alt="Percentual" />
                <span>Percentual sobre o saldo</span>
              </ButtonSelectBox>
              <BoxButtons displayed={displayPercent}>
                <ButtonSimulationCalc type="button" onClick={() => tiraPerct()}>
                  -
                </ButtonSimulationCalc>
                <ButtonSimulationCalc type="button">
                  {parseFloat(percentualValuePercent.toFixed(2))}
                </ButtonSimulationCalc>
                <ButtonSimulationCalc type="button" onClick={() => adicPerct()}>
                  +
                </ButtonSimulationCalc>
              </BoxButtons>

              <ColoredBoxInfo
                size="large"
                color="blue"
                gradientDirection="right"
                displayed={displayPercent}
              >
                <div>
                  <p>{percentualValue}*</p>
                  <small>Você receberá por mês</small>
                </div>
                <small>
                  *Valor simulado referente a{' '}
                  {percentualValuePercent.toFixed(2)}% do seu saldo projetado,
                  com pagamentos mensais efetuados com base no percentual que
                  escolher no momento da aposentadoria.{' '}
                </small>
                <img src={simulationPercentageInfo} alt="Percentual" />
              </ColoredBoxInfo>
            </ReceiveBox>

            <ReceiveBox>
              <ButtonSelectBox
                type="button"
                onClick={() => toggleSelectedReceive('PD')}
                selected={selectedReceive === 'PD'}
              >
                <img src={simulationSelectTimeIcon} alt="Tempo" />
                <span>Prazo determinado</span>
              </ButtonSelectBox>

              <BoxButtons displayed={displayTime}>
                <ButtonSimulationCalc type="button" onClick={() => tiraAno()}>
                  -
                </ButtonSimulationCalc>
                <ButtonSimulationCalc type="button">
                  {timeValueYears}
                </ButtonSimulationCalc>
                <ButtonSimulationCalc type="button" onClick={() => adicAno()}>
                  +
                </ButtonSimulationCalc>
              </BoxButtons>
              <ColoredBoxInfo
                size="large"
                color="green"
                gradientDirection="right"
                displayed={displayTime}
              >
                <div>
                  <p>{timeValue}*</p>
                  <small>Você receberá por mês</small>
                </div>
                <small>
                  *Valor simulado referente a modalidade de prazo determinado
                  com duração de {timeValueYears} anos calculado com base no seu
                  saldo projetado.{' '}
                </small>
                <img src={simulationYearsInfo} alt="Tempo" />
              </ColoredBoxInfo>
            </ReceiveBox>
            <small>
              Selecione uma das opções acima para simular o valor que você
              receberá mensalmente ao se aposentar
            </small>
            <br />
          </ReceiveTypes>

          <Button
            type="button"
            fontSize="normal"
            color="blue"
            width="large"
            onClick={handleConfirmValues}
          >
            <FiCheck size={40} />
            Pronto! É isso que eu quero
          </Button>

          <Button type="button" fontSize="small" onClick={handleChangeValues}>
            Ops! Quero alterar os valores e simular novamente
          </Button>
        </Content>
      </Container>
    </>
  )
}

export default Benefit
