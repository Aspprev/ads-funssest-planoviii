/* eslint-disable no-restricted-globals */
import { Form, Formik, yupToFormErrors } from 'formik'
import moment from 'moment'
import React, { useCallback, useEffect } from 'react'
import { BiCake } from 'react-icons/bi'
import { FiArrowRight, FiClock, FiDollarSign, FiPercent } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../../components/Button'
import Input from '../../components/Input'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import SectionDivider from '../../components/SectionDivider'
import usePersistedState from '../../hooks/usePersistedState'
import { normalizeCurrencyDigits, scrollToTop } from '../../utils/browser'
import calculaIdade from '../../utils/calculaIdade'
import { formatValue } from '../../utils/formatValues'
import { UserData, UserDetails } from '../../utils/interfaces'
import { ValorMascarar } from '../../utils/masks'
import { removeStorageItem } from '../../utils/storage'

interface ContributionFormValues {
  birthdate: string
  age: number | string
  salario: string
  pctContribuicaoSup: number | string
}

interface ContributionSummary {
  salario: number
  pctCtbBas: number
  vlrCtbBasica: number
  vlrCtbPatrocinadora: number
  vlrCtbTotal: number
  pctCtbSup: number
  vlrCtbSup: number
}

const BASIC_CONTRIBUTION_THRESHOLDS = {
  faixa1Max: 6304.5,
  faixa2Max: 10053,
  faixa3Max: 17592.75,
  faixa4Max: 25132.46,
} as const

function parseCurrencyValue(value: string | number | undefined): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (!value) {
    return 0
  }

  const normalized = normalizeCurrencyDigits(value)

  if (normalized === '' || isNaN(Number(normalized))) {
    return 0
  }

  const integerLength = Math.max(normalized.length - 2, 0)
  const parsed = parseFloat(
    `${normalized.substring(0, integerLength)}.${normalized.substring(
      integerLength,
    )}`,
  )

  return Number.isNaN(parsed) ? 0 : parsed
}

function calculateContributionSummary(
  salarioInput: string | number | undefined,
  pctContribuicaoSupInput: string | number | undefined,
): ContributionSummary {
  const salario = parseCurrencyValue(salarioInput)
  const pctCtbSup = Number(pctContribuicaoSupInput || 0)

  if (salario <= 0) {
    return {
      salario: 0,
      pctCtbBas: 1,
      vlrCtbBasica: 0,
      vlrCtbPatrocinadora: 0,
      vlrCtbTotal: 0,
      pctCtbSup,
      vlrCtbSup: 0,
    }
  }

  const salarioEmCentavos = Math.round(salario * 100)
  const faixa1MaxCentavos = Math.round(
    BASIC_CONTRIBUTION_THRESHOLDS.faixa1Max * 100,
  )
  const faixa2MaxCentavos = Math.round(
    BASIC_CONTRIBUTION_THRESHOLDS.faixa2Max * 100,
  )
  const faixa3MaxCentavos = Math.round(
    BASIC_CONTRIBUTION_THRESHOLDS.faixa3Max * 100,
  )
  const faixa4MaxCentavos = Math.round(
    BASIC_CONTRIBUTION_THRESHOLDS.faixa4Max * 100,
  )

  let pctCtbBas = 1

  // A tabela publicada no site em reais é a referência da faixa.
  if (salarioEmCentavos <= faixa1MaxCentavos) {
    pctCtbBas = 1
  } else if (salarioEmCentavos <= faixa2MaxCentavos) {
    pctCtbBas = 4
  } else if (salarioEmCentavos <= faixa3MaxCentavos) {
    pctCtbBas = 6.5
  } else if (salarioEmCentavos <= faixa4MaxCentavos) {
    pctCtbBas = 8.5
  } else {
    pctCtbBas = 9.5
  }

  const modelContrib = salario * (pctCtbBas / 100)

  const vlrCtbBasica = parseFloat(modelContrib.toFixed(2))
  const vlrCtbPatrocinadora = parseFloat(modelContrib.toFixed(2))
  const vlrCtbTotal = parseFloat((modelContrib * 2).toFixed(2))
  const vlrCtbSup = parseFloat(((salario * pctCtbSup) / 100).toFixed(2))

  return {
    salario,
    pctCtbBas,
    vlrCtbBasica,
    vlrCtbPatrocinadora,
    vlrCtbTotal,
    pctCtbSup,
    vlrCtbSup,
  }
}

const Contribution: React.FC = () => {
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [userData, setUserData] = usePersistedState<UserData>(
    'userData',
    {} as UserData,
  )
  const history = useHistory()

  const validate = useCallback(async (values: ContributionFormValues) => {
    const idadeNumerica = Number(values.age)
    const birthdateIso = values.birthdate.split('/').reverse().join('-')
    const idadeMinima =
      calculaIdade(birthdateIso) < 60 ? 60 : calculaIdade(birthdateIso) + 1
    const contributionSummary = calculateContributionSummary(
      values.salario,
      values.pctContribuicaoSup,
    )

    const schema = Yup.object().shape({
      birthdate: Yup.string()
        .required('Campo obrigatório')
        .test(
          '',
          'A data de nascimento não pode ser maior que hoje.',
          () => moment() > moment(birthdateIso) || values.birthdate === '',
        )
        .test(
          '',
          'Data de nascimento inválida',
          () => moment(birthdateIso).isValid() || values.birthdate === '',
        )
        .test(
          '',
          'Data de nascimento inválida',
          () => calculaIdade(birthdateIso) <= 115 || values.birthdate === '',
        ),
      age: Yup.number()
        .typeError(
          'Digite a idade desejada para a aposentadoria para realizar a simulação',
        )
        .required(
          'Digite a idade desejada para a aposentadoria para realizar a simulação',
        )
        .min(
          idadeMinima,
          `Idade inválida. Por favor, escolha uma idade igual ou superior a ${idadeMinima} anos`,
        )
        .max(115, 'Idade inválida.'),
      salario: Yup.string()
        .test(
          '',
          'Salário inválido.',
          () => contributionSummary.salario <= 100000,
        )
        .required('Campo obrigatório'),
      pctContribuicaoSup: Yup.number().test(
        '',
        'Percentual inválido. Escolha no máximo 100%',
        () => Number(values.pctContribuicaoSup || 0) <= 100,
      ),
    })

    try {
      await schema.validate(
        {
          ...values,
          age: idadeNumerica,
        },
        { abortEarly: false },
      )
      return {}
    } catch (err) {
      return yupToFormErrors(err as Yup.ValidationError)
    }
  }, [])

  const handleSubmit = useCallback(
    async (values: ContributionFormValues) => {
      const now = new Date()
      const birthdate = values.birthdate.split('/').reverse().join('-')
      const ano = birthdate.split('-')[0]
      const age = Number(values.age)
      const years = age - (now.getFullYear() - parseInt(ano, 10))
      const summary = calculateContributionSummary(
        values.salario,
        values.pctContribuicaoSup,
      )

      setUserData(current => ({
        ...current,
        birthdate,
      }))

      setUserDetails(current => ({
        ...current,
        salario: summary.salario,
        contribuicaoBasica: summary.vlrCtbBasica,
        contribuicaoPatrocinadora: summary.vlrCtbPatrocinadora,
        pctContribuicaoBasica: summary.pctCtbBas,
        contribuicaoSuplementar: summary.vlrCtbSup,
        pctContribuicaoSuplementar: summary.pctCtbSup,
        years,
        age,
      }))

      history.push('/simulation')
    },
    [history, setUserData, setUserDetails],
  )

  useEffect(() => {
    scrollToTop()
    removeStorageItem('flagAssistencial')
    removeStorageItem('flagTubarao')
  }, [])

  return (
    <PageLayout>
      <Formik<ContributionFormValues>
        enableReinitialize
        initialValues={{
          age: userDetails.age ?? '',
          salario:
            userDetails.salario === undefined
              ? ''
              : ValorMascarar(userDetails.salario.toFixed(2).toString()),
          birthdate:
            userData.birthdate === undefined
              ? ''
              : userData.birthdate.toString().split('-').reverse().join('/'),
          pctContribuicaoSup: userDetails.pctContribuicaoSuplementar ?? 0,
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ values, setTouched }) => {
          const summary = calculateContributionSummary(
            values.salario,
            values.pctContribuicaoSup,
          )

          return (
            <Form className="w-full flex flex-col items-center justify-center">
              <PageCard>
                <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
                  Simulação de Contribuição Básica
                </strong>
                <p className="mb-4 text-center">
                  Será descontada mensalmente de sua folha de pagamento. A
                  empresa também fará a contribuição no mesmo valor.
                  <br /> Para isso, defina a porcentagem de desconto sobre o seu
                  salário e simule sua contribuição mensal.
                </p>
                <Input
                  icon={BiCake}
                  name="birthdate"
                  placeholder="Data de nascimento"
                  mask="date"
                />
                <Input
                  icon={FiClock}
                  type="number"
                  name="age"
                  min={50}
                  sufix="anos"
                  placeholder="Qual a idade desejada para a aposentadoria?"
                />
                <Input
                  icon={FiDollarSign}
                  name="salario"
                  mask="currency"
                  type="text"
                  placeholder="Qual o seu salário (R$)?"
                />

                <SectionDivider className="mb-4 mt-6 w-[65%]" />

                <div className="flex w-full flex-col">
                  <div className="mt-3 flex w-full items-center justify-between">
                    <p>Valor da contribuição básica do participante: </p>
                    <strong className="text-base text-brand-400">
                      {formatValue(summary.vlrCtbBasica)}
                    </strong>
                  </div>
                  <div className="mt-3 flex w-full items-center justify-between">
                    <p>Valor da contribuição básica da patrocinadora: </p>
                    <strong className="text-base text-brand-400">
                      {formatValue(summary.vlrCtbPatrocinadora)}
                    </strong>
                  </div>
                  <div className="mt-3 flex w-full items-center justify-between">
                    <div>
                      <p>Valor total de contribuição básica ao plano: </p>
                      <small>(participante + patrocinadora)</small>
                    </div>
                    <strong className="text-base text-brand-400">
                      {formatValue(summary.vlrCtbTotal)}
                    </strong>
                  </div>
                </div>
              </PageCard>

              <PageCard>
                <strong className="mb-4 flex justify-center text-center text-lg text-brand-400">
                  Simulação de Contribuição Adicional
                </strong>
                <Input
                  icon={FiPercent}
                  name="pctContribuicaoSup"
                  type="number"
                  placeholder="Qual percentual de contribuição adicional?"
                />

                <SectionDivider className="mb-4 mt-6 w-[65%]" />

                <div className="flex w-full flex-col">
                  <div className="mt-3 flex w-full items-center justify-between">
                    <p>Valor total de contribuição adicional ao plano: </p>
                    <strong className="text-base text-brand-400">
                      {formatValue(summary.vlrCtbSup)}
                    </strong>
                  </div>
                </div>
              </PageCard>

              <PageCard>
                <div className="flex w-full flex-col">
                  <div className="mt-3 flex w-full items-center justify-between">
                    <div>
                      <h3>Valor total de contribuição ao plano: </h3>
                      <small>(participante + patrocinadora + adicional)</small>
                    </div>
                    <strong className="text-base text-brand-400">
                      {formatValue(summary.vlrCtbTotal + summary.vlrCtbSup)}
                    </strong>
                  </div>
                </div>
              </PageCard>

              <Button
                type="submit"
                color="orange"
                width="large"
                onClick={() => {
                  setTouched({
                    birthdate: true,
                    age: true,
                    salario: true,
                    pctContribuicaoSup: true,
                  })
                }}
              >
                Simular valores
                <FiArrowRight size={20} />
              </Button>
            </Form>
          )
        }}
      </Formik>
    </PageLayout>
  )
}

export default Contribution
