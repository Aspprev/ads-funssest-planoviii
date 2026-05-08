import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'

import GlobalStyle from './styles/global'

import Routes from './routes'

import AppProvider from './hooks'
import { ToggleThemeProvider } from './hooks/toggleTheme'

const App: React.FC = () => {
  return (
    <ToggleThemeProvider>
      <Router>
        <AppProvider>
          <Routes />
        </AppProvider>
        <GlobalStyle />
      </Router>
    </ToggleThemeProvider>
  )
}

export default App
