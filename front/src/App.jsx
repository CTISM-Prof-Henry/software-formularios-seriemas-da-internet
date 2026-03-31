import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from  './pages/Home.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/app" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
