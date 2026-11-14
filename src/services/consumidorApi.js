const API_URL = 'http://localhost:3001/consumidores';
const CLASSES_CONSUMO = ['Residencial', 'Comercial', 'Industrial', 'Rural'];

const normalizarConsumidor = (item, index = 0) => {
  if (item.uc && item.medidor && item.transformador) {
    return item;
  }

  return {
    id: item.id,
    nome: item.name || item.nome,
    uc: `${10004500 + (item.id || index) * 17}`,
    medidor: `MED-${8900 + (item.id || index) * 13}`,
    transformador: `TR-${100 + ((item.id || index) % 3) + 1}`,
    endereco: `${item.address?.street || 'Rua Principal'}, ${item.address?.suite || 'S/N'} - ${item.address?.city || 'Centro'}`,
    tipo: CLASSES_CONSUMO[index % CLASSES_CONSUMO.length],
    ligada: (item.id || index) % 4 !== 0,
  };
};

const obterMensagemErroHttp = (status) => {
  const mensagens = {
    400: 'Dados inválidos enviados para o servidor (Erro 400).',
    401: 'Acesso não autorizado (Erro 401).',
    403: 'Sem permissão para executar esta operação (Erro 403).',
    404: 'Registro ou endpoint da API não encontrado (Erro 404).',
    408: 'Tempo de resposta esgotado no servidor (Erro 408).',
    500: 'Erro interno no servidor da API (Erro 500).',
  };
  return mensagens[status] || `Erro na comunicação com a API (Código ${status}).`;
};

function fetchComControleDeCorrida(
  endpoint,
  { method = 'GET', body, signal: externalSignal, timeoutMs = 8000 } = {}
) {
  const controller = new AbortController();

  const aoAbortarExternamente = () => {
    controller.abort(new DOMException('Requisição substituída por uma mais recente.', 'AbortError'));
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      aoAbortarExternamente();
    } else {
      externalSignal.addEventListener('abort', aoAbortarExternamente, { once: true });
    }
  }

  let timerId;

  const promiseRequisicao = fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    signal: controller.signal,
    ...(body ? { body: JSON.stringify(body) } : {}),
  }).then(async (resposta) => {
    if (!resposta.ok) {
      throw new Error(obterMensagemErroHttp(resposta.status));
    }
    if (resposta.status === 204) return null;
    return resposta.json();
  });

  const promiseTimeout = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      controller.abort();
      reject(new Error(`Tempo limite de ${timeoutMs / 1000}s excedido (Timeout).`));
    }, timeoutMs);
  });

  return Promise.race([promiseRequisicao, promiseTimeout])
    .catch((erro) => {
      if (erro.name === 'AbortError') {
        const erroCancelamento = new Error('Requisição cancelada.');
        erroCancelamento.isCanceled = true;
        throw erroCancelamento;
      }
      if (erro.message === 'Failed to fetch') {
        throw new Error('Sem conexão com o servidor. Verifique sua internet.');
      }
      throw erro;
    })
    .finally(() => {
      clearTimeout(timerId);
      if (externalSignal) {
        externalSignal.removeEventListener('abort', aoAbortarExternamente);
      }
    });
}

export function buscarConsumidoresApi({ signal } = {}) {
  return fetchComControleDeCorrida(API_URL, {
    method: 'GET',
    signal,
  }).then((dados) => (Array.isArray(dados) ? dados.map(normalizarConsumidor) : []));
}

export function criarConsumidorApi(novoConsumidor, { signal } = {}) {
  return fetchComControleDeCorrida(API_URL, {
    method: 'POST',
    body: novoConsumidor,
    signal,
  }).then((criado) => ({
    ...novoConsumidor,
    id: criado?.id || Date.now(),
  }));
}

export function atualizarConsumidorApi({ id, ...dadosAtualizados }, { signal } = {}) {
  return fetchComControleDeCorrida(`${API_URL}/${id}`, {
    method: 'PUT',
    body: dadosAtualizados,
    signal,
  }).then(() => ({ id, ...dadosAtualizados }));
}

export function deletarConsumidorApi(id, { signal } = {}) {
  return fetchComControleDeCorrida(`${API_URL}/${id}`, {
    method: 'DELETE',
    signal,
  }).then(() => id);
}
