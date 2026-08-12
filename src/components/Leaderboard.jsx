import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
const rows = [['Maria S.','On Call',33,'$138.65k','22min'],['John D.','Idle · 12m',26,'$138.20k','13min'],['Ken T.','Away · Break',21,'$134.15k','23min'],['Sara K.','On Call',7,'$123.20k','23min'],['Han R.','On Break',10,'$134.10k','33min']];
export default function Leaderboard() { return <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}><Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>TOP AGENTS LEADERBOARD</Typography><Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}><thead><tr><th># Agent</th><th>Closed Sales</th><th>Revenue</th><th>Lead Turnaround Time</th></tr></thead><tbody>{rows.map((r, i) => <tr key={r[0]}><td style={{ padding: 7 }}><b>{i + 1} {r[0]}</b><br /><Chip label={r[1]} size="small" color={r[1].includes('On Call') ? 'success' : 'default'} /></td><td>{r[2]}</td><td style={{ color: '#059669', fontWeight: 700 }}>{r[3]}</td><td>{r[4]}</td></tr>)}</tbody></Box></Paper>; }
