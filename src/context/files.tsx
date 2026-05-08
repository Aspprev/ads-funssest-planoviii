/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/interface-name-prefix */
import { filesize } from 'filesize'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AxiosProgressEvent } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import api from '../services/api'

export interface IPost {
  _id: string
  name: string
  size: number
  key: string
  url: string
}

export interface IFile {
  id: string
  name: string
  size?: number
  readableSize: string
  uploaded?: boolean
  preview: string
  file: File | null
  progress?: number
  error?: boolean
  url: string
}

interface IFileContextData {
  uploadedFiles: IFile[]
  deleteFile(id: string): void
  handleUpload(files: File[]): void
}

const FileContext = createContext<IFileContextData>({} as IFileContextData)

const isBlobPreview = (preview: string): boolean =>
  preview.startsWith('blob:')

const FileProvider = ({
  children,
}: React.PropsWithChildren): React.JSX.Element => {
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([])

  useEffect(() => {
    api.get<IPost[]>('posts').then(response => {
      const postFormatted: IFile[] = response.data.map(post => ({
        ...post,
        id: post._id,
        preview: post.url,
        readableSize: filesize(post.size),
        file: null,
        error: false,
        uploaded: true,
      }))

      setUploadedFiles(postFormatted)
    })
  }, [])

  useEffect(
    () => () => {
      uploadedFiles.forEach(file => {
        if (isBlobPreview(file.preview)) {
          URL.revokeObjectURL(file.preview)
        }
      })
    },
    [uploadedFiles],
  )

  const updateFile = useCallback(
    (id: string, data: Partial<IFile>) => {
      setUploadedFiles(state =>
        state.map(file => (file.id === id ? { ...file, ...data } : file)),
      )
    },
    [],
  )

  const processUpload = useCallback(
    (uploadedFile: IFile) => {
      const data = new FormData()

      if (uploadedFile.file) {
        data.append('file', uploadedFile.file, uploadedFile.name)
      }

      api
        .post('posts', data, {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const total = progressEvent.total || uploadedFile.size || 0

            if (total <= 0) {
              updateFile(uploadedFile.id, { progress: 100 })
              return
            }

            const progress = Math.round((progressEvent.loaded * 100) / total)
            updateFile(uploadedFile.id, { progress })
          },
        })
        .then(response => {
          updateFile(uploadedFile.id, {
            uploaded: true,
            id: response.data._id,
            url: response.data.url,
            progress: 100,
          })
        })
        .catch(err => {
          console.error(
            `Houve um problema ao fazer upload da imagem ${uploadedFile.name} para o servidor.`,
          )
          console.error(err)

          updateFile(uploadedFile.id, {
            error: true,
          })
        })
    },
    [updateFile],
  )

  const handleUpload = useCallback(
    (files: File[]) => {
      const newUploadedFiles: IFile[] = files.map(file => ({
        file,
        id: uuidv4(),
        name: file.name,
        size: file.size,
        readableSize: filesize(file.size),
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
        error: false,
        url: '',
      }))

      setUploadedFiles(state => state.concat(newUploadedFiles))
      newUploadedFiles.forEach(processUpload)
    },
    [processUpload],
  )

  const deleteFile = useCallback((id: string) => {
    setUploadedFiles(state => {
      const fileToDelete = state.find(file => file.id === id)

      if (fileToDelete?.uploaded) {
        api.delete(`posts/${id}`)
      }

      if (fileToDelete && isBlobPreview(fileToDelete.preview)) {
        URL.revokeObjectURL(fileToDelete.preview)
      }

      return state.filter(file => file.id !== id)
    })
  }, [])

  const contextValue = useMemo(
    () => ({ uploadedFiles, deleteFile, handleUpload }),
    [deleteFile, handleUpload, uploadedFiles],
  )

  return (
    <FileContext.Provider value={contextValue}>{children}</FileContext.Provider>
  )
}

function useFiles(): IFileContextData {
  const context = useContext(FileContext)

  if (!context) {
    throw new Error('useFiles must be used within FileProvider')
  }

  return context
}

export { FileProvider, useFiles }
