import React, { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface Props extends HTMLAttributes<HTMLDivElement> {
  color?:
    | 'white'
    | 'green'
    | 'darkgreen'
    | 'pink'
    | 'purple'
    | 'blue'
    | 'orange'
  size?: 'large' | 'normal'
  gradientDirection?: 'left' | 'right'
  displayed?: boolean
}

const colorClasses = {
  green: {
    left:
      'bg-linear-to-r from-[#31D19E] to-[#6DE381] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
    right:
      'bg-linear-to-r from-[#6DE381] to-[#31D19E] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
  },
  darkgreen: {
    left:
      'bg-linear-to-r from-[#228F3C] to-[#28A745] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
    right:
      'bg-linear-to-r from-[#28A745] to-[#228F3C] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
  },
  pink: {
    left:
      'bg-linear-to-r from-[#EB6A9F] to-[#FBADB4] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
    right:
      'bg-linear-to-r from-[#FBADB4] to-[#EB6A9F] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
  },
  purple: {
    left:
      'bg-linear-to-r from-[#7A71EF] to-[#9C9EFF] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
    right:
      'bg-linear-to-r from-[#9C9EFF] to-[#7A71EF] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
  },
  blue: {
    left:
      'bg-linear-to-r from-[#0069D9] to-[#045381] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
    right:
      'bg-linear-to-r from-[#045381] to-[#0069D9] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
  },
  orange: {
    left:
      'bg-linear-to-r from-[#ff8c29] to-[#d96500] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
    right:
      'bg-linear-to-r from-[#d96500] to-[#ff8c29] text-white shadow-[0_6px_8px_rgba(101,101,101,0.2)]',
  },
  white: {
    left:
      'border border-[#EAEAEA] bg-white text-[#333333] shadow-[0_6px_8px_rgba(101,101,101,0.09)]',
    right:
      'border border-[#EAEAEA] bg-white text-[#333333] shadow-[0_6px_8px_rgba(101,101,101,0.09)]',
  },
}

const ColoredBox: React.FC<Props> = ({
  color = 'white',
  className,
  size = 'normal',
  gradientDirection = 'left',
  children,
  displayed = true,
  ...rest
}) => {
  return (
    <div
      className={cn(
        colorClasses[color][gradientDirection],
        size === 'large' ? 'w-full' : 'w-40 md:w-50',
        displayed
          ? 'pointer-events-auto h-full min-h-21 p-4 opacity-100'
          : 'pointer-events-none h-0 min-h-0 p-0 opacity-0',
        'relative rounded transition-all duration-200 ease-in-out',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default ColoredBox
