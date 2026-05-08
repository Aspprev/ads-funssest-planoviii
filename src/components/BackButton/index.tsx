import React from 'react'
import { cn } from '../../lib/cn'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

const BackButton: React.FC<Props> = ({ className, children, ...rest }) => {
  return (
    <button
      type="button"
      className={cn(
        'mb-4 flex flex-row items-center justify-center border-0 border-b border-b-transparent gap-2 bg-transparent text-ink-900 hover:border-b-ink-900 focus:border-b-ink-900',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default BackButton
