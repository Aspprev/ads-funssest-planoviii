import React, { HTMLAttributes } from 'react'

import { Container } from './styles'

interface Props extends HTMLAttributes<HTMLDivElement> {
  color?: 'white' | 'green' | 'darkgreen' | 'pink' | 'purple' | 'blue' | 'orange'
  size?: 'large' | 'normal'
  gradientDirection?: 'left' | 'right'
  displayed?: boolean
}
const ColoredBox: React.FC<Props> = ({
  color = 'white',
  className,
  size = 'normal',
  gradientDirection = 'left',
  children,
  displayed = true,
}) => {
  return (
    <Container
      className={className}
      color={color}
      size={size}
      gradientDirection={gradientDirection}
      displayed={displayed}
    >
      {children}
    </Container>
  )
}

export default ColoredBox
