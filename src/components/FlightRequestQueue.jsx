import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const STATUS_CONFIG = {
  'New':          { color: 'error',   bg: '#FEE2E2', text: '#991B1B', label: '🔴 New' },
  'In Progress':  { color: 'warning', bg: '#FEF3C7', text: '#92400E', label: '🟡 In Progress' },
  'Quote Ready':  { color: 'info',    bg: '#E0F2FE', text: '#075985', label: '🔵 Quote Ready' },
  'Sent to Agent':{ color: 'success', bg: '#DCFCE7', text: '#166534', label: '🟢 Sent to Agent' },
  'Completed':    { color: 'default', bg: '#F1F5F9', text: '#475569', label: '✅ Completed' },
};

export const PRIORITY_CONFIG = {
  'Urgent': { color: 'error', label: '⚡ URGENT' },
  'High':   { color: 'warning', label: '🔥 HIGH' },
  'Normal': { color: 'info', label: 'NORMAL' },
};

export const DEMO_QUEUE_REQUESTS = [
  {
    id: 'FE-4591',
    origin: 'JFK',
    originCity: 'New York',
    destination: 'LHR',
    destinationCity: 'London',
    travelDate: '15OCT - 22OCT',
    cabinClass: 'Business',
    passengers: 2,
    salesAgent: 'Sarah Jenkins (SE)',
    priority: 'Urgent',
    status: 'New',
    netFare: 4500,
    gdsRaw: '1 AA 100 J 15OCT JFK LHR 1830 0730+1\n2 BA 117 C 22OCT LHR JFK 1100 1430'
  },
  {
    id: 'FE-4592',
    origin: 'JFK',
    originCity: 'New York',
    destination: 'LHR',
    destinationCity: 'London',
    travelDate: '15OCT - 22OCT',
    cabinClass: 'Business',
    passengers: 2,
    salesAgent: 'Alex Morgan (SE)',
    priority: 'High',
    status: 'In Progress',
    netFare: 4200,
    gdsRaw: '1 VS 003 J 15OCT JFK LHR 2000 0815+1\n2 VS 004 J 22OCT LHR JFK 1400 1730'
  },
  {
    id: 'FE-4593',
    origin: 'DEL',
    originCity: 'Delhi',
    destination: 'DXB',
    destinationCity: 'Dubai',
    travelDate: '01NOV - 10NOV',
    cabinClass: 'First',
    passengers: 1,
    salesAgent: 'David Ray (SE)',
    priority: 'High',
    status: 'Quote Ready',
    netFare: 3800,
    gdsRaw: '1 EK 511 F 01NOV DEL DXB 1030 1245\n2 EK 512 F 10NOV DXB DEL 2150 0240+1'
  },
  {
    id: 'FE-4594',
    origin: 'SFO',
    originCity: 'San Francisco',
    destination: 'SIN',
    destinationCity: 'Singapore',
    travelDate: '05DEC - 20DEC',
    cabinClass: 'Business',
    passengers: 4,
    salesAgent: 'Maria Chen (SE)',
    priority: 'Normal',
    status: 'Sent to Agent',
    netFare: 11200,
    gdsRaw: '1 SQ 031 J 05DEC SFO SIN 1040 1900+1\n2 SQ 032 J 20DEC SIN SFO 0925 0745'
  },
  {
    id: 'FE-4595',
    origin: 'ORD',
    originCity: 'Chicago',
    destination: 'CDG',
    destinationCity: 'Paris',
    travelDate: '12NOV - 19NOV',
    cabinClass: 'Economy',
    passengers: 3,
    salesAgent: 'Sarah Jenkins (SE)',
    priority: 'Normal',
    status: 'Completed',
    netFare: 2400,
    gdsRaw: '1 AF 137 Y 12NOV ORD CDG 1715 0830+1\n2 AF 136 Y 19NOV CDG ORD 1150 1410'
  }
];

export default function FlightRequestQueue({
  requests = DEMO_QUEUE_REQUESTS,
  selectedId,
  onSelectRequest
}) {
  const [search, setSearch] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');

  const statusList = ['All', 'New', 'In Progress', 'Quote Ready', 'Sent to Agent', 'Completed'];

  const filteredRequests = requests.filter(r => {
    const query = search.toLowerCase();
    const matchesSearch =
      r.id.toLowerCase().includes(query) ||
      r.origin.toLowerCase().includes(query) ||
      r.destination.toLowerCase().includes(query) ||
      (r.salesAgent && r.salesAgent.toLowerCase().includes(query)) ||
      (r.cabinClass && r.cabinClass.toLowerCase().includes(query));

    const matchesStatus = activeStatusFilter === 'All' ? true : r.status === activeStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightTakeoffIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
            FLIGHT REQUEST QUEUE
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${filteredRequests.length} Requests`}
          color="primary"
          sx={{ fontWeight: 800, fontSize: '0.7rem' }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Incoming requests submitted by sales agents for GDS pricing & quote generation.
      </Typography>

      {/* Search Input */}
      <TextField
        fullWidth
        size="small"
        placeholder="🔍 Search ID, origin, destination, agent..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 1.5, '& input': { fontSize: '0.85rem' } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Status Quick Filter Chips */}
      <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', mb: 2 }}>
        {statusList.map(st => {
          const isActive = activeStatusFilter === st;
          const count = st === 'All' ? requests.length : requests.filter(r => r.status === st).length;
          return (
            <Chip
              key={st}
              size="small"
              label={`${st} (${count})`}
              onClick={() => setActiveStatusFilter(st)}
              color={isActive ? 'primary' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              sx={{ fontSize: '0.66rem', fontWeight: 700, cursor: 'pointer', height: 22 }}
            />
          );
        })}
      </Box>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4, px: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            No flight requests found
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Try adjusting your search query or status filter.
          </Typography>
        </Box>
      )}

      {/* Cards List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
        {filteredRequests.map((r) => {
          const isSelected = selectedId === r.id;
          const statusCfg = STATUS_CONFIG[r.status] || STATUS_CONFIG['New'];
          const priorityCfg = PRIORITY_CONFIG[r.priority] || PRIORITY_CONFIG['Normal'];

          return (
            <Paper
              key={r.id}
              variant="outlined"
              onClick={() => onSelectRequest(r)}
              sx={{
                p: 1.5,
                cursor: 'pointer',
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? '#EFF6FF' : 'background.paper',
                boxShadow: isSelected ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: isSelected ? '#EFF6FF' : '#F8FAFC',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {/* Card Header: Request # & Status Badge */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>
                  Request #{r.id}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  {r.priority && r.priority !== 'Normal' && (
                    <Chip
                      size="small"
                      label={priorityCfg.label}
                      color={priorityCfg.color}
                      sx={{ fontSize: '0.6rem', height: 18, fontWeight: 800 }}
                    />
                  )}
                  <Chip
                    size="small"
                    label={statusCfg.label}
                    sx={{
                      fontSize: '0.64rem',
                      height: 20,
                      fontWeight: 800,
                      bgcolor: statusCfg.bg,
                      color: statusCfg.text
                    }}
                  />
                </Box>
              </Box>

              {/* Route */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, fontSize: '0.95rem' }}>
                  {r.origin} → {r.destination}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({r.originCity || r.origin} to {r.destinationCity || r.destination})
                </Typography>
              </Box>

              {/* Meta: Dates | Cabin | Pax */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.8, fontSize: '0.75rem', color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <CalendarMonthIcon sx={{ fontSize: 13 }} />
                  <span>{r.travelDate}</span>
                </Box>
                <span>•</span>
                <Chip size="small" label={r.cabinClass} variant="outlined" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                <span>•</span>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  👥 {r.passengers} Pax
                </Typography>
              </Box>

              {/* Assigned Sales Agent */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.4, fontSize: '0.7rem' }}>
                  <PersonIcon sx={{ fontSize: 13 }} />
                  Agent: <b>{r.salesAgent || 'Unassigned'}</b>
                </Typography>

                <Button
                  size="small"
                  variant={isSelected ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon={<PlayArrowIcon sx={{ fontSize: 14 }} />}
                  sx={{ py: 0.2, px: 1, fontSize: '0.7rem', fontWeight: 700 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRequest(r);
                  }}
                >
                  View / Parse
                </Button>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
}
