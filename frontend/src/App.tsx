import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import DiffPage from './pages/DiffPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/diff" element={<DiffPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
