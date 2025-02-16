import { Outlet } from 'react-router-dom'

import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'

import GlobalErrorHandler from '@/GlobalErrorHandler'
import { ThemeProvider } from '@/components/theme-provider'

const RootLayout: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HelmetProvider>
        <Outlet />
        <GlobalErrorHandler />
        <Toaster position="top-center" richColors />
      </HelmetProvider>
    </ThemeProvider>
  )
}

export default RootLayout
