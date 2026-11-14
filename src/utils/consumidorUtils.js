export const ESTADO_INICIAL_FORM = {
  nome: '',
  uc: '',
  medidor: '',
  transformador: '',
  endereco: '',
  tipo: 'Residencial',
  ligada: true,
};

export const CAMPOS_FORMULARIO_CONSUMIDOR = [
  { name: 'nome', type: 'text', placeholder: 'Nome do Titular' },
  { name: 'uc', type: 'text', placeholder: 'Número da UC (Unidade Consumidora)' },
  { name: 'medidor', type: 'text', placeholder: 'Número do Medidor (Relógio)' },
  { name: 'transformador', type: 'text', placeholder: 'Número do Transformador (Trafo)' },
  { name: 'endereco', type: 'text', placeholder: 'Endereço Completo (Rua, Número, Bairro)' },
  {
    name: 'tipo',
    type: 'select',
    options: [
      { value: 'Residencial', label: 'Residencial' },
      { value: 'Comercial', label: 'Comercial' },
      { value: 'Industrial', label: 'Industrial' },
      { value: 'Rural', label: 'Rural' },
    ],
  },
  {
    name: 'ligada',
    type: 'checkbox',
    label: (valor) => `Unidade Consumidora Ligada (${valor})`,
  },
];

export const agruparLigadosPorTransformador = (consumidores, buscaTrafo) => {
  return consumidores
    .filter(({ ligada = true }) => ligada === true)
    .filter(({ transformador = '' }) =>
      transformador.toLowerCase().includes(buscaTrafo.toLowerCase())
    )
    .reduce((grupos, consumidor) => {
      const { transformador = 'Sem Transformador' } = consumidor;
      return {
        ...grupos,
        [transformador]: [...(grupos[transformador] || []), consumidor],
      };
    }, {});
};

export const formatarResumoConsumidor = ({ uc, nome, medidor, endereco }) => {
  return `UC ${uc} — ${nome} (Medidor: ${medidor} | Endereço: ${endereco})`;
};
