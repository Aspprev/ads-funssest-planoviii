import React, { ButtonHTMLAttributes } from 'react'

import { Container } from './styles'

interface PropsBtn<T> extends ButtonHTMLAttributes<T> {
  color?: 'green' | 'pink' | 'white' | 'blue' | 'orange'
  fontSize?: 'small' | 'normal' | 'large'
  width?: 'small' | 'medium' | 'large'
  isVisible?: boolean
}

type Props = PropsBtn<HTMLButtonElement>

const Button: React.FC<Props> = ({
  children,
  isVisible = true,
  fontSize,
  width,
  color = 'white',
  ...rest
}) => {
  return isVisible ? (
    <Container
      type="button"
      color={color}
      fontSize={fontSize}
      width={width}
      {...rest}
    >
      {children}
    </Container>
  ) : null
}

export default Button
