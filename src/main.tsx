import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './i18n'
import './index.css'

// 引入i18n初始化文件

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
