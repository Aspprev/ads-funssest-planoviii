/* eslint-disable no-nested-ternary */
import { useField } from 'formik'
import React from 'react'
import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import ReactSelect, {
  GroupBase,
  Props as SelectProps,
  SingleValue,
} from 'react-select'
import { cn } from '../../lib/cn'
import Tooltip from '../Tooltip'

interface SelectOption {
  label: string
  value: string
}

interface Props extends SelectProps<SelectOption, false> {
  name: string
  placeholder: string
  icon?: React.ComponentType<IconBaseProps>
  sizeBox?: 'small' | 'large'
  prefix?: string
  placeholderSelect?: string
  disabled?: boolean
}

const InputSelect: React.FC<Props> = ({
  placeholder,
  name,
  placeholderSelect,
  icon: Icon,
  options = [],
  onChange,
  isDisabled = false,
  disabled = false,
  ...rest
}) => {
  const [field, meta, helpers] = useField(name)
  const hasError = !!meta.touched && !!meta.error

  const [isFocused, setIsFocused] = React.useState(false)
  const finalIsDisabled = isDisabled || disabled

  const hasValue = !!field.value
  const isActive = hasValue || isFocused

  const flatOptions = (options as readonly (
    | SelectOption
    | GroupBase<SelectOption>
  )[]).flatMap(option => ('options' in option ? option.options : [option]))

  const currentValue =
    flatOptions.find(option => option.value === field.value) ?? null

  return (
    <div
      className={cn(
        'relative mb-3 h-17.25 border flex w-full items-end rounded bg-transparent px-3 pb-2 pt-5 text-ink-700 transition-all duration-200',
        isActive ? 'border border-black/70' : 'border-black/20',
        hasError && 'border-danger',
        finalIsDisabled &&
          'cursor-not-allowed border-[#D9D9D9] bg-[#F3F4F6] text-ink-700/70',
      )}
    >
      {Icon && (
        <Icon
          size={20}
          className={cn(
            'mb-2 mr-2 shrink-0',
            finalIsDisabled && 'text-ink-700/45',
          )}
        />
      )}

      <ReactSelect
        {...rest}
        className="w-full min-w-0 flex-1"
        classNamePrefix="react-select"
        inputId={name}
        name={name}
        options={options}
        placeholder={!isActive && (placeholderSelect ?? 'Selecione')}
        value={currentValue}
        isDisabled={finalIsDisabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          helpers.setTouched(true)
        }}
        styles={{
          container: base => ({
            ...base,
            flex: 1,
            width: '100%',
            minWidth: 0,
          }),

          control: base => ({
            ...base,
            width: '100%',
            minHeight: isActive ? '42px' : '34px',
            height: isActive ? '42px' : '34px',
            border: 'none',
            boxShadow: 'none',
            backgroundColor: 'transparent',
            cursor: finalIsDisabled ? 'not-allowed' : 'pointer',
            alignItems: 'center',
          }),

          valueContainer: base => ({
            ...base,
            height: isActive ? '42px' : '34px',
            padding: '0 8px 0 4px',
            display: 'flex',
            alignItems: 'center',
          }),

          singleValue: base => ({
            ...base,
            color: finalIsDisabled ? 'rgba(55, 65, 81, 0.6)' : '#374151',
            margin: 0,
            fontSize: isActive ? '16px' : '15px',
            lineHeight: '22px',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }),

          placeholder: base => ({
            ...base,
            color: finalIsDisabled ? 'rgba(55, 65, 81, 0.45)' : '#8D8D8D',
            margin: 0,
            fontSize: isActive ? '16px' : '15px',
            lineHeight: '22px',
          }),

          input: base => ({
            ...base,
            margin: 0,
            padding: 0,
            color: finalIsDisabled ? 'rgba(55, 65, 81, 0.6)' : '#374151',
            fontSize: isActive ? '16px' : '15px',
          }),

          indicatorsContainer: base => ({
            ...base,
            height: isActive ? '42px' : '34px',
          }),

          indicatorSeparator: base => ({
            ...base,
            display: 'none',
          }),

          dropdownIndicator: (base, state) => ({
            ...base,
            color: finalIsDisabled ? 'rgba(75, 85, 99, 0.45)' : '#4b5563',
            padding: '0 6px',
            transition: 'transform 0.2s ease',
            transform: state.selectProps.menuIsOpen
              ? 'rotate(180deg)'
              : undefined,

            ':hover': {
              color: finalIsDisabled ? 'rgba(75, 85, 99, 0.45)' : '#374151',
            },
          }),

          menu: base => ({
            ...base,
            width: '100%',
            minWidth: '100%',
            zIndex: 9999,
            marginTop: 0,
            border: '1px solid #d1d5db',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 8px 18px rgba(15, 23, 42, 0.14)',
            backgroundColor: '#ffffff',
          }),

          menuList: base => ({
            ...base,
            maxHeight: 280,
            paddingTop: 0,
            paddingBottom: 0,
          }),

          option: (base, state) => ({
            ...base,
            minHeight: '40px',
            padding: '9px 14px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            lineHeight: '21px',
            fontWeight: 400,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            color: '#374151',
            cursor: 'pointer',
            backgroundColor: state.isSelected
              ? '#dbeafe'
              : state.isFocused
              ? '#e5e7eb'
              : '#ffffff',

            ':active': {
              backgroundColor: '#dbeafe',
            },
          }),
        }}
        onChange={selected => {
          const nextValue = (selected as SelectOption | null)?.value ?? ''

          helpers.setValue(nextValue)

          onChange?.(selected as SingleValue<SelectOption>, {
            action: 'select-option',
            option: (selected as SingleValue<SelectOption>) ?? undefined,
            name,
          })
        }}
      />

      {hasError && (
        <Tooltip className="ml-3 mb-3 shrink-0 text-white" title={meta.error}>
          <FiAlertCircle color="#c53030" size="20" />
        </Tooltip>
      )}

      <label
        className={cn(
          'pointer-events-none absolute left-2 top-1.25 text-xs font-bold text-ink-700',
          finalIsDisabled && 'text-ink-700/55',
        )}
        htmlFor={name}
      >
        {placeholder}
      </label>
    </div>
  )
}

export default InputSelect
