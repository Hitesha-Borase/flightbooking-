import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import FlightIcon from '@mui/icons-material/Flight';
import ScheduleChange from '../../components/ScheduleChange';
import { useAlert } from '../../contexts/AlertContext';

const ALL_PNRS = [
  { pnr: 'XYZ34E', customer: 'J. Smith', route: 'JFK → LHR', date: '15 Oct', status: 'Schedule Change', tone: 'error', category: 'alerts', ago: '2h ago',
    original: 'AA 100 | 15OCT | 18:30 → 07:30+1', updated: 'AA 100 | 16OCT | 09:00 → 22:00', needsAction: true },
  { pnr: 'LMN78F', customer: 'A. Lee', route: 'DEL → SIN', date: '20 Nov', status: 'Dispatched', tone: 'success', category: 'dispatched', ago: '10h ago',
    original: 'SQ 407 | 20NOV | 10:00 → 18:00', updated: null, needsAction: false },
  { pnr: 'QRS90G', customer: 'S. Williams', route: 'DXB → CDG', date: '05 Dec', status: 'Delayed 2h', tone: 'warning', category: 'alerts', ago: '1h ago',
    original: 'EK 073 | 05DEC | 08:00 → 13:30', updated: 'EK 073 | 05DEC | 10:00 → 15:30', needsAction: true },
  { pnr: 'QRS38F', customer: 'J. Smith', route: 'LHR → JFK', date: '22 Oct', status: 'Ticketed', tone: 'success', category: 'confirmed', ago: '14h ago',
    original: 'BA 175 | 22OCT | 11:00 → 14:15', updated: null, needsAction: false },
  { pnr: 'ABC12D', customer: 'M. Chen', route: 'JFK → LHR', date: '15 Oct', status: 'Tracking Active', tone: 'info', category: 'confirmed', ago: 'Live',
    original: 'AA 100 | 15OCT | 18:30 → 07:30+1', updated: null, needsAction: false },
  { pnr: 'DEF56H', customer: 'R. Verma', route: 'BOM → DXB', date: '28 Oct', status: 'Changed', tone: 'warning', category: 'alerts', ago: '4h ago',
    original: 'EK 507 | 28OCT | 06:00 → 08:05', updated: 'EK 507 | 29OCT | 06:00 → 08:05', needsAction: true },
];

const FILTER_TABS = [
  { key: 'all', label: '📋 All' },
  { key: 'alerts', label: '🔴 Alerts' },
  { key: 'confirmed', label: '✅ Confirmed' },
  { key: 'dispatched', label: '📤 Dispatched' },
];

const STATUS_COLOR = {
  error:   { chip: 'error',   rowBg: '#FEF2F2', border: '#FECACA' },
  warning: { chip: 'warning', rowBg: '#FFFBEB', border: '#FDE68A' },
  success: { chip: 'success', rowBg: '#F0FDF4', border: '#BBF7D0' },
  info:    { chip: 'info',    rowBg: '#EFF6FF', border: '#BFDBFE' },
};

const STATUS_ICON = { error: '🔴', warning: '🟡', success: '✅', info: '⚪' };

export default function PNRTracking() {
  const { showAlert } = useAlert();
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [schedEvent, setSchedEvent] = useState(null);
  const [addPNROpen, setAddPNROpen] = useState(false);
  const [newPNR, setNewPNR] = useState({ pnr: '', customer: '', route: '', date: '' });
  const [actionModal, setActionModal] = useState(null);
  const [internalNote, setInternalNote] = useState('');

  const filtered = ALL_PNRS.filter(r => {
    const matchSearch = `${r.pnr} ${r.customer} ${r.route}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterTab === 'all' || r.category === filterTab;
    return matchSearch && matchFilter;
  });

  const alertCount = ALL_PNRS.filter(r => r.category === 'alerts').length;

  const handleAction = (row, action) => {
    showAlert(`${action} — PNR ${row.pnr} updated, customer notified`, 'success');
    setActionModal(null);
    setInternalNote('');
  };

  return (
    <Box>
      {/* ─── Header ─── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TrackChangesIcon color="primary" sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>ACTIVE PNR TRACKER</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.3 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>LIVE FEED</Typography>
              {alertCount > 0 && <Chip size="small" label={`${alertCount} Alerts`} color="error" sx={{ fontSize: '0.65rem' }} />}
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained" color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddPNROpen(true)}
        >
          + Add PNR to Tracker
        </Button>
      </Box>

      {/* ─── Search + Filter ─── */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="🔍 Search PNR or customer name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 280 }}
          />
          <Box sx={{ display: 'flex', gap: 0.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 0.5, bgcolor: 'background.paper' }}>
            {FILTER_TABS.map(tab => (
              <Button
                key={tab.key}
                size="small"
                variant={filterTab === tab.key ? 'contained' : 'text'}
                color={filterTab === tab.key ? 'primary' : 'inherit'}
                onClick={() => setFilterTab(tab.key)}
                sx={{ minWidth: 0, px: 1.5, py: 0.4, fontSize: '0.72rem', fontWeight: 700, borderRadius: 1.5 }}
              >
                {tab.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* ─── PNR Table ─── */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        {/* Table Header */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '110px 1fr 130px 100px 200px 90px 160px',
          px: 2, py: 1.2, bgcolor: 'background.neutral',
          borderBottom: '1px solid', borderColor: 'divider'
        }}>
          {['PNR', 'Customer', 'Route', 'Date', 'Status', 'Last Updated', 'Actions'].map(h => (
            <Typography key={h} variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.68rem' }}>
              {h}
            </Typography>
          ))}
        </Box>

        {/* Table Rows */}
        {filtered.length === 0 && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No PNRs match your filter</Typography>
          </Box>
        )}

        {filtered.map((row, i) => {
          const cfg = STATUS_COLOR[row.tone];
          return (
            <Box
              key={row.pnr}
              sx={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr 130px 100px 200px 90px 160px',
                px: 2, py: 1.5,
                bgcolor: row.needsAction ? cfg.rowBg : 'transparent',
                borderBottom: '1px solid', borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
                '&:hover': { bgcolor: row.needsAction ? cfg.rowBg : 'background.neutral' },
                transition: 'background 0.15s',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {STATUS_ICON[row.tone]} {row.pnr}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.customer}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FlightIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                <Typography variant="caption">{row.route}</Typography>
              </Box>
              <Typography variant="caption">{row.date}</Typography>
              <Chip size="small" label={row.status} color={cfg.chip} sx={{ fontSize: '0.68rem', maxWidth: 180 }} />
              <Typography variant="caption" color="text.secondary">{row.ago}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {row.needsAction ? (
                  <Button
                    size="small" variant="contained"
                    color={row.tone === 'error' ? 'error' : 'warning'}
                    sx={{ fontSize: '0.68rem', px: 1.2, py: 0.4 }}
                    onClick={() => {
                      if (row.category === 'alerts' && row.tone === 'error') {
                        setSchedEvent(row);
                      } else {
                        setActionModal(row);
                      }
                    }}
                  >
                    Action
                  </Button>
                ) : (
                  <Button
                    size="small" variant="outlined"
                    sx={{ fontSize: '0.68rem', px: 1.2, py: 0.4 }}
                    onClick={() => showAlert(`PNR ${row.pnr} — ${row.status}`, 'info')}
                  >
                    View
                  </Button>
                )}
                <Button
                  size="small" variant="text"
                  sx={{ fontSize: '0.65rem', px: 0.8, minWidth: 0 }}
                  onClick={() => showAlert(`Itinerary re-dispatched for PNR ${row.pnr}`, 'success')}
                >
                  Re-send
                </Button>
              </Box>
            </Box>
          );
        })}
      </Paper>

      {/* ─── Schedule Change Modal (for error/reschedule) ─── */}
      <ScheduleChange
        event={schedEvent}
        onClose={() => setSchedEvent(null)}
        onSave={(action) => {
          showAlert(`${action} — customer notified`, 'success');
          setSchedEvent(null);
        }}
      />

      {/* ─── Delay / Change Action Modal ─── */}
      <Dialog open={!!actionModal} onClose={() => setActionModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              PNR {actionModal?.pnr} — {actionModal?.status}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {actionModal?.customer} · {actionModal?.route} · {actionModal?.date}
            </Typography>
          </Box>
          <IconButton onClick={() => setActionModal(null)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {actionModal?.updated && (
            <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>ORIGINAL FLIGHT</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>{actionModal.original}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.main', display: 'block' }}>UPDATED FLIGHT</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'warning.main' }}>{actionModal.updated}</Typography>
            </Box>
          )}
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>ACTION REQUIRED:</Typography>
          <Box sx={{ display: 'grid', gap: 1, mb: 2 }}>
            {['Accept Change — Notify Customer', 'Request Reschedule', 'Request Refund', 'Contact Airline Directly'].map(action => (
              <Button key={action} variant="outlined" fullWidth sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                onClick={() => handleAction(actionModal, action)}>
                {action}
              </Button>
            ))}
          </Box>
          <TextField
            fullWidth multiline rows={3} label="Internal Note (optional)"
            value={internalNote} onChange={e => setInternalNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setActionModal(null)}>Cancel</Button>
          <Button variant="contained" color="primary"
            onClick={() => handleAction(actionModal, 'Internal note saved')}>
            Save & Notify
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Add PNR Modal ─── */}
      <Dialog open={addPNROpen} onClose={() => setAddPNROpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add PNR to Tracker
          <IconButton onClick={() => setAddPNROpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <TextField label="PNR Code" size="small" value={newPNR.pnr}
              onChange={e => setNewPNR(p => ({ ...p, pnr: e.target.value.toUpperCase() }))} />
            <TextField label="Customer Name" size="small" value={newPNR.customer}
              onChange={e => setNewPNR(p => ({ ...p, customer: e.target.value }))} />
            <TextField label="Route (e.g. JFK → LHR)" size="small" value={newPNR.route}
              onChange={e => setNewPNR(p => ({ ...p, route: e.target.value }))} />
            <TextField label="Travel Date" type="date" size="small" InputLabelProps={{ shrink: true }}
              value={newPNR.date} onChange={e => setNewPNR(p => ({ ...p, date: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setAddPNROpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            if (!newPNR.pnr) { showAlert('Please enter a PNR code', 'warning'); return; }
            showAlert(`PNR ${newPNR.pnr} added to tracker successfully`, 'success');
            setAddPNROpen(false);
            setNewPNR({ pnr: '', customer: '', route: '', date: '' });
          }}>
            Add to Tracker
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
