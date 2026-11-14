import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ESTADO_INICIAL_FORM,
  agruparLigadosPorTransformador,
} from '../utils/consumidorUtils';
import {
  buscarConsumidoresApi,
  criarConsumidorApi,
  atualizarConsumidorApi,
  deletarConsumidorApi,
} from '../services/consumidorApi';

const ConsumidoresContext = createContext(null);
const QUERY_KEY_CONSUMIDORES = ['consumidores'];

export function ConsumidoresProvider({ children }) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(ESTADO_INICIAL_FORM);
  const [editandoId, setEditandoId] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [termoBusca, setTermoBusca] = useState('');
  const [buscaTrafo, setBuscaTrafo] = useState('');
  const [erroFormulario, setErroFormulario] = useState(null);
  const [alerta, setAlerta] = useState(null);

  const formRef = useRef(null);
  const controllersPorIdRef = useRef(new Map());

  const exibirAlerta = (tipo, mensagem) => setAlerta({ tipo, mensagem });
  const fecharAlerta = () => setAlerta(null);

  const criarControllerExclusivo = (chave) => {
    const controllerAnterior = controllersPorIdRef.current.get(chave);
    if (controllerAnterior) {
      controllerAnterior.abort();
    }
    const novoController = new AbortController();
    controllersPorIdRef.current.set(chave, novoController);
    return novoController;
  };

  useEffect(() => {
    const mapaControllers = controllersPorIdRef.current;
    return () => {
      mapaControllers.forEach((ctrl) => ctrl.abort());
      mapaControllers.clear();
    };
  }, []);

  const {
    data: consumidores = [],
    isLoading: carregando,
    isFetching: sincronizandoEmSegundoPlano,
    error: erroQuery,
    refetch: recarregarApi,
  } = useQuery({
    queryKey: QUERY_KEY_CONSUMIDORES,
    queryFn: ({ signal }) => buscarConsumidoresApi({ signal }),
  });

  const forcarSincronizacaoSegura = async () => {
    await queryClient.cancelQueries({ queryKey: QUERY_KEY_CONSUMIDORES });
    recarregarApi();
  };

  const criarMutation = useMutation({
    mutationFn: (dados) => {
      const controller = criarControllerExclusivo('novo-cadastro');
      return criarConsumidorApi(dados, { signal: controller.signal });
    },
    onSuccess: (novoRegistro) => {
      const registroComId = { ...novoRegistro, id: Date.now() };
      queryClient.setQueryData(QUERY_KEY_CONSUMIDORES, (antigos = []) => [
        registroComId,
        ...antigos,
      ]);
      limparFormulario();
      exibirAlerta(
        'sucesso',
        `Consumidor "${registroComId.nome}" (UC: ${registroComId.uc}) cadastrado!`
      );
    },
    onError: (erro) => {
      if (erro.isCanceled) return;
      setErroFormulario(erro.message);
      exibirAlerta('erro', `Falha ao cadastrar: ${erro.message}`);
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: (dados) => {
      const controller = criarControllerExclusivo(`editar-${dados.id}`);
      return atualizarConsumidorApi(dados, { signal: controller.signal });
    },
    onSuccess: (atualizado) => {
      queryClient.setQueryData(QUERY_KEY_CONSUMIDORES, (antigos = []) =>
        antigos.map((item) => (item.id === atualizado.id ? atualizado : item))
      );
    },
    onError: (erro) => {
      if (erro.isCanceled) return;
      setErroFormulario(erro.message);
      exibirAlerta('erro', `Falha ao atualizar: ${erro.message}`);
    },
  });

  const deletarMutation = useMutation({
    mutationFn: (id) => {
      const controller = criarControllerExclusivo(`editar-${id}`);
      return deletarConsumidorApi(id, { signal: controller.signal });
    },
    onSuccess: (idRemovido) => {
      queryClient.setQueryData(QUERY_KEY_CONSUMIDORES, (antigos = []) =>
        antigos.filter((item) => item.id !== idRemovido)
      );
      if (editandoId === idRemovido) limparFormulario();
    },
    onError: (erro) => {
      if (erro.isCanceled) return;
      exibirAlerta('erro', `Erro ao excluir registro: ${erro.message}`);
    },
  });

  useEffect(() => {
    const qtdLigadas = consumidores.filter(({ ligada = true }) => ligada).length;
    document.title = `⚡ Gestão Energia (${qtdLigadas} ligadas)`;
  }, [consumidores]);

  useEffect(() => {
    if (!alerta) return;
    const duracao = alerta.tipo === 'erro' ? 5000 : 3000;
    const timer = setTimeout(() => setAlerta(null), duracao);
    return () => clearTimeout(timer);
  }, [alerta]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && editandoId) {
        limparFormulario();
        exibirAlerta('aviso', 'Edição cancelada (ESC).');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editandoId]);

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    if (erroFormulario) setErroFormulario(null);
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroFormulario(null);

    const { nome, uc, medidor, transformador, endereco } = formData;
    if (!nome.trim() || !uc.trim() || !medidor.trim() || !transformador.trim() || !endereco.trim()) {
      const msg = 'Preencha todos os campos obrigatórios antes de salvar.';
      setErroFormulario(msg);
      exibirAlerta('erro', msg);
      return;
    }

    if (editandoId) {
      atualizarMutation.mutate(
        { id: editandoId, ...formData },
        {
          onSuccess: (atualizado) => {
            limparFormulario();
            exibirAlerta(
              'sucesso',
              `Consumidor "${atualizado.nome}" (UC: ${atualizado.uc}) atualizado!`
            );
          },
        }
      );
    } else {
      criarMutation.mutate(formData);
    }
  };

  const handleEditar = (consumidor) => {
    const { id, ...dadosEditaveis } = consumidor;
    setErroFormulario(null);
    setEditandoId(id);
    setFormData({ ...ESTADO_INICIAL_FORM, ...dadosEditaveis });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleAlternarStatus = (consumidor) => {
    const novoStatus = !(consumidor.ligada ?? true);
    atualizarMutation.mutate(
      { ...consumidor, ligada: novoStatus },
      {
        onSuccess: () => {
          exibirAlerta(
            'sucesso',
            `UC ${consumidor.uc} alterada para ${novoStatus ? 'LIGADA (true)' : 'DESLIGADA (false)'}.`
          );
        },
      }
    );
  };

  const handleDeletar = ({ id, nome, uc }) => {
    if (!window.confirm(`Deseja realmente excluir o consumidor "${nome}" (UC: ${uc})?`)) {
      return;
    }
    deletarMutation.mutate(id, {
      onSuccess: () => {
        exibirAlerta('aviso', `Consumidor "${nome}" (UC: ${uc}) removido.`);
      },
    });
  };

  const limparFormulario = () => {
    setFormData({ ...ESTADO_INICIAL_FORM });
    setEditandoId(null);
    setErroFormulario(null);
  };

  const limparFiltros = () => {
    setTermoBusca('');
    setFiltroStatus('todas');
  };

  const consumidoresFiltrados = consumidores
    .filter(({ ligada = true }) => {
      if (filtroStatus === 'ligadas') return ligada === true;
      if (filtroStatus === 'desligadas') return ligada === false;
      return true;
    })
    .filter(({ nome = '', uc = '', medidor = '' }) => {
      const busca = termoBusca.toLowerCase();
      return (
        nome.toLowerCase().includes(busca) ||
        uc.toLowerCase().includes(busca) ||
        medidor.toLowerCase().includes(busca)
      );
    });

  const ligadosPorTransformador = agruparLigadosPorTransformador(
    consumidores,
    buscaTrafo
  );

  const enviando = criarMutation.isPending || atualizarMutation.isPending;

  return (
    <ConsumidoresContext.Provider
      value={{
        consumidores,
        consumidoresFiltrados,
        ligadosPorTransformador,
        carregando,
        sincronizandoEmSegundoPlano,
        enviando,
        erroCargaApi: erroQuery?.isCanceled ? null : erroQuery?.message || null,
        erroFormulario,
        alerta,
        fecharAlerta,
        formRef,
        recarregarApi: forcarSincronizacaoSegura,
        formData,
        editandoId,
        filtroStatus,
        setFiltroStatus,
        termoBusca,
        setTermoBusca,
        buscaTrafo,
        setBuscaTrafo,
        handleChange,
        handleSubmit,
        handleEditar,
        handleAlternarStatus,
        handleDeletar,
        limparFormulario,
        limparFiltros,
      }}
    >
      {children}
    </ConsumidoresContext.Provider>
  );
}

export function useConsumidores() {
  const contexto = useContext(ConsumidoresContext);
  if (!contexto) {
    throw new Error('useConsumidores deve ser usado dentro de um ConsumidoresProvider');
  }
  return contexto;
}
