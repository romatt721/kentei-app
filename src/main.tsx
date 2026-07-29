import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!

const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// 本番ビルドでは scripts/prerender.ts が各ルートのHTMLを #root に埋め込んでいるので
// ハイドレーションする。開発サーバーでは #root が空なので通常のレンダリングを行う。
if (container.firstElementChild) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
