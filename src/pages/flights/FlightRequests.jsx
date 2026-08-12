import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';

import PageHeader from '../../components/PageHeader';
import AppTable from '../../components/AppTable';
import AppModal from '../../components/AppModal';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../components/FlightRequestQueue';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';

export const DEMO_ALL_FLIGHT_REQUESTS = [
  {
    id: 'FE-4591',
    route: 'JFK → LHR',
    origin: 'JFK',
    destination: 'LHR',
    region: 'Transatlantic',
    travelDate: '2026-10-15',
    returnDate: '2026-10-22',
    dateDisplay: '15OCT - 22OCT',
    cabinClass: 'Business',
    passengers: 2,
    salesAgent: 'Sarah Jenkins',
    status: 'New',
    priority: 'Urgent',
    notes: 'Client looking for lie-flat seats on AA/BA non-stop.'
  },
  {
    id: 'FE-4592',
    route: 'JFK → LHR',
    origin: 'JFK',
    destination: 'LHR',
    region: 'Transatlantic',
    travelDate: '2026-10-15',
    returnDate: '2026-10-22',
    dateDisplay: '15OCT - 22OCT',
    cabinClass: 'Business',
    passengers: 2,
    salesAgent: 'Alex Morgan',
    status: 'In Progress',
    priority: 'High',
    notes: 'Checking Virgin Atlantic vs British Airways pricing.'
  },
  {
    id: 'FE-4593',
    route: 'DEL → DXB',
    origin: 'DEL',
    destination: 'DXB',
    region: 'Middle East',
    travelDate: '2026-11-01',
    returnDate: '2026-11-10',
    dateDisplay: '01NOV - 10NOV',
    cabinClass: 'First',
    passengers: 1,
    salesAgent: 'David Ray',
    status: 'Quote Ready',
    priority: 'High',
    notes: 'Emirates First Class suite quote calculated.'
  },
  {
    id: 'FE-4594',
    route: 'SFO → SIN',
    origin: 'SFO',
    destination: 'SIN',
    region: 'Asia Pacific',
    travelDate: '2026-12-05',
    returnDate: '2026-12-20',
    dateDisplay: '05DEC - 20DEC',
    cabinClass: 'Business',
    passengers: 4,
    salesAgent: 'Maria Chen',
    status: 'Sent to Agent',
    priority: 'Normal',
    notes: 'Family business class booking on Singapore Airlines.'
  },
  {
    id: 'FE-4595',
    route: 'ORD → CDG',
    origin: 'ORD',
    destination: 'CDG',
    region: 'Transatlantic',
    travelDate: '2026-11-12',
    returnDate: '2026-11-19',
    dateDisplay: '12NOV - 19NOV',
    cabinClass: 'Economy',
    passengers: 3,
    salesAgent: 'Sarah Jenkins',
    status: 'Completed',
    priority: 'Normal',
    notes: 'Air France non-stop ticketing complete.'
  },
  {
    id: 'FE-4596',
    route: 'LAX → HND',
    origin: 'LAX',
    destination: 'HND',
    region: 'Asia Pacific',
    travelDate: '2026-10-20',
    returnDate: '2026-11-03',
    dateDisplay: '20OCT - 03NOV',
    cabinClass: 'Premium Economy',
    passengers: 2,
    salesAgent: 'Sofia Rodriguez',
    status: 'New',
    priority: 'High',
    notes: 'ANA or JAL premium economy options required.'
  },
  {
    id: 'FE-4597',
    route: 'MIA → GRU',
    origin: 'MIA',
    destination: 'GRU',
    region: 'Latin America',
    travelDate: '2026-11-15',
    returnDate: '2026-11-28',
    dateDisplay: '15NOV - 28NOV',
    cabinClass: 'Business',
    passengers: 1,
    salesAgent: 'Alex Morgan',
    status: 'In Progress',
    priority: 'Normal',
    notes: 'LATAM non-stop flight option requested.'
  },
  {
    id: 'FE-4598',
    route: 'JFK → FRA',
    origin: 'JFK',
    destination: 'FRA',
    region: 'Europe',
    travelDate: '2026-12-01',
    returnDate: '2026-12-10',
    dateDisplay: '01DEC - 10DEC',
    cabinClass: 'Business',
    passengers: 2,
    salesAgent: 'David Ray',
    status: 'Quote Ready',
    priority: 'Urgent',
    notes: 'Lufthansa First/Business class quote pending.'
  }
];

export default function FlightRequests() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { currentUser } = useAuth();

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cabinFilter, setCabinFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Selected Detail Modal State
  const [selectedReq, setSelectedReq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filtered dataset calculation
  const filteredData = useMemo(() => {
    return DEMO_ALL_FLIGHT_REQUESTS.filter(r => {
      const q = search.toLowerCase();
      const matchSearch =
        r.id.toLowerCase().includes(q) ||
        r.route.toLowerCase().includes(q) ||
        r.salesAgent.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q);

      const matchStatus = statusFilter ? r.status === statusFilter : true;
      const matchCabin = cabinFilter ? r.cabinClass === cabinFilter : true;
      const matchRegion = regionFilter ? r.region === regionFilter : true;
      const matchPriority = priorityFilter ? r.priority === priorityFilter : true;
      const matchDate = dateFilter ? r.travelDate.includes(dateFilter) : true;

      return matchSearch && matchStatus && matchCabin && matchRegion && matchPriority && matchDate;
    });
  }, [search, statusFilter, cabinFilter, regionFilter, priorityFilter, dateFilter]);

  const handleOpenRequest = (row) => {
    setSelectedReq(row);
    setModalOpen(true);
  };

  const handleOpenInDesk = (row) => {
    showAlert(`Opening Request #${row.id} in Flight Expert / GDS Desk...`, 'info');
    navigate('/flight_expert/dashboard');
  };

  const columns = [
    {
      id: 'reqId',
      label: 'Request ID',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>
          {row.id}
        </Typography>
      )
    },
    {
      id: 'customer',
      label: 'Customer',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {row.customerName || 'Karan Singh'}
        </Typography>
      )
    },
    {
      id: 'route',
      label: 'Route',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <FlightTakeoffIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.route}</Typography>
            <Typography variant="caption" color="text.secondary">{row.region}</Typography>
          </Box>
        </Box>
      )
    },
    {
      id: 'date',
      label: 'Date',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.dateDisplay}
        </Typography>
      )
    },
    {
      id: 'cabin',
      label: 'Cabin',
      render: (row) => (
        <Chip size="small" label={row.cabinClass} variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
      )
    },
    {
      id: 'pax',
      label: 'Pax',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          👥 {row.passengers}
        </Typography>
      )
    },
    {
      id: 'agent',
      label: 'Sales Agent',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.salesAgent}
        </Typography>
      )
    },
    {
      id: 'priority',
      label: 'Priority',
      render: (row) => {
        const pCfg = PRIORITY_CONFIG[row.priority] || PRIORITY_CONFIG['Normal'];
        return (
          <Chip size="small" label={pCfg.label} color={pCfg.color} sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22 }} />
        );
      }
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => {
        const sCfg = STATUS_CONFIG[row.status] || STATUS_CONFIG['New'];
        return (
          <Chip
            size="small"
            label={sCfg.label}
            sx={{
              bgcolor: sCfg.bg,
              color: sCfg.text,
              fontWeight: 800,
              fontSize: '0.68rem',
              height: 22
            }}
          />
        );
      }
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Flight Requests (/flights)"
        subtitle="Manage incoming GDS flight requests, priority queues and GDS desk routing."
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={() => navigate('/flight_expert/dashboard')}
            sx={{ fontWeight: 800 }}
          >
            Open Flight Expert / GDS Desk
          </Button>
        }
      />

      {/* KPI Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 1.5, mb: 3 }}>
        {[
          { label: 'Total Requests', value: DEMO_ALL_FLIGHT_REQUESTS.length, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'New Requests', value: DEMO_ALL_FLIGHT_REQUESTS.filter(r => r.status === 'New').length, color: '#DC2626', bg: '#FEF2F2' },
          { label: 'In Progress', value: DEMO_ALL_FLIGHT_REQUESTS.filter(r => r.status === 'In Progress').length, color: '#D97706', bg: '#FFFBEB' },
          { label: 'Quotes Ready', value: DEMO_ALL_FLIGHT_REQUESTS.filter(r => r.status === 'Quote Ready').length, color: '#0284C7', bg: '#E0F2FE' },
          { label: 'Urgent Priority', value: DEMO_ALL_FLIGHT_REQUESTS.filter(r => r.priority === 'Urgent').length, color: '#9333EA', bg: '#F3E8FF' }
        ].map((kpi, idx) => (
          <Paper key={idx} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: kpi.bg }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
              {kpi.label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: kpi.color, mt: 0.5 }}>
              {kpi.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Filter Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)', md: '200px 150px 160px 160px 150px 140px' }, gap: 1.5, alignItems: 'center' }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search ID, route, agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Status Filter */}
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Quote Ready">Quote Ready</MenuItem>
              <MenuItem value="Sent to Agent">Sent to Agent</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          {/* Cabin Filter */}
          <FormControl size="small" fullWidth>
            <InputLabel>Cabin Class</InputLabel>
            <Select
              value={cabinFilter}
              label="Cabin Class"
              onChange={(e) => setCabinFilter(e.target.value)}
            >
              <MenuItem value="">All Cabins</MenuItem>
              <MenuItem value="Economy">Economy</MenuItem>
              <MenuItem value="Premium Economy">Premium Economy</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="First">First</MenuItem>
            </Select>
          </FormControl>

          {/* Region Filter */}
          <FormControl size="small" fullWidth>
            <InputLabel>Route Region</InputLabel>
            <Select
              value={regionFilter}
              label="Route Region"
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <MenuItem value="">All Regions</MenuItem>
              <MenuItem value="Transatlantic">Transatlantic</MenuItem>
              <MenuItem value="Middle East">Middle East</MenuItem>
              <MenuItem value="Asia Pacific">Asia Pacific</MenuItem>
              <MenuItem value="Europe">Europe</MenuItem>
              <MenuItem value="Latin America">Latin America</MenuItem>
            </Select>
          </FormControl>

          {/* Priority Filter */}
          <FormControl size="small" fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value="Urgent">Urgent</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Normal">Normal</MenuItem>
            </Select>
          </FormControl>

          {/* Reset Filters */}
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setCabinFilter('');
              setRegionFilter('');
              setPriorityFilter('');
              setDateFilter('');
            }}
            sx={{ fontWeight: 700 }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Requests Table */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        <AppTable
          columns={columns}
          data={filteredData}
          onRowClick={(row) => handleOpenRequest(row)}
          actions={(row) => (
            <Box sx={{ display: 'flex', gap: 0.8, whiteSpace: 'nowrap' }}>
              <Tooltip title="View Request Details">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpenRequest(row)}
                  sx={{ py: 0.3, px: 1, fontSize: '0.72rem', fontWeight: 700 }}
                >
                  View
                </Button>
              </Tooltip>

              <Tooltip title="Open in GDS Parsing Desk">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon sx={{ fontSize: 13 }} />}
                  onClick={() => handleOpenInDesk(row)}
                  sx={{ py: 0.3, px: 1, fontSize: '0.72rem', fontWeight: 700 }}
                >
                  Parse
                </Button>
              </Tooltip>

              <Tooltip title="Continue Processing Request">
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => handleOpenInDesk(row)}
                  sx={{ py: 0.3, px: 1, fontSize: '0.72rem', fontWeight: 700 }}
                >
                  Continue Processing
                </Button>
              </Tooltip>
            </Box>
          )}
        />
      </Paper>

      {/* Detail Modal */}
      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedReq ? `Flight Request Details: ${selectedReq.id}` : ''}
        maxWidth="sm"
        actions={
          selectedReq && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button variant="outlined" onClick={() => setModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={() => {
                  setModalOpen(false);
                  handleOpenInDesk(selectedReq);
                }}
              >
                Open in GDS Parsing Desk
              </Button>
            </Box>
          )
        }
      >
        {selectedReq && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                ✈️ {selectedReq.route} ({selectedReq.region})
              </Typography>
              <Chip label={selectedReq.status} color="primary" sx={{ fontWeight: 800 }} />
            </Box>

            <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, fontSize: '0.85rem' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Travel Dates:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedReq.dateDisplay}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Cabin & Pax:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedReq.cabinClass} ({selectedReq.passengers} Pax)</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Assigned Sales Agent:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedReq.salesAgent}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Priority:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>{selectedReq.priority}</Typography>
                </Box>
              </Box>
            </Paper>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                AGENT NOTES & REQUIREMENTS
              </Typography>
              <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 1.5, fontSize: '0.85rem' }}>
                💡 {selectedReq.notes}
              </Paper>
            </Box>
          </Box>
        )}
      </AppModal>
    </Box>
  );
}
