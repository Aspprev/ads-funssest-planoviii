import React from 'react'
import { cn } from '../../lib/cn'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const SectionDivider: React.FC<Props> = ({ className, ...rest }) => {
  return (
    <div
      className={cn('mx-auto h-px bg-[#D9DADD]', className)}
      aria-hidden="true"
      {...rest}
    />
  )
}

export default SectionDivider
