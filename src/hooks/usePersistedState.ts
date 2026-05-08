import { useCallback, useRef, useState, Dispatch, SetStateAction } from 'react'
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '../utils/storage'

type Response<T> = [
  T,
  Dispatch<SetStateAction<T>>
]

function usePersistedState<T>(key: string, initialState: T): Response<T> {
  const [state, setState] = useState(() => {
    const storedValue = getStorageItem(key)

    if (storedValue) {
      try {
        return JSON.parse(storedValue) as T
      } catch {
        removeStorageItem(key)
      }
    }

    return initialState
  })
  const stateRef = useRef(state)

  const setPersistedState = useCallback(
    (value: SetStateAction<T>) => {
      const nextState =
        value instanceof Function ? value(stateRef.current) : value

      stateRef.current = nextState

      setStorageItem(key, JSON.stringify(nextState))

      setState(nextState)
    },
    [key],
  )

  return [state, setPersistedState]
}

export default usePersistedState
