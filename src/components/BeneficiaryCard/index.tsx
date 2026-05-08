import React from 'react'
import { cn } from '../../lib/cn'

type Props = React.HTMLAttributes<HTMLDivElement>

const BeneficiaryCard: React.FC<Props> = ({ className, children, ...rest }) => {
  return (
    <div
      className={cn(
        'relative my-3 w-full rounded-lg bg-white px-6 pb-3 pt-4 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_6px_12px_rgba(61,69,67,0.05)] max-md:px-4 max-md:pt-5',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default BeneficiaryCard
