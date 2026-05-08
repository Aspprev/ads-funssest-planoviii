import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toBase64 } from 'js-base64'
import usePersistedState from '../../hooks/usePersistedState'
import useConfigData from '../../hooks/useConfigData'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import { sanitizeCpf, scrollToTop } from '../../utils/browser'
import { UserData } from '../../utils/interfaces'

const Attachment: React.FC = () => {
  const [configData] = useConfigData()
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  const history = useHistory()

  const [urlDocs] = useState(
    `http://efpc.universalprev.com.br/form.jsp?sys=AUT&formID=464569685&locale=pt_BR&cliente=${toBase64(
      configData.codCliente.toString(),
    )};cpf=${toBase64(sanitizeCpf(userData.cpf))}`,
  )

  const handleSubmit = useCallback(() => {
    history.push('/new-participant')
  }, [history])

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout>
      <PageCard className="flex flex-col items-center text-center">
        <strong className="mb-4 flex justify-center text-lg text-brand-400">
          Anexar documentos
        </strong>
        <p>Insira abaixo os documentos para validarmos sua adesão ao Plano VIII.</p>
        <iframe
          className="my-5 h-50 w-full border-0 outline-none"
          src={urlDocs}
          title="Anexar documentos"
        />
        <small className="mt-4">
          O upload de documentos está otimizado para os navegadores Google
          Chrome e Mozilla Firefox.
        </small>
      </PageCard>
      <Button type="button" color="orange" onClick={handleSubmit}>
        Continuar
      </Button>
      <BackButton type="button" onClick={() => history.goBack()}>
        &lt; Anterior
      </BackButton>
    </PageLayout>
  )
}

export default Attachment
