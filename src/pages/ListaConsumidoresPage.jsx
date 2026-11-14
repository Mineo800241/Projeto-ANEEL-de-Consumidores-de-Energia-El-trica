import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useConsumidores } from '../context/ConsumidoresContext';
import { DataTable } from '../components/ui/DataTable';
import { ResumoEnergia } from '../components/ResumoEnergia';

export function ListaConsumidoresPage() {
  const navigate = useNavigate();

  const {
    consumidoresFiltrados,
    carregando,
    sincronizandoEmSegundoPlano,
    erroCargaApi,
    recarregarApi,
    filtroStatus,
    setFiltroStatus,
    termoBusca,
    setTermoBusca,
    handleAlternarStatus,
    handleDeletar,
    limparFiltros,
  } = useConsumidores();

  const acoesTabela = [
    {
      label: 'Detalhes',
      muiColor: 'secondary',
      onClick: ({ id }) => navigate(`/detalhes/${id}`),
    },
    {
      label: ({ ligada = true }) => (ligada ? 'Desligar' : 'Ligar'),
      muiColor: ({ ligada = true }) => (ligada ? 'inherit' : 'success'),
      onClick: handleAlternarStatus,
    },
    {
      label: 'Editar',
      muiColor: 'warning',
      onClick: ({ id }) => navigate(`/editar/${id}`),
    },
    {
      label: 'Excluir',
      muiColor: 'error',
      onClick: handleDeletar,
    },
  ];

  const temFiltroAtivo = termoBusca !== '' || filtroStatus !== 'todas';

  return (
    <>
      <ResumoEnergia />

      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          spacing={2}
          sx={{ mb: 2.5 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h6" fontWeight={700} color="primary">
              {`Consumidores (${consumidoresFiltrados.length})`}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => recarregarApi()}
              disabled={sincronizandoEmSegundoPlano}
            >
              {sincronizandoEmSegundoPlano ? '🔄 Atualizando...' : '🔄 Sincronizar'}
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              size="small"
              label="Buscar por nome, UC ou medidor"
              value={termoBusca}
              onChange={({ target }) => setTermoBusca(target.value)}
            />

            <TextField
              select
              size="small"
              label="Status da Conta"
              value={filtroStatus}
              onChange={({ target }) => setFiltroStatus(target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="todas">Todas as Contas</MenuItem>
              <MenuItem value="ligadas">Somente Ligadas (true)</MenuItem>
              <MenuItem value="desligadas">Somente Desligadas (false)</MenuItem>
            </TextField>

            {temFiltroAtivo && (
              <Button variant="outlined" color="inherit" onClick={limparFiltros}>
                Limpar
              </Button>
            )}
          </Stack>
        </Stack>

        {carregando ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5, gap: 2 }}>
            <CircularProgress size={28} />
            <Typography color="text.secondary">Carregando registros da API...</Typography>
          </Box>
        ) : erroCargaApi ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => recarregarApi()}>
                Tentar Novamente
              </Button>
            }
          >
            {erroCargaApi}
          </Alert>
        ) : (
          <DataTable
            data={consumidoresFiltrados}
            actions={acoesTabela}
            emptyMessage="Nenhum consumidor encontrado para os filtros atuais."
          />
        )}
      </Paper>
    </>
  );
}
