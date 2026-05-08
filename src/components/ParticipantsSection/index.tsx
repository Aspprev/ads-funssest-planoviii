import React from 'react'
import { cn } from '../../lib/cn'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const ParticipantsSection: React.FC<Props> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div className={cn(className)} {...rest}>
      {children}
    </div>
  )
}

export default ParticipantsSection
