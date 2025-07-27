import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddNews from "./pages/AddNews.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/content/new" element={<AddNews/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
