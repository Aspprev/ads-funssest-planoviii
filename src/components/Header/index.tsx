import React from 'react'

import { Container } from './styles'

import Logo from '../Logo'

const Header: React.FC = () => {
  return (
    <Container>
      <div>
        {/* <div>{children}</div> */}
        <Logo />
      </div>
    </Container>
  )
}

export default Header
