import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFiles } from '../../context/files'
import { UserData, UserFiles, ConfigData } from '../../utils/interfaces'
import usePersistedState from '../../hooks/usePersistedState'
import api from '../../services/api'

interface FileUploaderProps {
  onFileUploaded: (file: File) => void
}

const InputUploader: React.FC<FileUploaderProps> = ({ onFileUploaded }) => {
  const { handleUpload } = useFiles()
  const [configData, setConfigData] = usePersistedState<ConfigData>(
    'configData',
    {} as ConfigData,
  )

  const onDrop = useCallback(
    async acceptedFiles => {
      // `acceptedFiles` é um array de objetos File
      onFileUploaded(acceptedFiles.map((a: any) => a))

      // console.log(acceptedFiles.map((a: any) => a))

      handleUpload(acceptedFiles)

      // console.log(
      //   'oi',
      //   acceptedFiles.map((a: any) => a),
      // )
    },
    [handleUpload, onFileUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Arraste o arquivo aqui</p>
      ) : (
        <p>Clique aqui para fazer o upload do arquivo</p>
      )}
    </div>
  )
}

export default InputUploader
