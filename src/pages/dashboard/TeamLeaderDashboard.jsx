import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DualClock from '../../components/DualClock';
import AgentActivityFeed from '../../components/AgentActivityFeed';
import Leaderboard from '../../components/Leaderboard';
import ReallocationTool from '../../components/ReallocationTool';
import { useAlert } from '../../contexts/AlertContext';

const queue = [
  ['Neglected Lead', 'Google Ads', '15 mins ago'],
  ['Neglected Lead', 'Facebook', '18 mins ago'],
  ['Hot VIP Lead', 'Referral', '2 mins ago'],
  ['New Inbound', 'Organic', '1 min ago']
];

export default function TeamLeaderDashboard() { 
  const { showAlert } = useAlert(); 
  const action = (message) => showAlert(message, 'success'); 
  
  return (
    <Box sx={{ pb: 4, minHeight: '100vh' }}>
      {/* Top Header */}
      <Paper elevation={0} sx={{ p: 1.5, px: 3, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>Command Centre</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Team Leader Dashboard</Typography>
        </Box>
        <DualClock client={{ timezone: 'America/New_York', label: 'EST' }} />
      </Paper>

      {/* Activity Feed horizontally spans the top */}
      <AgentActivityFeed />

      {/* 3 Column Layout below */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr 340px' }, gap: 2 }}>
        
        {/* Left Column: Queue Status */}
        <Box>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>LEAD QUEUE STATUS</Typography>
              <Chip label="LIVE" size="small" color="error" variant="outlined" sx={{ fontWeight: 800, animation: 'pulse 2s infinite' }} />
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
            
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>URGENT QUEUE</Typography>
            <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: '#64748B', borderBottom: '1px solid #f1f5f9' }}>Lead Type</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: '#64748B', borderBottom: '1px solid #f1f5f9' }}>Source</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: '#64748B', borderBottom: '1px solid #f1f5f9' }}>Wait Time</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: '12px 8px', fontWeight: 700, borderBottom: '1px solid #f1f5f9' }}>
                      <Chip label={r[0]} size="small" color={r[0].includes('VIP') ? 'primary' : 'warning'} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }} />
                    </td>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f5f9', color: '#475569', fontWeight: 600 }}>{r[1]}</td>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f5f9', color: '#ef4444', fontWeight: 700 }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </Box>

        {/* Center Column: Performance & Leaderboard */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>TEAM METRICS</Typography>
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
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2 }}>LEAD CONTROLS</Typography>
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Button variant="contained" color="primary" onClick={() => action('Round-robin assignment completed')} sx={{ py: 1.5, borderRadius: 2, fontWeight: 800 }}>
                Distribute 15 Leads
              </Button>
              <Button variant="outlined" onClick={() => action('Wasted leads cooldown opened')} sx={{ py: 1, borderRadius: 2, fontWeight: 700 }}>
                Wasted Leads Cooldown
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 4, mt: 2, bgcolor: '#fffbeb' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#b45309' }}>DISCOUNT APPROVALS</Typography>
              <Chip label="1 Pending" size="small" color="warning" sx={{ fontWeight: 800 }} />
            </Box>
            <Typography variant="body2" sx={{ my: 1.5, fontWeight: 600, color: '#78350f', fontSize: '0.8rem' }}>
              <b>Sofia R.</b> requests a 10% discount for <b>Karan Singh</b> (DEL→LHR, $10,350) to close immediately.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Button size="small" variant="contained" color="success" onClick={() => action('10% discount approved')} sx={{ fontWeight: 700 }}>Approve</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => action('Discount request rejected')} sx={{ fontWeight: 700 }}>Reject</Button>
              <Button size="small" variant="outlined" sx={{ gridColumn: '1 / -1', fontWeight: 700 }} onClick={() => action('5% counter-offer sent')}>Send 5% Counter</Button>
            </Box>
          </Paper>

          <ReallocationTool onReassign={agent => action(`Lead reassigned to ${agent}`)} />
        </Box>
      </Box>
    </Box>
  ); 
}
