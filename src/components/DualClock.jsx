import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';

export default function DualClock({ client }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timezone) => {
    try {
      return time.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '00:00';
    }
  };

  const getClientHour = (timezone) => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: 'numeric', hourCycle: 'h23' }).formatToParts(time);
      const hr = parts.find(p => p.type === 'hour')?.value;
      return parseInt(hr || '0', 10);
    } catch {
      return 12;
    }
  };

  const agentTime = formatTime(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const clientTime = formatTime(client.timezone);
  const hour = getClientHour(client.timezone);
  const isDay = hour >= 6 && hour < 18;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 3, 
      bgcolor: 'background.paper',
      p: 1.5,
      px: 3,
      borderRadius: 4,
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.06)' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Agent (Local):</Typography>
        <Typography variant="body1" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace', fontSize: '1.1rem' }}>{agentTime}</Typography>
      </Box>
      <Box sx={{ width: '1px', height: 24, bgcolor: 'divider' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PublicIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Client ({client.label}):</Typography>
        <Typography variant="body1" sx={{ fontWeight: 800, color: 'secondary.main', fontFamily: 'monospace', fontSize: '1.1rem' }}>{clientTime}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, px: 1.5, py: 0.5, borderRadius: 2, bgcolor: isDay ? '#FFFBEB' : '#F1F5F9' }}>
        {isDay ? <WbSunnyIcon sx={{ color: '#F59E0B', fontSize: 16 }} /> : <NightlightRoundIcon sx={{ color: '#475569', fontSize: 16 }} />}
        <Typography variant="caption" sx={{ fontWeight: 800, color: isDay ? '#D97706' : '#334155' }}>
          {isDay ? 'DAYTIME' : 'NIGHTTIME'}
        </Typography>
      </Box>
    </Box>
  );
}
