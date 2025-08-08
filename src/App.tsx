import './App.css';
import Mazagine from './pages/Mazagine';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    
    <BrowserRouter>
    <Routes>
      <Route path="/revistas" element={<Mazagine />} ></Route>
    </Routes>
    
    </BrowserRouter>
  );
}

export default App;
