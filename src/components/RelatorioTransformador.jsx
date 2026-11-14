import { useState } from 'react';
import { useConsumidores } from '../context/ConsumidoresContext';
import { formatarResumoConsumidor } from '../utils/consumidorUtils';

export function RelatorioTransformador() {
  const { ligadosPorTransformador, buscaTrafo, setBuscaTrafo } = useConsumidores();
  const [recolhido, setRecolhido] = useState(false);

  const entradas = Object.entries(ligadosPorTransformador);

  return (
    <div className="relatorio-trafo">
      <div className="cabecalho-lista">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2>🔌 Consumidores Ligados por Transformador</h2>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => setRecolhido((prev) => !prev)}
          >
            {recolhido ? 'Mostrar Lista' : 'Ocultar Lista'}
          </button>
        </div>

        <input
          type="text"
          className="input-busca-trafo"
          placeholder="Buscar número do trafo..."
          value={buscaTrafo}
          onChange={({ target }) => setBuscaTrafo(target.value)}
        />
      </div>

      {!recolhido && (
        <>
          {entradas.length === 0 ? (
            <p>
              {buscaTrafo
                ? `Nenhuma unidade ligada encontrada para o transformador "${buscaTrafo}".`
                : 'Nenhuma unidade consumidora ligada cadastrada.'}
            </p>
          ) : (
            <div className="grid-trafos">
              {entradas.map(([trafo, lista]) => (
                <div key={trafo} className="card-trafo">
                  <div className="card-trafo-header">
                    <h3>{`Transformador: ${trafo}`}</h3>
                    <span className="badge-total">{`${lista.length} ligada(s)`}</span>
                  </div>
                  <ul>
                    {lista.map((consumidor) => (
                      <li key={consumidor.id}>
                        {formatarResumoConsumidor(consumidor)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
