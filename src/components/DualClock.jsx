import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';

const timeFor = (zone) => new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: zone }).format(new Date());

export default function DualClock({ client = { timezone: 'America/New_York', label: 'EST' }, compact = false }) {
  const agentZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(timer); }, []);
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: client.timezone }).format(new Date(now)));
  const isDay = hour >= 6 && hour < 18;
  return <Box sx={{ display: 'flex', alignItems: 'center', gap: compact ? 1.5 : 2.5, flexWrap: 'wrap' }}>
    <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>AGENT ({agentZone.split('/').pop().replace('_', ' ')})</Typography><Typography sx={{ fontFamily: 'monospace', fontWeight: 800 }}>{timeFor(agentZone)}</Typography></Box>
    <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>CLIENT ({client.label})</Typography><Typography sx={{ fontFamily: 'monospace', fontWeight: 800 }}>{timeFor(client.timezone)}</Typography></Box>
    <Chip size="small" icon={isDay ? <WbSunnyIcon /> : <NightlightIcon />} label={isDay ? 'DAYTIME' : 'NIGHTTIME'} sx={{ fontWeight: 800, bgcolor: isDay ? '#FEF3C7' : '#E0E7FF', color: isDay ? '#92400E' : '#3730A3' }} />
  </Box>;
}
