import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DualClock from '../../components/DualClock';
import ScheduleChange from '../../components/ScheduleChange';
import { useAlert } from '../../contexts/AlertContext';

const ISSUANCE_QUEUE = [
  { id: 'TK-451', name: 'M. Chen', route: 'JFK → LHR', pnr: 'ABC12D', amount: '$3,200.00', date: '15 Oct', class: 'Business', pax: 2 },
  { id: 'TK-452', name: 'A. Lee', route: 'DEL → SIN', pnr: 'LMN78F', amount: '$1,430.00', date: '20 Nov', class: 'Economy', pax: 1 },
  { id: 'TK-453', name: 'K. Singh', route: 'DXB → LHR', pnr: 'QRS90G', amount: '$5,800.00', date: '05 Dec', class: 'First', pax: 3 },
  { id: 'TK-454', name: 'S. Williams', route: 'LHR → JFK', pnr: 'XYZ34E', amount: '$980.00', date: '22 Oct', class: 'Economy', pax: 4 },
];

const PNR_FEED = [
  { pnr: 'XYZ34E', customer: 'J. Smith', route: 'JFK → LHR', date: '15 Oct', status: 'Schedule Change', tone: 'error', ago: '2h ago', needsAction: true },
  { pnr: 'LMN78F', customer: 'A. Lee', route: 'DEL → SIN', date: '20 Nov', status: 'Ticketed & Dispatched', tone: 'success', ago: '10h ago', needsAction: false },
  { pnr: 'QRS90G', customer: 'S. Williams', route: 'DXB → CDG', date: '05 Dec', status: 'Flight Delayed 2h', tone: 'warning', ago: '1h ago', needsAction: true },
  { pnr: 'QRS38F', customer: 'J. Smith', route: 'LHR → JFK', date: '22 Oct', status: 'Ticketed & Dispatched', tone: 'success', ago: '14h ago', needsAction: false },
  { pnr: 'ABC12D', customer: 'M. Chen', route: 'JFK → LHR', date: '15 Oct', status: 'Tracking Active', tone: 'info', ago: 'Live', needsAction: false },
];

const TONE_CONFIG = {
  error:   { icon: '🔴', bgColor: '#FEF2F2', borderColor: '#FECACA' },
  warning: { icon: '🟡', bgColor: '#FFFBEB', borderColor: '#FDE68A' },
  success: { icon: '✅', bgColor: '#F0FDF4', borderColor: '#BBF7D0' },
  info:    { icon: '⚪', bgColor: '#EFF6FF', borderColor: '#BFDBFE' },
};

export default function TicketingIssuance() {
  const { showAlert } = useAlert();
  const [selectedItem, setSelectedItem] = useState(null);
  const [eTicketNums, setETicketNums] = useState('0172345678901\n0172345678902');
  const [issuedIds, setIssuedIds] = useState(new Set());
  const [pnrFeed, setPnrFeed] = useState(PNR_FEED);
  const [schedEvent, setSchedEvent] = useState(null);

  const handleIssue = () => {
    if (!selectedItem) return;
    if (!eTicketNums.trim()) {
      showAlert('Please enter at least one e-ticket number', 'warning');
      return;
    }
    setIssuedIds(prev => new Set([...prev, selectedItem.id]));
    setSelectedItem(null);
    setETicketNums('0172345678901\n0172345678902');
    showAlert('🎫 E-tickets saved! PDF itinerary generated and client notified by Email, WhatsApp & SMS.', 'success');
  };

  const handlePNRAction = (row) => {
    if (row.needsAction) {
      setSchedEvent(row);
    } else {
      showAlert(`PNR ${row.pnr} details — ${row.status}`, 'info');
    }
  };

  const handleDispatch = (pnr) => {
    showAlert(`📧 Official itinerary re-dispatched for PNR ${pnr}`, 'success');
  };

  const queueItems = ISSUANCE_QUEUE.filter(item => !issuedIds.has(item.id));

  return (
    <Box sx={{ pb: 4 }}>
      {/* ─── Topbar ─── */}
      <Paper elevation={0} sx={{
        p: 1.5, px: 2.5, mb: 2,
        border: '1px solid', borderColor: 'divider', borderRadius: 2,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ConfirmationNumberIcon color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>Ticketing Team — Issuance & Tracking</Typography>
            <Typography variant="caption" color="text.secondary">E-Ticket issuance queue & live PNR monitoring</Typography>
          </Box>
        </Box>
        <DualClock compact client={{ timezone: 'America/New_York', label: 'EST' }} />
      </Paper>

      {/* ─── 3-Col Layout ─── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '30% 38% 32%' }, gap: 2, alignItems: 'start' }}>

        {/* ══ LEFT: Ready-for-Issuance Queue ══ */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>READY-FOR-ISSUANCE QUEUE</Typography>
            <Chip
              label={`${queueItems.length} Ready`}
              color={queueItems.length > 0 ? 'success' : 'default'}
              size="small"
              icon={<NotificationsActiveIcon sx={{ fontSize: '0.85rem !important' }} />}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Paid leads awaiting ticket generation.
          </Typography>

          {queueItems.length === 0 && (
            <Alert severity="success" sx={{ mt: 1 }}>All tickets issued for today! 🎉</Alert>
          )}

          {queueItems.map(item => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 1.5, mb: 1.2, cursor: 'pointer',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? 'primary.50' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'background.neutral' }
                }}
                onClick={() => setSelectedItem(item)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>Lead #{item.id} — {item.name}</Typography>
                  <Chip size="small" label={item.class} variant="outlined" sx={{ fontSize: '0.62rem' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                  <FlightTakeoffIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.route} · {item.date}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                  <CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} />
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                    Payment Confirmed ({item.amount})
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">◉ Sabre PNR: <b>{item.pnr}</b></Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 0.8 }}>
                  <Button
                    size="small" variant={isSelected ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<ConfirmationNumberIcon />}
                    sx={{ fontSize: '0.7rem' }}
                    onClick={e => { e.stopPropagation(); setSelectedItem(item); }}
                  >
                    Issue E-Ticket
                  </Button>
                  <Button size="small" variant="text" sx={{ fontSize: '0.7rem' }}
                    onClick={e => { e.stopPropagation(); setSelectedItem(item); }}>
                    Review
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Paper>

        {/* ══ CENTER: Ticket Issuance Controls ══ */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <ConfirmationNumberIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>TICKET ISSUANCE CONTROLS</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a booking from the queue, enter the 13-digit e-ticket codes from your GDS and submit.
          </Typography>

          {!selectedItem ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              Select a booking from the queue on the left to begin issuance.
            </Alert>
          ) : (
            <Alert severity="success" sx={{ mb: 2 }}>
              Ready to issue: <b>#{selectedItem.id} — {selectedItem.name}</b> ({selectedItem.route})
            </Alert>
          )}

          {/* PNR Field */}
          <TextField
            fullWidth label="PNR Code" size="small"
            value={selectedItem?.pnr || ''}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
            helperText="Auto-filled from selected booking"
          />

          {/* E-Ticket Numbers */}
          <TextField
            fullWidth multiline rows={5}
            label="Enter 13-Digit E-Ticket Number(s)"
            helperText="One per line, per passenger (e.g. 0172345678901)"
            value={eTicketNums}
            onChange={e => setETicketNums(e.target.value)}
            sx={{
              mb: 2,
              '& textarea': { fontFamily: 'monospace', fontSize: '0.85rem' }
            }}
          />

          <Divider sx={{ mb: 2 }} />

          {/* After issue checklist */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>
              On Submit — System Will Automatically:
            </Typography>
            {[
              '✅ Save e-ticket numbers to booking record',
              '✅ Update booking status → Ticketed',
              '✅ Generate official itinerary PDF',
              '📧 Email PDF to customer',
              '💬 WhatsApp notification (if connected)',
              '📱 SMS ticket confirmation',
              '🔄 Add PNR to auto-tracker',
            ].map(step => (
              <Typography key={step} variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                {step}
              </Typography>
            ))}
          </Box>

          <Button
            fullWidth variant="contained" color="success"
            size="large"
            startIcon={<SendIcon />}
            disabled={!selectedItem}
            onClick={handleIssue}
            sx={{ borderRadius: 2, fontWeight: 700, py: 1.2 }}
          >
            Submit & Notify Client
          </Button>
        </Paper>

        {/* ══ RIGHT: PNR Auto-Tracker ══ */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrackChangesIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>FLIGHT PNR AUTO-TRACKER</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite' }} />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>LIVE</Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Active tracker feed — alerts for schedule changes, delays, and dispatch status.
          </Typography>

          {pnrFeed.map(row => {
            const cfg = TONE_CONFIG[row.tone];
            return (
              <Box
                key={row.pnr}
                sx={{
                  mb: 1.2, p: 1.5, borderRadius: 2,
                  bgcolor: cfg.bgColor,
                  border: `1px solid ${cfg.borderColor}`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>
                    {cfg.icon} PNR {row.pnr} — {row.customer}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{row.ago}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                  {row.route} · {row.date}
                </Typography>
                <Chip
                  size="small"
                  label={row.status}
                  color={row.tone}
                  sx={{ fontSize: '0.65rem', mb: row.needsAction ? 1 : 0 }}
                />
                {row.needsAction && (
                  <Box sx={{ display: 'flex', gap: 0.8, mt: 0.8 }}>
                    <Button
                      size="small" variant="contained"
                      color={row.tone === 'error' ? 'error' : 'warning'}
                      sx={{ fontSize: '0.68rem' }}
                      onClick={() => handlePNRAction(row)}
                    >
                      Discuss & Action
                    </Button>
                    {row.tone === 'error' && (
                      <Button
                        size="small" variant="outlined"
                        sx={{ fontSize: '0.68rem' }}
                        onClick={() => showAlert('Schedule change reschedule workflow opened', 'info')}
                      >
                        Process Change
                      </Button>
                    )}
                  </Box>
                )}
                {!row.needsAction && (
                  <Button
                    size="small" variant="text"
                    startIcon={<SendIcon sx={{ fontSize: '0.85rem' }} />}
                    sx={{ fontSize: '0.68rem', mt: 0.5 }}
                    onClick={() => handleDispatch(row.pnr)}
                  >
                    Re-Dispatch Itinerary
                  </Button>
                )}
              </Box>
            );
          })}
        </Paper>
      </Box>

      {/* Schedule Change Modal */}
      <ScheduleChange
        event={schedEvent}
        onClose={() => setSchedEvent(null)}
        onSave={(action) => {
          showAlert(`${action} — customer notified successfully`, 'success');
          setSchedEvent(null);
        }}
      />
    </Box>
  );
}
