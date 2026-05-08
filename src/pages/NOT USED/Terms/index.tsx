import React, { useCallback, useRef } from 'react'

import { FiCheck } from 'react-icons/fi'

import { useHistory } from 'react-router-dom'
import { Base64 } from 'js-base64'
import api from '../../../services/api'
import { Container, Footer, Content, ButtonReject } from './styles'
import Header from '../../../components/Header'
import Button from '../../../components/Button'
import usePersistedState from '../../../hooks/usePersistedState'

interface UserData {
  name: string
  phone: string
  cpf: string
}

interface UserDetails {
  email: string
  birthdate: Date
  contribution: number
  years: number
  bestDayPayment: number
  paymentType: string
}

interface FormToken {
  token: string
}

const Terms: React.FC = () => {
  const [acceptFinalTerms, setAcceptFinalTerms] = usePersistedState(
    'acceptFinalTerms',
    false,
  )
  const [userData, setUserData] = usePersistedState<UserData>(
    'userData',
    {} as UserData,
  )
  const [userDetails, setUserDetails] = usePersistedState<UserDetails>(
    'userDetails',
    {} as UserDetails,
  )
  const [token, setToken] = usePersistedState<FormToken>(
    'token',
    {} as FormToken,
  )

  const history = useHistory()

  const handleAcceptFinalTerms = useCallback(async () => {
    try {
      let telTrat = userData.phone.replace('(', '')
      telTrat = telTrat.replace(')', '')
      telTrat = telTrat.replace(' ', '')
      telTrat = telTrat.replace('-', '')

      let cpfTrat = userData.cpf.replace('.', '')
      cpfTrat = cpfTrat.replace('.', '')
      cpfTrat = cpfTrat.replace('-', '')

      console.log('entrou')
      const parametros = Base64.encode(
        `{
        "token": "${token}",
        "nome": "${userData.name}",
        "cpf": "${cpfTrat}",
        "nascimento": "${userDetails.birthdate}",
        "email": "${userDetails.email}",
        "telefone": "55${telTrat}",
        "valor": "${userDetails.contribution}"
        }`,
      )

      const parametrosFinal = Base64.encode(parametros)

      await api
        .post(`wsAdesao.rule?sys=ADZ&Entrada=${parametrosFinal}`)
        .then(res => console.log('deu bom hein'))
        .catch(err => console.log(err.err))
      console.log('bbbbb')
    } catch {
      console.log('aaaaa')
    }

    setAcceptFinalTerms(true)

    history.push('/end')
  }, [history, setAcceptFinalTerms])

  const handleScroll = useCallback(() => console.log('scroll!'), [])

  return (
    <>
      <Header>Pronto! Falta bem pouquinho, confirme os termos abaixo:</Header>
      <Container>
        <p>Termos de serviço</p>
        <Content onScroll={handleScroll}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            commodo libero consequat, posuere ex id, ultricies leo. Ut
            pellentesque gravida dolor, id convallis est hendrerit a. Duis ac
            imperdiet odio. Cras nibh arcu, sagittis vel neque non, venenatis
            varius ligula. Duis accumsan nulla tincidunt, molestie leo eu,
            mollis sapien. In elit tortor, blandit eu lectus a, vulputate
            faucibus nisi. Praesent lectus leo, luctus in risus sit amet,
            feugiat accumsan purus. Phasellus euismod neque sit amet dolor
            pretium vulputate. Donec et sollicitudin diam. Mauris mattis odio
            nulla. Duis dignissim sapien pulvinar tellus laoreet, et posuere
            urna ultrices. Nam non sollicitudin augue. In eu vulputate justo.
          </p>
          <p>
            Vestibulum rhoncus feugiat tellus. Suspendisse vitae vehicula felis,
            in iaculis sem. Aenean dictum posuere semper. Vivamus feugiat auctor
            sagittis. Donec sed leo lobortis, dapibus felis sed, tincidunt dui.
            Aliquam tristique, quam vitae ornare semper, leo mi tempor justo, a
            facilisis mi leo ut nisi. Donec aliquet malesuada aliquet.
          </p>
          <p>
            Class aptent taciti sociosqu ad litora torquent per conubia nostra,
            per inceptos himenaeos. Sed eleifend lectus et viverra dictum. Fusce
            suscipit sollicitudin mi, id bibendum lectus. Phasellus vulputate
            nunc quam, vel mollis erat placerat non. Quisque fringilla libero et
            egestas sollicitudin. Integer sit amet ipsum sed ex tincidunt
            tincidunt venenatis vitae magna. Aliquam et molestie dui, ac
            interdum nunc. Aenean consequat turpis orci, vel efficitur leo
            viverra vitae. Nullam blandit nisi et porttitor tempor. Nunc
            vehicula, diam id maximus ornare, tellus massa aliquam nisi, ut
            faucibus elit tortor at magna. Aenean in urna luctus, sollicitudin
            velit ac, bibendum magna. Praesent at tellus lacus. Nulla magna
            nunc, laoreet non nunc et, suscipit tincidunt augue. Etiam at
            consectetur leo. Nunc nec quam purus. Fusce neque justo, accumsan id
            dictum at, eleifend ac diam.
          </p>
          <p>
            Duis vestibulum, magna eu varius laoreet, ligula erat aliquam arcu,
            ac dictum eros ipsum et nisi. Suspendisse vitae magna condimentum,
            ullamcorper lectus sed, luctus tellus. Maecenas maximus accumsan
            risus a dictum. Nam a lectus enim. Phasellus condimentum tellus at
            sem molestie fringilla sit amet id sapien. Curabitur eu est posuere
            nisl cursus rhoncus sed sit amet quam. Donec eget blandit urna.
            Proin eu metus nisi.
          </p>
          <p>
            Nulla accumsan et mauris a posuere. Vivamus facilisis eget risus
            eget aliquam. Suspendisse eget justo in risus fringilla pretium.
            Aenean ac aliquet orci, sed hendrerit justo. Nunc venenatis eros ut
            efficitur consectetur. Etiam in magna sit amet magna interdum
            ullamcorper. Praesent euismod massa vel magna dictum condimentum. In
            leo nisi, dignissim nec ex in, fermentum sollicitudin arcu. Integer
            sodales faucibus risus ut mattis. Ut ac dapibus nisi, nec egestas
            dui. Pellentesque dictum nunc quis libero tempus, non rutrum enim
            condimentum. Praesent at risus fermentum, semper ex nec, faucibus
            felis. Maecenas feugiat pulvinar dui sed placerat.
          </p>
          <p>
            Mauris a blandit lectus. Proin consectetur, urna a molestie aliquet,
            magna nulla auctor tellus, interdum luctus turpis nisl sagittis
            sapien. Nulla sagittis metus in nunc laoreet, nec lobortis ipsum
            blandit. Maecenas facilisis metus non mauris semper, varius auctor
            odio varius. Sed quis ligula semper, mollis justo non, suscipit
            nisl. Praesent laoreet ligula nisl. Sed congue erat id sagittis
            pulvinar. Pellentesque suscipit ac nisi ut cursus. Integer bibendum
            efficitur mi, non aliquet nunc volutpat et. Fusce ultrices ut neque
            sit amet faucibus. In laoreet eget quam in faucibus. In at odio
            massa. Praesent ex metus, mattis in urna a, semper fermentum nulla.
            Maecenas congue dolor in urna feugiat, at porttitor ligula accumsan.
            Sed tortor dui, viverra non posuere eu, condimentum id lorem.
          </p>
          <p>
            Nam a orci nec libero sodales mattis. Donec at volutpat arcu, in
            porttitor leo. Nunc vehicula justo vel nibh congue mollis. Interdum
            et malesuada fames ac ante ipsum primis in faucibus. Aliquam viverra
            lobortis viverra. In luctus aliquam justo non molestie. Vestibulum
            at dui eget nulla commodo consequat quis faucibus metus. Phasellus
            ut leo ligula. Mauris varius fringilla magna id rhoncus. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Nullam a ultricies
            massa.
          </p>
          <p>
            Nunc risus ligula, feugiat non orci commodo, tempor tincidunt justo.
            Nunc vel sollicitudin nisl, id maximus lectus. Aliquam ultrices ante
            lobortis accumsan ullamcorper. Vestibulum condimentum nisi et tortor
            egestas, eget efficitur nibh mattis. Ut hendrerit aliquet nibh eget
            rutrum. Nullam ut sem et mi rutrum gravida. Orci varius natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Ut consectetur efficitur quam quis vestibulum. Vivamus cursus elit
            at nulla egestas, eget auctor nunc commodo. Aliquam quis justo in
            ante laoreet condimentum eget quis mauris. Cras vitae mollis enim.
            Phasellus ac ante vitae augue auctor luctus sed et velit. Morbi leo
            leo, mollis vitae dignissim eu, auctor vel tortor. Aenean efficitur
            turpis nisi, vitae tincidunt ipsum porta at. Sed convallis felis
            magna. Nam aliquam, felis quis pharetra vestibulum, orci mi
            malesuada nulla, eget feugiat lectus ligula eget quam.
          </p>
        </Content>
        <Footer>
          <Button
            type="button"
            color="green"
            width="large"
            onClick={handleAcceptFinalTerms}
          >
            <FiCheck size={30} />
            Aceito os termos
          </Button>
          <ButtonReject type="button" onClick={() => history.push('/help')}>
            Não aceito
          </ButtonReject>
        </Footer>
      </Container>
    </>
  )
}

export default Terms
