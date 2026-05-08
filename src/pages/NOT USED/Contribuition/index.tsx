/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useCallback, useState } from 'react'

import {
  FiClock,
  FiDollarSign,
  FiMinusCircle,
  FiPlusCircle,
} from 'react-icons/fi'

import Collapse from '@material-ui/core/Collapse'

import * as Yup from 'yup'

import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { useHistory } from 'react-router-dom'

import { AnnouncementTwoTone } from '@material-ui/icons'
import {
  Container,
  Content,
  BoxValue,
  BtnVoltar,
  LogoContent,
  TitleContent,
  BoxValueContent,
  BoxValueCheckContent,
  DivC,
  ButtonController,
  TextController,
} from './styles'

import Logo from '../../../components/Logo'
import usePersistedState from '../../../hooks/usePersistedState'
import Input from '../../../components/Input'
import InputSelect from '../../../components/InputSelect'

// import InputRange from '../../components/InputRange'

import Button from '../../../components/Button'
import {formatValue} from '../../../utils/formatValues'
import getValidationErrors from '../../../utils/getValidationErrors'
import { UserData, UserDetails } from '../../../utils/interfaces'
/*
interface UserData {
  cpf: string
  admission: Date
  name: string
  birthdate: string
  emailCorp: string
  emailP: string
  phoneFix: string
  phoneCel: string
  patrocinadora: string
}
interface UserDetails {
  salario: number
  contribuicaoBasica: number
  contribuicaoPatrocinadora: number
  pctContribuicaoBasica: number
  pctContribuicaoPatrocinadora: number
  contribuicaoSuplementar: number
  tipoContribuicaosuplementar: string
  pctContribuicaoSuplementar: number
  periodicidade: string
  years: number
  age: number
} */

const PersonalInfos: React.FC = () => {
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [UR] = useState(450)

  const [salarioValue, setSalarioValue] = useState(userDetails.salario)
  const [vlrCtbBasica, setVlrCtbBasica] = useState(
    userDetails.contribuicaoBasica,
  )
  const [vlrCtbPatrocinadora, setVlrCtbPatrocinadora] = useState(
    userDetails.contribuicaoPatrocinadora,
  )
  const [vlrCtbTotal, setVlrCtbTotal] = useState(
    userDetails.contribuicaoBasica * 2,
  )
  const [txtPct, setTxtPct] = useState(
    userDetails.pctContribuicaoBasica > 0
      ? userDetails.pctContribuicaoBasica
      : 12,
  )
  const [vis2, setVis2] = useState(true)

  const [pctCtbSup, setPctCtbSup] = useState(
    userDetails.pctContribuicaoSuplementar
      ? userDetails.pctContribuicaoSuplementar
      : 0,
  )
  const [vlrCtbSup, setVlrCtbSup] = useState(
    userDetails.contribuicaoSuplementar > 0
      ? userDetails.contribuicaoSuplementar
      : 0,
  )
  const [idadeApos, setIdadeApos] = useState(userDetails.age)

  const history = useHistory()

  const formRef = useRef<FormHandles>(null)

  const handleMudaContrib = useCallback(
    (pct, sal) => {
      const f1 = sal <= UR * 10 ? sal * 0.02 : UR * 10 * 0.02
      const vlrResidual = sal <= UR * 10 ? 0 : sal - UR * 10
      const f2 = vlrResidual === 0 ? 0 : vlrResidual * (pct / 100)
      // console.log(f1, vlrResidual, f2)
      setTxtPct(pct)
      if (sal <= UR) {
        setVlrCtbBasica(f1)
        setVlrCtbPatrocinadora(f1)
        setVlrCtbTotal(f1 * 2)
      } else {
        const aux = f1 + f2
        const teto = sal * 0.085
        const vlrP = aux >= teto ? teto : aux
        setVlrCtbBasica(aux)
        setVlrCtbPatrocinadora(vlrP)
        setVlrCtbTotal(aux + vlrP)
      }
    },
    [UR],
  )

  const minusContrib = useCallback(() => {
    // setTxtPct(txtPct - 1)
    handleMudaContrib(txtPct - 1, salarioValue)
  }, [handleMudaContrib, salarioValue, txtPct])
  const plusContrib = useCallback(() => {
    // setTxtPct(txtPct + 1)
    handleMudaContrib(txtPct + 1, salarioValue)
  }, [handleMudaContrib, salarioValue, txtPct])

  const handleMudaContribSup = useCallback(
    valor => {
      if (valor < 0 || valor > 50) {
        alert('O percentual da contribuição adicional deve estar entre 0 e 10')
      } else {
        const valueCSup = (salarioValue * valor) / 100
        setPctCtbSup(valor)
        setVlrCtbSup(valueCSup)
      }
    },

    [salarioValue],
  )

  const handleMudaVlrSup = useCallback(
    (valor, rest) => {
      if (valor < 0 || valor > rest) {
        const msg = `O valor da contribuição adicional deve estar entre 0 e ${formatValue(
          rest,
        )}`
        alert(msg)
      } else {
        const valueCSup = valor * 1
        setVlrCtbSup(valueCSup)
      }
    },

    [],
  )

  const mudarSalario = useCallback(
    valor => {
      const v = valor.replace(',', '').replaceAll('.', '')
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(v)) {
        setSalarioValue(salarioValue)
      } else {
        const m = Math.floor(v.length - 2)
        const a = `${v.substr(0, m)}.${v.substr(m)}`
        const f = parseFloat(a)
        setSalarioValue(f)
        handleMudaContrib(txtPct, f)
      }
    },
    [salarioValue, handleMudaContrib, txtPct],
  )

  const handleSubmit = useCallback(
    async (data: UserDetails) => {
      try {
        const now = new Date()
        const aa = userData.birthdate
        const ano = aa.split('-')[0]
        const mes = aa.split('-')[1]
        const dia = aa.split('-')[2]
        const dataForm = `${ano}-${`0${mes}`.slice(-2)}-${`0${dia}`.slice(-2)}`
        const idadeAtual = now.getFullYear() - parseInt(ano, 10)
        const anosContrib2 = idadeApos - (now.getFullYear() - parseInt(ano, 10))

        const idadeMinima = anosContrib2 < 5 ? idadeAtual + 5 : 50

        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          age: Yup.number()
            .required(
              'Digite a idade desejada para a aposentadoria para realizar a simulação',
            )
            .min(
              idadeMinima,
              `Idade inválida. Por favor, escolha uma idade igual ou superior a ${idadeMinima} anos`,
            ),
          salario: Yup.string().required('Campo obrigatório'),
        })

        await schema.validate(data, { abortEarly: false })

        setUserDetails({
          ...userDetails,
          salario: salarioValue,
          contribuicaoBasica: vlrCtbBasica,
          contribuicaoPatrocinadora: vlrCtbPatrocinadora,
          pctContribuicaoBasica: txtPct,
          contribuicaoSuplementar: vlrCtbSup,
          pctContribuicaoSuplementar: pctCtbSup,
          years: anosContrib2,
          age: idadeApos,
        })

        history.push('/simulation')
      } catch (err) {
        formRef.current?.setErrors(getValidationErrors(err))
      }
    },
    [
      history,
      idadeApos,
      pctCtbSup,
      salarioValue,
      setUserDetails,
      txtPct,
      userData.birthdate,
      userDetails,
      vlrCtbBasica,
      vlrCtbPatrocinadora,
      vlrCtbSup,
    ],
  )

  const handleClick = useCallback(() => {
    formRef.current?.submitForm()
  }, [])

  /*
  const validarContrib = useCallback(
    valor => {
      if (valor < 0 || valor > 2000) {
        alert('O valor da contribuição deve estar entre 0 e 2000')
        document.getElementById('contribution')?.focus()
      } else {
        setContribValue(valor)
      }
    },
    [setContribValue, contribValue],
  ) */
  /*
  useEffect(() => {
    changeFormContrib(salarioValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salarioValue])
*/

  const optionsArraySup = []
  for (let i = 1; i < 10; i += 1) {
    optionsArraySup.push({ label: `${i} %`, value: i })
  }

  const handleCangePctSup = useCallback(
    e => {
      const t = e
      setVis2(false)
      handleMudaContribSup(t.value)
    },
    [handleMudaContribSup],
  )

  return (
    <Container>
      <LogoContent>
        <div>
          <Logo />
        </div>
      </LogoContent>
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit} initialData={userDetails}>
          <BoxValue>
            <TitleContent>
              <strong>Contribuição básica</strong>
            </TitleContent>
            <BoxValueContent>
              <p>
                Aqui você irá definir a sua contribuição para o seu Plano de
                Previdência. O percentual definido será descontado mensalmente
                de seu salário base. A patrocinadora também fará contribuição
                para a formação do seu benefício futuro, no mesmo valor da sua
                contribuição básica, limitada a 8,5% do seu salário base.”
              </p>
            </BoxValueContent>
            <br />
            {/* <MainTitleContent>
              <div>
                <strong>Dados de contribuição</strong>
              </div>
              </MainTitleContent>
            <InputHidden name="salario" type="hidden" /> */}
            <DivC>
              <Input
                sizeBox="large"
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
                // value={formatValue(salarioValue)}
                icon={FiDollarSign}
                name="salario"
                mask="currency"
                type="text"
                placeholder="Qual o seu salário R$?"
                onChange={e => mudarSalario(e.target.value)}
              />
              {/* <Input
                name="teste"
                mask="currency"
                type="text"
                placeholder="teste"
                onChange={e => mudarSalario(e.target.value)}
              />
              <button
                type="button"
                disabled={salarioValue <= 0}
              >
                Calcular Contribuicao
              </button> */}
            </DivC>
            {/* <img src={wallet} alt="wallet" /> */}
            {/* <p>Quero investir:</p> */}
            <Collapse in={salarioValue > 1}>
              {salarioValue > UR * 10 ? (
                <>
                  <table>
                    <tr>
                      <td>
                        <label>Com quantos % você quer contribuir?</label>
                      </td>

                      <td>
                        <div>
                          <ButtonController
                            type="button"
                            disabled={txtPct <= 6}
                            isSelected={txtPct > 6}
                            onClick={() => minusContrib()}
                          >
                            <FiMinusCircle />
                          </ButtonController>
                          <TextController type="button" disabled>
                            {txtPct}%
                          </TextController>
                          <ButtonController
                            type="button"
                            disabled={txtPct >= 12}
                            isSelected={txtPct < 12}
                            onClick={() => plusContrib()}
                          >
                            <FiPlusCircle />
                          </ButtonController>
                        </div>
                      </td>
                    </tr>
                  </table>
                  <br />
                </>
              ) : (
                <></>
              )}
              {vlrCtbBasica >= 0 ? (
                <>
                  <table>
                    <tr>
                      <td>
                        <label>
                          Valor da contribuição básica do Participante:{' '}
                        </label>
                      </td>
                      <td>
                        <strong>{formatValue(vlrCtbBasica)}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>
                          Valor da contribuição básica da Patrocinadora:{' '}
                        </label>
                      </td>
                      <td>
                        <strong>{formatValue(vlrCtbPatrocinadora)}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>
                          Valor total de contribuição básica ao Plano:{' '}
                        </label>
                        <small>(participante + patrocinadora)</small>
                      </td>
                      <td>
                        <strong>{formatValue(vlrCtbTotal)}</strong>
                      </td>
                    </tr>
                  </table>
                </>
              ) : (
                <></>
              )}
              <br />
              {/* <DivC isVisible={!vis3}>
                <label onClick={handleTeste}>Continuar ↓</label>
              </DivC> */}
            </Collapse>
            {/* </BoxValue2> */}
            {/* <small>Valor mensal recorrente</small> */}
          </BoxValue>
          <br />
          <Collapse in={salarioValue > UR * 10 && txtPct >= 12}>
            <BoxValue>
              {vlrCtbBasica >= 0 ? (
                <>
                  <TitleContent>
                    <strong>Contribuição adicional</strong>
                  </TitleContent>
                  <BoxValueContent>
                    <p>
                      Para contribuir ainda mais com a formação da sua reserva,
                      cadastre contribuição adicional.
                    </p>
                  </BoxValueContent>

                  <InputSelect
                    name="pctContribuicaoSup"
                    value={{ label: `${pctCtbSup} %`, value: pctCtbSup }}
                    options={optionsArraySup}
                    onChange={e => handleCangePctSup(e)}
                    sizeBox="large"
                    placeholder="Com qual % você deseja contribuir na parcela do salário base que ultrapassa R$ 4.500,00?”"
                  />

                  <small>
                    A contribuição sumplementar também será descontada da sua
                    folha de pagamento mensalmente, deste valor não há
                    contrapartida da empresa.
                  </small>
                  <br />
                  <br />
                  <div>
                    <label>Valor da contribuição adicional: </label>
                    <strong>{formatValue(vlrCtbSup)}</strong>
                  </div>
                  <br />
                  {/* <BoxValue2> */}
                  <BoxValueCheckContent>
                    <div>
                      <input
                        type="checkbox"
                        checked={vis2}
                        onChange={e => {
                          setVis2(e.target.checked)
                          setPctCtbSup(0)
                          handleMudaContribSup(0)
                        }}
                      />
                      <label>
                        Não quero cadastrar uma contribuição adicional
                      </label>
                    </div>
                  </BoxValueCheckContent>

                  {/* </BoxValue2> */}
                </>
              ) : (
                <></>
              )}
            </BoxValue>
          </Collapse>
        </Form>
        <br />
        <br />
        <small>
          Está em dúvida? Não se preocupe, depois você poderá alterar este valor
          sempre que desejar.
        </small>
        <br />
        <br />

        <Button
          type="submit"
          color="blue"
          onClick={handleClick}
          disabled={vlrCtbTotal === 0 || (vlrCtbSup === 0 && !vis2)}
        >
          Continuar
        </Button>
        <BtnVoltar type="button" onClick={() => history.goBack()}>
          &lt; Anterior
        </BtnVoltar>
      </Content>
    </Container>
  )
}

export default PersonalInfos
