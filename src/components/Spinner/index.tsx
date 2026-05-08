import React from 'react'
import { cn } from '../../lib/cn'

interface SpinnerProps {
  className?: string
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent',
        className,
      )}
    />
  )
}

export default Spinner
