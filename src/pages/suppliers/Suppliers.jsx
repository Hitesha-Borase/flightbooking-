import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

// Icons
import AddIcon from '@mui/icons-material/Add';
import FlightIcon from '@mui/icons-material/Flight';
import ApiIcon from '@mui/icons-material/Api';
import ShieldIcon from '@mui/icons-material/Shield';

import PageHeader from '../../components/PageHeader';
import AppTable from '../../components/AppTable';
import AppModal from '../../components/AppModal';
import { useAlert } from '../../contexts/AlertContext';

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
  const { showAlert } = useAlert();
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('crm-suppliers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse suppliers from localStorage', e);
      }
    }
    return MOCK_SUPPLIERS;
  });

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'GDS',
    contact: '',
    commission: '5%',
    balance: '$0',
    status: 'Active'
  });

  const handleOpenModal = () => {
    setFormData({
      name: '',
      type: 'GDS',
      contact: '',
      commission: '5%',
      balance: '$0',
      status: 'Active'
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showAlert('Please enter supplier name', 'error');
      return;
    }
    if (!formData.contact.trim()) {
      showAlert('Please enter contact email', 'error');
      return;
    }

    const nextIdNumber = suppliers.length + 1;
    const newId = `SUP-${String(nextIdNumber).padStart(3, '0')}`;

    const newSupplier = {
      id: newId,
      name: formData.name.trim(),
      type: formData.type,
      status: formData.status,
      contact: formData.contact.trim(),
      commission: formData.commission.trim() || 'N/A',
      balance: formData.balance.trim().startsWith('$') ? formData.balance.trim() : `$${formData.balance.trim()}`
    };

    const updatedList = [newSupplier, ...suppliers];
    setSuppliers(updatedList);
    localStorage.setItem('crm-suppliers', JSON.stringify(updatedList));

    showAlert(`Supplier "${newSupplier.name}" added successfully!`, 'success');
    setOpenModal(false);
  };

  const activeGdsCount = suppliers.filter(s => s.type === 'GDS' && s.status === 'Active').length;
  const airlineCount = suppliers.filter(s => s.type === 'Airline').length;

  const columns = [
    {
      id: 'id',
      label: 'Supplier ID',
      render: row => <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.id}</Typography>
    },
    {
      id: 'name',
      label: 'Supplier Name',
      render: row => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {row.type === 'Airline' ? <FlightIcon fontSize="small" color="primary" /> : <ApiIcon fontSize="small" color="secondary" />}
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.name}</Typography>
        </Box>
      )
    },
    { id: 'type', label: 'Type' },
    { id: 'contact', label: 'Contact Email' },
    {
      id: 'commission',
      label: 'Base Commission',
      render: row => <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>{row.commission}</Typography>
    },
    {
      id: 'balance',
      label: 'Account Balance',
      render: row => <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.balance}</Typography>
    },
    {
      id: 'status',
      label: 'Status',
      render: row => (
        <Chip
          label={row.status}
          size="small"
          color={row.status === 'Active' ? 'success' : 'default'}
          sx={{ fontWeight: 800, fontSize: '0.7rem' }}
        />
      )
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Suppliers Management"
        subtitle="Manage airline direct connects, GDS API credentials, and B2B travel suppliers."
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
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
            <Typography variant="h5" sx={{ fontWeight: 900 }}>{activeGdsCount}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Active GDS Connections</Typography>
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#FEF08A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CA8A04' }}>
            <FlightIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>{43 + airlineCount}+</Typography>
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
      />

      {/* Add Supplier Modal */}
      <AppModal
        open={openModal}
        onClose={handleCloseModal}
        title="Add New Travel Supplier"
        actions={
          <>
            <Button onClick={handleCloseModal} variant="outlined" color="inherit" sx={{ fontWeight: 700 }}>
              Cancel
            </Button>
            <Button onClick={handleAddSupplier} variant="contained" color="primary" sx={{ fontWeight: 700 }}>
              Save Supplier
            </Button>
          </>
        }
      >
        <Box component="form" onSubmit={handleAddSupplier} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
          <TextField
            label="Supplier Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Qatar Airways or Mystifly"
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel id="supplier-type-label">Type</InputLabel>
            <Select
              labelId="supplier-type-label"
              name="type"
              value={formData.type}
              label="Type"
              onChange={handleInputChange}
            >
              <MenuItem value="GDS">GDS Connection</MenuItem>
              <MenuItem value="Airline">Direct Airline Contract</MenuItem>
              <MenuItem value="Hotel Aggregator">Hotel Aggregator</MenuItem>
              <MenuItem value="Wholesaler">Travel Wholesaler</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Contact Email"
            name="contact"
            type="email"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="e.g. b2b@qatarairways.com"
            fullWidth
            required
          />

          <TextField
            label="Base Commission"
            name="commission"
            value={formData.commission}
            onChange={handleInputChange}
            placeholder="e.g. 5% or N/A"
            fullWidth
          />

          <TextField
            label="Account Balance ($)"
            name="balance"
            value={formData.balance}
            onChange={handleInputChange}
            placeholder="e.g. 5000"
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="supplier-status-label">Status</InputLabel>
            <Select
              labelId="supplier-status-label"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleInputChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </AppModal>
    </Box>
  );
}
