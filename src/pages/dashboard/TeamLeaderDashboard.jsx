import React, { useState } from 'react';
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
import HeadsetIcon from '@mui/icons-material/Headset';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DualClock from '../../components/DualClock';
import AgentActivityFeed from '../../components/AgentActivityFeed';
import Leaderboard from '../../components/Leaderboard';
import ReallocationTool from '../../components/ReallocationTool';
import { useAlert } from '../../contexts/AlertContext';

const initialQueue = [
  ['Neglected Lead', 'Google Ads', '15 mins ago', 'LD-1004 (LHR→SIN)'],
  ['Neglected Lead', 'Facebook', '18 mins ago', 'LD-1005 (DEL→SIN)'],
  ['Hot VIP Lead', 'Referral', '2 mins ago', 'LD-1001 (DEL→LHR)'],
  ['New Inbound', 'Organic', '1 min ago', 'LD-1003 (JFK→LHR)']
];

const initialApprovals = [
  {
    id: 'APP-101',
    agent: 'Sofia R.',
    lead: 'Karan Singh',
    sector: 'DEL → LHR',
    pax: 2,
    cabin: 'Business',
    originalPrice: 2500,
    requestedDiscount: 150,
    marginAfterDiscount: 280,
    reason: 'Client has competing quote from Expedia. Ready to pay immediately.',
    status: 'Pending'
  },
  {
    id: 'APP-102',
    agent: 'Alex M.',
    lead: 'Michael Chen',
    sector: 'JFK → LHR',
    pax: 1,
    cabin: 'First',
    originalPrice: 4800,
    requestedDiscount: 200,
    marginAfterDiscount: 450,
    reason: 'Repeat corporate flyer requesting waiver on service fee.',
    status: 'Pending'
  }
];

const floorAgents = [
  { name: 'Sarah J.', status: 'ON CALL', time: '12:40 min', lead: 'Karan S. (DEL-LHR)', color: 'success' },
  { name: 'David R.', status: 'WRAP UP', time: '02:15 min', lead: 'Ankit S. (DEL-DXB)', color: 'warning' },
  { name: 'Sofia R.', status: 'AVAILABLE', time: '04:30 min', lead: 'Idle', color: 'info' },
  { name: 'Alex M.', status: 'ON CALL', time: '08:12 min', lead: 'Michael C. (JFK-LHR)', color: 'success' },
  { name: 'Rita V.', status: 'BREAK', time: '14:20 min', lead: 'Lunch Break', color: 'default' }
];

export default function TeamLeaderDashboard() { 
  const { showAlert } = useAlert(); 
  const [approvals, setApprovals] = useState(initialApprovals);
  const [distributeOpen, setDistributeOpen] = useState(false);
  const [distSource, setDistSource] = useState('All Inbound');
  const [distStrategy, setDistStrategy] = useState('Round Robin (Active Agents)');

  const handleApprove = (id, discount, leadName) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    showAlert(`✓ Approved $${discount} discount for ${leadName}. Sales Agent notified.`, 'success');
  };

  const handleReject = (id, leadName) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
    showAlert(`✕ Discount rejected for ${leadName}. Retaining full margin.`, 'error');
  };

  const handleCounterOffer = (id, counterAmount, leadName) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: `Counter $${counterAmount}` } : a));
    showAlert(`Counter-offer of $${counterAmount} sent for ${leadName}.`, 'warning');
  };

  const handleDistributeLeads = () => {
    setDistributeOpen(false);
    showAlert(`🚀 15 leads from "${distSource}" distributed via ${distStrategy}`, 'success');
  };

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');

  return (
    <Box sx={{ pb: 4, minHeight: '100vh' }}>
      {/* Top Header */}
      <Paper elevation={0} sx={{ p: 1.5, px: 3, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>Command Centre</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Team Leader & Floor Sales Operations</Typography>
        </Box>
        <DualClock client={{ timezone: 'America/New_York', label: 'Client EST' }} />
      </Paper>

      {/* Activity Feed horizontally spans the top */}
      <AgentActivityFeed />

      {/* 3 Column Layout below */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr 360px' }, gap: 2 }}>
        
        {/* Left Column: Queue Status & Live Floor Monitor */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>LEAD QUEUE & SLA STATUS</Typography>
              <Chip label="LIVE" size="small" color="error" variant="outlined" sx={{ fontWeight: 800 }} />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, textAlign: 'center', mb: 3 }}>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3, bgcolor: '#fafafa' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Unassigned</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>15</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3, bgcolor: '#f0f9ff', borderColor: '#bae6fd' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0284c7' }}>New Inbound</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0369a1' }}>8</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3, bgcolor: '#fef2f2', borderColor: '#fecaca' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#dc2626' }}>MAX WAIT</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#b91c1c' }}>23min</Typography>
              </Paper>
            </Box>
            
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>URGENT NEGLECTED LEADS</Typography>
            <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#64748B', borderBottom: '1px solid #f1f5f9' }}>Priority</th>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#64748B', borderBottom: '1px solid #f1f5f9' }}>Route / Lead</th>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#64748B', borderBottom: '1px solid #f1f5f9' }}>Source</th>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#64748B', borderBottom: '1px solid #f1f5f9' }}>Wait</th>
                </tr>
              </thead>
              <tbody>
                {initialQueue.map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: '8px', fontWeight: 700, borderBottom: '1px solid #f1f5f9' }}>
                      <Chip label={r[0]} size="small" color={r[0].includes('VIP') ? 'primary' : 'warning'} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }} />
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', fontWeight: 700 }}>{r[3]}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>{r[1]}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#ef4444', fontWeight: 700 }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>

          {/* Live Floor QA Monitoring */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
                <HeadsetIcon color="primary" fontSize="small" />
                LIVE FLOOR CALL MONITORING
              </Typography>
              <Chip label="5 Agents" size="small" sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {floorAgents.map((agent, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 1.2, px: 1.5, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: agent.status === 'ON CALL' ? '#F0FDF4' : '#F8FAFC' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      {agent.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {agent.lead} ({agent.time})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={agent.status} size="small" color={agent.color} sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800 }} />
                    {agent.status === 'ON CALL' && (
                      <Tooltip title="Listen in / QA Barge">
                        <Button size="small" variant="text" onClick={() => showAlert(`Listening to ${agent.name}'s call with ${agent.lead}`, 'info')} sx={{ fontSize: '0.7rem', fontWeight: 700, minWidth: 0, p: 0.5 }}>
                          🎧 Listen
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Center Column: Performance & Leaderboard */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>TEAM SALES METRICS</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 2, mt: 2 }}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#ecfdf5', borderRadius: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669' }}>CONVERSION</Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#10b981' }}>8.1%</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>REVENUE (USD 225k)</Typography>
                <Box sx={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 1, mt: 1 }}>
                  {[30, 40, 25, 52, 45, 60].map((h, i) => (
                    <Box key={i} sx={{ flex: 1, height: h, bgcolor: i === 5 ? 'primary.main' : 'primary.200', borderRadius: '4px 4px 0 0' }} />
                  ))}
                </Box>
              </Paper>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Calls: <b style={{ color: '#000' }}>114</b></Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Avg Call: <b style={{ color: '#000' }}>18m</b></Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>SMS: <b style={{ color: '#000' }}>449</b></Typography>
            </Box>
          </Paper>
          <Leaderboard />
        </Box>

        {/* Right Column: Actions & Approvals */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>LEAD DISTRIBUTION CONTROLS</Typography>
            <Box sx={{ display: 'grid', gap: 1.2 }}>
              <Button variant="contained" color="primary" onClick={() => setDistributeOpen(true)} sx={{ py: 1.2, borderRadius: 2, fontWeight: 800, textTransform: 'none' }}>
                🚀 Smart Distribute 15 Leads
              </Button>
              <Button variant="outlined" onClick={() => showAlert('Wasted leads cooldown initiated for inactive leads', 'info')} sx={{ py: 0.8, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
                Wasted Leads Cooldown
              </Button>
            </Box>
          </Paper>
          
          {/* Dynamic Discount Approvals Desk */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 4, mt: 2, bgcolor: '#FFFBEB' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#B45309' }}>DISCOUNT APPROVALS</Typography>
              <Chip label={`${pendingApprovals.length} Pending`} size="small" color={pendingApprovals.length > 0 ? "warning" : "default"} sx={{ fontWeight: 800 }} />
            </Box>

            {pendingApprovals.length === 0 ? (
              <Box sx={{ py: 2, textAlign: 'center' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 28, mb: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#065F46' }}>
                  All approval requests resolved!
                </Typography>
              </Box>
            ) : (
              pendingApprovals.map((app) => (
                <Paper key={app.id} variant="outlined" sx={{ p: 1.5, mb: 1.5, borderRadius: 2.5, bgcolor: '#FFF' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      {app.agent} ➔ {app.lead}
                    </Typography>
                    <Chip label={`-$${app.requestedDiscount}`} size="small" color="error" sx={{ fontWeight: 900, height: 20, fontSize: '0.68rem' }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Route: <b>{app.sector}</b> ({app.cabin}) | Selling: <b>${app.originalPrice}</b>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700, display: 'block', mb: 1 }}>
                    Estimated Margin Remaining: <b>${app.marginAfterDiscount}</b>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', fontStyle: 'italic', display: 'block', mb: 1.5, bgcolor: '#F8FAFC', p: 0.8, borderRadius: 1.5 }}>
                    "{app.reason}"
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.8 }}>
                    <Button size="small" variant="contained" color="success" onClick={() => handleApprove(app.id, app.requestedDiscount, app.lead)} sx={{ fontWeight: 800, fontSize: '0.72rem', py: 0.5 }}>
                      Approve
                    </Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleReject(app.id, app.lead)} sx={{ fontWeight: 800, fontSize: '0.72rem', py: 0.5 }}>
                      Reject
                    </Button>
                    <Button size="small" variant="outlined" color="warning" onClick={() => handleCounterOffer(app.id, Math.round(app.requestedDiscount / 2), app.lead)} sx={{ gridColumn: '1 / -1', fontWeight: 700, fontSize: '0.72rem', py: 0.5 }}>
                      Counter Offer (-${Math.round(app.requestedDiscount / 2)})
                    </Button>
                  </Box>
                </Paper>
              ))
            )}
          </Paper>

          <ReallocationTool onReassign={agent => showAlert(`5 Neglected leads reassigned to ${agent}`, 'success')} />
        </Box>
      </Box>

      {/* SMART LEAD DISTRIBUTION DIALOG */}
      <Dialog open={distributeOpen} onClose={() => setDistributeOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>
          🚀 Smart Lead Distribution
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Select inbound lead channel and distribution logic for active sales floor agents:
          </Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Lead Source Channel</InputLabel>
            <Select value={distSource} label="Lead Source Channel" onChange={e => setDistSource(e.target.value)}>
              <MenuItem value="All Inbound">All Inbound Channels (15 Leads)</MenuItem>
              <MenuItem value="Google Ads">Google Ads Flight Campaigns (8 Leads)</MenuItem>
              <MenuItem value="Meta / WhatsApp">Meta & WhatsApp Inbound (4 Leads)</MenuItem>
              <MenuItem value="Website Organic">Website Organic Searches (3 Leads)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Distribution Strategy</InputLabel>
            <Select value={distStrategy} label="Distribution Strategy" onChange={e => setDistStrategy(e.target.value)}>
              <MenuItem value="Round Robin (Active Agents)">Round Robin (Active Agents Only)</MenuItem>
              <MenuItem value="Skill Based (Route Expertise)">Skill Based (US/UK to Senior Agents)</MenuItem>
              <MenuItem value="Capacity Weighted">Capacity Weighted (Fill Inactive Agents)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDistributeOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDistributeLeads} variant="contained" color="primary" sx={{ fontWeight: 800 }}>
            Distribute Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  ); 
}

