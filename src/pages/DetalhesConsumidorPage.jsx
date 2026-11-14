import { useParams, useNavigate } from 'react-router-dom';
import { useConsumidores } from '../context/ConsumidoresContext';
import { Button } from '../components/ui/Button';

export function DetalhesConsumidorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    consumidores,
    carregando,
    handleAlternarStatus,
    handleDeletar,
  } = useConsumidores();

  if (carregando) {
    return <p className="mensagem-status-api">⏳ Carregando detalhes...</p>;
  }

  const consumidor = consumidores.find((item) => String(item.id) === String(id));

  if (!consumidor) {
    return (
      <div className="erro-api">
        <p>{`🚨 Consumidor com ID "${id}" não encontrado.`}</p>
        <Button variant="cancelar" onClick={() => navigate('/')}>
          ← Voltar para a Lista
        </Button>
      </div>
    );
  }

  const { uc, medidor, transformador, nome, endereco, tipo, ligada = true } = consumidor;

  const excluirERedirecionar = () => {
    handleDeletar(consumidor);
    navigate('/');
  };

  return (
    <div className="card-detalhes">
      <div className="cabecalho-lista">
        <div>
          <span className="indicador-titulo">Ficha Técnica da Unidade Consumidora</span>
          <h2 style={{ fontSize: '1.6rem', marginTop: '4px' }}>{nome}</h2>
        </div>

        <span className={`status-${ligada ? 'ligada' : 'desligada'}`}>
          {`${ligada ? 'Unidade Ligada' : 'Unidade Desligada'} (${ligada})`}
        </span>
      </div>

      <div className="grid-detalhes">
        <div className="item-detalhe">
          <span>Unidade Consumidora (UC)</span>
          <strong>{uc}</strong>
        </div>

        <div className="item-detalhe">
          <span>Número do Medidor</span>
          <strong>{medidor}</strong>
        </div>

        <div className="item-detalhe">
          <span>Transformador Vinculado</span>
          <strong>{transformador}</strong>
        </div>

        <div className="item-detalhe">
          <span>Classe de Consumo</span>
          <strong>{tipo}</strong>
        </div>

        <div className="item-detalhe" style={{ gridColumn: '1 / -1' }}>
          <span>Endereço de Instalação</span>
          <strong>{endereco}</strong>
        </div>
      </div>

      <div className="botoes-form" style={{ marginTop: '24px' }}>
        <Button variant="cancelar" onClick={() => navigate('/')}>
          ← Voltar
        </Button>

        <Button
          variant={ligada ? 'cancelar' : 'salvar'}
          onClick={() => handleAlternarStatus(consumidor)}
        >
          {ligada ? 'Desligar Unidade (false)' : 'Ligar Unidade (true)'}
        </Button>

        <Button variant="editar" onClick={() => navigate(`/editar/${id}`)}>
          ✏️ Editar Dados
        </Button>

        <Button variant="deletar" onClick={excluirERedirecionar}>
          🗑️ Excluir Registro
        </Button>
      </div>
    </div>
  );
}
