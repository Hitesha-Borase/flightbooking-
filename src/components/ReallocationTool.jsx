import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
const leads = [['Need read','Alex R.','Hot Lead'],['Need read','Alex R.','Hot Lead'],['Lead Lead','Alex R.','Hot Lead'],['Need Lead','Alex R.','VIP'],['Lead Lead','Alex T.','Hot Lead'],['Need Lead','Hen T.','VIP']];
export default function ReallocationTool({ onReassign }) { const [open, setOpen] = useState(false); const [agent, setAgent] = useState(''); const [reason, setReason] = useState(''); return <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}><Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>LEAD REALLOCATION TOOL</Typography><table style={{ width: '100%', fontSize: 12 }}><thead><tr><th>Lead Attention</th><th>Current Agent</th><th>Lead Importance</th><th /></tr></thead><tbody>{leads.map((lead, i) => <tr key={i}><td>{lead[0]}</td><td>{lead[1]}</td><td>{lead[2]}</td><td><Button size="small" onClick={() => setOpen(true)}>Reassign</Button></td></tr>)}</tbody></table><Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs"><DialogTitle>Reassign Lead to</DialogTitle><DialogContent><TextField select fullWidth value={agent} onChange={e => setAgent(e.target.value)} label="Active agent" sx={{ mt: 1 }}>{['Maria S.','John D.','Sara K.'].map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}</TextField><TextField fullWidth multiline rows={3} value={reason} onChange={e => setReason(e.target.value)} label="Reason (optional)" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained" disabled={!agent} onClick={() => { onReassign(agent); setOpen(false); setAgent(''); setReason(''); }}>Confirm Reassign</Button></DialogActions></Dialog></Paper>; }
