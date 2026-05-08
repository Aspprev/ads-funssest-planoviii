import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react'

import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'

import { useField } from '@unform/core'

import { Container, Error } from './styles'

import masks from '../../utils/inputMasks'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  placeholder: string
  icon?: React.ComponentType<IconBaseProps>
  mask?: 'cep' | 'currency' | 'cpf' | 'phone' | 'date' | 'percent'
  sizeBox?: 'small' | 'medium' | 'large'
  prefix?: string
  sufix?: string
}

const Input: React.FC<Props> = ({
  prefix,
  sufix,
  placeholder,
  name,
  icon: Icon,
  mask,
  sizeBox = 'medium',
  type,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const {
    fieldName,
    defaultValue,
    error,
    clearError,
    registerField,
  } = useField(name)

  useEffect(() => {
    if (type === 'date' && !!inputRef?.current?.value) {
      inputRef.current.type = type
    }
  }, [type])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    })
  }, [fieldName, registerField])

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
    if (inputRef && inputRef.current && type === 'date') {
      inputRef.current.type = 'date'
    }
  }, [type])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!inputRef.current?.value)

    if (type === 'date' && inputRef?.current?.value === '') {
      inputRef.current.type = 'text'
    }

    if (inputRef.current?.value) clearError()
  }, [clearError, type])

  const handleKeyUp = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      if (mask) masks({ type: mask, event })
    },
    [mask],
  )

  useEffect(() => {
    setIsFilled(!!inputRef.current?.value)
  }, [])

  return (
    <Container
      isErrored={!!error}
      isFilled={isFilled}
      isFocused={isFocused}
      sizeBox={sizeBox}
      hasSufix={!!sufix}
    >
      {(isFilled || isFocused) && Icon && <Icon size={20} />}
      {(isFilled || isFocused) && prefix && <span>{prefix}</span>}

      <input
        type={type === 'date' ? 'text' : type}
        onKeyUp={handleKeyUp}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />

      {(isFilled || isFocused) && sufix && <span>{sufix}</span>}
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size="20" />
        </Error>
      )}
      <label htmlFor={fieldName}>{placeholder}</label>
    </Container>
  )
}

export default Input
