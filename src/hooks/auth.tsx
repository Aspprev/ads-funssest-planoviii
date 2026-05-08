import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react'

import { decode } from 'jsonwebtoken'

import api from '../services/api'

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

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider: React.FC = ({ children }) => {
  const [expired, setExpired] = useState(false)
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@BRFPrev:token')
    const user = localStorage.getItem('@BRFPrev:user')

    if (token && user) {
      const { exp } = decode(token) as { exp: number | 0; iat: number | 0 }

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

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', {
      email,
      password,
    })

    const { token, user } = response.data

    localStorage.setItem('@BRFPrev:token', token)
    localStorage.setItem('@BRFPrev:user', JSON.stringify(user))

    setData({ token, user })

    api.defaults.headers.Authorization = `Bearer ${token}`
  }, [])

  const updateProfile = useCallback(
    (newUser: AuthContextData['user']) => {
      if (newUser.id === data?.user?.id) {
        localStorage.setItem('@BRFPrev:user', JSON.stringify(newUser))

        setData({ token: data.token, user: newUser })
      }
    },
    [data],
  )

  const signOut = useCallback(() => {
    localStorage.removeItem('@BRFPrev:token')
    localStorage.removeItem('@BRFsPrev:user')
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
