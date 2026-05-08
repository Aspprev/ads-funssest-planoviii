import React, { useRef, useEffect, useState } from 'react'

import ReactSelect, { OptionTypeBase, Props as SelectProps } from 'react-select'
import { useField } from '@unform/core'

import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import { Container, Error } from './styles'

interface Props extends SelectProps<OptionTypeBase> {
  name: string
  placeholder: string
  icon?: React.ComponentType<IconBaseProps>
  sizeBox?: 'small' | 'large'
  prefix?: string
  placeholderSelect?: string
}
const InputSelect: React.FC<Props> = ({
  placeholder,
  name,
  placeholderSelect,
  icon: Icon,
  sizeBox = 'small',
  ...rest
}) => {
  const [isFocused] = useState(false)
  const [isFilled] = useState(true) /* false */

  const inputRef = useRef(null)
  const {
    fieldName,
    defaultValue,
    registerField,
    error,
  } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref: any) => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return []
          }
          return ref.state.value.map((option: OptionTypeBase) => option.value)
        }
        if (!ref.state.value) {
          return ''
        }
        return ref.state.value.value
      },
    })
  }, [fieldName, registerField, rest.isMulti])

  return (
    <Container
      isErrored={!!error}
      isFilled={isFilled}
      isFocused={isFocused}
      sizeBox={sizeBox}
    >
      {(isFilled || isFocused) && Icon && <Icon size={20} />}
      <ReactSelect
        defaultValue={defaultValue}
        ref={inputRef}
        classNamePrefix="react-select"
        placeholder={placeholderSelect ?? 'Selecione'}
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size="20" />
        </Error>
      )}

      <label htmlFor={fieldName}>{placeholder}</label>
    </Container>
  )
}
export default InputSelect
