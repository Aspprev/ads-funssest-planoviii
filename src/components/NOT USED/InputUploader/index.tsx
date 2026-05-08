import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFiles } from '../../../context/files'

interface FileUploaderProps {
  onFileUploaded: (files: File[]) => void
}

const InputUploader: React.FC<FileUploaderProps> = ({ onFileUploaded }) => {
  const { handleUpload } = useFiles()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      onFileUploaded(acceptedFiles)
      handleUpload(acceptedFiles)
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
