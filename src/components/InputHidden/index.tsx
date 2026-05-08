import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
} from 'react'

import { useField } from '@unform/core'

import { Container } from './styles'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  type: 'hidden'
}

const InputHidden: React.FC<Props> = ({ name, type, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    fieldName,
    defaultValue,
    registerField,
  } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    })
  }, [fieldName, registerField])

  return (
    <Container>
      <input
        type={type !== 'hidden' ? 'hidden' : type}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
    </Container>
  )
}

export default InputHidden
