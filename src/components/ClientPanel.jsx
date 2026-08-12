import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function ClientPanel({ lead, onComment, onAction }) {
  const [comment, setComment] = useState('');
  const add = () => { if (comment.trim()) { onComment(comment); setComment(''); } };
  const section = (name, children) => <Box sx={{ mb: 2 }}><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '.06em' }}>{name}</Typography>{children}</Box>;
  return <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, minWidth: 0 }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{lead.firstName} {lead.lastName} <Typography component="span" variant="caption" color="text.secondary">— CLIENT ID: {lead.clientId}</Typography></Typography><Divider sx={{ my: 1.5 }} />
    {section('PERSONAL DATA', <Box sx={{ display: 'grid', gap: .5, fontSize: '.85rem' }}><span>Country: <b>{lead.country}</b></span><span>Time Zone: <b>{lead.timeZone}</b></span><span>City: <b>{lead.city}</b></span></Box>)}
    {section('FLIGHT REQUEST', <Box sx={{ bgcolor: 'background.neutral', p: 1.25, borderRadius: 1.5, fontSize: '.85rem', display: 'grid', gap: .45 }}><b>{lead.origin} → {lead.destination}</b><span>Travel Date: {lead.travelDate} {lead.returnDate && `• Return: ${lead.returnDate}`}</span><span>{lead.cabinClass} • {lead.passengers} Adults</span></Box>)}
    {section('REGISTRATION DATA', <Box sx={{ fontSize: '.85rem', display: 'grid', gap: .4 }}><span>Email: <b>{lead.email}</b></span><span>Phone: <b>{lead.fullPhone}</b></span><span>Source: <b>{lead.source}</b></span></Box>)}
    {section('ACTIVITY HISTORY', <Paper variant="outlined" sx={{ maxHeight: 180, overflow: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}><thead><tr><th>Timestamp</th><th>Agent</th><th>Status</th><th>Comments</th></tr></thead><tbody>{lead.activities.map((a, i) => <tr key={`${a.time}-${i}`}><td>{a.time}</td><td>{a.agent}</td><td><Chip label={a.status} size="small" /></td><td>{a.comments || '—'}</td></tr>)}</tbody></table></Paper>)}
    <Box sx={{ display: 'flex', gap: 1 }}><TextField value={comment} onChange={e => setComment(e.target.value)} size="small" fullWidth placeholder="Add comment..." onKeyDown={e => e.key === 'Enter' && add()} /><Button onClick={add} variant="contained" size="small">Add</Button></Box>
    <Divider sx={{ my: 2 }} /><Typography variant="caption" sx={{ fontWeight: 800 }}>QUICK ACTIONS</Typography><Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}><Button onClick={() => onAction('quote')} size="small" variant="contained">Request Quote from GDS</Button><Button onClick={() => onAction('booking')} size="small" variant="outlined">Create Booking</Button><Button onClick={() => onAction('payment')} size="small" variant="outlined">Send Payment Link</Button></Box>
  </Paper>;
}
