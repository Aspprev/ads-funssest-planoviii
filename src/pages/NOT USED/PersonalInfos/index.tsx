/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
import React, { useCallback, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import moment from 'moment'
import * as Yup from 'yup'

import { FiCalendar, FiSmartphone, FiMail, FiUser } from 'react-icons/fi'
import { FaFemale } from 'react-icons/fa'
import { MdSecurity } from 'react-icons/md'

import getValidationErrors from '../../../utils/getValidationErrors'
import usePersistedState from '../../../hooks/usePersistedState'
import validaCPF from '../../../utils/validaCPF'

import Button from '../../../components/Button'
import Header from '../../../components/Header'
import Input from '../../../components/Input'

import { UserData } from '../../../utils/interfaces'
import { Container, Content, Line } from './styles'
import InputSelect from '../../../components/InputSelect'

const PersonalInfos: React.FC = () => {
  const [userData, setUserData] = usePersistedState<UserData>(
    'userData',
    {} as UserData,
  )

  const [patrocinadora, setPatrocinadora] = useState({ label: '', value: '' })

  const history = useHistory()
  const formRef = useRef<FormHandles>(null)

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string()
            .required('Seu nome é obrigatório.')
            .min(3, 'Digite o nome completo'),
          cpf: Yup.string()
            .required('Digite o CPF do titular')
            .test(
              '',
              'CPF inválido',
              () =>
                validaCPF(data.cpf.replaceAll('.', '').replace('-', '')) ||
                data.cpf === '',
            ),
          admission: Yup.string()
            .required('Data de admissão obrigatória')
            .test(
              '',
              'A data de admissão não pode ser maior que hoje.',
              () =>
                moment() >
                  moment(data.admission.split('/').reverse().join('-')) ||
                data.admission === '',
            )
            .test(
              '',
              'Data de admissão inválida',
              () =>
                moment(
                  data.admission.split('/').reverse().join('-'),
                ).isValid() || data.admission === '',
            ),
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          phone: Yup.string()
            .max(15, 'Telefone inválido')
            .required('Celular obrigatório'),
          parental: Yup.string()
          .required('Nome da mãe é obrigatório.')
          .min(3, 'Digite o nome completo da mãe'),
          patrocinadora: Yup.string().required('Patrocinadora é obrigatória'),
        })

        await schema.validate(data, { abortEarly: false })

        const aa = data.admission
        const dia = aa.split('/')[0]
        const mes = aa.split('/')[1]
        const ano = aa.split('/')[2]

        const dataForm = `${ano}-${`0${mes}`.slice(-2)}-${`0${dia}`.slice(-2)}`

        await setUserData({
          ...userData,
          name: data.name,
          cpf: data.cpf,
          admission: dataForm,
          email: data.email,
          phone: data.phone,
          patrocinadora: patrocinadora.value,
          parental: data.parental,
        })

        // history.push('/taxation')
        history.push('/pep-fatca')
      } catch (err) {
        formRef.current?.setErrors(getValidationErrors(err))
      }
    },
    [history, setUserData, userData, patrocinadora.value],
  )

  const [dtAdm, setDtAdm] = useState(
    userData.admission
      ? userData.admission.split('-').reverse().join('-').replaceAll('-', '/')
      : '',
  )

  const handleOnKeyDown = useCallback(e => {
    if (e.which === 8) {
      let val = e.target.value
      if (val.length === 3 || val.length === 6) {
        val = val.slice(0, val.length - 1)
        setDtAdm(val)
      }
    }
  }, [])

  const handleOnChange = useCallback(
    e => {
      let val = e.target.value
      if (val.length === 2) {
        val += '/'
      } else if (val.length === 5) {
        val += '/'
      } else if (val.length > 10) {
        val = dtAdm
      }
      setDtAdm(val)
    },
    [dtAdm, setDtAdm],
  )

  const handleChangePatrocinadora = useCallback(e => {
    const t = e
    setPatrocinadora(t)
  }, [])

  const handleConfirmar = useCallback(() => {
    formRef.current?.submitForm()
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content>
          <strong>Informe seus dados para prosseguir:</strong>

          <Form ref={formRef} onSubmit={handleSubmit} initialData={userData}>
            <Input name="name"
              placeholder="Nome Completo"
              icon={FiUser}
              value={userData.name}
            />
            <Input
              placeholder="CPF"
              name="cpf"
              icon={MdSecurity}
              type="tel"
              mask="cpf"
              value={userData.cpf}
            />
            <Input
              icon={FiCalendar}
              name="admission"
              value={dtAdm}
              placeholder="Data de Admissão"
              min="1930-01-01"
              max={new Date().toISOString().split('T')[0]}
              onChange={e => handleOnChange(e)}
              onKeyDown={e => handleOnKeyDown(e)}
            />
            <Input
              name="phone"
              mask="phone"
              prefix="+55 | "
              placeholder="Celular com DDD"
              icon={FiSmartphone}
              value={userData.phone}
            />
            <Input
              icon={FiMail}
              name="email"
              id="email"
              type="email"
              placeholder="E-mail"
              maxLength={150}
              value={userData.email}
            />
            <Input name="parental"
              placeholder="Nome Completo da Mãe"
              icon={FaFemale}
              value={userData.parental}
            />
            <InputSelect
              name="patrocinadora"
              value={patrocinadora}
              options={[
                { label: 'AcelorMittal', value: '2' },
                { label: 'FUNSSEST', value: '3' },
              ]}
              onChange={e => handleChangePatrocinadora(e)}
              placeholder="Patrocinadora"
            />
          </Form>

          <Line />

          <small>
            Alguns dados pessoais foram recebidos do seu empregador para cumprimento
            de obrigação legal de ofertas deste plano. Caso necessite retificar estes dados,
            favor contatar o seu empregador.
          </small>
        </Content>

        <Button type="submit" color="orange" onClick={handleConfirmar}>
          Próximo
        </Button>
      </Container>
    </>
  )
}

export default PersonalInfos
