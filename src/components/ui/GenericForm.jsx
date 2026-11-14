import {
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  Box,
} from '@mui/material';

export function GenericForm({
  title,
  fields,
  values,
  isEditing,
  isSubmitting = false,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <Paper component="form" onSubmit={onSubmit} elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 2.5 }}>
        {title}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        {fields.map(({ name, type = 'text', placeholder, options = [], label }) => {
          if (type === 'select') {
            return (
              <TextField
                key={name}
                select
                fullWidth
                label={placeholder || 'Classe de Consumo'}
                name={name}
                value={values[name]}
                onChange={onChange}
                disabled={isSubmitting}
              >
                {options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            );
          }

          if (type === 'checkbox') {
            const textoSwitch = typeof label === 'function' ? label(values[name]) : label;
            return (
              <Box key={name} sx={{ gridColumn: '1 / -1' }}>
                <FormControlLabel
                  control={
                    <Switch
                      name={name}
                      checked={Boolean(values[name])}
                      onChange={onChange}
                      color="success"
                      disabled={isSubmitting}
                    />
                  }
                  label={textoSwitch}
                />
              </Box>
            );
          }

          return (
            <TextField
              key={name}
              fullWidth
              type={type}
              label={placeholder}
              name={name}
              value={values[name]}
              onChange={onChange}
              disabled={isSubmitting}
            />
          );
        })}
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={isSubmitting}
          sx={{ fontWeight: 700 }}
        >
          {isSubmitting ? '⏳ Salvando...' : isEditing ? '💾 Atualizar' : '💾 Cadastrar'}
        </Button>

        {isEditing && (
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            ✖️ Cancelar (ESC)
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
