import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CAMPOS_FORMULARIO_CONSUMIDOR } from '../utils/consumidorUtils';
import { useConsumidores } from '../context/ConsumidoresContext';
import { GenericForm } from '../components/ui/GenericForm';
import { Button } from '../components/ui/Button';

export function FormularioConsumidorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    consumidores,
    carregando,
    enviando,
    erroFormulario,
    formData,
    editandoId,
    handleChange,
    handleSubmit,
    handleEditar,
    limparFormulario,
  } = useConsumidores();

  const isModoEdicao = Boolean(id);
  const consumidorAlvo = isModoEdicao
    ? consumidores.find((item) => String(item.id) === String(id))
    : null;

  useEffect(() => {
    if (isModoEdicao && consumidorAlvo) {
      handleEditar(consumidorAlvo);
    } else if (!isModoEdicao) {
      limparFormulario();
    }
  }, [id, consumidorAlvo?.id]);

  useEffect(() => {
    if (isModoEdicao && editandoId === null && !enviando && formData.nome === '') {
      navigate('/');
    }
  }, [editandoId, enviando]);

  if (isModoEdicao && carregando) {
    return <p className="mensagem-status-api">⏳ Buscando dados da unidade consumidora...</p>;
  }

  if (isModoEdicao && !consumidorAlvo) {
    return (
      <div className="erro-api">
        <p>{`🚨 Unidade consumidora com ID "${id}" não encontrada.`}</p>
        <Button variant="cancelar" onClick={() => navigate('/')}>
          ← Voltar para a Lista
        </Button>
      </div>
    );
  }

  const aoSubmeter = (e) => {
    handleSubmit(e);
    if (!isModoEdicao) {
      const { nome, uc, medidor, transformador, endereco } = formData;
      if (nome.trim() && uc.trim() && medidor.trim() && transformador.trim() && endereco.trim()) {
        navigate('/');
      }
    }
  };

  const aoCancelar = () => {
    limparFormulario();
    navigate('/');
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button variant="cancelar" onClick={aoCancelar}>
          ← Voltar para a Lista
        </Button>
      </div>

      {erroFormulario && (
        <div className="alerta-erro-form" role="alert">
          {`🚨 ${erroFormulario}`}
        </div>
      )}

      <GenericForm
        title={
          isModoEdicao
            ? `Editar Consumidor (UC: ${formData.uc})`
            : 'Cadastrar Nova Unidade Consumidora'
        }
        fields={CAMPOS_FORMULARIO_CONSUMIDOR}
        values={formData}
        isEditing={isModoEdicao}
        isSubmitting={enviando}
        onChange={handleChange}
        onSubmit={aoSubmeter}
        onCancel={aoCancelar}
      />
    </div>
  );
}
