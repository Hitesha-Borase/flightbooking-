import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Icons
import AddIcon from '@mui/icons-material/Add';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LuggageIcon from '@mui/icons-material/Luggage';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import PublishIcon from '@mui/icons-material/Publish';

import PageHeader from '../../components/PageHeader';
import AppTable from '../../components/AppTable';
import AppModal from '../../components/AppModal';
import { MOCK_QUOTES, MOCK_BOOKINGS, AIRLINES, CABIN_CLASSES } from '../../constants/mockData';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';

const QUOTE_STATUS_FLOW = ['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired', 'Archived'];

const STATUS_COLORS = {
  'Draft': { bg: '#F1F5F9', color: '#475569', icon: '📝' },
  'Sent': { bg: '#FEF3C7', color: '#92400E', icon: '📤' },
  'Viewed': { bg: '#EFF6FF', color: '#1E40AF', icon: '👁️' },
  'Accepted': { bg: '#D1FAE5', color: '#065F46', icon: '✅' },
  'Rejected': { bg: '#FEE2E2', color: '#991B1B', icon: '❌' },
  'Expired': { bg: '#F3E8FF', color: '#6B21A8', icon: '⏰' },
  'Archived': { bg: '#E2E8F0', color: '#64748B', icon: '📦' }
};

export default function Quotes() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { currentUser } = useAuth();

  const getRolePrefix = () => {
    if (!currentUser) return 'super_admin';
    if (currentUser.role === 'consultant') return 'agent';
    return currentUser.role;
  };

  // Quotes state
  const [quotes, setQuotes] = useState(() => [
    {
      id: 'QT-001',
      customerName: 'Karan Singh',
      customerEmail: 'karan@example.com',
      customerPhone: '+1 212 555 0199',
      route: 'DEL → LHR',
      optionsCount: 3,
      validity: '24h',
      createdBy: 'Alex M.',
      status: 'Sent',
      createdDate: '2026-06-18',
      sellingPrice: 10350,
      flightReqRef: 'REQ-8821',
      options: [
        {
          id: 1,
          airline: 'British Airways (BA)',
          flightNumber: 'BA-117',
          origin: 'DEL',
          destination: 'LHR',
          depDateTime: '2026-10-15T10:30',
          arrDateTime: '2026-10-15T15:45',
          stops: 'Direct',
          cabinClass: 'Business',
          baggage: '2x 32kg included',
          netFare: 8800,
          markupPct: 15,
          sellingPrice: 10120,
          profit: 1320,
          notes: 'Premium lie-flat Club Suite seats with fast-track security.'
        },
        {
          id: 2,
          airline: 'Air India (AI)',
          flightNumber: 'AI-161',
          origin: 'DEL',
          destination: 'LHR',
          depDateTime: '2026-10-15T02:45',
          arrDateTime: '2026-10-15T07:30',
          stops: 'Direct',
          cabinClass: 'Business',
          baggage: '2x 32kg + 7kg cabin',
          netFare: 8200,
          markupPct: 18,
          sellingPrice: 9676,
          profit: 1476,
          notes: 'Direct morning arrival in London Heathrow Terminal 2.'
        },
        {
          id: 3,
          airline: 'Emirates (EK)',
          flightNumber: 'EK-511 / EK-003',
          origin: 'DEL',
          destination: 'LHR',
          depDateTime: '2026-10-15T10:30',
          arrDateTime: '2026-10-15T18:20',
          stops: '1 Stop (DXB 1h 45m)',
          cabinClass: 'Business',
          baggage: '40kg checked allowance',
          netFare: 7900,
          markupPct: 20,
          sellingPrice: 9480,
          profit: 1580,
          notes: 'A380 Onboard Lounge bar access + chauffeur drive.'
        }
      ]
    },
    {
      id: 'QT-002',
      customerName: 'Ankit Sharma',
      customerEmail: 'ankit@example.com',
      customerPhone: '+1 415 882 1092',
      route: 'JFK → DXB',
      optionsCount: 2,
      validity: '48h',
      createdBy: 'Sofia R.',
      status: 'Accepted',
      createdDate: '2026-06-17',
      sellingPrice: 3200,
      flightReqRef: 'REQ-8819',
      options: [
        {
          id: 1,
          airline: 'Emirates (EK)',
          flightNumber: 'EK-202',
          origin: 'JFK',
          destination: 'DXB',
          depDateTime: '2026-11-20T23:00',
          arrDateTime: '2026-11-21T19:45',
          stops: 'Direct',
          cabinClass: 'Economy',
          baggage: '2x 23kg included',
          netFare: 2600,
          markupPct: 23,
          sellingPrice: 3200,
          profit: 600,
          notes: 'Direct flight on Boeing 777-300ER.'
        }
      ]
    },
    {
      id: 'QT-003',
      customerName: 'Michael Chen',
      customerEmail: 'mchen@example.com',
      customerPhone: '+1 650 993 1120',
      route: 'JFK → LHR',
      optionsCount: 3,
      validity: '12h',
      createdBy: 'Alex M.',
      status: 'Viewed',
      createdDate: '2026-06-18',
      sellingPrice: 5175,
      flightReqRef: 'REQ-8830',
      options: [
        {
          id: 1,
          airline: 'Virgin Atlantic (VS)',
          flightNumber: 'VS-004',
          origin: 'JFK',
          destination: 'LHR',
          depDateTime: '2026-10-12T19:00',
          arrDateTime: '2026-10-13T07:15',
          stops: 'Direct',
          cabinClass: 'Premium Economy',
          baggage: '2x 23kg included',
          netFare: 4200,
          markupPct: 23,
          sellingPrice: 5175,
          profit: 975,
          notes: 'Premium Upper Class lounge access included.'
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeOptionTab, setActiveOptionTab] = useState(0);

  // Form State for creating a quote
  const [formQuote, setFormQuote] = useState({
    customerName: 'Karan Singh',
    customerEmail: 'karan@example.com',
    customerPhone: '+1 212 555 0199',
    flightReqRef: 'REQ-8850',
    validity: '24h',
    options: [
      {
        airline: 'British Airways (BA)',
        flightNumber: 'BA-117',
        origin: 'DEL',
        destination: 'LHR',
        depDateTime: '2026-10-15T10:30',
        arrDateTime: '2026-10-15T15:45',
        stops: 'Direct',
        cabinClass: 'Business',
        baggage: '2x 32kg included',
        netFare: 8800,
        markupPct: 15,
        notes: 'Club World lie-flat seats + Fast Track.'
      },
      {
        airline: 'Air India (AI)',
        flightNumber: 'AI-161',
        origin: 'DEL',
        destination: 'LHR',
        depDateTime: '2026-10-15T02:45',
        arrDateTime: '2026-10-15T07:30',
        stops: 'Direct',
        cabinClass: 'Business',
        baggage: '2x 32kg included',
        netFare: 8200,
        markupPct: 18,
        notes: 'Morning direct flight to Heathrow T2.'
      }
    ]
  });

  const handleOptionChange = (index, field, value) => {
    setFormQuote(prev => {
      const updated = [...prev.options];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, options: updated };
    });
  };

  const handleAddOption = () => {
    if (formQuote.options.length >= 3) {
      showAlert('Maximum 3 flight quote options allowed', 'warning');
      return;
    }
    setFormQuote(prev => ({
      ...prev,
      options: [
        ...prev.options,
        {
          airline: 'Emirates (EK)',
          flightNumber: 'EK-511',
          origin: 'DEL',
          destination: 'LHR',
          depDateTime: '2026-10-15T10:30',
          arrDateTime: '2026-10-15T18:20',
          stops: '1 Stop (DXB)',
          cabinClass: 'Business',
          baggage: '40kg included',
          netFare: 7900,
          markupPct: 20,
          notes: ''
        }
      ]
    }));
    setActiveOptionTab(formQuote.options.length);
  };

  const handleSaveQuote = (status = 'Sent') => {
    const newId = 'QT-00' + (quotes.length + 1);
    const calculatedOptions = formQuote.options.map((opt, i) => {
      const net = Number(opt.netFare) || 0;
      const pct = Number(opt.markupPct) || 0;
      const selling = Math.round(net * (1 + pct / 100));
      return {
        id: i + 1,
        ...opt,
        sellingPrice: selling,
        profit: selling - net
      };
    });

    const newQuote = {
      id: newId,
      customerName: formQuote.customerName,
      customerEmail: formQuote.customerEmail,
      customerPhone: formQuote.customerPhone,
      route: `${formQuote.options[0]?.origin || 'DEL'} → ${formQuote.options[0]?.destination || 'LHR'}`,
      optionsCount: calculatedOptions.length,
      validity: formQuote.validity,
      createdBy: currentUser?.name || 'Alex M.',
      status: status,
      createdDate: new Date().toISOString().split('T')[0],
      sellingPrice: calculatedOptions[0]?.sellingPrice || 10350,
      flightReqRef: formQuote.flightReqRef,
      options: calculatedOptions
    };

    setQuotes([newQuote, ...quotes]);
    MOCK_QUOTES.unshift(newQuote);
    showAlert(`Quote ${newId} (${status}) saved for ${formQuote.customerName}!`, 'success');
    setAddModalOpen(false);
  };

  const handleUpdateStatus = (quoteId, newStatus) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: newStatus } : q));
    if (selectedQuote && selectedQuote.id === quoteId) {
      setSelectedQuote(prev => ({ ...prev, status: newStatus }));
    }
    showAlert(`Quote ${quoteId} status marked as ${newStatus}`, 'success');
  };

  const handleConvertToBooking = (quote, optionIndex = 0) => {
    const opt = quote.options?.[optionIndex] || quote.options?.[0] || {};
    const newBookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: newBookingId,
      bookingId: newBookingId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail || 'customer@example.com',
      customerPhone: quote.customerPhone || '+1 212 555 0199',
      route: quote.route,
      origin: opt.origin || 'DEL',
      destination: opt.destination || 'LHR',
      travelDate: opt.depDateTime ? opt.depDateTime.split('T')[0] : '15 Oct 2026',
      cabinClass: opt.cabinClass || 'Business',
      passengers: 2,
      pnr: 'QTPNR' + Math.floor(10 + Math.random() * 89),
      airline: opt.airline || 'British Airways',
      flightNumber: opt.flightNumber || 'BA-117',
      netFare: opt.netFare || (quote.sellingPrice * 0.85),
      sellingPrice: opt.sellingPrice || quote.sellingPrice,
      profit: opt.profit || (quote.sellingPrice * 0.15),
      bookingStatus: 'CONFIRMED',
      status: 'Confirmed',
      paymentStatus: 'PENDING',
      ticketStatus: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: quote.createdBy || currentUser?.name || 'Agent'
    };

    MOCK_BOOKINGS.unshift(newBooking);
    handleUpdateStatus(quote.id, 'Accepted');
    showAlert(`🎉 Quote ${quote.id} converted into Booking ${newBookingId}!`, 'success');
    navigate(`/${getRolePrefix()}/bookings`);
  };

  const handleResend = (quote) => {
    handleUpdateStatus(quote.id, 'Sent');
    showAlert(`Quote ${quote.id} re-dispatched to ${quote.customerName} via WhatsApp & Email!`, 'success');
  };

  const handleArchive = (quote) => {
    handleUpdateStatus(quote.id, 'Archived');
    showAlert(`Quote ${quote.id} moved to archive`, 'info');
  };

  const handleEdit = (quote) => {
    setSelectedQuote(quote);
    setAddModalOpen(true);
    showAlert(`Editing Quote ${quote.id} (Frontend mode)`, 'info');
  };

  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      const matchSearch =
        q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.route.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? q.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [quotes, searchTerm, statusFilter]);

  const columns = [
    {
      id: 'quoteId',
      label: 'Quote ID',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>
          {row.id}
        </Typography>
      )
    },
    {
      id: 'customer',
      label: 'Customer',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.customerName}</Typography>
          <Typography variant="caption" color="text.secondary">{row.customerEmail}</Typography>
        </Box>
      )
    },
    {
      id: 'agent',
      label: 'Sales Agent',
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 700 }}>{row.createdBy}</Typography>
      )
    },
    {
      id: 'route',
      label: 'Route',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FlightTakeoffIcon sx={{ fontSize: 14, color: 'primary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.route}</Typography>
        </Box>
      )
    },
    {
      id: 'cabinPax',
      label: 'Cabin / Pax',
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {row.options?.[0]?.cabinClass || row.cabinClass || 'Business'} · 👥 {row.passengers || 2} Pax
        </Typography>
      )
    },
    {
      id: 'date',
      label: 'Date',
      render: (row) => (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {row.createdDate}
        </Typography>
      )
    },
    {
      id: 'options',
      label: 'Flight Options',
      render: (row) => (
        <Chip size="small" label={`${row.optionsCount || row.options?.length || 1} Options`} color="info" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.68rem' }} />
      )
    },
    {
      id: 'netFare',
      label: 'Net Fare',
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: 'monospace' }}>
          ${Number(row.options?.[0]?.netFare || row.netFare || 8000).toLocaleString()}
        </Typography>
      )
    },
    {
      id: 'sellingPrice',
      label: 'Selling Price',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 900, color: 'success.main', fontFamily: 'monospace' }}>
          ${Number(row.options?.[0]?.sellingPrice || row.sellingPrice || 10000).toLocaleString()}
        </Typography>
      )
    },
    {
      id: 'profit',
      label: 'Profit ($ / %)',
      render: (row) => {
        const net = Number(row.options?.[0]?.netFare || row.netFare || 8000);
        const sell = Number(row.options?.[0]?.sellingPrice || row.sellingPrice || 10000);
        const prof = sell - net;
        const pct = net > 0 ? ((prof / net) * 100).toFixed(1) : '15.0';
        return (
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', display: 'block' }}>
              +${prof.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({pct}%)
            </Typography>
          </Box>
        );
      }
    },
    {
      id: 'status',
      label: 'Quote Status',
      render: (row) => {
        const cfg = STATUS_COLORS[row.status] || { bg: '#F1F5F9', color: '#475569', icon: '📝' };
        return (
          <Chip
            size="small"
            label={`${cfg.icon} ${row.status}`}
            sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 800, fontSize: '0.68rem', height: 22 }}
          />
        );
      }
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Flight Quotes Management (/quotes)"
        subtitle="Manage custom multi-option flight quotes, markup margin calculation & instant booking conversions."
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
            sx={{ fontWeight: 700 }}
          >
            + Create Multi-Option Quote
          </Button>
        }
      />

      {/* Summary KPI Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5, mb: 3 }}>
        {[
          { label: 'Total Quotes', value: quotes.length, color: '#6366F1', bg: '#EEF2FF' },
          { label: 'Sent & Viewed', value: quotes.filter(q => q.status === 'Sent' || q.status === 'Viewed').length, color: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Accepted (Won)', value: quotes.filter(q => q.status === 'Accepted').length, color: '#10B981', bg: '#ECFDF5' },
          { label: 'Conversion Rate', value: '68%', color: '#2563EB', bg: '#EFF6FF' },
        ].map((s, i) => (
          <Paper key={i} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: s.bg }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: s.color, mt: 0.5 }}>{s.value}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search quote ID, customer, route..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ width: { xs: '100%', md: 320 }, bgcolor: 'background.paper' }}
        />
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={e => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {QUOTE_STATUS_FLOW.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        <AppTable
          columns={columns}
          data={filteredQuotes}
          onRowClick={(row) => {
            setSelectedQuote(row);
            setDrawerOpen(true);
          }}
          actions={(row) => (
            <Box sx={{ display: 'flex', gap: 0.5, whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
              <Tooltip title="View Quote Details">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => { setSelectedQuote(row); setDrawerOpen(true); }}
                  sx={{ py: 0.4, px: 1, fontSize: '0.72rem', fontWeight: 700 }}
                >
                  View
                </Button>
              </Tooltip>

              <Tooltip title="Edit Quote">
                <IconButton size="small" color="primary" onClick={() => handleEdit(row)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Republish Quote to Client">
                <IconButton size="small" color="info" onClick={() => handleResend(row)}>
                  <PublishIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Convert to Confirmed Booking">
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<BookmarkAddedIcon sx={{ fontSize: 13 }} />}
                  onClick={() => handleConvertToBooking(row)}
                  sx={{ py: 0.4, px: 1, fontSize: '0.72rem', fontWeight: 700 }}
                >
                  Convert
                </Button>
              </Tooltip>

              <Tooltip title="Archive Quote">
                <IconButton size="small" color="default" onClick={() => handleArchive(row)}>
                  <ArchiveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </Paper>

      {/* ─── SLIDE-OVER QUOTE DETAILS MODAL ─── */}
      <AppModal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedQuote ? `Quote Details: ${selectedQuote.id}` : ''}
        maxWidth="md"
        actions={
          selectedQuote && (
            <Box sx={{ display: 'flex', gap: 1.5, width: '100%', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<EditIcon />}
                onClick={() => { handleEdit(selectedQuote); setDrawerOpen(false); }}
                sx={{ fontWeight: 800 }}
              >
                Edit Quote
              </Button>
              <Button
                variant="contained"
                color="info"
                startIcon={<PublishIcon />}
                onClick={() => { handleResend(selectedQuote); setDrawerOpen(false); }}
                sx={{ fontWeight: 800 }}
              >
                Republish Quote
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<BookmarkAddedIcon />}
                onClick={() => { handleConvertToBooking(selectedQuote, 0); setDrawerOpen(false); }}
                sx={{ fontWeight: 800 }}
              >
                Convert to Booking
              </Button>
            </Box>
          )
        }
      >
        {selectedQuote && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Customer: <b>{selectedQuote.customerName}</b> ({selectedQuote.customerEmail}) &nbsp;|&nbsp; Route: <b>{selectedQuote.route}</b> &nbsp;|&nbsp; Created By: <b>{selectedQuote.createdBy}</b>
              </Typography>
            </Box>

            <Divider />

            {/* STATUS LIFECYCLE FLOW STEPPER */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1.5, textTransform: 'uppercase' }}>
                QUOTE STATUS FLOW
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                {QUOTE_STATUS_FLOW.map((st) => {
                  const isCurrent = selectedQuote.status === st;
                  const cfg = STATUS_COLORS[st];
                  return (
                    <Chip
                      key={st}
                      label={`${cfg.icon} ${st}`}
                      onClick={() => handleUpdateStatus(selectedQuote.id, st)}
                      color={isCurrent ? (st === 'Accepted' ? 'success' : st === 'Rejected' ? 'error' : 'primary') : 'default'}
                      variant={isCurrent ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer', fontWeight: 800, fontSize: '0.68rem', height: 22 }}
                    />
                  );
                })}
              </Box>
            </Paper>

            {/* Options list */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                ✈️ FLIGHT OPTIONS ({selectedQuote.options?.length || 1} AVAILABLE)
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {(selectedQuote.options || [
                  {
                    id: 1,
                    airline: 'British Airways (BA)',
                    flightNumber: 'BA-117',
                    origin: 'DEL',
                    destination: 'LHR',
                    depDateTime: '2026-10-15T10:30',
                    arrDateTime: '2026-10-15T15:45',
                    stops: 'Direct',
                    cabinClass: 'Business',
                    baggage: '2x 32kg included',
                    netFare: 8800,
                    markupPct: 15,
                    sellingPrice: 10120,
                    profit: 1320,
                    notes: 'Club World lie-flat Suite seats.'
                  }
                ]).map((opt, idx) => (
                  <Paper key={idx} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: opt.id === 1 ? '#93C5FD' : 'divider', borderRadius: 2, bgcolor: opt.id === 1 ? '#EFF6FF' : '#FFFFFF' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip size="small" label={`Option #${idx + 1}`} color={idx === 0 ? 'primary' : 'default'} sx={{ fontWeight: 800 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>{opt.airline} ({opt.flightNumber})</Typography>
                      </Box>
                      <Chip size="small" label={opt.stops} variant="outlined" sx={{ fontSize: '0.65rem' }} />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 0.8, fontSize: 13, mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Departure/Arrival:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {opt.depDateTime?.replace('T', ' ')} → {opt.arrDateTime?.replace('T', ' ')}
                      </Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Class & Baggage:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{opt.cabinClass} &nbsp;·&nbsp; 🧳 {opt.baggage}</Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Net Fare (Cost):</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>${Number(opt.netFare || 8000).toLocaleString()}</Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Markup %:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{opt.markupPct || 15}%</Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Selling Price:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: 'success.main', fontSize: '0.85rem' }}>
                        ${Number(opt.sellingPrice || 10120).toLocaleString()}
                      </Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Net Profit:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        +${Number(opt.profit || 1320).toLocaleString()}
                      </Typography>
                    </Box>

                    {opt.notes && (
                      <Box sx={{ p: 1, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0', fontSize: 12, color: '#475569', mb: 1.5 }}>
                        💡 {opt.notes}
                      </Box>
                    )}

                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      fullWidth
                      startIcon={<BookmarkAddedIcon />}
                      onClick={() => { handleConvertToBooking(selectedQuote, idx); setDrawerOpen(false); }}
                      sx={{ fontWeight: 700 }}
                    >
                      Select Option #{idx + 1} & Book
                    </Button>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Fare Rules Summary */}
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #BAE6FD', bgcolor: '#F0F9FF', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'info.main', mb: 1 }}>
                📜 FARE RULES & CANCELLATION PENALTIES
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                • <b>Refund Rules:</b> Permitted within 24h of issuance; non-refundable thereafter.<br />
                • <b>Change Fee:</b> $200 change fee + fare difference prior to departure.<br />
                • <b>Advance Purchase:</b> Fare basis JOWUS requires booking 7 days in advance.
              </Typography>
            </Paper>

            {/* Upsell Suggestions */}
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #FEF08A', bgcolor: '#FFFBEB', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400E', mb: 1 }}>
                💡 RECOMMENDED ANCILLARY UPSELLS
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip size="small" label="💺 Lie-flat Seat Upgrade (+$120)" color="warning" variant="outlined" sx={{ fontWeight: 700 }} />
                <Chip size="small" label="🧳 Extra 32kg Baggage (+$80)" color="warning" variant="outlined" sx={{ fontWeight: 700 }} />
                <Chip size="small" label="🛡️ Trip Insurance (+$45)" color="warning" variant="outlined" sx={{ fontWeight: 700 }} />
                <Chip size="small" label="🚌 Airport Luxury Transfer (+$60)" color="warning" variant="outlined" sx={{ fontWeight: 700 }} />
              </Box>
            </Paper>
          </Box>
        )}
      </AppModal>

      {/* ─── CREATE MULTI-OPTION QUOTE MODAL (FULL SPEC) ─── */}
      <AppModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Create Multi-Option Flight Quote"
        maxWidth="md"
        actions={
          <>
            <Button onClick={() => setAddModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={() => handleSaveQuote('Draft')}
              variant="outlined"
              color="secondary"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSaveQuote('Sent')}
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
            >
              Send to Customer
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Section 1: Customer & Flight Request */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5 }}>
              👤 QUOTE FOR (CUSTOMER & LINKED REQUEST)
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5 }}>
              <TextField
                size="small"
                label="Customer Name *"
                value={formQuote.customerName}
                onChange={e => setFormQuote({ ...formQuote, customerName: e.target.value })}
              />
              <TextField
                size="small"
                label="Customer Email"
                value={formQuote.customerEmail}
                onChange={e => setFormQuote({ ...formQuote, customerEmail: e.target.value })}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Validity Period</InputLabel>
                <Select
                  value={formQuote.validity}
                  label="Validity Period"
                  onChange={e => setFormQuote({ ...formQuote, validity: e.target.value })}
                >
                  <MenuItem value="12h">12 Hours</MenuItem>
                  <MenuItem value="24h">24 Hours</MenuItem>
                  <MenuItem value="48h">48 Hours</MenuItem>
                  <MenuItem value="72h">72 Hours</MenuItem>
                  <MenuItem value="Custom">Custom Expiry</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Section 2: Multi-Option Tabs (Up to 3 options) */}
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #BAE6FD', bgcolor: '#F0F9FF', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'info.main' }}>
                ✈️ FLIGHT OPTIONS (ADD UP TO 3 OPTIONS)
              </Typography>
              {formQuote.options.length < 3 && (
                <Button size="small" startIcon={<AddIcon />} onClick={handleAddOption}>
                  Add Option #{formQuote.options.length + 1}
                </Button>
              )}
            </Box>

            <Tabs
              value={activeOptionTab}
              onChange={(_, v) => setActiveOptionTab(v)}
              sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              {formQuote.options.map((_, i) => (
                <Tab key={i} label={`Option #${i + 1}`} sx={{ fontWeight: 700 }} />
              ))}
            </Tabs>

            {formQuote.options[activeOptionTab] && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Airline *</InputLabel>
                    <Select
                      value={formQuote.options[activeOptionTab].airline}
                      label="Airline *"
                      onChange={e => handleOptionChange(activeOptionTab, 'airline', e.target.value)}
                    >
                      {['British Airways (BA)', 'American Airlines (AA)', 'Emirates (EK)', 'Air India (AI)', 'Qatar Airways (QR)', 'Virgin Atlantic (VS)'].map(a => (
                        <MenuItem key={a} value={a}>{a}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    label="Flight Number *"
                    value={formQuote.options[activeOptionTab].flightNumber}
                    onChange={e => handleOptionChange(activeOptionTab, 'flightNumber', e.target.value)}
                  />

                  <FormControl size="small" fullWidth>
                    <InputLabel>Stops</InputLabel>
                    <Select
                      value={formQuote.options[activeOptionTab].stops}
                      label="Stops"
                      onChange={e => handleOptionChange(activeOptionTab, 'stops', e.target.value)}
                    >
                      <MenuItem value="Direct">Direct Non-Stop</MenuItem>
                      <MenuItem value="1 Stop">1 Stop</MenuItem>
                      <MenuItem value="2 Stops">2 Stops</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    label="Origin (Airport Code) *"
                    value={formQuote.options[activeOptionTab].origin}
                    onChange={e => handleOptionChange(activeOptionTab, 'origin', e.target.value)}
                  />

                  <TextField
                    size="small"
                    label="Destination (Airport Code) *"
                    value={formQuote.options[activeOptionTab].destination}
                    onChange={e => handleOptionChange(activeOptionTab, 'destination', e.target.value)}
                  />

                  <FormControl size="small" fullWidth>
                    <InputLabel>Cabin Class *</InputLabel>
                    <Select
                      value={formQuote.options[activeOptionTab].cabinClass}
                      label="Cabin Class *"
                      onChange={e => handleOptionChange(activeOptionTab, 'cabinClass', e.target.value)}
                    >
                      {['Economy', 'Premium Economy', 'Business', 'First Class'].map(c => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    label="Departure Date & Time *"
                    type="datetime-local"
                    value={formQuote.options[activeOptionTab].depDateTime}
                    onChange={e => handleOptionChange(activeOptionTab, 'depDateTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    size="small"
                    label="Arrival Date & Time *"
                    type="datetime-local"
                    value={formQuote.options[activeOptionTab].arrDateTime}
                    onChange={e => handleOptionChange(activeOptionTab, 'arrDateTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    size="small"
                    label="Baggage Allowance"
                    value={formQuote.options[activeOptionTab].baggage}
                    onChange={e => handleOptionChange(activeOptionTab, 'baggage', e.target.value)}
                    placeholder="e.g. 2x 23kg included"
                  />
                </Box>

                {/* Pricing calculation for this option */}
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #BAE6FD', mt: 1 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' }, gap: 1.5, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      label="Net Fare ($) *"
                      type="number"
                      value={formQuote.options[activeOptionTab].netFare}
                      onChange={e => handleOptionChange(activeOptionTab, 'netFare', Number(e.target.value))}
                    />
                    <TextField
                      size="small"
                      label="Markup % *"
                      type="number"
                      value={formQuote.options[activeOptionTab].markupPct}
                      onChange={e => handleOptionChange(activeOptionTab, 'markupPct', Number(e.target.value))}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Selling Price (calc):</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'success.main' }}>
                        ${Math.round((Number(formQuote.options[activeOptionTab].netFare) || 0) * (1 + (Number(formQuote.options[activeOptionTab].markupPct) || 0) / 100)).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Net Profit:</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2563EB' }}>
                        +${Math.round((Number(formQuote.options[activeOptionTab].netFare) || 0) * ((Number(formQuote.options[activeOptionTab].markupPct) || 0) / 100)).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <TextField
                  size="small"
                  label="Option Notes & Highlights"
                  multiline
                  rows={2}
                  value={formQuote.options[activeOptionTab].notes}
                  onChange={e => handleOptionChange(activeOptionTab, 'notes', e.target.value)}
                  placeholder="e.g. Free seat selection, chauffeur transfer included, refundable fare..."
                  fullWidth
                />
              </Box>
            )}
          </Paper>
        </Box>
      </AppModal>
    </Box>
  );
}
