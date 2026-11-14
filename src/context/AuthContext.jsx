import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useLocalStorage('sessao_operador_energia', null);

  const login = (email, senha) => {
    if (email === 'admin@energia.com' && senha === '123456') {
      const dadosOperador = {
        nome: 'Operador Administrador',
        email,
        cargo: 'Engenharia de Distribuição',
      };
      setUsuario(dadosOperador);
      return { sucesso: true };
    }

    return {
      sucesso: false,
      erro: 'E-mail ou senha inválidos. Use admin@energia.com / 123456',
    };
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaAutenticado: Boolean(usuario),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return contexto;
}
