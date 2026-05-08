import React, { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface PropsBtn<T> extends ButtonHTMLAttributes<T> {
  color?: 'green' | 'pink' | 'white' | 'blue' | 'orange'
  fontSize?: 'small' | 'normal' | 'large'
  width?: 'small' | 'medium' | 'large' | 'fit'
  isVisible?: boolean
}

type Props = PropsBtn<HTMLButtonElement>

const colorClasses = {
  green:
    'bg-linear-to-r from-[#6DE381] to-[#31D19E] text-white shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_8px_rgba(61,69,67,0.08)]',
  blue:
    'bg-linear-to-r from-[#0060A1] to-[#0093B8] text-white shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_8px_rgba(61,69,67,0.08)]',
  orange:
    'bg-linear-to-r from-[#FF612E] to-[#FF8F61] text-white shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_8px_rgba(61,69,67,0.08)]',
  pink:
    'bg-linear-to-r from-[#FBADB4] to-[#EB6A9F] text-white shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_8px_rgba(61,69,67,0.08)]',
  white:
    'border border-[#EAEAEA] bg-white text-[#333333] shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_8px_rgba(61,69,67,0.08)]',
}

const fontSizeClasses = {
  small: 'min-h-10 text-xs font-normal',
  normal: 'min-h-[50px] text-base font-bold',
  large: 'min-h-[50px] text-lg font-bold',
}

const widthClasses = {
  small: 'w-[180px] px-3 py-2',
  medium: 'w-[200px] px-3 py-2',
  large: 'w-[250px] px-3 py-2',
  fit: 'w-fit px-6 py-2',
}

const disabledClasses =
  'cursor-not-allowed border-[#EAEAEA] bg-[#bababa] text-white shadow-[0_6px_8px_rgba(101,101,101,0.09)]'

const Button: React.FC<Props> = ({
  children,
  isVisible = true,
  fontSize,
  width,
  color = 'white',
  ...rest
}) => {
  return isVisible ? (
    <button
      type="button"
      className={cn(
        'my-2 flex items-center justify-center gap-2 rounded-full border-0 text-center transition focus:underline',
        rest.disabled ? disabledClasses : colorClasses[color],
        fontSizeClasses[fontSize ?? 'normal'],
        widthClasses[width ?? 'medium'],
      )}
      {...rest}
    >
      {children}
    </button>
  ) : null
}

export default Button
