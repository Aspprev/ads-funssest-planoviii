import React from 'react'

import { AuthProvider } from './auth'

const AppProvider = ({
  children,
}: React.PropsWithChildren): React.JSX.Element => (
  <AuthProvider>{children}</AuthProvider>
)
export default AppProvider
