import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const [email, setEmail] = useState('admin@energia.com');
  const [senha, setSenha] = useState('123456');
  const [erroLogin, setErroLogin] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destino = location.state?.from?.pathname || '/admin';

  const handleLogin = (e) => {
    e.preventDefault();
    setErroLogin('');

    const resultado = login(email.trim(), senha);
    if (resultado.sucesso) {
      navigate(destino, { replace: true });
    } else {
      setErroLogin(resultado.erro);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="card-login">
        <h2>🔐 Acesso Restrito ao Sistema</h2>
        <p className="login-subtitulo">
          Autentique-se para acessar o Painel Administrativo, cadastrar ou editar unidades consumidoras.
        </p>

        {erroLogin && (
          <div className="alerta-erro-form" role="alert">
            {`🚨 ${erroLogin}`}
          </div>
        )}

        <div className="campo-login">
          <label htmlFor="email">E-mail do Operador</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            required
          />
        </div>

        <div className="campo-login">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={({ target }) => setSenha(target.value)}
            required
          />
        </div>

        <div className="dica-credenciais">
          <strong>Credenciais de teste:</strong> admin@energia.com | Senha: 123456
        </div>

        <div className="botoes-form" style={{ marginTop: '16px' }}>
          <Button type="submit" variant="salvar" style={{ width: '100%' }}>
            Entrar no Painel
          </Button>
        </div>
      </form>
    </div>
  );
}
