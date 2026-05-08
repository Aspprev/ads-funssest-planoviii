import React from 'react'
import { cn } from '../../lib/cn'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

const ModalActionButton: React.FC<Props> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={cn(
        'mt-5 mr-5 flex w-25 flex-col items-center justify-center rounded-sm border-0 bg-linear-to-r from-[#FF612E] to-[#FF8F61] px-1 py-1 text-white focus:underline',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default ModalActionButton
