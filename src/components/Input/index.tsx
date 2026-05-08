import { useField } from 'formik'
import React, {
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import { cn } from '../../lib/cn'
import { applyInputMask, InputMaskType } from '../../utils/inputMasks'
import Tooltip from '../Tooltip'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  placeholder: string
  icon?: React.ComponentType<IconBaseProps>
  mask?: Extract<
    InputMaskType,
    'cep' | 'currency' | 'cpf' | 'phone' | 'date' | 'percent'
  >
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
  value: valueProp,
  onChange,
  onBlur,
  disabled = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [field, meta, helpers] = useField(name)
  const inputRef = useRef<HTMLInputElement>(null)

  const fieldValue = valueProp ?? field.value ?? ''
  const isFilled = `${fieldValue}`.length > 0
  const hasError = !!meta.touched && !!meta.error

  useEffect(() => {
    if (type === 'date' && !!fieldValue && inputRef.current) {
      inputRef.current.type = type
    }
  }, [fieldValue, type])

  const handleInputFocus = useCallback(() => {
    if (disabled) {
      return
    }

    setIsFocused(true)

    if (inputRef.current && type === 'date') {
      inputRef.current.type = 'date'
    }
  }, [disabled, type])

  const handleInputBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (disabled) {
        return
      }

      setIsFocused(false)
      helpers.setTouched(true)

      if (
        type === 'date' &&
        event.currentTarget.value === '' &&
        inputRef.current
      ) {
        inputRef.current.type = 'text'
      }

      onBlur?.(event)
    },
    [disabled, helpers, onBlur, type],
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) {
        return
      }

      const maskedValue = mask
        ? applyInputMask(mask, event.currentTarget.value)
        : event.currentTarget.value

      // eslint-disable-next-line no-param-reassign
      event.currentTarget.value = maskedValue
      helpers.setValue(maskedValue)
      onChange?.(event)
    },
    [disabled, helpers, mask, onChange],
  )

  return (
    <div
      className={cn(
        'relative mb-3 flex w-full items-center rounded border bg-transparent px-3 py-4 text-ink-700 transition',
        isFilled || isFocused ? 'border-black/60 pt-6' : 'border-[#AEAEAE]/60',
        isFocused && 'border-black/60 text-brand-400',
        isFilled && 'text-brand-200',
        hasError && 'border-danger',
        disabled &&
          'cursor-not-allowed border-[#D9D9D9] bg-[#F3F4F6] text-ink-700/70',
        sizeBox === 'small' && 'h-12 pt-7',
        sizeBox === 'large' && 'h-17.5 pt-8',
      )}
    >
      {(isFilled || isFocused) && Icon && (
        <Icon size={20} className={cn(disabled && 'text-ink-700/45')} />
      )}
      {(isFilled || isFocused) && prefix && (
        <span
          className={cn(
            'mr-1 inline-block text-ink-900',
            disabled && 'text-ink-700/45',
          )}
        >
          {prefix}
        </span>
      )}

      <input
        {...field}
        {...rest}
        className={cn(
          'flex-1 border-0 bg-transparent px-3 text-left text-ink-900 outline-none placeholder:text-ink-700/80 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          disabled &&
            'cursor-not-allowed text-ink-700/60 placeholder:text-ink-700/45',
        )}
        id={name}
        name={name}
        type={type === 'date' ? 'text' : type}
        onChange={handleChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        value={fieldValue}
        ref={inputRef}
        disabled={disabled}
      />

      {(isFilled || isFocused) && sufix && (
        <span
          className={cn(
            'ml-1 mr-6 inline-block text-ink-900',
            disabled && 'text-ink-700/45',
          )}
        >
          {sufix}
        </span>
      )}
      {hasError && (
        <Tooltip className="absolute right-2 ml-3 h-5" title={meta.error}>
          <FiAlertCircle color="#c53030" size="20" />
        </Tooltip>
      )}
      <label
        className={cn(
          'pointer-events-none absolute left-3 top-4 pr-3 text-xs font-bold text-ink-700 transition',
          (isFilled || isFocused) && '-translate-y-3 tracking-widest',
          disabled && 'text-ink-700/55',
          sizeBox === 'small' && 'text-[10px]',
          sizeBox === 'large' && 'text-xs',
          hasError && sizeBox === 'large' && 'pr-8',
        )}
        htmlFor={name}
      >
        {placeholder}
      </label>
    </div>
  )
}

export default Input
