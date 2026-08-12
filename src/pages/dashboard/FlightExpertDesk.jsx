import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublishIcon from '@mui/icons-material/Publish';
import CalculateIcon from '@mui/icons-material/Calculate';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ArticleIcon from '@mui/icons-material/Article';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DualClock from '../../components/DualClock';
import { MOCK_FLIGHT_REQUESTS } from '../../constants/mockData';
import { useAlert } from '../../contexts/AlertContext';

const STATUS_MAP = {
  'New':          { color: 'error',   label: '🔴 New' },
  'In Progress':  { color: 'warning', label: '🟡 In Progress' },
  'Quote Ready':  { color: 'info',    label: '🔵 Quote Ready' },
  'Sent':         { color: 'success', label: '🟢 Sent to Agent' },
  'Completed':    { color: 'default', label: '✅ Completed' },
};

const UPSELLS = [
  { icon: '💺', title: 'Seat Upgrade', desc: 'Recommend extra legroom / exit row seats', value: '+$120' },
  { icon: '🧳', title: 'Extra Baggage', desc: 'Add 23kg or 32kg baggage allowance', value: '+$80' },
  { icon: '🛡️', title: 'Travel Insurance', desc: 'Based on booking value — recommended', value: '+$45' },
  { icon: '🏨', title: 'Hotel Package', desc: 'Partner hotels at destination', value: '+$250/night' },
  { icon: '🚌', title: 'Airport Transfer', desc: 'Private transfer at origin & destination', value: '+$60' },
  { icon: '⚡', title: 'Priority Check-in', desc: 'Fast-track security and priority boarding', value: '+$35' },
];

export default function FlightExpertDesk() {
  const { showAlert } = useAlert();
  const requests = MOCK_FLIGHT_REQUESTS || [];
  const [selected, setSelected] = useState(requests[0] || null);
  const [search, setSearch] = useState('');
  const [rawGDS, setRawGDS] = useState('1 AA 100 J 15OCT JFK LHR 1830 0730+1\n2 BA 117 C 15OCT LHR JFK 1100 1430');
  const [parsed, setParsed] = useState(false);
  const [netFare, setNetFare] = useState(4500);
  const [markup, setMarkup] = useState(15);
  const [fixedMarkup, setFixedMarkup] = useState(0);

  const filteredRequests = requests.filter(r =>
    `${r.firstName || ''} ${r.lastName || ''} ${r.origin || ''} ${r.destination || ''}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const sellingPrice = fixedMarkup > 0
    ? Number(netFare) + Number(fixedMarkup)
    : Number(netFare) * (1 + Number(markup) / 100);
  const profit = sellingPrice - Number(netFare);
  const profitPct = ((profit / Number(netFare)) * 100).toFixed(1);

  const handleParse = () => {
    setParsed(true);
    showAlert('✅ GDS itinerary parsed and validated successfully', 'success');
  };

  const handlePublish = () => {
    showAlert('🚀 Quote published! Sales agent notified. Net fare is hidden from agent view.', 'success');
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* ─── Topbar ─── */}
      <Paper elevation={0} sx={{
        p: 1.5, px: 2.5, mb: 2,
        border: '1px solid', borderColor: 'divider', borderRadius: 2,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FlightTakeoffIcon color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>Flight Expert / GDS Desk</Typography>
            <Typography variant="caption" color="text.secondary">Quote & Pricing Operations Center</Typography>
          </Box>
        </Box>
        <DualClock compact client={{ timezone: 'America/New_York', label: 'EST' }} />
      </Paper>

      {/* ─── Main 2-Col Layout ─── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '35% 65%' }, gap: 2, alignItems: 'start' }}>

        {/* ══ LEFT: Flight Request Queue ══ */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>FLIGHT REQUEST QUEUE</Typography>
            <Chip size="small" label={`${filteredRequests.length} requests`} color="primary" variant="outlined" />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Incoming requests forwarded by sales agents.
          </Typography>

          {/* Search */}
          <TextField
            fullWidth size="small" placeholder="🔍 Search requests..."
            value={search} onChange={e => setSearch(e.target.value)}
            sx={{ mb: 1.5 }}
          />

          {/* Request Cards */}
          {filteredRequests.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No requests found
            </Typography>
          )}
          {filteredRequests.map((r, i) => {
            const status = r.status || (i % 2 === 0 ? 'New' : 'In Progress');
            const sm = STATUS_MAP[status] || STATUS_MAP['New'];
            const isSelected = selected?.id === r.id;
            return (
              <Paper
                key={r.id || i}
                variant="outlined"
                sx={{
                  p: 1.5, mb: 1, cursor: 'pointer',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? 'primary.50' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'background.neutral' }
                }}
                onClick={() => { setSelected(r); setParsed(false); }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>
                    Request #{r.id || `FE-459${i + 1}`}
                  </Typography>
                  <Chip size="small" label={sm.label} color={sm.color} sx={{ fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {r.origin || 'JFK'} → {r.destination || 'LHR'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {r.travelDate || '15OCT'} &nbsp;|&nbsp; {r.cabinClass || 'Business'} &nbsp;|&nbsp; {r.passengers || 2} Pax
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Agent: {r.firstName ? `${r.firstName} ${r.lastName}` : 'Sarah J.'} (SE)
                </Typography>
                <Button
                  size="small"
                  variant={isSelected ? 'contained' : 'outlined'}
                  startIcon={<PlayArrowIcon />}
                  sx={{ mt: 1, fontSize: '0.72rem' }}
                  onClick={e => { e.stopPropagation(); setSelected(r); setParsed(false); }}
                >
                  View / Parse
                </Button>
              </Paper>
            );
          })}

          {/* Fallback if no mock data */}
          {filteredRequests.length === 0 && !search && [
            { id: 'FE-4591', origin: 'JFK', destination: 'LHR', travelDate: '15OCT', cabinClass: 'Business', passengers: 2, status: 'New' },
            { id: 'FE-4592', origin: 'DEL', destination: 'DXB', travelDate: '20NOV', cabinClass: 'Economy', passengers: 4, status: 'In Progress' },
          ].map((r, i) => (
            <Paper key={r.id} variant="outlined" sx={{ p: 1.5, mb: 1, cursor: 'pointer' }} onClick={() => setSelected(r)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800 }}>Request #{r.id}</Typography>
                <Chip size="small" label={STATUS_MAP[r.status]?.label} color={STATUS_MAP[r.status]?.color} sx={{ fontSize: '0.65rem' }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.origin} → {r.destination}</Typography>
              <Typography variant="caption" color="text.secondary">{r.travelDate} | {r.cabinClass} | {r.passengers} Pax</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Agent: Sarah J. (SE)</Typography>
              <Button size="small" startIcon={<PlayArrowIcon />} sx={{ mt: 1, fontSize: '0.72rem' }} onClick={() => setSelected(r)}>
                View / Parse
              </Button>
            </Paper>
          ))}
        </Paper>

        {/* ══ RIGHT: GDS Workspace ══ */}
        <Box sx={{ display: 'grid', gap: 2 }}>

          {/* Selected request header */}
          {selected && (
            <Paper elevation={0} sx={{
              p: 1.5, px: 2, border: '1px solid', borderColor: 'primary.light',
              borderRadius: 2, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', gap: 1.5
            }}>
              <FlightTakeoffIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                Active: {selected.firstName ? `${selected.firstName} ${selected.lastName}` : 'Request'} &nbsp;·&nbsp;
                {selected.origin || 'JFK'} → {selected.destination || 'LHR'} &nbsp;·&nbsp;
                {selected.cabinClass || 'Business'} &nbsp;·&nbsp; {selected.passengers || 2} Pax
              </Typography>
            </Paper>
          )}

          {/* 1. SABRE/GDS Parsing Box */}
          <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <ArticleIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>SABRE / GDS PARSING BOX</Typography>
            </Box>
            <TextField
              fullWidth multiline rows={4}
              value={rawGDS}
              onChange={e => { setRawGDS(e.target.value); setParsed(false); }}
              placeholder="Paste raw GDS PNR text here (Ctrl+V)&#10;1 AA 100 J 15OCT JFK LHR 1830 0730+1"
              sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.8rem' } }}
            />
            <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary" onClick={handleParse}>Parse Itinerary</Button>
              <Button variant="outlined" onClick={() => showAlert('Codes validated successfully', 'success')}>Validate Codes</Button>
              <Button variant="outlined" onClick={() => { setParsed(true); showAlert('Parsed data imported', 'success'); }}>Import Parsed Data</Button>
            </Box>

            {parsed && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main' }}>PARSED ITINERARY</Typography>
                </Box>
                {rawGDS.split('\n').filter(Boolean).map((line, i) => (
                  <Box key={i} sx={{ mb: 0.5, p: 1, bgcolor: 'white', borderRadius: 1, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    <b>Flight {i + 1}:</b> {line.includes('AA') ? 'AA 100' : line.includes('BA') ? 'BA 117' : 'FL'} &nbsp;|&nbsp;
                    {selected?.origin || 'JFK'} → {selected?.destination || 'LHR'} &nbsp;|&nbsp;
                    {line.match(/\d{2}[A-Z]{3}/)?.[0] || '15OCT'} &nbsp;|&nbsp;
                    Dep: {line.match(/\d{4}/g)?.[0] || '18:30'} &nbsp;|&nbsp;
                    Class: {line.match(/\s[A-Z]\s/)?.[0]?.trim() || 'J'} (Business) &nbsp;|&nbsp;
                    PNR: <b>ABC12D</b> &nbsp;|&nbsp; Fare Basis: JOWUS
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* 2. Net vs Selling Price Calculator */}
          <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <CalculateIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>NET vs. SELLING PRICE CALCULATOR</Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {/* Left: Parsed flights */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Parsed Flights
                </Typography>
                {(parsed ? rawGDS.split('\n').filter(Boolean) : ['1 AA 100 J 15OCT JFK LHR 1830 0730+1']).map((line, i) => (
                  <Box key={i} sx={{ mt: 1, p: 1.2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>● Flight {i + 1} · {line.includes('AA') ? 'AA 100' : 'BA 117'}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {selected?.origin || 'JFK'} → {selected?.destination || 'LHR'} | Class: {line.match(/\s[A-Z]\s/)?.[0]?.trim() || 'J'}
                      </Typography>
                    </Box>
                    <Chip size="small" label="✓" color="success" sx={{ fontSize: '0.65rem' }} />
                  </Box>
                ))}
              </Box>

              {/* Right: Calculator inputs */}
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <TextField
                  label="Net Fare (Cost) USD" type="number" size="small"
                  value={netFare} onChange={e => setNetFare(e.target.value)}
                />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    Manual Markup % — {markup}%
                  </Typography>
                  <Slider
                    value={Number(markup)} min={0} max={40} step={1}
                    onChange={(_, v) => { setMarkup(v); setFixedMarkup(0); }}
                    color="primary" sx={{ mt: 0.5 }}
                  />
                </Box>
                <TextField
                  label="Fixed Markup USD (overrides %)" type="number" size="small"
                  value={fixedMarkup} onChange={e => setFixedMarkup(e.target.value)}
                />
                <Divider />
                <Box sx={{ p: 1.5, bgcolor: 'background.neutral', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Selling Price:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>USD {sellingPrice.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Net Profit Margin:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: profit > 0 ? 'success.main' : 'error.main' }}>
                      USD {profit.toFixed(2)} ({profitPct}%) 🟢
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained" color="success" fullWidth
                  startIcon={<PublishIcon />}
                  onClick={handlePublish}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  Generate & Publish Quote to Client Profile
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* 3. Upsell Suggestions Engine */}
          <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <TipsAndUpdatesIcon fontSize="small" color="warning" />
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>UPSELL SUGGESTIONS ENGINE</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
              {UPSELLS.map(u => (
                <Box
                  key={u.title}
                  sx={{
                    p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2,
                    cursor: 'pointer', transition: 'all 0.2s',
                    '&:hover': { borderColor: 'warning.main', bgcolor: '#FFFBEB' }
                  }}
                  onClick={() => showAlert(`Upsell added: ${u.title} (${u.value})`, 'success')}
                >
                  <Typography sx={{ fontSize: '1.2rem' }}>{u.icon}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, display: 'block' }}>{u.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.68rem' }}>{u.desc}</Typography>
                  <Chip size="small" label={u.value} color="warning" variant="outlined" sx={{ mt: 0.5, fontSize: '0.65rem' }} />
                </Box>
              ))}
            </Box>
          </Paper>

          {/* 4. Fare Rules View */}
          <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>FARE RULES VIEW</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Refund rules, change fees, min/max stay, and advance purchase requirements for the selected fare.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, mb: 1.5 }}>
              {[
                ['Refund Policy', 'Non-refundable after 24h'],
                ['Change Fee', '$200 per change'],
                ['Min Stay', '7 days'],
                ['Advance Purchase', '14 days minimum'],
              ].map(([k, v]) => (
                <Box key={k} sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>{k}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{v}</Typography>
                </Box>
              ))}
            </Box>
            <Button size="small" variant="outlined" onClick={() => showAlert('Full fare rules document opened', 'info')}>
              View Full Fare Rules →
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
