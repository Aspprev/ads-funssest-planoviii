/* eslint-disable import/no-duplicates */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FiCheck } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import {
  addMonths,
  addYears,
  differenceInMonths,
  differenceInYears,
  format,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Container,
  Content,
  InfoValuesBox,
  GraphWrapper,
  BtnVoltar,
} from './styles'

import usePersistedState from '../../hooks/usePersistedState'
import { formatValue } from '../../utils/formatValues'
import Button from '../../components/Button'
import { UserData, UserDetails } from '../../utils/interfaces'
import Header from '../../components/Header'
import { Valor } from '../../utils/masks'
import calculaIdade from '../../utils/calculaIdade'

interface CustomTooltipInterface {
  active: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
  label: string
}

interface Values {
  year: number
  anomes: string
  invested: number
  finalBalance: number
  rentability: number
}

const Simulation: React.FC = () => {
  const [userDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [totalBalance, setTotalBalance] = usePersistedState('totalBalance', 0)

  const [timeValueYears, setTimeValueYears] = usePersistedState<number>(
    'TimeValueYears',
    10,
  )
  const [rendaFixa, setRendaFixa] = usePersistedState('RendaFixaValue', 0)
  const [percentualValuePercent, setPercentualValuePercent] = usePersistedState<
    string
  >('PercentualValuePercent', '0.3')

  const [selectedReceive, setSelectedReceive] = usePersistedState<
    'PD' | 'PS' | 'VF' | ''
  >('receiveTypeSelected', '')

  const [flagEdit] = usePersistedState<'S' | 'N'>('flagEdit', 'N')
  const [aportFlag] = usePersistedState('aportFlag', false)
  const [, setDisplayPercent] = useState(selectedReceive === 'PS')
  const [, setDisplayTime] = useState(selectedReceive === 'PD')
  const [, setDisplayValorFixo] = useState(selectedReceive === 'VF')

  const [totalInvested, setTotalInvested] = useState(0)
  const [values, setValues] = useState<Values[]>([])
  const [launched, setLaunched] = useState(false)

  const history = useHistory()

  const [rentAnual] = usePersistedState('rentAnual', 8)
  const [rentMensal] = usePersistedState(
    'rentMensal',
    ((1 + rentAnual / 100) ** (1 / 12) - 1) * 100,
  )
  const [txAdmin] = useState(0.03)

  // const ctbParticipanteBasica =
  //   userDetails.contribuicaoBasica - userDetails.contribuicaoBasica * txAdmin

  // const ctbParticipanteAdic =
  //   userDetails.contribuicaoSuplementar -
  //   userDetails.contribuicaoSuplementar * txAdmin

  // const ctbPatrocinadora =
  //   userDetails.contribuicaoPatrocinadora -
  //   userDetails.contribuicaoPatrocinadora * txAdmin

  const idadeAtual = calculaIdade(userData.birthdate)
  const actualYear = new Date().getFullYear()
  const lastYear = actualYear + userDetails.years

  const [, setTotalInvestedPartic] = useState(0)
  const [, setTotalInvestedPatroc] = useState(0)

  const [UAMB] = usePersistedState('UAMB', 707.58) // 618.88
  const maxUamb = UAMB * 10

  const formRef = useRef<FormHandles>(null)

  // console.log((1 + 3.26) ** (1 / 12 - 1))
  /*
  const createValues = useCallback(() => {
    const valuesCalculated: Values[] = []
    let totalInvestedTemp = totalInvested
    let idade = idadeAtual
    let temporaryFinalBalance = 0

    for (let i = actualYear; i <= lastYear; i += 1) {
      // const rentability = 0.2676901 // 3.26% aa.
      // const rentability = (1 + 5) ** (1 / 12 - 1)
      const rentability = (1 + 8) ** (1 / 12 - 1)

      let finalBalance = 0

      for (let j = 1; j <= 12; j += 1) {
        const monthinvested =
          userDetails.contribuicaoBasica +
          userDetails.contribuicaoSuplementar +
          (idade >= 65 ? 0 : userDetails.contribuicaoPatrocinadora)
        totalInvestedTemp += monthinvested

        const monthinvestedDesc =
          ctbParticipante + (idade >= 65 ? 0 : ctbPatrocinadora)

        finalBalance =
          temporaryFinalBalance * (rentability / 100) +
          (monthinvestedDesc + temporaryFinalBalance)

        temporaryFinalBalance = finalBalance
      }

      const val: Values = {
        year: i,
        invested: totalInvestedTemp,
        rentability,
        finalBalance,
      }
      idade += 1
      valuesCalculated.push(val)
    }
    setTotalInvested(totalInvestedTemp)
    setTotalBalance(temporaryFinalBalance)
    setValues(valuesCalculated)
    setLaunched(true)
  }, [
    actualYear,
    ctbParticipante,
    ctbPatrocinadora,
    idadeAtual,
    lastYear,
    setTotalBalance,
    totalInvested,
    userDetails,
  ])

  */

  const createValues = useCallback(() => {
    const valuesCalculated: Values[] = []
    let totalInvestedTemp = 0
    let temporaryFinalBalance = 0
    let tempMonthInvestedPartic = 0
    let tempTotalInvestedPartic = 0
    let tempMonthInvestedPatroc = 0
    let tempTotalInvestedPatroc = 0
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let vlrRendeu = 0
    let idade = idadeAtual
    const evolSalarial = 3

    let { salario } = userDetails

    let vlrCtbBasica = 0
    if (salario >= maxUamb) {
      const vlrExcedente = salario - maxUamb
      vlrCtbBasica = maxUamb * 0.005 + vlrExcedente * 0.09
    } else {
      vlrCtbBasica = salario * 0.005
    }
    let vlrCtbPatroc = vlrCtbBasica
    let vlrCtbAdicPct = salario * (userDetails.pctContribuicaoSuplementar / 100)

    const dataAposentadoria = addYears(
      parseISO(userData.birthdate),
      userDetails.age,
    )
    const hoje = new Date()
    const dtIniCtb = hoje
    const monthsContrib = differenceInMonths(dataAposentadoria, new Date())
    // const yearsContrib = differenceInYears(dataAposentadoria, new Date())
    const totalContribution = monthsContrib // + yearsContrib
    let finalBalance = 0
    let counter = 1
    // const vlrTxAdmn = (vlrCtbBasica + vlrCtbPatroc + vlrCtbAdicPct) * txAdmin

    /* COMEÇA O LOOP */
    for (counter; counter <= totalContribution + 2; counter += 1) {
      const dataCorrente = addMonths(dtIniCtb, counter)
      const mesCorrente = dataCorrente.getMonth() + 1
      const anoCorrente = dataCorrente.getFullYear()

      if (mesCorrente === parseISO(userData.birthdate).getMonth() + 2) {
        idade += 1
      }

      /* EVOLUÇÃO SALARIAL */
      if (mesCorrente === 1) {
        salario += salario * (evolSalarial / 100)
        if (salario >= maxUamb) {
          const vlrExcedente = salario - maxUamb
          vlrCtbBasica = maxUamb * 0.005 + vlrExcedente * 0.09
        } else {
          vlrCtbBasica = salario * 0.005
        }
        vlrCtbPatroc = vlrCtbBasica
        vlrCtbAdicPct = salario * (userDetails.pctContribuicaoSuplementar / 100)
      }
      //   pctCtbBasica = 0
      //   tipCtbBasica === 'M'
      //     ? (pctCtbBasica = maxPctCtb(salario))
      //     : (pctCtbBasica = userDetails.pctContribuicaoBasica)

      //   vlrCtbBasica = salario * (pctCtbBasica / 100)
      //   vlrCtbPatroc = vlrCtbBasica
      //   vlrCtbAdicPct = salario * (userDetails.pctContribuicaoSuplementar / 100)
      //   vlrCtbAdicFixa = userDetails.contribuicaoSuplementar
      // }

      let monthTotalInvested = 0
      /* Calcula 13º */
      if (mesCorrente === 12) {
        monthTotalInvested = (vlrCtbBasica + vlrCtbPatroc + vlrCtbAdicPct) * 2
      } else {
        monthTotalInvested = vlrCtbBasica + vlrCtbPatroc + vlrCtbAdicPct
      }
      totalInvestedTemp += monthTotalInvested

      vlrRendeu = temporaryFinalBalance * (rentMensal / 100)

      finalBalance = monthTotalInvested + temporaryFinalBalance + vlrRendeu

      temporaryFinalBalance = finalBalance

      /* Investimento do Participante */
      tempMonthInvestedPartic = vlrCtbBasica + vlrCtbAdicPct
      tempTotalInvestedPartic += tempMonthInvestedPartic

      /* Investimento da Patrocinadora */
      tempMonthInvestedPatroc = vlrCtbPatroc
      tempTotalInvestedPatroc += tempMonthInvestedPatroc

      let anomesFormat = format(dataCorrente, "MMM'/'yyyy", { locale: ptBR })
      anomesFormat = anomesFormat[0].toUpperCase() + anomesFormat.substring(1)

      const val: Values = {
        year: anoCorrente,
        anomes: anomesFormat,
        invested: totalInvestedTemp,
        rentability: rentMensal,
        finalBalance,
      }
      valuesCalculated.push(val)
    }
    idade += 1

    setTotalInvested(totalInvestedTemp)
    setTotalBalance(temporaryFinalBalance)
    setTotalInvestedPartic(tempTotalInvestedPartic)
    setTotalInvestedPatroc(tempTotalInvestedPatroc)
    setValues(valuesCalculated)
    setLaunched(true)
  }, [
    idadeAtual,
    maxUamb,
    rentMensal,
    setTotalBalance,
    // txAdmin,
    userData.birthdate,
    userDetails,
  ])

  const toggleSelectedReceive = useCallback(
    (selectedReceiveNow: 'PD' | 'PS' | 'VF' | '') => {
      setSelectedReceive(selectedReceiveNow)
      if (selectedReceiveNow === 'PD') {
        setDisplayTime(true)
        setDisplayPercent(false)
        setDisplayValorFixo(false)
      } else if (selectedReceiveNow === 'PS') {
        setDisplayTime(false)
        setDisplayPercent(true)
        setDisplayValorFixo(false)
      } else if (selectedReceiveNow === 'VF') {
        setDisplayTime(false)
        setDisplayPercent(false)
        setDisplayValorFixo(true)
      } else {
        setDisplayPercent(false)
        setDisplayTime(false)
        setDisplayValorFixo(false)
      }
    },
    [setSelectedReceive],
  )

  const adicAno = useCallback(() => {
    if (timeValueYears >= 40) {
      setTimeValueYears(40)
    } else {
      setTimeValueYears(timeValueYears + 1)
    }
  }, [setTimeValueYears, timeValueYears])

  const tiraAno = useCallback(() => {
    if (timeValueYears <= 5) {
      setTimeValueYears(5)
    } else {
      setTimeValueYears(timeValueYears - 1)
    }
  }, [setTimeValueYears, timeValueYears])

  const mudarRendaFixa = useCallback(
    valor => {
      const v = valor.replace(',', '')
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(v) || v === '' || v === undefined) {
        setRendaFixa(rendaFixa)
      } else {
        const m = Math.floor(v.length - 2)
        const a = `${v.substr(0, m)}.${v.substr(m)}`
        const f = parseFloat(a)
        setRendaFixa(f)
      }
    },
    [rendaFixa, setRendaFixa],
  )

  useEffect(() => {
    if (!launched) createValues()
  }, [createValues, launched])

  const graphValues = values.map(value => ({
    year: value.year,
    value: value.finalBalance,
    formattedValue: Valor(value.finalBalance.toFixed(2)),
  }))

  const CustomTooltip = useCallback(
    ({ active, payload, label }: CustomTooltipInterface) => {
      if (active) {
        return (
          <div className="tooltip">
            <h4>Ano: {label}</h4>
            <p>
              Saldo: <span>{Valor(payload[0].value.toFixed(2))}</span>
            </p>
          </div>
        )
      }
      return null
    },
    [],
  )

  const handleChangePctSup = useCallback(
    e => {
      const t = parseFloat(e)
      if (e === '' || e === undefined) {
        setPercentualValuePercent('0')
      } else {
        setPercentualValuePercent(e)
        // console.log(e)
      }
    },
    [setPercentualValuePercent],
  )

  const handleValidaPctSup = useCallback(
    e => {
      const t = parseFloat(e)
      if (e === '' || e === undefined) {
        setPercentualValuePercent('0')
      } else if (parseFloat(e) > 2.5) {
        setPercentualValuePercent('2.5')
      } else {
        setPercentualValuePercent(e)
      }
    },
    [setPercentualValuePercent],
  )

  const handleSubmit = useCallback(
    async data => {
      // try {
      //   formRef.current?.setErrors({})
      //   const schema = Yup.object().shape({
      //     pctReceive: Yup.string().when('tipo', {
      //       is: 'PS',
      //       then: Yup.string()
      //         .required('Campo obrigatório')
      //         .test(
      //           '',
      //           'Campo obrigatório',
      //           () => parseFloat(percentualValuePercent) > 0,
      //         )
      //         .test(
      //           '',
      //           'Escolha entre 0,1% e 2,5%',
      //           () =>
      //             parseFloat(data.pctReceive.replace(',', '.')) >= 0.1 &&
      //             parseFloat(data.pctReceive.replace(',', '.')) <= 2.5,
      //         ),
      //     }),
      //     rendaFixa: Yup.string().when('tipo', {
      //       is: 'VF',
      //       then: Yup.string()
      //         .required('Campo obrigatório')
      //         .test('', 'Campo obrigatório', () => rendaFixa > 0)
      //         .test(
      //           '',
      //           `Escolha um valor entre ${formatValue(
      //             totalBalance * 0.001,
      //           )} e ${formatValue(totalBalance * 0.025)}`,
      //           () =>
      //             (totalBalance * 0.001 <
      //               parseFloat(
      //                 data.rendaFixa.replace('.', '').replaceAll(',', '.'),
      //               ) &&
      //               parseFloat(
      //                 data.rendaFixa.replace('.', '').replaceAll(',', '.'),
      //               ) <= parseFloat((totalBalance * 0.025).toFixed(2))) ||
      //             data.rendaFixa === undefined,
      //         ),
      //     }),
      //   })

      if (data.tipo === 'PD' || data.tipo === 'PS') {
        setRendaFixa(0)
      }
      // await schema.validate(data, { abortEarly: false })

      if (flagEdit === 'S') {
        history.push('/resume')
      } else if (aportFlag === true) {
        history.push('/aport-confirmation')
      } else {
        history.push('/register')
      }
      // } catch (err) {
      //   formRef.current?.setErrors(getValidationErrors(err))
      // }
    },
    [
      aportFlag,
      flagEdit,
      history,
      percentualValuePercent,
      rendaFixa,
      setRendaFixa,
      totalBalance,
    ],
  )

  const handleConfirmValues = useCallback(() => {
    formRef.current?.submitForm()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          <div className="values-box">
            <InfoValuesBox color="purple" gradientDirection="right">
              <span>Valor Investido</span>
              <h3>{formatValue(totalInvested)}</h3>
              <small>Seu investimento no período</small>
            </InfoValuesBox>

            <InfoValuesBox color="green" gradientDirection="left">
              <span>Seu saldo projetado</span>
              <h3>{formatValue(totalBalance)}</h3>
              <small>Seu investimento + rentabilidade</small>
            </InfoValuesBox>
          </div>
          <article>
            <p>
              Os dados não mentem. <br />
              Quer ver? Arraste o mouse no gráfico e descubra a evolução do seu
              patrimônio no decorrer dos próximos anos.
            </p>
          </article>

          <GraphWrapper>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={graphValues}>
                <defs>
                  <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF612C33" stopOpacity={0.8} />
                    <stop
                      offset="95%"
                      stopColor="#FF612C44"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FF612C"
                  fillOpacity={1}
                  fill="url(#color)"
                />

                <Tooltip
                  content={
                    <CustomTooltip active={false} payload={2} label="" />
                  }
                />
                <XAxis name="Ano" dataKey="year" />
                <YAxis
                  name="Saldo"
                  dataKey="value"
                  width={75}
                  axisLine={false}
                  tickLine={false}
                  tickCount={5}
                  tickFormatter={number => `${Valor(number.toFixed(2))}`}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </GraphWrapper>
          <small>
            Os valores são simulações e não há garantia de rentabilidade futura.
            Para a projeção acima foi utilizado o percentual de 8% a.a,
            considerando a inflação de 3% a.a.
          </small>
        </Content>

        {/* <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{
            rendaFixa: ValorMascarar(rendaFixa.toFixed(2).toString()),
          }}
        >
          <Content>
            <strong>
              Escolha a forma de recebimento mensal <br /> do seu benefício:
            </strong>
            <ReceiveBox>
              <ButtonSelectBox
                type="button"
                onClick={() => toggleSelectedReceive('PS')}
                selected={selectedReceive === 'PS'}
              >
                <img src={simulationSelectPercentIcon} alt="Percentual" />
                <span>Percentual sobre o saldo</span>
                <FiCheckCircle />
              </ButtonSelectBox>
              <BoxButtons displayed={displayPercent}>
                {/* <ButtonSimulationCalc type="button" onClick={() => tiraPerct()}>
                -
              </ButtonSimulationCalc>
              <ButtonSimulationValue type="button">
                <span>{parseFloat(percentualValuePercent.toFixed(2))}%</span>
              </ButtonSimulationValue>
              <ButtonSimulationCalc type="button" onClick={() => adicPerct()}>
                +
              </ButtonSimulationCalc> * /}
                <Input
                  icon={FiPercent}
                  name="pctReceive"
                  value={percentualValuePercent}
                  type="number"
                  // mask="percent"
                  placeholder="Quero receber por mês:"
                  onChange={e => handleChangePctSup(e.target.value)}
                  // onBlur={e => handleValidaPctSup(e.target.value)}
                />
                <small>Mínimo 0,1% | máximo 2,5%</small>
              </BoxButtons>
              <ColoredBoxInfo
                size="large"
                color="purple"
                gradientDirection="right"
                displayed={displayPercent}
              >
                <div>
                  <h3>{percentualValue}*</h3>
                  <small>Valor recebido por mês</small>
                  <p>
                    *Valor simulado referente a {percentualValuePercent}% do seu
                    saldo projetado, com pagamentos mensais efetuados com base
                    no percentual que escolher no momento da aposentadoria.
                  </p>
                </div>
                <img src={simulationPercentageInfo} alt="Percentual" />
              </ColoredBoxInfo>
            </ReceiveBox>
            <Line />
            <ReceiveBox>
              <ButtonSelectBox
                type="button"
                onClick={() => toggleSelectedReceive('PD')}
                selected={selectedReceive === 'PD'}
              >
                <img src={simulationSelectTimeIcon} alt="Tempo" />
                <span>Prazo determinado</span>
                <FiCheckCircle />
              </ButtonSelectBox>
              <BoxButtons displayed={displayTime}>
                <ButtonSimulationCalc type="button" onClick={() => tiraAno()}>
                  -
                </ButtonSimulationCalc>
                <ButtonSimulationValue type="button">
                  <span>{timeValueYears} anos</span>
                </ButtonSimulationValue>
                <ButtonSimulationCalc type="button" onClick={() => adicAno()}>
                  +
                </ButtonSimulationCalc>
              </BoxButtons>
              <ColoredBoxInfo
                size="large"
                color="green"
                gradientDirection="left"
                displayed={displayTime}
              >
                <div>
                  <h3>{timeValue}*</h3>
                  <small>Valor recebido por mês</small>
                  <p>
                    *Valor simulado referente a modalidade de prazo determinado
                    com duração de {timeValueYears} anos calculado com base no
                    seu saldo projetado.
                  </p>
                </div>
                <img src={simulationYearsInfo} alt="Tempo" />
              </ColoredBoxInfo>
            </ReceiveBox>
            <Line />
            <ReceiveBox>
              <ButtonSelectBox
                type="button"
                onClick={() => toggleSelectedReceive('VF')}
                selected={selectedReceive === 'VF'}
              >
                <img src={simulationFixedValue} alt="Renda Fixa" />
                <span>Valor Fixo</span>
                <FiCheckCircle />
              </ButtonSelectBox>
              <BoxButtons displayed={displayValorFixo}>
                <Input
                  icon={FiDollarSign}
                  name="rendaFixa"
                  mask="currency"
                  type="text"
                  placeholder="Quero receber por mês:"
                  onChange={e => mudarRendaFixa(e.target.value)}
                />
                <small>
                  {`Mínimo R$${ValorMascarar(
                    (totalBalance * 0.001).toFixed(2).toString(),
                  )} | Máximo R$${ValorMascarar(
                    (totalBalance * 0.025).toFixed(2).toString(),
                  )}`}
                </small>
              </BoxButtons>
              <ColoredBoxInfo
                size="large"
                color="orange"
                gradientDirection="right"
                displayed={displayValorFixo}
              >
                <div>
                  <h3>{formatValue(rendaFixa)}*</h3>
                  <small>Você receberá por mês</small>
                  <p>
                    *Renda mensal em valor fixo, expresso em moeda corrente
                    nacional.
                  </p>
                </div>
                <img src={simulationYearsInfo} alt="Tempo" />
              </ColoredBoxInfo>
            </ReceiveBox>
            <InputHidden name="tipo" type="hidden" value={selectedReceive} />
            <small className="comment">
              Selecione uma das opções acima para simular o valor que você
              receberá mensalmente ao se aposentar
            </small>
          </Content>
        </Form> */}
        <Button
          type="button"
          fontSize="normal"
          color="orange"
          width="large"
          // onClick={handleConfirmValues}
          onClick={handleSubmit}
          // disabled={!selectedReceive}
        >
          <FiCheck size={40} />É isso que eu quero!
        </Button>

        <BtnVoltar type="button" onClick={() => history.push('/')}>
          &lt; Quero alterar os valores e simular novamente
        </BtnVoltar>
      </Container>
    </>
  )
}

export default Simulation
