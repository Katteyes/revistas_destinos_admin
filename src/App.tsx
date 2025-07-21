import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <h2>Vista protegida: Usuarios</h2>
            </PrivateRoute>
          }
        />

        <Route
          path="/editor"
          element={
            <PrivateRoute allowedRoles={['admin', 'editor']}>
              <h2>Vista protegida: Editor</h2>
            </PrivateRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <h2>Vista protegida: Perfil de cualquier usuario</h2>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
