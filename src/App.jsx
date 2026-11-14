import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Snackbar, Alert } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import {
  ConsumidoresProvider,
  useConsumidores,
} from './context/ConsumidoresContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Navbar } from './components/Navbar';
import { ListaConsumidoresPage } from './pages/ListaConsumidoresPage';
import { FormularioConsumidorPage } from './pages/FormularioConsumidorPage';
import { DetalhesConsumidorPage } from './pages/DetalhesConsumidorPage';
import { TransformadoresPage } from './pages/TransformadoresPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import './App.css';

function LayoutAplicacao() {
  const { alerta, fecharAlerta } = useConsumidores();

  const severidadeMui = {
    sucesso: 'success',
    erro: 'error',
    aviso: 'warning',
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Snackbar
          open={Boolean(alerta)}
          autoHideDuration={alerta?.tipo === 'erro' ? 5000 : 3000}
          onClose={fecharAlerta}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          {alerta ? (
            <Alert
              onClose={fecharAlerta}
              severity={severidadeMui[alerta.tipo] || 'info'}
              variant="filled"
              sx={{ width: '100%', fontWeight: 600 }}
            >
              {alerta.mensagem}
            </Alert>
          ) : undefined}
        </Snackbar>

        <Routes>
          <Route path="/" element={<ListaConsumidoresPage />} />
          <Route path="/detalhes/:id" element={<DetalhesConsumidorPage />} />
          <Route path="/transformadores" element={<TransformadoresPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/novo"
            element={
              <PrivateRoute>
                <FormularioConsumidorPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/editar/:id"
            element={
              <PrivateRoute>
                <FormularioConsumidorPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConsumidoresProvider>
          <LayoutAplicacao />
        </ConsumidoresProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
