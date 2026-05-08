import { AxiosError } from 'axios'
import { History } from 'history'
import { ErroProps } from './interfaces'

type PersistError = (value: ErroProps) => void

const DEFAULT_ERROR: ErroProps = {
  title: 'Erro ao processar a solicitação',
  description: 'Ops, algo deu errado. Tente novamente mais tarde.',
}

const timeoutMessages = new Set([
  'ECONNABORTED',
  'ETIMEDOUT',
])

export function getApiErrorPayload(error: unknown): AxiosError<Record<string, unknown>> | null {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    return error as AxiosError<Record<string, unknown>>
  }

  return null
}

export function buildApiErrorProps(error: unknown): ErroProps {
  const axiosError = getApiErrorPayload(error)

  if (!axiosError) {
    return DEFAULT_ERROR
  }

  if (
    axiosError.code === 'ERR_NETWORK' ||
    axiosError.message === 'Network Error'
  ) {
    return {
      title: 'Falha de conexão',
      description: 'Não foi possível se comunicar com o servidor. Verifique sua conexão e tente novamente.',
    }
  }

  if (
    axiosError.code === 'ECONNABORTED' ||
    timeoutMessages.has(axiosError.code ?? '') ||
    axiosError.response?.status === 408
  ) {
    return {
      title: 'Tempo de resposta esgotado',
      description: 'Sua sessão expirou ou a resposta demorou demais. Tente novamente.',
    }
  }

  if ((axiosError.response?.status ?? 0) >= 500) {
    return {
      title: 'Erro interno no servidor',
      description: axiosError.message,
    }
  }

  const responseData = axiosError.response?.data ?? {}
  const titulo = responseData.titulo
  const descricao = responseData.descricao
  const codigo = responseData.codigo

  if (typeof titulo === 'string' || typeof descricao === 'string') {
    return {
      title: typeof titulo === 'string' ? titulo : DEFAULT_ERROR.title,
      description:
        typeof descricao === 'string'
          ? typeof codigo === 'string' || typeof codigo === 'number'
            ? `${descricao} (cód. ${codigo})`
            : descricao
          : DEFAULT_ERROR.description,
    }
  }

  return DEFAULT_ERROR
}

export function persistErrorAndRedirect(
  history: History,
  persistError: PersistError,
  error: unknown,
): void {
  persistError(buildApiErrorProps(error))
  history.push('/erro')
}
