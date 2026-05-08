import React from 'react'
import { cn } from '../../lib/cn'

type Props = React.HTMLAttributes<HTMLDivElement>

const BeneficiaryContent: React.FC<Props> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div className={cn('w-full', className)} {...rest}>
      {children}
    </div>
  )
}

export default BeneficiaryContent
