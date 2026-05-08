import React from 'react'
import { cn } from '../../lib/cn'

type Props = React.HTMLAttributes<HTMLDivElement>

const InfoContentCard: React.FC<Props> = ({ className, children, ...rest }) => {
  return (
    <div
      className={cn(
        'mb-3 flex w-full flex-col rounded-sm border border-[#AEAEAE] px-3 py-2',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default InfoContentCard
