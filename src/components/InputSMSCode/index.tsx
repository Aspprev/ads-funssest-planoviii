/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useField, useFormikContext } from 'formik'
import React, {
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../lib/cn'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  size: number
}

const InputSMSCode: React.FC<Props> = ({ name, size, ...rest }) => {
  const arr = Object.keys(Array.apply(0, Array(size))).map(Number)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [field, , helpers] = useField<string>(name)
  const { submitForm } = useFormikContext()

  const value = field.value ?? ''
  const arrValues = useMemo(() => value.split(''), [value])
  const selectedIndex = useMemo(
    () => (arrValues.length < size ? arrValues.length : size - 1),
    [arrValues.length, size],
  )
  const hideInput = useMemo(() => !(arrValues.length < size), [
    arrValues.length,
    size,
  ])

  const handleClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    helpers.setTouched(true)
  }, [helpers])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextDigit = event.currentTarget.value.replace(/\D/g, '').slice(-1)

      if (!nextDigit || value.length >= size) {
        return
      }

      helpers.setValue(`${value}${nextDigit}`)
      // eslint-disable-next-line no-param-reassign
      event.currentTarget.value = ''
    },
    [helpers, size, value],
  )

  useEffect(() => {
    if (value.length === size) {
      submitForm()
    }
  }, [size, submitForm, value])

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace') {
        helpers.setValue(value.slice(0, value.length - 1))
      }
    },
    [helpers, value],
  )

  return (
    <div>
      <div
        className="relative flex cursor-default overflow-hidden"
        onClick={handleClick}
      >
        <input type="hidden" name={name} value={value} readOnly />
        <input
          {...rest}
          className="absolute inset-y-0 h-8 w-10 border-0 bg-transparent p-2 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{
            left: `${selectedIndex * 40 + selectedIndex * 16}px`,
            opacity: hideInput ? 0 : 1,
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          enterKeyHint="done"
          value=""
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          ref={inputRef}
        />

        {arr.map((_, index) => {
          const indexFocused = isFocused && arrValues.length === index
          const indexFilled = arrValues.length > index

          return (
            <div
              className={cn(
                'relative flex h-8 w-10 items-center justify-center border-b-2 border-[#D2D2D2] px-2 text-[20px] font-bold text-[#555555]',
                index > 0 && 'ml-4',
                indexFilled && 'border-brand-200',
                indexFocused && 'border-brand-400',
              )}
              // eslint-disable-next-line react/no-array-index-key
              key={`${name}-${index}`}
            >
              {arrValues[index]}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InputSMSCode
