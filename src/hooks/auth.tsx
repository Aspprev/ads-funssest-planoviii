import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import api from '../services/api'
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '../utils/storage'

interface AuthState {
  token: string
  user: {
    id: string
    name: string
    email: string
    cpf: string
    birthdate: string
    phone: string
    referenceCode: string
    avatar: string
  }
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: {
    id: string
    name: string
    email: string
    cpf: string
    birthdate: string
    phone: string
    referenceCode: string
    avatar: string
  }

  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
  updateProfile(user: AuthContextData['user']): void
}

function decodeTokenPayload(token: string): { exp?: number; iat?: number } {
  try {
    const [, payload = ''] = token.split('.')
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = window.atob(normalized)

    return JSON.parse(decoded)
  } catch {
    return {}
  }
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider = ({
  children,
}: React.PropsWithChildren): React.JSX.Element => {
  const [expired, setExpired] = useState(false)
  const [data, setData] = useState<AuthState>(() => {
    const token = getStorageItem('authToken', ['@BRFPrev:token'])
    const user = getStorageItem('authUser', ['@BRFPrev:user'])

    if (token && user) {
      const { exp = 0 } = decodeTokenPayload(token)

      // o token está expirado.
      if (Date.now() > exp * 1000) {
        setExpired(true)
        return {} as AuthState
      }

      api.defaults.headers.Authorization = `Bearer ${token}`
      return { token, user: JSON.parse(user) }
    }
    return {} as AuthState
  })

  const signIn = useCallback(async ({ email, password }): Promise<void> => {
    const response = await api.post('/sessions', {
      email,
      password,
    })

    const { token, user } = response.data

    setStorageItem('authToken', token)
    setStorageItem('authUser', JSON.stringify(user))

    setData({ token, user })

    api.defaults.headers.Authorization = `Bearer ${token}`
  }, [])

  const updateProfile = useCallback(
    (newUser: AuthContextData['user']): void => {
      if (newUser.id === data?.user?.id) {
        setStorageItem('authUser', JSON.stringify(newUser))

        setData({ token: data.token, user: newUser })
      }
    },
    [data],
  )

  const signOut = useCallback((): void => {
    removeStorageItem('authToken', ['@BRFPrev:token'])
    removeStorageItem('authUser', ['@BRFPrev:user', '@BRFsPrev:user'])
    setData({} as AuthState)

    setExpired(false)
  }, [])

  useEffect(() => {
    if (expired) {
      signOut()
    }
  }, [expired, signOut])

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
