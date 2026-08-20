import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import AppTable from '../../components/AppTable';
import DualClock from '../../components/DualClock';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import WarningIcon from '@mui/icons-material/Warning';
import WifiIcon from '@mui/icons-material/Wifi';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer
} from 'recharts';

const ISSUANCE_TREND_DATA = [
  { day: 'Mon', 'Issued': 8 },
  { day: 'Tue', 'Issued': 14 },
  { day: 'Wed', 'Issued': 11 },
  { day: 'Thu', 'Issued': 9 },
  { day: 'Fri', 'Issued': 16 },
  { day: 'Sat', 'Issued': 6 },
  { day: 'Sun', 'Issued': 4 },
];

const RECENT_ISSUED_TICKETS = [
  { id: 'TKT-98301', customer: 'K. Patel', route: 'JFK → LHR', pnr: 'SAB89A', date: 'Today, 14:20', gds: 'Sabre', status: 'Issued' },
  { id: 'TKT-98300', customer: 'D. Miller', route: 'DEL → SIN', pnr: '1A982B', date: 'Today, 11:05', gds: 'Amadeus', status: 'Issued' },
  { id: 'TKT-98299', customer: 'H. Smith', route: 'DXB → LHR', pnr: '1P234D', date: 'Yesterday, 17:45', gds: 'Travelport', status: 'Issued' },
  { id: 'TKT-98298', customer: 'S. Al-Mutawa', route: 'BOM → DXB', pnr: 'SAB12X', date: 'Yesterday, 12:15', gds: 'Sabre', status: 'Issued' },
  { id: 'TKT-98297', customer: 'M. Garcia', route: 'LHR → JFK', pnr: '1A543E', date: '10 Aug 2026', gds: 'Amadeus', status: 'Issued' },
];

export default function TicketingAgentDashboard() {
  const navigate = useNavigate();

  const columns = [
    { id: 'id', label: 'Ticket ID', render: row => <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>{row.id}</Typography> },
    { id: 'customer', label: 'Passenger', render: row => <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.customer}</Typography> },
    { id: 'route', label: 'Route', render: row => <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.route}</Typography> },
    { id: 'pnr', label: 'GDS PNR', render: row => <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>{row.pnr}</Typography> },
    { id: 'date', label: 'Issued Time', render: row => <Typography variant="caption" color="text.secondary">{row.date}</Typography> },
    { id: 'gds', label: 'GDS', render: row => <Chip size="small" label={row.gds} sx={{ fontWeight: 800, fontSize: '0.65rem', height: 18 }} /> },
    { id: 'status', label: 'Status', render: row => <Chip size="small" label={row.status} color="success" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 18 }} /> },
  ];

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          px: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Ticketing Operations Control
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Global GDS queues, airline API connections, e-ticket issuance metrics & performance stats.
          </Typography>
        </Box>
        <DualClock compact client={{ timezone: 'America/New_York', label: 'Client EST' }} />
      </Paper>

      {/* KPI Cards Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#F0FDF4' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>TICKETS ISSUED TODAY</Typography>
            <ConfirmationNumberIcon sx={{ color: '#22C55E' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#16A34A' }}>12</Typography>
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>↑ +33% vs yesterday</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#EFF6FF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>MONTHLY ISSUANCES</Typography>
            <AirplaneTicketIcon sx={{ color: '#3B82F6' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1D4ED8' }}>142</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Target: 200 tickets</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFBEB' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>PENDING IN QUEUE</Typography>
            <QueryBuilderIcon sx={{ color: '#D97706' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#B45309' }}>3</Typography>
          <Typography variant="caption" color="warning.main" sx={{ fontWeight: 800 }}>Needs immediate action</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FEF2F2' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>ACTIVE TRACKER ALERTS</Typography>
            <WarningIcon sx={{ color: '#EF4444' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#B91C1C' }}>2</Typography>
          <Typography variant="caption" color="error.main" sx={{ fontWeight: 800 }}>Schedule changes flagged</Typography>
        </Paper>
      </Box>

      {/* Urgent TTL Banner */}
      <Paper

        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: '1px solid #FECACA',
          borderRadius: 2.5,
          bgcolor: '#FEF2F2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningIcon sx={{ color: '#DC2626', fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#991B1B' }}>
              🚨 URGENT AIRLINE TTL WARNING: PNR #ABC12D (M. Chen · JFK → LHR)
            </Typography>
            <Typography variant="caption" sx={{ color: '#B91C1C', fontWeight: 600 }}>
              Ticketing Time Limit expires in <b>38 minutes</b>. Auto-cancellation by American Airlines if unissued.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => navigate('/ticketing')}
          sx={{ fontWeight: 800, borderRadius: 2, textTransform: 'none' }}
        >
          Issue Ticket Now (001-XXXX)
        </Button>
      </Paper>

      {/* Main Grid Content */}
      <Grid container spacing={3}>
        {/* Left Section: Recent Tickets & GDS Status */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              🎫 RECENTLY ISSUED TICKETS
            </Typography>


            <AppTable
              columns={columns}
              data={RECENT_ISSUED_TICKETS}
              count={RECENT_ISSUED_TICKETS.length}
              page={0}
              rowsPerPage={5}
              onPageChange={() => {}}
              onRowsPerPageChange={() => {}}
              hidePagination
            />
          </Paper>

          {/* GDS Connectivity */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              🌐 GDS CONNECTIONS & AIRLINE API STATUS
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              {[
                { name: 'Sabre GDS Host', speed: '42ms', status: 'Active', color: '#22C55E' },
                { name: 'Amadeus 1A Gateway', speed: '58ms', status: 'Active', color: '#22C55E' },
                { name: 'Travelport GDS Link', speed: '110ms', status: 'Degraded', color: '#F59E0B' },
              ].map((c) => (
                <Box key={c.name} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WifiIcon sx={{ color: c.color }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{c.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Latency: {c.speed}</Typography>
                    <Chip size="small" label={c.status} color={c.status === 'Active' ? 'success' : 'warning'} sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800, mt: 0.5 }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right Section: Trend Chart & Shortcuts */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              📈 DAILY ISSUANCE TREND
            </Typography>
            <Box sx={{ height: 210, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ISSUANCE_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <ChartTooltip />
                  <Bar dataKey="Issued" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Quick Actions / Shortcuts */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              ⚡ QUICK SHORTCUTS
            </Typography>
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Button
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/ticketing')}
                sx={{ py: 1.2, borderRadius: 2, fontWeight: 800, background: 'linear-gradient(135deg, #3F51B5 0%, #303F9F 100%)' }}
              >
                Go to Issuance Queue
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/flight-alerts')}
                sx={{ py: 1.2, borderRadius: 2, fontWeight: 800 }}
              >
                View Live Flight Alerts
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/bookings')}
                sx={{ py: 1.2, borderRadius: 2, fontWeight: 800 }}
              >
                Manage Bookings List
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
