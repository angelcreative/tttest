document.documentElement.dataset.theme = 'audiense'

// #region agent log
const BUILD_MARKER = 'figmatt-deploy-from-main-2025'
fetch('http://127.0.0.1:7245/ingest/29b78a1c-be03-4dcd-8341-0fd068b1fb76', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'main.tsx:load', message: 'App bundle loaded', data: { buildMarker: BUILD_MARKER }, timestamp: Date.now(), hypothesisId: 'H1' }) }).catch(() => {})
// #endregion

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './audiense-brown-override.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
