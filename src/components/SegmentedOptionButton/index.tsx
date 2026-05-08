import React from 'react'
import { cn } from '../../lib/cn'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean
}

const SegmentedOptionButton: React.FC<Props> = ({
  isActive,
  className,
  children,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={cn(
        'flex size-full flex-col items-center justify-center rounded-[18px] border-0 transition-all focus:underline',
        isActive
          ? 'bg-linear-to-r from-[#FF612E] to-[#FF8F61] text-white'
          : 'bg-transparent text-ink-700',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default SegmentedOptionButton
