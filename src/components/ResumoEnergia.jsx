import { Card, CardContent, Typography, Alert, Box } from '@mui/material';
import { useConsumidores } from '../context/ConsumidoresContext';

export function ResumoEnergia() {
  const { consumidores } = useConsumidores();

  const total = consumidores.length;
  const ligadas = consumidores.filter(({ ligada = true }) => ligada === true).length;
  const desligadas = total - ligadas;
  const totalTrafos = new Set(
    consumidores.map(({ transformador }) => transformador).filter(Boolean)
  ).size;

  const indicadores = [
    { titulo: 'Total de UCs', valor: total, cor: '#2563eb' },
    { titulo: 'Contas Ligadas (true)', valor: ligadas, cor: '#10b981' },
    { titulo: 'Contas Desligadas (false)', valor: desligadas, cor: '#ef4444' },
    { titulo: 'Transformadores Ativos', valor: totalTrafos, cor: '#0f172a' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 2,
          mb: 2,
        }}
      >
        {indicadores.map(({ titulo, valor, cor }) => (
          <Card key={titulo} sx={{ borderLeft: `5px solid ${cor}` }} elevation={1}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                {titulo}
              </Typography>
              <Typography variant="h4" fontWeight={800} color="primary" sx={{ mt: 0.5 }}>
                {valor}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {desligadas > 0 && (
        <Alert severity="warning" variant="outlined" sx={{ bgcolor: '#fffbeb', fontWeight: 500 }}>
          Atenção: Existem <strong>{desligadas}</strong> unidade(s) consumidora(s) com status desligado (false) no sistema.
        </Alert>
      )}
    </Box>
  );
}
