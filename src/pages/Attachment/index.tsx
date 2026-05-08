import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { toBase64 } from 'js-base64'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import usePersistedState from '../../hooks/usePersistedState'

import Button from '../../components/Button'
import Header from '../../components/Header'

import { UserData, ConfigData } from '../../utils/interfaces'
import { Container, Content, BtnVoltar } from './styles'
// import InputUploader from '../../components/InputUploader'
// import api from '../../services/api'
// import { convertImageToBits } from '../../utils/convertImageToBits'
// import Upload from '../../components/Upload'

const Attachment: React.FC = () => {
  const [configData] = usePersistedState<ConfigData>(
    'configData',
    {} as ConfigData,
  )
  const [userData] = usePersistedState<UserData>('userData', {} as UserData)
  // const [userFiles, setUserFiles] = usePersistedState<UserFiles>(
  //   'userFilesGroup',
  //   {} as UserFiles,
  // )
  const formRef = useRef<FormHandles>(null)
  const history = useHistory()

  // const [urlDocs] = useState(
  //   `http://192.1.0.52:8049/webrunstudio/form.jsp?sys=AUT_AUT_EFPC_PRD_STUDIO&formID=464569685&locale=pt_BR&cliente=${toBase64(
  //     codCliente.toString(),
  //   )};cpf=${toBase64(userData.cpf.replaceAll('.', '').replaceAll('-', ''))}`,
  // )
  // const [urlDocs] = useState(
  //   `https://portal.universalprev.com.br/form.jsp?sys=AUT&formID=464569685&locale=pt_BR&cliente=${toBase64(
  //     configData.codCliente.toString(),
  //   )};cpf=${toBase64(userData.cpf.replaceAll('.', '').replaceAll('-', ''))}`,
  // )

  const [urlDocs] = useState(
    `http://efpc.universalprev.com.br/form.jsp?sys=AUT&formID=464569685&locale=pt_BR&cliente=${toBase64(
      configData.codCliente.toString(),
    )};cpf=${toBase64(userData.cpf.replaceAll('.', '').replaceAll('-', ''))}`,
  )
  // http://efpc.universalprev.com.br/

  const handleSubmit = useCallback(async () => {
    history.push('/new-participant')
  }, [history])

  /* const handleFileUpload = useCallback(
    async (files: File) => {
      // Aqui você pode enviar o arquivo para o servidor
      // console.log('Arquivo carregado:', files)
      // setUserFiles(file)
      const formData = new FormData()
      formData.append('file', files)

      const blobArquivo = new Blob([files], { type: files.type })
      // console.log(files.type)

      // const file = files.files[0]
      // convertImageToBits(files)
      //   .then(imageData => {
      //     console.log(
      //       `Imagem ${imageData.name} convertida em bits:`,
      //       imageData.data,
      //     )
      //   })
      //   .catch(error => {
      //     console.error(error)
      //   })

      const config = {
        headers: {
          'content-type': files.type,
        },
        body: {
          token: configData.token,
          versao: configData.tipo,
          plano: configData.plano,
          cliente: configData.codCliente,
          cpf: userData.cpf.replaceAll('.', '').replace('-', ''),
        },
      }
      const params = {
        sys: 'ADZ',
      }
      const data = {
        token: configData.token,
        versao: configData.tipo,
        plano: configData.plano,
        cliente: configData.codCliente,
        cpf: userData.cpf.replaceAll('.', '').replace('-', ''),
      }

      const parametros = Base64.encode(
        `{"token": "${configData.token}",
          "versao":"${configData.tipo}",
          "plano": "${configData.plano}",
          "cliente":"${configData.codCliente}",
          "cpf":"${userData.cpf.replaceAll('.', '').replace('-', '')}"}`,
      )
      const parametrosFinal = Base64.encode(parametros)
      await api
        .post(`wsDocumento.rule`, data, { params })
        .then(res => console.log(res))
        .catch(erro => console.log(erro))
      // `wsDocumento.rule?sys=ADZ&Entrada=${parametrosFinal}`,

      / * const axios = require('axios')
      const data = `${blobArquivo}`

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://192.1.0.52:2020/webrunstudio/wsDocumento.rule?sys=ADZ',
        headers: {
          'Content-Type': 'text/plain',
        },
        data,
      }

      axios.request(config)
      // .then(res => {
      //   console.log(JSON.stringify(res.data))
      // })
      // .catch(error => {
      //   console.log(error)
      // }) * /
    },
    [configData, userData],
  ) */

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  const handleClick = useCallback(() => {
    formRef.current?.submitForm()
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Content>
            <strong>Anexar documentos</strong>
            <p>
              Insira abaixo os documentos para validarmos sua adesão ao Plano V.
            </p>
            <iframe src={urlDocs} title="Anexar documentos" />
            <small>
              O upload de documentos está otimizado para os navegadores Google
              Chrome e Mozilla Firefox.
            </small>
            {/* <Line />
            <div>
              <h1>Upload de arquivo</h1>
              <InputUploader onFileUploaded={handleFileUpload} />
            </div> */}
            {/* <Line />
            <Upload /> */}
          </Content>
        </Form>
        <Button type="button" color="orange" onClick={handleClick}>
          Continuar
        </Button>
        <BtnVoltar type="button" onClick={() => history.goBack()}>
          &lt; Anterior
        </BtnVoltar>
      </Container>
    </>
  )
}

export default Attachment
