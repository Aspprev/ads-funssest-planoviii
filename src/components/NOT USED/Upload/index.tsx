import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFiles } from '../../../context/files'
import { cn } from '../../../lib/cn'

const Upload: React.FC = () => {
  const { handleUpload } = useFiles()

  const onDrop = useCallback(
    (files: File[]) => {
      handleUpload(files)
    },
    [handleUpload],
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
  })

  const renderDragMessage = useCallback(() => {
    if (!isDragActive) {
      return (
        <p className="flex items-center justify-center py-4 text-[#999999]">
          Arraste imagens aqui...
        </p>
      )
    }

    if (isDragReject) {
      return (
        <p className="flex items-center justify-center py-4 text-[#e57878]">
          Tipo de arquivo não suportado
        </p>
      )
    }

    return (
      <p className="flex items-center justify-center py-4 text-[#78e5d5]">
        Solte as imagens aqui
      </p>
    )
  }, [isDragActive, isDragReject])

  return (
    <div
      {...getRootProps()}
      className={cn(
        'cursor-pointer rounded border border-dashed border-[#dddddd] transition-[height]',
        isDragActive && 'border-[#78e5d5]',
        isDragReject && 'border-[#e57878]',
      )}
    >
      <input {...getInputProps()} />
      {renderDragMessage()}
    </div>
  )
}

export default Upload
