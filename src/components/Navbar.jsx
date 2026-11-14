import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { estaAutenticado, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const estiloLink = ({ isActive }) => ({
    textDecoration: 'none',
    color: '#fff',
    backgroundColor: isActive ? '#2563eb' : 'transparent',
    borderRadius: '8px',
  });

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, py: 1 }}>
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          ⚡ Gestão de Energia
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <NavLink to="/" end style={estiloLink}>
            <Button color="inherit" sx={{ textTransform: 'none' }}>
              📋 Lista Pública
            </Button>
          </NavLink>

          <NavLink to="/transformadores" style={estiloLink}>
            <Button color="inherit" sx={{ textTransform: 'none' }}>
              🔌 Por Transformador
            </Button>
          </NavLink>

          <NavLink to="/admin" style={estiloLink}>
            <Button color="inherit" sx={{ textTransform: 'none' }}>
              🛡️ Painel Admin
            </Button>
          </NavLink>

          <NavLink to="/novo" style={estiloLink}>
            <Button color="inherit" sx={{ textTransform: 'none' }}>
              ➕ Novo Cadastro
            </Button>
          </NavLink>

          {estaAutenticado ? (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleLogout}
              title={`Conectado como ${usuario?.email}`}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              🚪 Sair
            </Button>
          ) : (
            <NavLink to="/login" style={estiloLink}>
              <Button color="inherit" sx={{ textTransform: 'none' }}>
                🔐 Entrar
              </Button>
            </NavLink>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
