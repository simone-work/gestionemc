import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

// Import delle pagine/viste
import Login from './pages/Login';
import Register from './pages/Register'; // Importa il nuovo componente
import Dashboard from './pages/Dashboard';

// Componente per una Home Page pubblica di esempio
const HomePage = () => (
  <div style={{ padding: 20 }}>
    <h1>Pagina Home Pubblica</h1>
    <p>Chiunque può vedere questa pagina.</p>
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Vai alla Dashboard (protetta)</Link>
        </li>
        <li>
          <Link to="/login">Vai al Login</Link>
        </li>
        <li>
          <Link to="/register">Vai alla Registrazione</Link>
        </li>
      </ul>
    </nav>
  </div>
);

// Componente per la pagina 404
const NotFoundPage = () => (
    <div style={{ padding: 20, textAlign: 'center' }}>
        <h1>404 - Pagina Non Trovata</h1>
        <p>La risorsa che stai cercando non esiste.</p>
        <Link to="/">Torna alla Home</Link>
    </div>
);


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* --- ROTTE PUBBLICHE --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* <-- NUOVA ROTTA */}
          
          {/* --- ROTTE PROTETTE --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          
          {/* --- ROTTA CATCH-ALL PER IL 404 --- */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;