import React from 'react'

interface CollapseProps {
  in: boolean
  children: React.ReactNode
}

const Collapse: React.FC<CollapseProps> = ({ in: isOpen, children }) => {
  if (!isOpen) {
    return null
  }

  return <>{children}</>
}

export default Collapse
