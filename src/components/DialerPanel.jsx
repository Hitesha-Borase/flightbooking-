import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MicOffIcon from '@mui/icons-material/MicOff';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VoicemailIcon from '@mui/icons-material/Voicemail';

export default function DialerPanel({ lead, onCall }) {
  const [status, setStatus] = useState('IDLE'); const [seconds, setSeconds] = useState(0); const [number, setNumber] = useState(lead.fullPhone);
  useEffect(() => setNumber(lead.fullPhone), [lead]); useEffect(() => { if (status !== 'ON CALL') return; const t = setInterval(() => setSeconds(s => s + 1), 1000); return () => clearInterval(t); }, [status]);
  const timer = new Date(seconds * 1000).toISOString().slice(11, 19); const keys = ['1','2 ABC','3 DEF','4 GHI','5 JKL','6 MNO','7 PQRS','8 TUV','9 WXYZ','*','0','#'];
  const start = () => { const next = status === 'ON CALL' ? 'CALL ENDED' : 'ON CALL'; setStatus(next); onCall(next); if (next === 'CALL ENDED') setTimeout(() => setStatus('IDLE'), 900); };
  const color = status === 'ON CALL' ? 'success' : status === 'HOLD' ? 'warning' : status === 'DIALING' ? 'primary' : 'default';
  return <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}><Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="subtitle2" sx={{ fontWeight: 800 }}>TELNYX WEBRTC DIALER</Typography><span>•••</span></Box><Chip size="small" color={color} label={`Status: ${status}${status === 'ON CALL' ? ` — ${timer}` : ''}`} sx={{ mt: 1, fontWeight: 700 }} />
    <Box sx={{ my: 2 }}><Typography sx={{ fontWeight: 700 }}>{lead.firstName} {lead.lastName}</Typography><Typography color="text.secondary">{number}</Typography></Box><Box sx={{ display: 'flex', justifyContent: 'space-between' }}>{[[MicOffIcon,'Mute'],[PauseCircleIcon,'Hold'],[SwapHorizIcon,'Transfer'],[VoicemailIcon,'VM Drop']].map(([Icon, label]) => <IconButton key={label} size="small" title={label}><Icon fontSize="small" /></IconButton>)}</Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: .6, my: 2 }}>{keys.map(key => <Button key={key} onClick={() => setNumber(n => n + key[0])} variant="outlined" sx={{ minWidth: 0, fontSize: '.7rem' }}>{key}</Button>)}</Box><Button onClick={start} fullWidth variant="contained" color={status === 'ON CALL' ? 'error' : 'success'}>{status === 'ON CALL' ? 'END CALL' : 'CALL'}</Button><Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'text.secondary' }}>Wow My Flight</Typography></Paper>;
}
