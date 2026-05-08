import React from 'react'

import { Container, Dot } from './styles'

interface Props {
  quantity: number
  active: number
}

const Dots: React.FC<Props> = ({ quantity, active }) => {
  const arr = Object.keys(Array.apply(0, Array(quantity))).map(Number)

  return (
    <Container>
      {arr.map((value, index) => {
        const isActive = index === active
        return <Dot key={Math.random()} active={isActive} />
      })}
    </Container>
  )
}

export default Dots
