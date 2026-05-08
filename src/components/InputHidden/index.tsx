import React, { InputHTMLAttributes, useEffect } from 'react'
import { useField } from 'formik'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  type: 'hidden'
}

const InputHidden: React.FC<Props> = ({ name, type, value, ...rest }) => {
  const [field, , helpers] = useField(name)

  useEffect(() => {
    if (value !== undefined && value !== field.value) {
      helpers.setValue(value)
    }
  }, [field.value, helpers, value])

  return (
    <input
      {...field}
      {...rest}
      name={name}
      type={type !== 'hidden' ? 'hidden' : type}
      value={field.value ?? value ?? ''}
    />
  )
}

export default InputHidden
