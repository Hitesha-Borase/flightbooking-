import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

// Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import GroupsIcon from '@mui/icons-material/Groups';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import SpeedIcon from '@mui/icons-material/Speed';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

// Recharts
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// MOCK DATASETS
// ==========================================

const INITIAL_EXEC_KPIS = [
  { id: 'leads', title: 'Total Leads', value: '12,450 Leads', change: '+14% MoM', isUp: true, color: '#3F51B5', border: '#3F51B5', icon: <PeopleAltIcon /> },
  { id: 'bookings', title: 'Total Bookings', value: '1,840 Bookings', change: '+18% MoM', isUp: true, color: '#2563EB', border: '#2563EB', icon: <AirplaneTicketIcon /> },
  { id: 'revenue', title: 'Total Revenue', value: '$1,420,000', change: '+$142k this month', isUp: true, color: '#059669', border: '#059669', icon: <MonetizationOnIcon /> },
  { id: 'profit', title: 'Gross Profit', value: '$184,500', change: '13.0% margin', isUp: true, color: '#C59B27', border: '#C59B27', icon: <VerifiedIcon /> },
  { id: 'conv', title: 'Conversion Rate', value: '14.8%', change: '+1.4% target', isUp: true, color: '#7C3AED', border: '#7C3AED', icon: <TrendingUpIcon /> },
  { id: 'avgValue', title: 'Avg Booking Value', value: '$771', change: 'Per ticket avg', isUp: true, color: '#0284C7', border: '#0284C7', icon: <SpeedIcon /> },
  { id: 'pending', title: 'Pending Payments', value: '$42,800', change: 'In clearing queue', isUp: false, color: '#D97706', border: '#D97706', icon: <AccountBalanceIcon /> },
  { id: 'refund', title: 'Refund Amount', value: '$8,200', change: '12 approved cases', isUp: false, color: '#DC2626', border: '#DC2626', icon: <AssessmentIcon /> },
  { id: 'cancel', title: 'Cancellation Rate', value: '1.2%', change: 'Industry low', isUp: true, color: '#059669', border: '#059669', icon: <FlightTakeoffIcon /> }
];

const REVENUE_TREND_DATA = [
  { month: 'Jan', revenue: 98000, profit: 12800 },
  { month: 'Feb', revenue: 110000, profit: 14500 },
  { month: 'Mar', revenue: 125000, profit: 16200 },
  { month: 'Apr', revenue: 118000, profit: 15400 },
  { month: 'May', revenue: 142000, profit: 18500 },
  { month: 'Jun', revenue: 165000, profit: 21800 }
];

const AGENT_LEADERBOARD = [
  { rank: 1, name: 'Sarah Jenkins', calls: 450, talkTime: '18h 30m', leads: 280, quotes: 84, bookings: 42, conv: '15.0%', revenue: '$145,000', profit: '$18,200' },
  { rank: 2, name: 'Alex Miller', calls: 410, talkTime: '16h 45m', leads: 240, quotes: 72, bookings: 36, conv: '15.0%', revenue: '$128,000', profit: '$16,100' },
  { rank: 3, name: 'David Ross', calls: 380, talkTime: '14h 10m', leads: 210, quotes: 60, bookings: 28, conv: '13.3%', revenue: '$98,000', profit: '$12,400' },
  { rank: 4, name: 'Sofia Rodriguez', calls: 430, talkTime: '17h 20m', leads: 260, quotes: 78, bookings: 38, conv: '14.6%', revenue: '$132,000', profit: '$16,800' }
];

const SUPPLIER_PERFORMANCE_DATA = [
  { name: 'Amadeus 1A Air', revenue: '$620,000', bookings: 780, failureRate: '0.2%', refundRate: '0.4%' },
  { name: 'Sabre 1S GDS', revenue: '$540,000', bookings: 680, failureRate: '0.1%', refundRate: '0.3%' },
  { name: 'Travelport 1G', revenue: '$260,000', bookings: 380, failureRate: '0.5%', refundRate: '0.8%' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ManagementReportingDashboard() {
  const { showAlert } = useAlert();
  const [currentTab, setCurrentTab] = useState(0);
  const [dateRange, setDateRange] = useState('MONTHLY');

  // Drill-Down State Hierarchy
  const [drillLevel, setDrillLevel] = useState(1);
  const [drillData, setDrillData] = useState({
    company: 'FlightBooking Global Enterprise',
    department: 'Sales Department',
    team: 'Alpha Sales Team',
    agent: 'Sarah Jenkins',
    lead: 'LD-99120 (Dr. Harrison Wells)',
    booking: 'BK-10231 (DEL ➔ LHR ➔ JFK)',
    transaction: 'TXN-991 ($28,500 Amex Payment Recvd)'
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleExport = (format) => {
    showAlert(`✓ Report exported in ${format.toUpperCase()} format successfully!`, 'success');
  };

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            📊
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                Executive Management Reporting & Analytics Command Center
              </Typography>
              <Chip label="ROLE: OWNER / MANAGEMENT / SUPER ADMIN" size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: '#C59B27', color: '#FFF', height: 24 }} />
              <Chip label="7-LEVEL DRILL-DOWN" size="small" variant="outlined" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem', height: 24 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Enterprise Overview of Sales, Agent Leaderboards, Flight Operations, Financial P&L, and Multi-Level Drill-Down Analytics
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ width: 140 }}>
            <InputLabel>Date Range</InputLabel>
            <Select value={dateRange} label="Date Range" onChange={e => setDateRange(e.target.value)}>
              <MenuItem value="TODAY">Today</MenuItem>
              <MenuItem value="WEEKLY">Weekly</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
              <MenuItem value="QUARTERLY">Quarterly</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" color="primary" startIcon={<FileDownloadIcon />} onClick={() => handleExport('pdf')} sx={{ fontWeight: 800 }}>
            PDF
          </Button>
          <Button variant="contained" color="success" startIcon={<FileDownloadIcon />} onClick={() => handleExport('excel')} sx={{ fontWeight: 800 }}>
            Excel
          </Button>
          <DualClock client={{ timezone: 'America/New_York', label: 'Exec EST' }} />
        </Box>
      </Paper>

      {/* 9 TOP EXECUTIVE KPI CARDS */}
      <Box sx={{ mb: 3.5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)', lg: 'repeat(9, 1fr)' }, gap: 1.5 }}>
          {INITIAL_EXEC_KPIS.map((kpi) => (
            <Paper
              key={kpi.id}
              elevation={0}
              sx={{
                p: 1.8,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#FFFFFF',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  backgroundColor: kpi.border
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                  {kpi.title}
                </Typography>
                <Box sx={{ p: 0.5, borderRadius: 1.2, bgcolor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {kpi.icon}
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                  {kpi.value}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: kpi.border, fontSize: '0.6rem' }}>
                  {kpi.change}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* MODULE TABS */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 800,
              fontSize: '0.78rem',
              py: 1.8,
              minHeight: 48,
              textTransform: 'none'
            }
          }}
        >
          <Tab label="1. Executive Overview & P&L" icon={<AssessmentIcon fontSize="small" />} iconPosition="start" />
          <Tab label="2. Sales & Campaign Funnel" icon={<TrendingUpIcon fontSize="small" />} iconPosition="start" />
          <Tab label="3. Agent Scorecard & Leaderboard" icon={<PeopleAltIcon fontSize="small" />} iconPosition="start" />
          <Tab label="4. Flight Operations & Suppliers" icon={<FlightTakeoffIcon fontSize="small" />} iconPosition="start" />
          <Tab label="5. Financial P&L & Cashflow" icon={<MonetizationOnIcon fontSize="small" />} iconPosition="start" />
          <Tab label="6. Mandatory 7-Level Drill-Down Engine" icon={<SpeedIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* ========================================================= */}
      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {/* ========================================================= */}
      {currentTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5', mb: 2 }}>
              📈 Enterprise Monthly Revenue & Gross Profit Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#3F51B5" fill="#3F51B520" strokeWidth={3} />
                  <Area type="monotone" dataKey="profit" name="Gross Profit ($)" stroke="#C59B27" fill="#C59B2720" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      )}

      {/* ========================================================= */}
      {/* TAB 3: AGENT SCORECARD & LEADERBOARD */}
      {/* ========================================================= */}
      {currentTab === 2 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#C59B27', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            🏆 Top Performing Sales Agents Leaderboard
          </Typography>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Sales Agent</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Calls / Talk Time</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Leads / Quotes</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Bookings Completed</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Conversion %</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Revenue</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Gross Profit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {AGENT_LEADERBOARD.map((ag) => (
                  <TableRow key={ag.name} hover>
                    <TableCell><Chip label={`#${ag.rank}`} size="small" color={ag.rank === 1 ? 'secondary' : 'default'} sx={{ fontWeight: 900 }} /></TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>{ag.name}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>{ag.calls} calls ({ag.talkTime})</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>{ag.leads} leads / {ag.quotes} quotes</TableCell>
                    <TableCell align="center"><Chip label={`${ag.bookings} Bookings`} size="small" color="primary" sx={{ fontWeight: 900 }} /></TableCell>
                    <TableCell align="center"><Chip label={ag.conv} size="small" color="success" sx={{ fontWeight: 900 }} /></TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: 'primary.main' }}>{ag.revenue}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: '#059669' }}>{ag.profit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 4: FLIGHT OPERATIONS & SUPPLIERS */}
      {/* ========================================================= */}
      {currentTab === 3 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669', mb: 2 }}>
            ✈️ GDS & Air Aggregator Supplier Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Supplier GDS Provider</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Supplier Revenue</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Booking Count</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Failure Rate %</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Refund Rate %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SUPPLIER_PERFORMANCE_DATA.map((sup) => (
                  <TableRow key={sup.name} hover>
                    <TableCell sx={{ fontWeight: 900 }}>{sup.name}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: 'primary.main' }}>{sup.revenue}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800 }}>{sup.bookings} bookings</TableCell>
                    <TableCell align="center"><Chip label={sup.failureRate} size="small" color="success" sx={{ fontWeight: 800 }} /></TableCell>
                    <TableCell align="center"><Chip label={sup.refundRate} size="small" color="info" sx={{ fontWeight: 800 }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 6: MANDATORY 7-LEVEL DRILL-DOWN ENGINE */}
      {/* ========================================================= */}
      {(currentTab === 5 || currentTab === 1) && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon color="primary" />
              Mandatory 7-Level Interactive Executive Drill-Down Hierarchy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click any level to drill down seamlessly: Company ➔ Department ➔ Team ➔ Agent ➔ Lead ➔ Booking ➔ Transaction
            </Typography>
          </Box>

          {/* BREADCRUMB NAVIGATION */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#F8FAFC', borderRadius: 2 }}>
            <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
              <Link color={drillLevel === 1 ? 'primary' : 'inherit'} onClick={() => setDrillLevel(1)} sx={{ fontWeight: 900, cursor: 'pointer' }}>
                L1: Company
              </Link>
              {drillLevel >= 2 && (
                <Link color={drillLevel === 2 ? 'primary' : 'inherit'} onClick={() => setDrillLevel(2)} sx={{ fontWeight: 900, cursor: 'pointer' }}>
                  L2: Department ({drillData.department})
                </Link>
              )}
              {drillLevel >= 3 && (
                <Link color={drillLevel === 3 ? 'primary' : 'inherit'} onClick={() => setDrillLevel(3)} sx={{ fontWeight: 900, cursor: 'pointer' }}>
                  L3: Team ({drillData.team})
                </Link>
              )}
              {drillLevel >= 4 && (
                <Link color={drillLevel === 4 ? 'primary' : 'inherit'} onClick={() => setDrillLevel(4)} sx={{ fontWeight: 900, cursor: 'pointer' }}>
                  L4: Agent ({drillData.agent})
                </Link>
              )}
              {drillLevel >= 5 && (
                <Link color={drillLevel === 5 ? 'primary' : 'inherit'} onClick={() => setDrillLevel(5)} sx={{ fontWeight: 900, cursor: 'pointer' }}>
                  L5: Lead ({drillData.lead})
                </Link>
              )}
              {drillLevel >= 6 && (
                <Link color={drillLevel === 6 ? 'primary' : 'inherit'} onClick={() => setDrillLevel(6)} sx={{ fontWeight: 900, cursor: 'pointer' }}>
                  L6: Booking ({drillData.booking})
                </Link>
              )}
              {drillLevel >= 7 && (
                <Typography color="primary" sx={{ fontWeight: 900 }}>
                  L7: Transaction ({drillData.transaction})
                </Typography>
              )}
            </Breadcrumbs>
          </Paper>

          {/* DRILL-DOWN LEVEL DETAILS */}
          {drillLevel === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>LEVEL 1: Company Level Overview</Typography>
              <Button variant="contained" color="primary" onClick={() => setDrillLevel(2)} sx={{ fontWeight: 800 }}>
                Drill Down to Level 2: Departments ➔
              </Button>
            </Box>
          )}

          {drillLevel === 2 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>LEVEL 2: Sales Department Overview</Typography>
              <Button variant="contained" color="primary" onClick={() => setDrillLevel(3)} sx={{ fontWeight: 800 }}>
                Drill Down to Level 3: Alpha Sales Team ➔
              </Button>
            </Box>
          )}

          {drillLevel === 3 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>LEVEL 3: Alpha Sales Team Overview</Typography>
              <Button variant="contained" color="primary" onClick={() => setDrillLevel(4)} sx={{ fontWeight: 800 }}>
                Drill Down to Level 4: Agent Sarah Jenkins ➔
              </Button>
            </Box>
          )}

          {drillLevel === 4 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>LEVEL 4: Agent Sarah Jenkins Scorecard</Typography>
              <Button variant="contained" color="primary" onClick={() => setDrillLevel(5)} sx={{ fontWeight: 800 }}>
                Drill Down to Level 5: Lead LD-99120 ➔
              </Button>
            </Box>
          )}

          {drillLevel === 5 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>LEVEL 5: Lead LD-99120 Attribution</Typography>
              <Button variant="contained" color="primary" onClick={() => setDrillLevel(6)} sx={{ fontWeight: 800 }}>
                Drill Down to Level 6: Booking BK-10231 ➔
              </Button>
            </Box>
          )}

          {drillLevel === 6 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>LEVEL 6: Central Booking Record BK-10231</Typography>
              <Button variant="contained" color="primary" onClick={() => setDrillLevel(7)} sx={{ fontWeight: 800 }}>
                Drill Down to Level 7: Financial Transaction ➔
              </Button>
            </Box>
          )}

          {drillLevel === 7 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#059669', mb: 2 }}>LEVEL 7: Financial Transaction Ledger ($28,500 Recvd)</Typography>
              <Chip label="Deepest Level Reached" color="success" sx={{ fontWeight: 900 }} />
            </Box>
          )}
        </Paper>
      )}

    </Box>
  );
}
