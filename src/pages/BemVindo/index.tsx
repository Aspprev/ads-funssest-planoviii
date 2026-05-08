/* eslint-disable no-restricted-globals */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import moment from 'moment'
import * as Yup from 'yup'

import {
  FiArrowRightCircle,
  FiClock,
  FiDollarSign,
  FiPercent,
} from 'react-icons/fi'
import { BiCake } from 'react-icons/bi'
import getValidationErrors from '../../utils/getValidationErrors'
import usePersistedState from '../../hooks/usePersistedState'
import { ValorMascarar } from '../../utils/masks'
import { formatValue } from '../../utils/formatValues'

import Header from '../../components/Header'
import Button from '../../components/Button'
import Input from '../../components/Input'

import { UserDetails, UserData } from '../../utils/interfaces'
import { Container, Content, Line, InfoContent } from './styles'
import calculaIdade from '../../utils/calculaIdade'

const BemVindo: React.FC = () => {
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [userData, setUserData] = usePersistedState<UserData>(
    'userData',
    {} as UserData,
  )
  const [idadeApos, setIdadeApos] = useState(userDetails.age)
  const [salarioValue, setSalarioValue] = useState(userDetails.salario)
  const [vlrCtbBasica, setVlrCtbBasica] = useState(
    userDetails.contribuicaoBasica > 0 ? userDetails.contribuicaoBasica : 0,
  )
  const [vlrCtbPatrocinadora, setVlrCtbPatrocinadora] = useState(
    userDetails.contribuicaoPatrocinadora > 0
      ? userDetails.contribuicaoPatrocinadora
      : 0,
  )
  const [vlrCtbTotal, setVlrCtbTotal] = useState(
    userDetails.contribuicaoBasica + userDetails.contribuicaoPatrocinadora > 0
      ? userDetails.contribuicaoBasica + userDetails.contribuicaoPatrocinadora
      : 0,
  )
  const [pctCtbBas, setPctCtbBas] = useState(
    userDetails.pctContribuicaoBasica > 0
      ? userDetails.pctContribuicaoBasica
      : 6,
  )
  const [pctCtbSup, setPctCtbSup] = useState(
    userDetails.pctContribuicaoSuplementar > 0
      ? userDetails.pctContribuicaoSuplementar
      : 0,
  )
  const [vlrCtbSup, setVlrCtbSup] = useState(
    userDetails.contribuicaoSuplementar > 0
      ? userDetails.contribuicaoSuplementar
      : 0,
  )
  const [UAMB] = usePersistedState('UAMB', 707.58) // 618.88
  const history = useHistory()
  const formRef = useRef<FormHandles>(null)

  /* CALCULO DE CONTRIBUIÇÃO NORMAL */
  let pctCtb = 0
  const maxUamb = UAMB * 10
  let contribExcedente = 0
  let modelContrib = 0

  useEffect(() => {
    setUAMB(673.247)
    if (salarioValue !== 0 && salarioValue !== undefined) {
      if (salarioValue <= maxUamb) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        pctCtb = 0.005
        // eslint-disable-next-line react-hooks/exhaustive-deps
        modelContrib = salarioValue * pctCtb

        setPctCtbBas(pctCtb * 100)
        setVlrCtbBasica(parseFloat(modelContrib.toFixed(2)))
        setVlrCtbPatrocinadora(parseFloat(modelContrib.toFixed(2)))
      } else {
        pctCtb = 0.09
        // eslint-disable-next-line react-hooks/exhaustive-deps
        contribExcedente = salarioValue - maxUamb
        modelContrib = maxUamb * 0.005 + contribExcedente * 0.09
        // setPctCtbBas(
        //   parseFloat(((modelContrib / salarioValue) * 100).toFixed(2)),
        // )
        setPctCtbBas(0.09 * 100)
        setVlrCtbBasica(parseFloat(modelContrib.toFixed(2)))
        setVlrCtbPatrocinadora(parseFloat(modelContrib.toFixed(2)))
      }
    }

    setVlrCtbTotal(parseFloat((modelContrib * 2).toFixed(2)))
  }, [
    salarioValue,
    vlrCtbPatrocinadora,
    vlrCtbBasica,
    setVlrCtbBasica,
    setVlrCtbPatrocinadora,
  ])

  const mudarSalario = useCallback(
    valor => {
      const v = valor.replace(',', '').replaceAll('.', '')
      if (isNaN(v)) {
        setSalarioValue(salarioValue)
      } else {
        const m = Math.floor(v.length - 2)
        const a = `${v.substr(0, m)}.${v.substr(m)}`
        const f = parseFloat(a)
        setSalarioValue(f)
        // handleCalculaContribuicao(f)
      }
    },
    [salarioValue],
  )

  const handleMudaContribSup = useCallback(
    valor => {
      const valueCSup = (salarioValue * valor) / 100
      setPctCtbSup(valor)
      setVlrCtbSup(valueCSup)
    },
    [salarioValue],
  )

  const handleChangePctSup = useCallback(
    e => {
      const t = e
      if (isNaN(t)) {
        handleMudaContribSup(0)
      } else {
        handleMudaContribSup(t)
      }
    },
    [handleMudaContribSup],
  )

  const handleSubmit = useCallback(
    async data => {
      try {
        const now = new Date()
        const bday = data.birthdate.split('/').reverse().join('-')
        const ano = bday.split('-')[0]
        const anosContrib2 = idadeApos - (now.getFullYear() - parseInt(ano, 10))
        const idadeMinima =
          calculaIdade(data.birthdate.split('/').reverse().join('-')) < 60
            ? 60
            : calculaIdade(data.birthdate.split('/').reverse().join('-')) + 1

        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          birthdate: Yup.string()
            .required('Campo obrigatório')
            .test(
              '',
              'A data de nascimento não pode ser maior que hoje.',
              () =>
                moment() >
                  moment(data.birthdate.split('/').reverse().join('-')) ||
                data.birthdate === '',
            )
            .test(
              '',
              'Data de nascimento inválida',
              () =>
                moment(
                  data.birthdate.split('/').reverse().join('-'),
                ).isValid() || data.birthdate === '',
            )
            .test(
              '',
              'Data de nascimento inválida',
              () =>
                calculaIdade(data.birthdate.split('/').reverse().join('-')) <=
                  115 || data.birthdate === '',
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
            .test('', 'Salário inválido.', () => salarioValue <= 100000)
            .required('Campo obrigatório'),
          pctContribuicaoSup: Yup.number().test(
            '',
            'Percentual inválido. Escolha no máximo 100%',
            () => pctCtbSup <= 100,
          ),
        })

        await schema.validate(data, { abortEarly: false })

        setUserData({
          ...userData,
          birthdate: bday,
        })

        setUserDetails({
          ...userDetails,
          salario: salarioValue,
          contribuicaoBasica: vlrCtbBasica,
          contribuicaoPatrocinadora: vlrCtbPatrocinadora,
          pctContribuicaoBasica: pctCtbBas * 1,
          contribuicaoSuplementar: vlrCtbSup,
          pctContribuicaoSuplementar: pctCtbSup * 1,
          years: anosContrib2,
          age: idadeApos,
        })

        history.push('/simulation')
      } catch (err) {
        formRef.current?.setErrors(
          getValidationErrors(err as Yup.ValidationError),
        )
      }
    },
    [
      history,
      idadeApos,
      pctCtbSup,
      salarioValue,
      setUserData,
      setUserDetails,
      userData,
      userDetails,
      vlrCtbBasica,
      vlrCtbPatrocinadora,
      vlrCtbSup,
      pctCtbBas,
    ],
  )

  const handleClick = useCallback(() => {
    formRef.current?.submitForm()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    localStorage.removeItem('@Funssest:flagAssistencial')
    localStorage.removeItem('@Funssest:flagTubarao')
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{
            age: userDetails.age,
            salario:
              userDetails.salario === undefined
                ? ''
                : ValorMascarar(userDetails.salario.toFixed(2).toString()),
            birthdate:
              userData.birthdate === undefined
                ? ''
                : userData.birthdate.toString().split('-').reverse().join('/'),
            pctContribuicaoSup: pctCtbSup,
          }}
        >
          <Content>
            <strong>Simulação de Contribuição Básica</strong>
            <p>
              Será descontada mensalmente de sua folha de pagamento. A empresa
              também fará a contribuição no mesmo valor.
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
              value={idadeApos}
              min={50}
              sufix="anos"
              placeholder="Qual a idade desejada para a aposentadoria?"
              onChange={e => setIdadeApos(parseInt(e.target.value, 10))}
            />
            <Input
              icon={FiDollarSign}
              name="salario"
              mask="currency"
              type="text"
              placeholder="Qual o seu salário (R$)?"
              onChange={e => mudarSalario(e.target.value)}
            />

            <Line />

            <InfoContent>
              <div>
                <p>Valor da contribuição básica do Participante: </p>
                <strong>{formatValue(vlrCtbBasica)}</strong>
              </div>
              <div>
                <p>Valor da contribuição básica da Patrocinadora: </p>
                <strong>{formatValue(vlrCtbPatrocinadora)}</strong>
              </div>
              <div>
                <div>
                  <p>Valor total de contribuição básica ao Plano: </p>
                  <small>(participante + patrocinadora)</small>
                </div>
                <strong>{formatValue(vlrCtbTotal)}</strong>
              </div>
            </InfoContent>
          </Content>
          <>
            <Content>
              <strong>Simulação de Aporte Voluntário</strong>
              <Input
                icon={FiPercent}
                name="pctContribuicaoSup"
                // mask="percent"
                type="number"
                placeholder="Qual percentual de aporte voluntário?"
                onChange={e => handleChangePctSup(e.target.value)}
              />

              <Line />

              <InfoContent>
                <div>
                  <p>Valor total de aporte voluntário ao plano: </p>
                  <strong>{formatValue(vlrCtbSup)}</strong>
                </div>
              </InfoContent>
            </Content>

            <Content>
              <InfoContent>
                <div>
                  <div>
                    <h3>Valor total de contribuição ao Plano: </h3>
                    <small>(participante + patrocinadora + voluntário)</small>
                  </div>
                  <strong>
                    {formatValue(
                      isNaN(vlrCtbTotal) ? 0 : vlrCtbTotal + vlrCtbSup,
                    )}
                  </strong>
                </div>
              </InfoContent>
            </Content>
          </>
        </Form>

        <Button color="orange" onClick={handleClick} width="large">
          Simular valores
          <FiArrowRightCircle size={45} />
        </Button>
      </Container>
    </>
  )
}

export default BemVindo
