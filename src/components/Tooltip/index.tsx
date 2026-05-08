import React from 'react'
import { cn } from '../../lib/cn'

interface TooltipProps {
  title: string
  className?: string
  children?: React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  className = '',
  children,
}) => {
  return (
    <div className={cn('group relative', className)}>
      <span className="invisible absolute bottom-[calc(100%+12px)] left-1/2 z-10 w-40 -translate-x-1/2 rounded bg-danger p-2 text-center text-sm font-medium text-white opacity-0 transition-[opacity,visibility] duration-300 before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-x-[6px] before:border-t-[6px] before:border-x-transparent before:border-t-danger before:content-[''] group-hover:visible group-hover:opacity-100">
        {title}
      </span>
      {children}
    </div>
  )
}

export default Tooltip
