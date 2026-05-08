import React from 'react'
import { cn } from '../../lib/cn'

interface Props extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
}

const PageCard: React.FC<Props> = ({
  as: Component = 'div',
  className,
  children,
  ...rest
}) => {
  return (
    <Component
      className={cn(
        'mb-3 w-full rounded-lg bg-white px-6 py-7 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_6px_12px_rgba(61,69,67,0.05)] max-md:px-4 max-md:py-5',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default PageCard
