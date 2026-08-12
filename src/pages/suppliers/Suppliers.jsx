import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

// Icons
import AddIcon from '@mui/icons-material/Add';
import FlightIcon from '@mui/icons-material/Flight';
import ApiIcon from '@mui/icons-material/Api';
import ShieldIcon from '@mui/icons-material/Shield';

import PageHeader from '../../components/PageHeader';
import AppTable from '../../components/AppTable';

const MOCK_SUPPLIERS = [
  {
    id: 'SUP-001',
    name: 'Sabre GDS',
    type: 'GDS',
    status: 'Active',
    contact: 'api-support@sabre.com',
    commission: 'N/A',
    balance: '$12,450'
  },
  {
    id: 'SUP-002',
    name: 'Amadeus',
    type: 'GDS',
    status: 'Active',
    contact: 'tech@amadeus.com',
    commission: 'N/A',
    balance: '$8,200'
  },
  {
    id: 'SUP-003',
    name: 'British Airways',
    type: 'Airline',
    status: 'Active',
    contact: 'b2b@ba.com',
    commission: '5%',
    balance: '$0'
  },
  {
    id: 'SUP-004',
    name: 'Emirates',
    type: 'Airline',
    status: 'Active',
    contact: 'agents@emirates.com',
    commission: '7%',
    balance: '$4,100'
  },
  {
    id: 'SUP-005',
    name: 'Travelport',
    type: 'GDS',
    status: 'Inactive',
    contact: 'support@travelport.com',
    commission: 'N/A',
    balance: '$0'
  }
];

export default function Suppliers() {
  const [suppliers] = useState(MOCK_SUPPLIERS);

  const columns = [
    { key: 'id', label: 'Supplier ID' },
    { key: 'name', label: 'Supplier Name' },
    { key: 'type', label: 'Type' },
    { key: 'contact', label: 'Contact Email' },
    { key: 'commission', label: 'Base Commission' },
    { key: 'balance', label: 'Account Balance' },
    { key: 'status', label: 'Status' }
  ];

  const renderRow = (row) => (
    <>
      <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.id}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {row.type === 'Airline' ? <FlightIcon fontSize="small" color="primary" /> : <ApiIcon fontSize="small" color="secondary" />}
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.name}</Typography>
      </Box>
      <Typography variant="body2">{row.type}</Typography>
      <Typography variant="body2">{row.contact}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>{row.commission}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.balance}</Typography>
      <Chip
        label={row.status}
        size="small"
        color={row.status === 'Active' ? 'success' : 'default'}
        sx={{ fontWeight: 800, fontSize: '0.7rem' }}
      />
    </>
  );

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Suppliers Management"
        subtitle="Manage airline direct connects, GDS API credentials, and B2B travel suppliers."
        action={
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Add Supplier
          </Button>
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
            <ApiIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>3</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Active GDS Connections</Typography>
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#FEF08A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CA8A04' }}>
            <FlightIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>45+</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Direct Airline Contracts</Typography>
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
            <ShieldIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>100%</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>API Uptime / Health</Typography>
          </Box>
        </Paper>
      </Box>

      <AppTable
        columns={columns}
        data={suppliers}
        renderRow={renderRow}
      />
    </Box>
  );
}
