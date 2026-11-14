import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';

ModuleRegistry.registerModules([AllCommunityModule]);

export function DataTable({
  data,
  actions = [],
  emptyMessage = 'Nenhum registro encontrado.',
}) {
  const columnDefs = useMemo(() => {
    const baseCols = [
      { field: 'uc', headerName: 'UC', sortable: true, filter: true, width: 120 },
      { field: 'medidor', headerName: 'Medidor', sortable: true, filter: true, width: 130 },
      { field: 'transformador', headerName: 'Trafo', sortable: true, filter: true, width: 110 },
      { field: 'nome', headerName: 'Titular', sortable: true, filter: true, flex: 1, minWidth: 180 },
      { field: 'tipo', headerName: 'Classe', sortable: true, filter: true, width: 130 },
      {
        field: 'ligada',
        headerName: 'Status',
        sortable: true,
        width: 155,
        cellRenderer: ({ value = true }) => (
          <Chip
            label={`${value ? 'Ligada' : 'Desligada'} (${value})`}
            color={value ? 'success' : 'error'}
            size="small"
            variant="filled"
            sx={{ fontWeight: 700 }}
          />
        ),
      },
    ];

    if (actions.length > 0) {
      baseCols.push({
        headerName: 'Ações',
        field: 'id',
        sortable: false,
        filter: false,
        width: 340,
        minWidth: 340,
        cellRenderer: ({ data: row }) => (
          <Stack direction="row" spacing={0.8} alignItems="center" sx={{ height: '100%' }}>
            {actions.map((action, index) => {
              const label =
                typeof action.label === 'function' ? action.label(row) : action.label;
              const muiColor =
                typeof action.muiColor === 'function'
                  ? action.muiColor(row)
                  : action.muiColor || 'primary';

              return (
                <Button
                  key={`${row.id}-acao-${index}`}
                  size="small"
                  variant="contained"
                  color={muiColor}
                  onClick={() => action.onClick(row)}
                  sx={{ textTransform: 'none', fontWeight: 600, minWidth: 'auto', px: 1.2 }}
                >
                  {label}
                </Button>
              );
            })}
          </Stack>
        ),
      });
    }

    return baseCols;
  }, [actions]);

  if (data.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 470 }}>
      <AgGridReact
        theme={themeQuartz}
        rowData={data}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={8}
        paginationPageSizeSelector={[5, 8, 15, 30]}
        rowHeight={50}
        animateRows={true}
      />
    </Box>
  );
}
