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
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import Tooltip from '@mui/material/Tooltip';

export default function DialerPanel({ lead, onCall }) {
  const [status, setStatus] = useState('IDLE');
  const [seconds, setSeconds] = useState(0);
  const [number, setNumber] = useState(lead.fullPhone);

  useEffect(() => setNumber(lead.fullPhone), [lead]);
  
  useEffect(() => {
    if (status !== 'ON CALL') return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  const timer = new Date(seconds * 1000).toISOString().slice(11, 19);
  const keys = ['1','2 ABC','3 DEF','4 GHI','5 JKL','6 MNO','7 PQRS','8 TUV','9 WXYZ','*','0','#'];

  const start = () => {
    const next = status === 'ON CALL' ? 'CALL ENDED' : 'ON CALL';
    if (next === 'ON CALL') setSeconds(0);
    setStatus(next);
    onCall(next);
    if (next === 'CALL ENDED') setTimeout(() => setStatus('IDLE'), 1500);
  };

  const getBgColor = () => {
    if (status === 'ON CALL') return 'rgba(34, 197, 94, 0.04)';
    if (status === 'CALL ENDED') return 'rgba(239, 68, 68, 0.04)';
    return 'background.paper';
  };

  const getBorderColor = () => {
    if (status === 'ON CALL') return '#22c55e';
    if (status === 'CALL ENDED') return '#ef4444';
    return 'divider';
  };

  return (
    <Paper elevation={0} sx={{ 
      p: 2.2, 
      border: '1px solid', 
      borderColor: getBorderColor(), 
      borderRadius: 3,
      bgcolor: getBgColor(),
      boxShadow: status === 'ON CALL' ? '0 10px 25px rgba(34, 197, 94, 0.12)' : '0 4px 15px rgba(0,0,0,0.02)',
      transition: 'all 0.3s ease'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
          <GraphicEqIcon sx={{ color: status === 'ON CALL' ? '#22c55e' : 'text.disabled', fontSize: 18 }} />
          TELNYX DIALER
        </Typography>
        <Chip 
          size="small" 
          color={status === 'ON CALL' ? 'success' : status === 'HOLD' ? 'warning' : status === 'DIALING' ? 'primary' : 'default'} 
          label={status === 'ON CALL' ? `ON CALL — ${timer}` : status} 
          sx={{ fontWeight: 800, borderRadius: 1.5, fontSize: '0.7rem', height: 20 }} 
        />
      </Box>

      <Box sx={{ my: 1.8, textAlign: 'center', p: 1.2, bgcolor: 'background.default', borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.85rem' }}>
          {lead.firstName} {lead.lastName}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5, mt: 0.2, fontSize: '0.8rem' }}>
          {number}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        {[
          { icon: MicOffIcon, label: 'Mute' },
          { icon: PauseCircleIcon, label: 'Hold' },
          { icon: SwapHorizIcon, label: 'Transfer' },
          { icon: VoicemailIcon, label: 'VM Drop' }
        ].map(({ icon: Icon, label }) => (
          <Tooltip title={label} key={label}>
            <IconButton 
              size="small"
              sx={{ 
                bgcolor: 'background.default', 
                border: '1px solid', 
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { bgcolor: 'primary.50', color: 'primary.main', borderColor: 'primary.main' }
              }}
            >
              <Icon fontSize="small" />
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
        {keys.map(key => (
          <Button 
            key={key} 
            onClick={() => setNumber(n => n + key[0])} 
            variant="outlined" 
            color="inherit"
            sx={{ 
              py: 0.8, 
              borderRadius: 2,
              borderColor: 'divider',
              color: 'text.secondary',
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1,
              minWidth: 0,
              '&:hover': { bgcolor: 'background.default', borderColor: 'text.primary', color: 'text.primary' }
            }}
          >
            <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{key[0]}</span>
            {key.length > 1 && <span style={{ fontSize: '0.5rem', fontWeight: 600, marginTop: '1px', opacity: 0.7 }}>{key.slice(2)}</span>}
          </Button>
        ))}
      </Box>

      <Button 
        onClick={start} 
        fullWidth 
        variant="contained" 
        color={status === 'ON CALL' ? 'error' : 'success'}
        startIcon={status === 'ON CALL' ? <PhoneDisabledIcon sx={{ fontSize: 16 }} /> : <PhoneIcon sx={{ fontSize: 16 }} />}
        sx={{ 
          py: 1, 
          borderRadius: 2, 
          fontWeight: 800, 
          fontSize: '0.85rem',
          boxShadow: status === 'ON CALL' ? '0 5px 12px rgba(239, 68, 68, 0.2)' : '0 5px 12px rgba(34, 197, 94, 0.2)',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        }}
      >
        {status === 'ON CALL' ? 'END CALL' : 'CALL'}
      </Button>
    </Paper>
  );
}
