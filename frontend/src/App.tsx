import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import sistma di gestione dell'autenticazione
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

// Import delle pagine
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';



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