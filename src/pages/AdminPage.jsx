import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConsumidores } from '../context/ConsumidoresContext';
import { ResumoEnergia } from '../components/ResumoEnergia';
import { Button } from '../components/ui/Button';

export function AdminPage() {
  const { usuario, logout } = useAuth();
  const {
    consumidores,
    handleAlternarStatus,
    recarregarApi,
    sincronizandoEmSegundoPlano,
  } = useConsumidores();
  const navigate = useNavigate();

  const contasDesligadas = consumidores.filter(({ ligada = true }) => !ligada);

  const sairDoSistema = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="card-detalhes">
      <div className="cabecalho-lista">
        <div>
          <span className="indicador-titulo">Área Protegida • Controle Operacional</span>
          <h2 style={{ fontSize: '1.5rem', marginTop: '4px' }}>
            {`Bem-vindo, ${usuario?.nome}`}
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--cor-texto-secundario)', fontSize: '0.9rem' }}>
            {`${usuario?.cargo} (${usuario?.email})`}
          </p>
        </div>

        <div className="botoes-form">
          <Button variant="salvar" onClick={() => navigate('/novo')}>
            ➕ Novo Consumidor
          </Button>
          <Button
            variant="cancelar"
            onClick={() => recarregarApi()}
            disabled={sincronizandoEmSegundoPlano}
          >
            🔄 Sincronizar Base
          </Button>
          <Button variant="deletar" onClick={sairDoSistema}>
            🚪 Sair (Logout)
          </Button>
        </div>
      </div>

      <ResumoEnergia />

      <div style={{ marginTop: '24px' }}>
        <h3>⚠️ Unidades Desligadas Aguardando Religamento ({contasDesligadas.length})</h3>

        {contasDesligadas.length === 0 ? (
          <p style={{ color: 'var(--cor-texto-secundario)' }}>
            Todas as unidades consumidoras cadastradas estão ligadas (true) no momento.
          </p>
        ) : (
          <div className="grid-trafos" style={{ marginTop: '12px' }}>
            {contasDesligadas.map((c) => (
              <div
                key={c.id}
                className="card-trafo"
                style={{ borderTopColor: 'var(--cor-perigo)' }}
              >
                <div className="card-trafo-header">
                  <h3>{`UC ${c.uc} — ${c.nome}`}</h3>
                  <span className="status-desligada">Desligada (false)</span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '0.9rem' }}>
                  {`Medidor: ${c.medidor} | Trafo: ${c.transformador} | ${c.endereco}`}
                </p>
                <div className="botoes-form">
                  <Button variant="salvar" onClick={() => handleAlternarStatus(c)}>
                    ⚡ Religar Unidade (true)
                  </Button>
                  <Button variant="editar" onClick={() => navigate(`/editar/${c.id}`)}>
                    ✏️ Editar Cadastro
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
