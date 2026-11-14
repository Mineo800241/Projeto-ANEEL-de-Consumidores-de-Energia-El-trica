import { useState, useEffect } from 'react';

export function useLocalStorage(chave, valorInicial) {
  const [valorArmazenado, setValorArmazenado] = useState(() => {
    try {
      const item = localStorage.getItem(chave);
      return item ? JSON.parse(item) : valorInicial;
    } catch (erro) {
      console.error(`Erro ao ler a chave "${chave}" do localStorage:`, erro);
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valorArmazenado));
    } catch (erro) {
      console.error(`Erro ao salvar a chave "${chave}" no localStorage:`, erro);
    }
  }, [chave, valorArmazenado]);

  return [valorArmazenado, setValorArmazenado];
}
