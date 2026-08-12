import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

export default function ClientPanel({ lead, onComment, onAction }) {
  const [comment, setComment] = useState('');
  const add = () => { if (comment.trim()) { onComment(comment); setComment(''); } };
  
  const section = (name, children) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '.06em', display: 'block', mb: 0.5 }}>
        {name}
      </Typography>
      {children}
    </Box>
  );

  return (
    <Paper elevation={0} sx={{ 
      p: 2.5, 
      border: '1px solid', 
      borderColor: 'divider', 
      borderRadius: 4, 
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      bgcolor: 'background.paper',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
    }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'primary.main', fontSize: '1.1rem' }}>
          {lead.firstName} {lead.lastName}
        </Typography>
        <Typography component="div" variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          CLIENT ID: <span style={{ color: '#000' }}>{lead.clientId}</span>
        </Typography>
      </Box>
      <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
      
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 1 }}>
        {section('PERSONAL DATA', 
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '0.8rem', color: 'text.secondary' }}>
            <span>Country: <b style={{ color: '#000' }}>{lead.country}</b></span>
            <span>Time Zone: <b style={{ color: '#000' }}>{lead.timeZone.split(' ')[0]}</b></span>
            <span>City: <b style={{ color: '#000' }}>{lead.city}</b></span>
          </Box>
        )}
        {section('CONTACT', 
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '0.8rem', color: 'text.secondary' }}>
            <span>Email: <b style={{ color: '#000' }}>{lead.email}</b></span>
            <span>Phone: <b style={{ color: '#000' }}>{lead.fullPhone}</b></span>
            <span>Source: <b style={{ color: '#000' }}>{lead.source}</b></span>
          </Box>
        )}
      </Box>

      {section('FLIGHT REQUEST', 
        <Box sx={{ 
          bgcolor: 'primary.50', 
          p: 1.5, 
          borderRadius: 3, 
          fontSize: '0.85rem', 
          border: '1px solid',
          borderColor: 'primary.100',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlightTakeoffIcon fontSize="small" />
            {lead.origin} → {lead.destination}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', fontWeight: 600, mt: 0.5, fontSize: '0.75rem' }}>
            <span>Depart: {lead.travelDate}</span>
            {lead.returnDate && <span>Return: {lead.returnDate}</span>}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
            <span>{lead.cabinClass}</span>
            <span>{lead.passengers} Adults</span>
          </Box>
        </Box>
      )}

      {section('ACTIVITY HISTORY', 
        <Paper variant="outlined" sx={{ flexGrow: 1, overflow: 'auto', borderRadius: 2, minHeight: 120 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 1 }}>
              <tr>
                <th style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Time</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Agent</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Status</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Comments</th>
              </tr>
            </thead>
            <tbody>
              {lead.activities.map((a, i) => (
                <tr key={`${a.time}-${i}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 10px', color: '#64748b' }}>{a.time}</td>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>{a.agent}</td>
                  <td style={{ padding: '8px 10px' }}><Chip label={a.status} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} /></td>
                  <td style={{ padding: '8px 10px', color: '#475569' }}>{a.comments || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}
      
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <TextField 
          value={comment} 
          onChange={e => setComment(e.target.value)} 
          size="small" 
          fullWidth 
          placeholder="Add comment..." 
          onKeyDown={e => e.key === 'Enter' && add()} 
          sx={{ '& .MuiInputBase-root': { borderRadius: 2, fontSize: '0.85rem' } }}
        />
        <Button onClick={add} variant="contained" size="small" sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>Add</Button>
      </Box>
      
      <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button onClick={() => onAction('quote')} size="small" variant="contained" sx={{ borderRadius: 2, fontWeight: 700, flex: 1, minWidth: '140px' }}>Request Quote</Button>
        <Button onClick={() => onAction('booking')} size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 700, flex: 1, minWidth: '140px' }}>Create Booking</Button>
        <Button onClick={() => onAction('payment')} size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 700, flex: 1, minWidth: '140px' }}>Send Link</Button>
      </Box>
    </Paper>
  );
}
