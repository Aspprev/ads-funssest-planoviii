import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clientConfig from '../services/clientConfig'
import { ConfigData } from '../utils/interfaces'
import { readStorageJson, writeStorageJson } from '../utils/storage'

type ConfigDataResponse = [
  ConfigData,
  Dispatch<SetStateAction<ConfigData>>,
]

function useConfigData() {
  const baseConfig = useMemo(
    () => ({
      ...clientConfig(),
      token: '',
      tipoContato: '',
    }),
    [],
  )

  const [configData, setConfigData] = useState<ConfigData>(() => {
    const parsedValue = readStorageJson<Partial<ConfigData>>(
      'configData',
      baseConfig,
    )

    return {
      ...baseConfig,
      ...parsedValue,
      codCliente: parsedValue.codCliente ?? baseConfig.codCliente,
      tipo: parsedValue.tipo ?? baseConfig.tipo,
      plano: parsedValue.plano ?? baseConfig.plano,
      token: parsedValue.token ?? '',
      tipoContato: parsedValue.tipoContato ?? '',
    }
  })
  const configRef = useRef(configData)

  const setPersistedConfigData = useCallback(
    (value: SetStateAction<ConfigData>) => {
      const nextConfig =
        value instanceof Function ? value(configRef.current) : value

      configRef.current = nextConfig
      writeStorageJson('configData', nextConfig)
      setConfigData(nextConfig)
    },
    [],
  )

  useEffect(() => {
    configRef.current = configData
  }, [configData])

  useEffect(() => {
    const needsSync =
      configData.codCliente !== baseConfig.codCliente ||
      configData.tipo !== baseConfig.tipo ||
      configData.plano !== baseConfig.plano ||
      configData.token === undefined ||
      configData.tipoContato === undefined

    if (needsSync) {
      setPersistedConfigData(current => ({
        ...baseConfig,
        ...current,
        codCliente: baseConfig.codCliente,
        tipo: baseConfig.tipo,
        plano: baseConfig.plano,
        token: current?.token ?? '',
        tipoContato: current?.tipoContato ?? '',
      }))
    }
  }, [baseConfig, configData, setPersistedConfigData])

  return [configData, setPersistedConfigData] as ConfigDataResponse
}

export default useConfigData
