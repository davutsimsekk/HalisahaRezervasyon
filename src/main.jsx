import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import './index.css'
import App from './App.jsx'
import { RoleProvider } from './context/RoleContext'
import { TeamProvider } from './context/TeamContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RoleProvider>
          <TeamProvider>
            <App />
          </TeamProvider>
        </RoleProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
