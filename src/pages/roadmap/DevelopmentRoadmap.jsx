import React, { useState } from 'react';
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
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Icons
import MapIcon from '@mui/icons-material/Map';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import SecurityIcon from '@mui/icons-material/Security';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PsychologyIcon from '@mui/icons-material/Psychology';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// ROADMAP DATASETS
// ==========================================

const PHASES = [
  {
    id: 1,
    title: 'Priority 1 — Sales Conversion (Highest Priority)',
    subtitle: 'Convert leads into bookings as quickly as possible',
    status: 'ACTIVE & DEPLOYED (100%)',
    color: '#3F51B5',
    bg: '#EFF6FF',
    modules: [
      'Lead Management', 'Lead Auto-Distribution', 'Agent Workspace',
      'Calling System', 'Customer 360 View', 'Follow-up Management',
      'Quote Management', 'Sales Dashboard & KPIs'
    ],
    kpis: ['New Leads', 'Assigned Leads', 'Contact Rate', 'Quotes Sent', 'Conversion Rate %', 'Revenue Generated']
  },
  {
    id: 2,
    title: 'Priority 2 — Booking Operations',
    subtitle: 'Manage complete booking lifecycle from search to ticketing',
    status: 'ACTIVE & DEPLOYED (100%)',
    color: '#059669',
    bg: '#ECFDF5',
    modules: [
      'Flight Search Engine', 'Supplier / GDS Integration (Sabre & Amadeus)',
      'Single Central Booking Record (14-Tab Architecture)', 'Ticketing Management',
      'Payment & Ledger Management', 'After-Sales & Schedule Change Support'
    ],
    kpis: ['Flight Searches', 'Confirmed Bookings', 'Supplier Cost', 'Ticket Issuance Time', 'Cancellation Rate']
  },
  {
    id: 3,
    title: 'Priority 3 — Management Control',
    subtitle: 'Monitor team quality, SLA compliance, and financial P&L',
    status: 'ACTIVE & DEPLOYED (100%)',
    color: '#C59B27',
    bg: '#FEFCE8',
    modules: [
      'Team Leader Dashboard', '14-Point Booking QA Checklist',
      'SLA Management System (5m, 2m, 10m, 15m targets)', 'Workflow & Event Automation Engine',
      'Executive Management Reporting (7-Level Drill Down)', 'Finance Dashboard & Audit Trail'
    ],
    kpis: ['Team Revenue', 'Conversion Rate', 'QA Score', 'SLA Compliance %', 'Pending Payments', 'Gross Profit']
  },
  {
    id: 4,
    title: 'Priority 4 — Scale & Automation',
    subtitle: 'Advanced AI automation, marketing ROI, and multi-channel scale',
    status: 'ACTIVE & DEPLOYED (100%)',
    color: '#7C3AED',
    bg: '#F5F3FF',
    modules: [
      'Marketing Dashboard & Conversion Funnel', 'UTM Attribution & Campaign ROI Ledger',
      'Central Notification System & Delivery Gateway', 'AI Lead Assignment & Follow-up Insights',
      'Multi-Channel Social Inbox (WhatsApp, Email, SMS)', 'Advanced Analytics & Forecasting'
    ],
    kpis: ['Marketing ROI %', 'Cost Per Lead (CPL)', 'AI Lead Scoring Accuracy', 'Notification Delivery Rate']
  }
];

const WORKFLOW_STEPS = [
  '1. Lead Received', '2. Quote Generated', '3. Customer Payment',
  '4. Booking Created', '5. Ticket Issued (GDS)', '6. After-Sales Support', '7. AI Automation'
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function DevelopmentRoadmap() {
  const { showAlert } = useAlert();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            🗺️
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                CRM 4-Phase Development Priority Roadmap Control Center
              </Typography>
              <Chip label="BUSINESS-FIRST WORKFLOW" size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: '#059669', color: '#FFF', height: 24 }} />
              <Chip label="ALL 4 PHASES DEPLOYED" size="small" variant="outlined" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem', height: 24 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Priority 1: Sales Conversion ➔ Priority 2: Booking Operations ➔ Priority 3: Management Control ➔ Priority 4: Scale & Automation
            </Typography>
          </Box>
        </Box>
        <DualClock client={{ timezone: 'America/New_York', label: 'Roadmap EST' }} />
      </Paper>

      {/* END-TO-END BUSINESS WORKFLOW STEPPER */}
      <Paper elevation={0} sx={{ p: 3, mb: 3.5, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#3F51B5', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          🔄 End-to-End Business-First CRM Workflow Architecture
        </Typography>

        <Stepper activeStep={6} alternativeLabel sx={{ pt: 1 }}>
          {WORKFLOW_STEPS.map((label) => (
            <Step key={label} completed>
              <StepLabel
                StepIconProps={{
                  style: { color: '#059669' }
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800 }}>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* 4 PRIORITY PHASE CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 2.5, mb: 3.5 }}>
        {PHASES.map((phase) => (
          <Paper
            key={phase.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: phase.bg,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '6px',
                height: '100%',
                backgroundColor: phase.color
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: phase.color, fontFamily: 'Outfit, sans-serif' }}>
                  {phase.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {phase.subtitle}
                </Typography>
              </Box>
              <Chip label={phase.status} size="small" sx={{ fontWeight: 900, bgcolor: phase.color, color: '#FFF' }} />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1 }}>
              📦 Included Modules:
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
              {phase.modules.map((m) => (
                <Chip key={m} label={m} size="small" variant="outlined" sx={{ fontWeight: 700, bgcolor: '#FFFFFF', borderColor: phase.color, color: 'text.primary' }} />
              ))}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1 }}>
              🎯 Tracked KPIs & Metrics:
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              {phase.kpis.map((k) => (
                <Chip key={k} label={`• ${k}`} size="small" sx={{ fontWeight: 800, bgcolor: `${phase.color}15`, color: phase.color }} />
              ))}
            </Box>
          </Paper>
        ))}
      </Box>

    </Box>
  );
}
