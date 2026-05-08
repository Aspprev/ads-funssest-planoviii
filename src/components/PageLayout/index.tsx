import React from 'react'
import { cn } from '../../lib/cn'
import Header from '../Header'

interface Props extends React.PropsWithChildren {
  containerClassName?: string
}

const PageLayout: React.FC<Props> = ({ children, containerClassName }) => {
  return (
    <>
      <Header />
      <div
        className={cn(
          'mx-auto mb-4 flex max-w-160 flex-col items-center px-1 max-md:max-w-140',
          containerClassName,
        )}
      >
        {children}
      </div>
    </>
  )
}

export default PageLayout
