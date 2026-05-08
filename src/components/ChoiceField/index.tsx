import React from 'react'
import { cn } from '../../lib/cn'

type Variant = 'segmented' | 'outlined'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  segmented:
    'relative flex w-full flex-col items-start rounded-sm bg-transparent px-3 pb-0 pt-4 text-ink-700',
  outlined:
    'relative mb-3 flex w-full flex-col items-start rounded-sm border border-[#AEAEAE] bg-transparent px-3 py-4 text-ink-700',
}

const ChoiceField: React.FC<Props> = ({
  variant = 'segmented',
  className,
  children,
  ...rest
}) => {
  return (
    <div className={cn(variantClasses[variant], className)} {...rest}>
      {children}
    </div>
  )
}

export default ChoiceField
