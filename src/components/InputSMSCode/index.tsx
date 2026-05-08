/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  InputHTMLAttributes,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react'

import { useField, FormHandles } from '@unform/core'
import { Container, Cell } from './styles'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  size: number
  formRef?: React.RefObject<FormHandles>
}

const InputSMSCode: React.FC<Props> = ({ formRef, name, size, ...rest }) => {
  const arr = Object.keys(Array.apply(0, Array(size))).map(Number)

  const [isFocused, setIsFocused] = useState(false)
  const [, setIsFilled] = useState(false)
  const [value, setValue] = useState('')

  const arrValues = useMemo(() => value.split(''), [value])

  const selectedIndex = useMemo(
    () => (arrValues.length < size ? arrValues.length : size - 1),
    [arrValues, size],
  )

  const hideInput = useMemo(() => !(arrValues.length < size), [
    arrValues.length,
    size,
  ])

  const inputRefTmp = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    fieldName,
    defaultValue,
    clearError,
    registerField,
  } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    })
  }, [fieldName, registerField])

  const handleClick = useCallback(() => {
    inputRefTmp.current?.focus()
  }, [])

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!inputRefTmp.current?.value)

    if (inputRefTmp.current?.value) clearError()
  }, [clearError])

  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const eValue = event.currentTarget.value

      if (value.length < size) {
        setValue(value + eValue)
      }
    },
    [size, value],
  )

  useEffect(() => {
    if (value.length === size) {
      formRef?.current?.submitForm()
    }
  }, [size, value, formRef])

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace') {
        setValue(value.slice(0, value.length - 1))
      }
    },
    [value],
  )

  return (
    <Container hideInput={hideInput} selectedIndex={selectedIndex}>
      <div onClick={handleClick}>
        <input type="hidden" value={value} ref={inputRef} />
        <input
          type="number"
          min="0"
          max="9"
          step="1"
          value=""
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          defaultValue={defaultValue}
          ref={inputRefTmp}
          {...rest}
        />

        {arr.map((_, index) => {
          const indexFocused = isFocused && arrValues.length === index
          const indexFilled = arrValues.length > index
          return (
            <Cell
              isFocused={indexFocused}
              isFilled={indexFilled}
              key={Math.random()}
            >
              {arrValues[index]}
            </Cell>
          )
        })}
      </div>
    </Container>
  )
}

export default InputSMSCode
