import {
  addMonths,
  addYears,
  differenceInMonths,
  format,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import ColoredBox from '../../components/ColoredBox'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import usePersistedState from '../../hooks/usePersistedState'
import { scrollToTop } from '../../utils/browser'
import { formatValue } from '../../utils/formatValues'
import { UserData, UserDetails } from '../../utils/interfaces'
import { Valor } from '../../utils/masks'

interface Values {
  year: number
  anomes: string
  invested: number
  finalBalance: number
  rentability: number
}

interface ChartDatum {
  label: string
  year: number
  value: number
  formattedValue: string
}

const ProjectionChart: React.FC<{ data: ChartDatum[] }> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const chart = useMemo(() => {
    if (data.length === 0) {
      return null
    }

    const width = 980
    const height = 580
    const paddingTop = 20
    const paddingRight = 18
    const paddingBottom = 48
      const paddingLeft = 110
    const innerWidth = width - paddingLeft - paddingRight
    const innerHeight = height - paddingTop - paddingBottom
    const valuesOnly = data.map(item => item.value)
    const maxValue = Math.max(...valuesOnly)
    const safeMaxValue = maxValue > 0 ? maxValue : 1

    const yTicks = Array.from({ length: 5 }, (_, index) => {
      const value = (safeMaxValue / 4) * (4 - index)
      const y =
        paddingTop + ((safeMaxValue - value) / safeMaxValue) * innerHeight

      return { value, y }
    })

    const points = data.map((item, index) => {
      const x =
        paddingLeft +
        (data.length === 1
          ? innerWidth / 2
          : (index / (data.length - 1)) * innerWidth)
      const y =
        paddingTop + ((safeMaxValue - item.value) / safeMaxValue) * innerHeight

      return {
        ...item,
        x,
        y,
      }
    })

    const linePath = points
      .map(
        (point, index) =>
          `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(
            2,
          )}`,
      )
      .join(' ')

    const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(
      2,
    )} ${(height - paddingBottom).toFixed(2)} L ${points[0].x.toFixed(2)} ${(
      height - paddingBottom
    ).toFixed(2)} Z`

    const xLabelIndexes = Array.from(
      new Set(
        [0, 0.16, 0.32, 0.48, 0.64, 0.8, 0.92, 1]
          .map(ratio => Math.round((data.length - 1) * ratio))
          .filter(index => index >= 0 && index < data.length),
      ),
    )

    return {
      width,
      height,
      paddingLeft,
      paddingRight,
      paddingBottom,
      points,
      yTicks,
      linePath,
      areaPath,
      xLabelIndexes,
    }
  }, [data])

  if (!chart) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-ink-700">
        Não foi possível gerar o gráfico com os dados informados.
      </div>
    )
  }

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>): void => {
    const svgElement = svgRef.current

    if (!svgElement) return

    const rect = svgElement.getBoundingClientRect()
    const scaleX = chart.width / rect.width
    const pointerX = (event.clientX - rect.left) * scaleX

    const nearestIndex = chart.points.reduce((closestIndex, point, index) => {
      const closestPoint = chart.points[closestIndex]

      return Math.abs(point.x - pointerX) < Math.abs(closestPoint.x - pointerX)
        ? index
        : closestIndex
    }, 0)

    setHoveredIndex(nearestIndex)
  }

  const hoveredPoint = hoveredIndex !== null ? chart.points[hoveredIndex] : null

  let tooltipTransform = 'translate(-50%, calc(-100% - 14px))'
  if (hoveredPoint && hoveredPoint.x >= chart.width - 130) {
    tooltipTransform = 'translate(calc(-100% - 12px), calc(-100% - 14px))'
  } else if (hoveredPoint && hoveredPoint.x <= 130) {
    tooltipTransform = 'translate(12px, calc(-100% - 14px))'
  }

  const tooltipStyle = hoveredPoint
    ? {
        left: `${(hoveredPoint.x / chart.width) * 100}%`,
        top: `${Math.min(
          Math.max((hoveredPoint.y / chart.height) * 100, 18),
          92,
        )}%`,
        transform: tooltipTransform,
      }
    : undefined

  return (
    <div className="relative h-full w-full">
      {hoveredPoint && (
        <div
          className="pointer-events-none absolute z-10 min-w-fit rounded-lg border border-[#F2D2C8] bg-white/95 px-3 py-2 text-left shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          style={tooltipStyle}
        >
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-700">
            {hoveredPoint.label}
          </p>
          <p className="mt-1 whitespace-nowrap text-xs text-ink-900">
            Ano:{' '}
            <span className="font-bold text-ink-900">{hoveredPoint.year}</span>
          </p>
          <p className="mt-1 whitespace-nowrap text-xs text-ink-900">
            Saldo:{' '}
            <span className="whitespace-nowrap font-bold text-brand-400">
              {hoveredPoint.formattedValue}
            </span>
          </p>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        className="h-full w-full"
        role="img"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
        aria-label="Evolução do saldo projetado"
      >
        <defs>
          <linearGradient
            id="simulationAreaGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#FF612C" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF612C" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {chart.yTicks.map(tick => (
          <g key={tick.value}>
            <line
              x1={chart.paddingLeft}
              y1={tick.y}
              x2={chart.width - chart.paddingRight}
              y2={tick.y}
              stroke="#E6E8EB"
              strokeDasharray="4 6"
            />
            <text
              x={chart.paddingLeft - 12}
              y={tick.y + 4}
              fontSize={16}
              textAnchor="end"
              className="fill-[#6B7280] text-[13px]"
            >
              {Valor(tick.value.toFixed(2))}
            </text>
          </g>
        ))}

        {hoveredPoint ? (
          <line
            x1={hoveredPoint.x}
            y1={20}
            x2={hoveredPoint.x}
            y2={chart.height - chart.paddingBottom}
            stroke="#FFB39A"
            strokeDasharray="4 6"
          />
        ) : null}

        <path d={chart.areaPath} fill="url(#simulationAreaGradient)" />
        <path
          d={chart.linePath}
          fill="none"
          stroke="#FF612C"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {chart.points.map((point, index) => (
          <g
            key={`${point.label}-${point.year}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onFocus={() => setHoveredIndex(index)}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 4 : 0}
              fill="#FFFFFF"
              stroke="#FF612C"
              strokeWidth="2"
            />
            <circle cx={point.x} cy={point.y} r={18} fill="transparent" />
          </g>
        ))}

        {chart.xLabelIndexes.map(index => {
          const point = chart.points[index]

          return (
            <text
              key={`${point.label}-axis`}
              x={point.x}
              y={chart.height - 16}
              fontSize={16}
              textAnchor="middle"
              className="fill-[#6B7280] text-[13px]"
            >
              {point.year}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

const Simulation: React.FC = () => {
  const [userDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [totalBalance, setTotalBalance] = usePersistedState('totalBalance', 0)
  const [flagEdit] = usePersistedState<'S' | 'N'>('flagEdit', 'N')
  const [aportFlag] = usePersistedState('aportFlag', false)

  const [totalInvested, setTotalInvested] = useState(0)
  const [values, setValues] = useState<Values[]>([])
  const [launched, setLaunched] = useState(false)

  const history = useHistory()

  const [rentAnual] = usePersistedState('rentAnual', 8)
  const [rentMensal] = usePersistedState(
    'rentMensal',
    ((1 + rentAnual / 100) ** (1 / 12) - 1) * 100,
  )

  const birthdate = userData.birthdate ?? ''
  const parsedBirthdate = birthdate ? parseISO(birthdate) : null
  const hasValidBirthdate =
    parsedBirthdate !== null && !Number.isNaN(parsedBirthdate.getTime())

  const [, setTotalInvestedPartic] = useState(0)
  const [, setTotalInvestedPatroc] = useState(0)

  const [UAMB] = usePersistedState('UAMB', 707.58)
  const maxUamb = UAMB * 10

  const hasSimulationInputs =
    hasValidBirthdate &&
    Number.isFinite(Number(userDetails.age)) &&
    Number(userDetails.age) > 0 &&
    Number.isFinite(Number(userDetails.salario)) &&
    Number(userDetails.salario) >= 0

  const createValues = useCallback(() => {
    if (!hasSimulationInputs || parsedBirthdate === null) {
      setTotalInvested(0)
      setTotalBalance(0)
      setTotalInvestedPartic(0)
      setTotalInvestedPatroc(0)
      setValues([])
      setLaunched(true)
      return
    }

    const valuesCalculated: Values[] = []
    let totalInvestedTemp = 0
    let temporaryFinalBalance = 0
    let tempMonthInvestedPartic = 0
    let tempTotalInvestedPartic = 0
    let tempMonthInvestedPatroc = 0
    let tempTotalInvestedPatroc = 0
    let vlrRendeu = 0
    const evolSalarial = 3

    let salario = Number(userDetails.salario)

    let vlrCtbBasica = 0
    if (salario >= maxUamb) {
      const vlrExcedente = salario - maxUamb
      vlrCtbBasica = maxUamb * 0.005 + vlrExcedente * 0.09
    } else {
      vlrCtbBasica = salario * 0.005
    }
    let vlrCtbPatroc = vlrCtbBasica
    let vlrCtbAdicPct =
      salario * (Number(userDetails.pctContribuicaoSuplementar) / 100)

    const dataAposentadoria = addYears(parsedBirthdate, Number(userDetails.age))
    const hoje = new Date()
    const dtIniCtb = hoje
    const monthsContrib = differenceInMonths(dataAposentadoria, new Date())
    const totalContribution = Math.max(monthsContrib, 0)
    let finalBalance = 0
    let counter = 1

    for (counter; counter <= totalContribution + 2; counter += 1) {
      const dataCorrente = addMonths(dtIniCtb, counter)
      const mesCorrente = dataCorrente.getMonth() + 1
      const anoCorrente = dataCorrente.getFullYear()

      if (mesCorrente === 1) {
        salario += salario * (evolSalarial / 100)
        if (salario >= maxUamb) {
          const vlrExcedente = salario - maxUamb
          vlrCtbBasica = maxUamb * 0.005 + vlrExcedente * 0.09
        } else {
          vlrCtbBasica = salario * 0.005
        }
        vlrCtbPatroc = vlrCtbBasica
        vlrCtbAdicPct =
          salario * (Number(userDetails.pctContribuicaoSuplementar) / 100)
      }

      let monthTotalInvested = 0
      if (mesCorrente === 12) {
        monthTotalInvested = (vlrCtbBasica + vlrCtbPatroc + vlrCtbAdicPct) * 2
      } else {
        monthTotalInvested = vlrCtbBasica + vlrCtbPatroc + vlrCtbAdicPct
      }
      totalInvestedTemp += monthTotalInvested

      vlrRendeu = temporaryFinalBalance * (rentMensal / 100)

      finalBalance = monthTotalInvested + temporaryFinalBalance + vlrRendeu

      temporaryFinalBalance = finalBalance

      tempMonthInvestedPartic = vlrCtbBasica + vlrCtbAdicPct
      tempTotalInvestedPartic += tempMonthInvestedPartic

      tempMonthInvestedPatroc = vlrCtbPatroc
      tempTotalInvestedPatroc += tempMonthInvestedPatroc

      let anomesFormat = format(dataCorrente, "MMM'/'yyyy", { locale: ptBR })
      anomesFormat = anomesFormat[0].toUpperCase() + anomesFormat.substring(1)

      valuesCalculated.push({
        year: anoCorrente,
        anomes: anomesFormat,
        invested: totalInvestedTemp,
        rentability: rentMensal,
        finalBalance,
      })
    }
    setTotalInvested(totalInvestedTemp)
    setTotalBalance(temporaryFinalBalance)
    setTotalInvestedPartic(tempTotalInvestedPartic)
    setTotalInvestedPatroc(tempTotalInvestedPatroc)
    setValues(valuesCalculated)
    setLaunched(true)
  }, [
    hasSimulationInputs,
    maxUamb,
    parsedBirthdate,
    rentMensal,
    setTotalBalance,
    userDetails.age,
    userDetails.pctContribuicaoSuplementar,
    userDetails.salario,
  ])

  useEffect(() => {
    if (!launched) createValues()
  }, [createValues, launched])

  const graphValues = useMemo(
    () =>
      values
        .filter(value => Number.isFinite(value.finalBalance))
        .map(value => ({
          label: value.anomes,
          year: value.year,
          value: value.finalBalance,
          formattedValue: Valor(value.finalBalance.toFixed(2)),
        })),
    [values],
  )

  const handleContinue = useCallback(() => {
    if (flagEdit === 'S') {
      history.push('/resume')
    } else if (aportFlag === true) {
      history.push('/aport-confirmation')
    } else {
      history.push('/welcome')
    }
  }, [aportFlag, flagEdit, history])

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout>
      <PageCard>
        <div className="grid w-full gap-5 md:grid-cols-2 md:gap-8 md:px-6">
          <ColoredBox
            color="purple"
            gradientDirection="right"
            size="large"
            className="rounded-xl px-5 py-4"
          >
            <span className="mb-2 block text-[13px] font-bold">
              Valor investido
            </span>
            <h3 className="mb-2 text-xl font-bold leading-tight">
              {formatValue(totalInvested)}
            </h3>
            <small className="mt-1 block text-[12px] leading-6">
              Seu investimento no perí­odo
            </small>
          </ColoredBox>

          <ColoredBox
            color="green"
            gradientDirection="left"
            size="large"
            className="rounded-xl px-5 py-4"
          >
            <span className="mb-2 block text-[13px] font-bold">
              Seu saldo projetado
            </span>
            <h3 className="mb-2 text-xl font-bold leading-tight">
              {formatValue(totalBalance)}
            </h3>
            <small className="mt-1 block text-[12px] leading-6">
              Seu investimento + rentabilidade
            </small>
          </ColoredBox>
        </div>

        <article className="mx-auto mt-7 max-w-140 text-center text-[15px] leading-[1.45] text-ink-900">
          <p>
            Os dados não mentem. <br />
            Quer ver? Passe o mouse no gráfico e descubra a evolução do seu
            patrimônio no decorrer dos próximos anos.
          </p>
        </article>

        <div className="mt-5 w-full rounded-xl bg-white px-2 pb-2 pt-1">
          {hasSimulationInputs ? (
            <ProjectionChart data={graphValues} />
          ) : (
            <div className="flex h-100 flex-col items-center justify-center gap-3 text-center text-sm text-ink-700">
              <p>Faltam dados para montar a simulação.</p>
              <p>
                Revise data de nascimento, idade de aposentadoria e salário.
              </p>
            </div>
          )}
        </div>

        <small className="mx-auto mt-5 block max-w-130 text-center text-[11px] leading-5 text-ink-700 italic">
          Os valores são simulações e não há garantia de rentabilidade futura.
          Para a projeção acima foi utilizado o percentual de 8% a.a.,
          considerando a inflação de 3% a.a.
        </small>
      </PageCard>

      <Button
        type="button"
        fontSize="normal"
        color="orange"
        width="large"
        onClick={handleContinue}
      >
        <FiCheckCircle size={24} />É isso que eu quero!
      </Button>

      <BackButton type="button" onClick={() => history.push('/contribution')}>
        <FiArrowLeft /> Quero alterar os valores e simular novamente
      </BackButton>
    </PageLayout>
  )
}

export default Simulation
