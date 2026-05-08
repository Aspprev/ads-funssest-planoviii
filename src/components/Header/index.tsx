import React from 'react'

import Logo from '../Logo'

const Header: React.FC = () => {
  return (
    <header className="relative top-0 mb-5 flex h-18 justify-center bg-white px-6 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_6px_12px_rgba(61,69,67,0.05)] md:mb-9 md:h-23 md:px-25">
      <div className="relative mx-auto flex w-full max-w-125 scale-90 items-center justify-center md:scale-100">
        {/* <div>{children}</div> */}
        <Logo />
      </div>
    </header>
  )
}

export default Header
