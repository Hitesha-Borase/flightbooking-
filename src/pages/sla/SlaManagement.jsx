import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
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
import InputAdornment from '@mui/material/InputAdornment';

// Icons
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SpeedIcon from '@mui/icons-material/Speed';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import RefreshIcon from '@mui/icons-material/Refresh';

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

const INITIAL_SLA_KPIS = [
  { id: 'activeSla', title: 'Total Active SLAs', value: '42 Active', change: 'Live countdowns', isUp: true, color: '#3F51B5', border: '#3F51B5', icon: <TimerIcon /> },
  { id: 'completedOnTime', title: 'Completed On Time', value: '1,280 SLAs', change: '96.4% on-time', isUp: true, color: '#059669', border: '#059669', icon: <CheckCircleIcon /> },
  { id: 'approaching', title: 'Approaching Deadline', value: '8 SLAs', change: '< 2m remaining', isUp: false, color: '#D97706', border: '#D97706', icon: <WarningAmberIcon /> },
  { id: 'breached', title: 'SLA Breached', value: '3 Breaches', change: 'Escalated to TL', isUp: false, color: '#DC2626', border: '#DC2626', icon: <ReportProblemIcon /> },
  { id: 'avgResponse', title: 'Avg Response Time', value: '3m 12s', change: 'Target < 5m', isUp: true, color: '#0284C7', border: '#0284C7', icon: <SpeedIcon /> },
  { id: 'avgTicketing', title: 'Avg Ticketing Time', value: '6m 45s', change: 'Target < 10m', isUp: true, color: '#7C3AED', border: '#7C3AED', icon: <ConfirmationNumberIcon /> },
  { id: 'slaCompliance', title: 'SLA Compliance %', value: '96.4%', change: '+1.2% this week', isUp: true, color: '#C59B27', border: '#C59B27', icon: <VerifiedIcon /> }
];

const DEFAULT_MANDATORY_SLA_RULES = [
  { id: 'RULE-1', event: 'New Lead Created', targetText: 'First Contact within 5 Minutes', targetMinutes: 5, agentAlert: 'At 3 Minutes', tlAlert: 'At 5 Minutes', expertTlEscalation: 'If unresolved after 10m', priority: 'Standard', status: 'Active' },
  { id: 'RULE-2', event: 'High-Value Lead ($10k+)', targetText: 'First Contact within 2 Minutes', targetMinutes: 2, agentAlert: 'At 1 Minute', tlAlert: 'At 2 Minutes', expertTlEscalation: 'Immediate Red Alert', priority: 'Critical Red', status: 'Active' },
  { id: 'RULE-3', event: 'Payment Received', targetText: 'Ticketing within 10 Minutes', targetMinutes: 10, agentAlert: 'At 8 Minutes', tlAlert: 'At 10 Minutes', expertTlEscalation: 'Escalate pending GDS PNR', priority: 'High Priority', status: 'Active' },
  { id: 'RULE-4', event: 'Customer Request / Inquiry', targetText: 'Response within 15 Minutes', targetMinutes: 15, agentAlert: 'At 10 Minutes', tlAlert: 'At 15 Minutes', expertTlEscalation: 'Escalate to Concierge Desk', priority: 'Standard', status: 'Active' }
];

const INITIAL_ACTIVE_SLA_TRACKER = [
  { id: 'SLA-801', customerName: 'Dr. Harrison Wells', leadBookingId: 'LD-99120', type: 'High-Value Lead', agent: 'Sarah Jenkins', tl: 'Michael Chang', startTime: '14:20:10', deadlineTime: '14:22:10', remaining: '1m 15s remaining', priority: 'Critical Red', status: 'On Time', color: '#059669', bg: '#ECFDF5' },
  { id: 'SLA-802', customerName: 'Elena Rostova', leadBookingId: 'BK-10912', type: 'Payment Received (Ticketing)', agent: 'Alex Miller', tl: 'Sofia Rodriguez', startTime: '14:14:00', deadlineTime: '14:24:00', remaining: '1m 45s remaining', priority: 'High Priority', status: 'Warning', color: '#D97706', bg: '#FFFBEB' },
  { id: 'SLA-803', customerName: 'Marcus Sterling', leadBookingId: 'LD-98440', type: 'New Lead', agent: 'David Ross', tl: 'Michael Chang', startTime: '13:45:00', deadlineTime: '13:50:00', remaining: 'Expired (Breached 32m ago)', priority: 'Standard', status: 'SLA Breached', color: '#DC2626', bg: '#FEF2F2' },
  { id: 'SLA-804', customerName: 'Ambassador Harold Vance', leadBookingId: 'BK-10892', type: 'Customer Request', agent: 'Sarah Jenkins', tl: 'Michael Chang', startTime: '14:15:00', deadlineTime: '14:30:00', remaining: '7m 45s remaining', priority: 'High Priority', status: 'On Time', color: '#059669', bg: '#ECFDF5' }
];

const INITIAL_SLA_ALERTS = [
  { id: 'ALT-101', type: 'SLA Breached', leadId: 'LD-98440', customer: 'Marcus Sterling', agent: 'David Ross', tl: 'Michael Chang', escalationLevel: 'Expert Team Leader Notified', time: '13:50:05', message: 'New Lead SLA 5m breached. Case escalated to Expert TL.' },
  { id: 'ALT-102', type: 'Approaching Deadline', leadId: 'BK-10912', customer: 'Elena Rostova', agent: 'Alex Miller', tl: 'Sofia Rodriguez', escalationLevel: 'Team Leader Warning', time: '14:22:15', message: 'Payment Ticketing SLA has less than 2 minutes remaining.' }
];

const AGENT_COMPLIANCE_DATA = [
  { name: 'Sarah Jenkins', compliance: 98.5, avgTime: '2m 10s', onTime: 420, breached: 6 },
  { name: 'Alex Miller', compliance: 96.2, avgTime: '3m 40s', onTime: 380, breached: 15 },
  { name: 'David Ross', compliance: 94.1, avgTime: '4m 15s', onTime: 310, breached: 19 },
  { name: 'Sofia Rodriguez', compliance: 97.8, avgTime: '2m 45s', onTime: 395, breached: 9 }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function SlaManagement() {
  const { showAlert } = useAlert();
  const [currentTab, setCurrentTab] = useState(0);

  // States
  const [rules, setRules] = useState(DEFAULT_MANDATORY_SLA_RULES);
  const [activeTracker, setActiveTracker] = useState(INITIAL_ACTIVE_SLA_TRACKER);
  const [alerts, setAlerts] = useState(INITIAL_SLA_ALERTS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [editRuleModalOpen, setEditRuleModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [editTargetMinutes, setEditTargetMinutes] = useState(5);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setEditTargetMinutes(rule.targetMinutes);
    setEditRuleModalOpen(true);
  };

  const handleSaveRule = () => {
    if (!selectedRule) return;
    setRules(prev => prev.map(r => r.id === selectedRule.id ? { ...r, targetMinutes: editTargetMinutes, targetText: `First Contact within ${editTargetMinutes} Minutes` } : r));
    setEditRuleModalOpen(false);
    showAlert(`✓ SLA Rule "${selectedRule.event}" updated to ${editTargetMinutes} minutes target!`, 'success');
  };

  const handleResolveBreach = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    showAlert(`✓ SLA Breach Alert ${alertId} resolved and logged in compliance history`, 'success');
  };

  const filteredTracker = useMemo(() => {
    return activeTracker.filter(t => {
      const matchesSearch = t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || t.leadBookingId.toLowerCase().includes(searchQuery.toLowerCase()) || t.agent.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [activeTracker, searchQuery, statusFilter, priorityFilter]);

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#C59B27', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(197, 155, 39, 0.3)' }}>
            SLA
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                SLA Service Level Agreement Management System
              </Typography>
              <Chip label="ROLE: ADMIN / TL / EXPERT TL" size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: '#C59B27', color: '#FFF', height: 24 }} />
              <Chip label="REAL-TIME DEADLINE MONITORING" size="small" variant="outlined" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem', height: 24 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Automated Response Deadlines & Escalations: New Lead (5m), High-Value (2m), Payment Ticketing (10m), Customer Request (15m)
            </Typography>
          </Box>
        </Box>
        <DualClock client={{ timezone: 'America/New_York', label: 'SLA Engine Time (EST)' }} />
      </Paper>

      {/* 7 REAL-TIME SLA KPI CARDS */}
      <Box sx={{ mb: 3.5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' }, gap: 1.5 }}>
          {INITIAL_SLA_KPIS.map((kpi) => (
            <Paper
              key={kpi.id}
              elevation={0}
              sx={{
                p: 2,
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem' }}>
                  {kpi.title}
                </Typography>
                <Box sx={{ p: 0.5, borderRadius: 1.5, bgcolor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {kpi.icon}
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                  {kpi.value}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: kpi.border, fontSize: '0.62rem' }}>
                  {kpi.change}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* DASHBOARD MODULE TABS */}
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
          <Tab label="1. SLA Performance Dashboard" icon={<SpeedIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`2. Mandatory SLA Rules Configurator (${rules.length} Rules)`} icon={<GavelIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`3. Active SLA Tracker (${filteredTracker.length} Live)`} icon={<TimerIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`4. SLA Alerts & Escalations (${alerts.length} Queue)`} icon={<NotificationsActiveIcon fontSize="small" />} iconPosition="start" />
          <Tab label="5. SLA History & Compliance Reports" icon={<AssessmentIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* ========================================================= */}
      {/* TAB 1: SLA PERFORMANCE DASHBOARD */}
      {/* ========================================================= */}
      {currentTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon color="primary" />
                Real-Time Live SLA Countdown Monitor
              </Typography>
              <Chip label="Overall Compliance: 96.4%" color="success" sx={{ fontWeight: 900 }} />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
              {activeTracker.map((item) => (
                <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: item.bg, borderColor: item.color }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip label={item.status} size="small" sx={{ fontWeight: 900, bgcolor: item.color, color: '#FFFFFF', fontSize: '0.65rem' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{item.leadBookingId}</Typography>
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary' }}>
                    {item.customerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                    Type: <b>{item.type}</b>
                  </Typography>

                  <Paper variant="outlined" sx={{ p: 1, bgcolor: '#FFFFFF', borderRadius: 1.5, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>COUNTDOWN TIMER:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: item.color, fontFamily: 'monospace' }}>
                      ⏱️ {item.remaining}
                    </Typography>
                  </Paper>

                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Rep: <b>{item.agent}</b> • TL: <b>{item.tl}</b>
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Box>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MANDATORY SLA RULES CONFIGURATOR */}
      {/* ========================================================= */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#C59B27', display: 'flex', alignItems: 'center', gap: 1 }}>
                <GavelIcon color="secondary" />
                Mandatory System SLA Rules & Timing Configurator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure default response deadlines, agent warning thresholds, and multi-tier escalation paths
              </Typography>
            </Box>
            <Chip label="Admin SLA Enforcement Active" color="primary" sx={{ fontWeight: 800 }} />
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Rule ID & Event</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Mandatory SLA Target</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Agent Warning Alert</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Team Leader Alert</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Expert TL Escalation</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Priority</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Admin Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>{rule.event}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{rule.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={rule.targetText} size="small" color="primary" sx={{ fontWeight: 900, fontSize: '0.72rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={rule.agentAlert} size="small" color="warning" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={rule.tlAlert} size="small" color="error" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#DC2626' }}>{rule.expertTlEscalation}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={rule.priority} size="small" color={rule.priority.includes('Red') ? 'error' : 'default'} sx={{ fontWeight: 800 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" color="primary" onClick={() => handleEditRule(rule)} startIcon={<EditIcon />} sx={{ fontWeight: 800, fontSize: '0.68rem' }}>
                        Edit SLA
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 3: ACTIVE SLA TRACKER LEDGER */}
      {/* ========================================================= */}
      {currentTab === 2 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5' }}>
                Active Ongoing SLA Case Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time tracking ledger for ongoing leads, confirmed bookings, ticketing, and customer requests
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search customer, ID, agent..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{ width: 260 }}
              />

              <FormControl size="small" sx={{ width: 140 }}>
                <InputLabel>SLA Status</InputLabel>
                <Select value={statusFilter} label="SLA Status" onChange={e => setStatusFilter(e.target.value)}>
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="On Time">🟢 On Time</MenuItem>
                  <MenuItem value="Warning">🟡 Warning</MenuItem>
                  <MenuItem value="SLA Breached">🔴 SLA Breached</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 950 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Customer Name & ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>SLA Type</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Assigned Agent</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Start Time</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Deadline</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Remaining Time</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Priority</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>SLA Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTracker.map((t) => (
                  <TableRow key={t.id} hover sx={{ bgcolor: t.bg }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>{t.customerName}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{t.leadBookingId}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={t.type} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{t.agent}</Typography>
                      <Typography variant="caption" color="text.secondary">TL: {t.tl}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="caption" sx={{ fontWeight: 700 }}>{t.startTime}</Typography></TableCell>
                    <TableCell><Typography variant="caption" sx={{ fontWeight: 700 }}>{t.deadlineTime}</Typography></TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 900, color: t.color, fontFamily: 'monospace' }}>
                        {t.remaining}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={t.priority} size="small" color={t.priority.includes('Red') ? 'error' : 'default'} sx={{ fontWeight: 800 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={t.status} size="small" sx={{ fontWeight: 900, bgcolor: t.color, color: '#FFFFFF' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SLA ALERTS & ESCALATION CENTER */}
      {/* ========================================================= */}
      {currentTab === 3 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReportProblemIcon color="error" />
                Live SLA Alerts & Multi-Tier Escalation Queue
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Automatic notifications dispatched to Agent, Team Leader, and Expert Team Leader
              </Typography>
            </Box>
            <Chip label={`${alerts.length} Unresolved Alerts`} color="error" sx={{ fontWeight: 800 }} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {alerts.map((a) => (
              <Paper key={a.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#FEF2F2', borderColor: '#FCA5A5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#991B1B' }}>
                      {a.id} • {a.type} ({a.leadId})
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                      Customer: <b>{a.customer}</b> • Rep: <b>{a.agent}</b> • TL: <b>{a.tl}</b>
                    </Typography>
                  </Box>
                  <Chip label={a.escalationLevel} size="small" color="error" sx={{ fontWeight: 900 }} />
                </Box>

                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.2 }}>Escalation Reason & System Alert:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#DC2626' }}>{a.message}</Typography>
                </Paper>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="contained" color="success" onClick={() => handleResolveBreach(a.id)} sx={{ fontWeight: 800 }}>
                    Acknowledge & Resolve SLA
                  </Button>
                  <Button size="small" variant="outlined" color="primary" onClick={() => showAlert(`Agent callback triggered for ${a.customer}`, 'info')} startIcon={<PhoneInTalkIcon />} sx={{ fontWeight: 700 }}>
                    Agent Direct Callback
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 5: SLA HISTORY & COMPLIANCE REPORTS */}
      {/* ========================================================= */}
      {currentTab === 4 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
                📊 AGENT SLA COMPLIANCE RATE (%)
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={AGENT_COMPLIANCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[80, 100]} />
                    <RechartsTooltip />
                    <Bar dataKey="compliance" name="Compliance %" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
                ⏱️ AVERAGE RESPONSE TIME BY AGENT
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Sales Rep</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>Compliance %</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>Avg Response Time</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>On Time / Breached</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {AGENT_COMPLIANCE_DATA.map((ag) => (
                      <TableRow key={ag.name} hover>
                        <TableCell sx={{ fontWeight: 800 }}>{ag.name}</TableCell>
                        <TableCell align="center">
                          <Chip label={`${ag.compliance}%`} size="small" color="success" sx={{ fontWeight: 900 }} />
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>
                          {ag.avgTime}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          <span style={{ color: '#059669' }}>{ag.onTime}</span> / <span style={{ color: '#DC2626' }}>{ag.breached}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
      )}

      {/* MODALS */}
      <Dialog open={editRuleModalOpen} onClose={() => setEditRuleModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: 'primary.main' }}>
          ⚙️ Edit SLA Rule Threshold
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {selectedRule && (
            <Box sx={{ p: 1.5, bgcolor: '#EFF6FF', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                {selectedRule.event} ({selectedRule.id})
              </Typography>
            </Box>
          )}

          <TextField
            label="Target SLA Minutes"
            type="number"
            size="small"
            value={editTargetMinutes}
            onChange={e => setEditTargetMinutes(parseInt(e.target.value) || 1)}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditRuleModalOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSaveRule} variant="contained" color="primary" sx={{ fontWeight: 800 }}>
            Save SLA Target
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
