import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';

// Icons
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ForumIcon from '@mui/icons-material/Forum';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Services & Components
import { dbService } from '../../services/dbService';
import PageHeader from '../../components/PageHeader';
import AppCard from '../../components/AppCard';
import AppModal from '../../components/AppModal';
import PaymentLinkModal from '../../components/PaymentLinkModal';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_BOOKINGS } from '../../constants/mockData';

export const SuperAdminClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState(0);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [newLogText, setNewLogText] = useState('');
  const [logChannel, setLogChannel] = useState('WhatsApp');

  // Fetch clients
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: dbService.getClients
  });

  const client = clients.find((c) => c.id === id) || {
    id: id || 'CL-9021',
    firstName: 'Karan',
    lastName: 'Singh',
    email: 'karan.singh@example.com',
    phone: '+1 212 555 0199',
    country: 'United States',
    nationality: 'American',
    city: 'New York',
    timezone: 'UTC-05:00 Eastern Time',
    preferredLanguage: 'English',
    passportNumber: 'US98234109',
    passportExpiry: '2031-08-15',
    otherNationalities: 'Indian (OCI)',
    preferredCabinClass: 'Business Class',
    frequentFlyer: [
      { airline: 'British Airways', program: 'Executive Club', number: 'BA-9832104', status: 'Silver' },
      { airline: 'Delta Airlines', program: 'SkyMiles', number: 'DL-4482019', status: 'Platinum Medallion' },
      { airline: 'Emirates', program: 'Skywards', number: 'EK-7729103', status: 'Gold' }
    ],
    preferredAirlines: ['British Airways', 'American Airlines', 'Emirates', 'Air India'],
    seatPreference: 'Aisle Seat (Exit Row preferred)',
    mealPreference: 'Vegetarian (Asian Style)',
    specialAssistance: 'Extra legroom required',
    assignedConsultant: 'Maria S.',
    totalSpent: '$24,225',
    totalBookings: 4
  };

  const clientBookings = (MOCK_BOOKINGS || []).filter(b =>
    b.customerName?.toLowerCase().includes(client.firstName?.toLowerCase()) ||
    b.customerEmail?.toLowerCase() === client.email?.toLowerCase()
  );

  const mockBookingsList = clientBookings.length > 0 ? clientBookings : [
    { id: 'BK-4591', route: 'DEL → LHR', travelDate: '15 Oct 2026', cabinClass: 'Business', sellingPrice: 5175, bookingStatus: 'TICKETED', pnr: 'ABC12D' },
    { id: 'BK-3820', route: 'JFK → DXB', travelDate: '20 Aug 2026', cabinClass: 'First', sellingPrice: 8500, bookingStatus: 'COMPLETED', pnr: 'DXB89F' },
    { id: 'BK-2910', route: 'LHR → JFK', travelDate: '12 May 2026', cabinClass: 'Business', sellingPrice: 4800, bookingStatus: 'COMPLETED', pnr: 'LHR33K' },
    { id: 'BK-1102', route: 'BOM → SIN', travelDate: '05 Jan 2026', cabinClass: 'Economy', sellingPrice: 1250, bookingStatus: 'COMPLETED', pnr: 'SIN55R' },
  ];

  const mockInvoices = [
    { id: 'INV-1092', bookingRef: 'BK-4591', amount: '$5,175.00', method: 'Stripe Credit Card', status: 'PAID', date: '2026-06-18' },
    { id: 'INV-0881', bookingRef: 'BK-3820', amount: '$8,500.00', method: 'Bank Wire Transfer', status: 'PAID', date: '2026-05-14' },
    { id: 'INV-0654', bookingRef: 'BK-2910', amount: '$4,800.00', method: 'Stripe Credit Card', status: 'PAID', date: '2026-04-02' },
    { id: 'INV-0312', bookingRef: 'BK-1102', amount: '$1,250.00', method: 'Apple Pay', status: 'PAID', date: '2025-12-20' },
  ];

  const [commLogs, setCommLogs] = useState([
    { id: 1, channel: 'WhatsApp', time: 'Today, 14:20', agent: 'Maria S.', text: 'Sent updated flight options for JFK → LHR Business class direct flights (BA-117).' },
    { id: 2, channel: 'Call', time: 'Yesterday, 16:45', agent: 'Maria S.', text: 'Telnyx call (duration: 8m 22s). Passenger confirmed preference for Aisle seats and vegetarian meal.' },
    { id: 3, channel: 'Email', time: '14 Jun 2026', agent: 'System / GDS', text: 'E-Ticket PDF and official itinerary dispatched for PNR ABC12D.' },
    { id: 4, channel: 'SMS', time: '12 Jun 2026', agent: 'System', text: 'Payment confirmation link opened by customer.' },
  ]);

  const handleAddCommLog = () => {
    if (!newLogText.trim()) return;
    const newEntry = {
      id: Date.now(),
      channel: logChannel,
      time: 'Just now',
      agent: currentUser?.name || 'Admin',
      text: newLogText
    };
    setCommLogs([newEntry, ...commLogs]);
    setNewLogText('');
    showAlert(`Communication record added to ${client.firstName}'s profile!`, 'success');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Button
        startIcon={<KeyboardArrowLeftIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 1.5, color: 'text.secondary' }}
      >
        Back to Customers
      </Button>

      {/* Customer Header Banner */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 24, fontWeight: 900 }}>
              {client.firstName?.[0]}{client.lastName?.[0]}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {client.firstName} {client.lastName}
                </Typography>
                <Chip size="small" label="👑 VIP Frequent Flyer" color="primary" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                Customer ID: <b>#{client.id}</b> &nbsp;|&nbsp; Location: <b>{client.city || 'New York'}, {client.country || 'USA'}</b> ({client.timezone || 'EST'})
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<PhoneIcon />}
              onClick={() => showAlert(`Calling ${client.firstName} via Telnyx WebRTC…`, 'success')}
            >
              Call
            </Button>
            <Button
              variant="outlined"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={() => navigate('/social-inbox?channel=whatsapp')}
            >
              WhatsApp
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FlightTakeoffIcon />}
              onClick={() => {
                showAlert(`New flight quote created for ${client.firstName}!`, 'success');
                navigate('/quotes');
              }}
            >
              Create Flight Quote
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<MonetizationOnIcon />}
              onClick={() => setPaymentModalOpen(true)}
            >
              Send Payment Link
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab icon={<PersonIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Personal & Passport" sx={{ fontWeight: 700 }} />
        <Tab icon={<StarIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Travel Preferences" sx={{ fontWeight: 700 }} />
        <Tab icon={<AirplaneTicketIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Booking History (${mockBookingsList.length})`} sx={{ fontWeight: 700 }} />
        <Tab icon={<ReceiptIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Payment History (${mockInvoices.length})`} sx={{ fontWeight: 700 }} />
        <Tab icon={<ForumIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Communication Log (${commLogs.length})`} sx={{ fontWeight: 700 }} />
      </Tabs>

      {/* ─── TAB 0: PERSONAL & PASSPORT DATA ─── */}
      {activeTab === 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
          {/* Personal Data */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, color: 'primary.main' }}>
              👤 PERSONAL DATA
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: 1.5, fontSize: 14 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Full Name:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>{client.firstName} {client.lastName}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Email Address:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{client.email}</Typography>
                <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Phone Number:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{client.phone}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Country / Nationality:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{client.country || 'USA'} ({client.nationality || 'American'})</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>City:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{client.city || 'New York'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Time Zone:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{client.timezone || 'UTC-05:00 Eastern Time (EST)'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Language Preference:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{client.preferredLanguage || 'English'}</Typography>
            </Box>
          </Paper>

          {/* Passport / Travel Docs */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, color: 'info.main' }}>
              🛂 PASSPORT & TRAVEL DOCUMENTS
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: 1.5, fontSize: 14 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Passport Number:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{client.passportNumber || 'US98234109'}</Typography>
                <Chip size="small" label="Verified Valid" color="success" sx={{ fontSize: '0.65rem', height: 20 }} />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Passport Expiry Date:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>{client.passportExpiry || '2031-08-15'} (Valid &gt; 6 months)</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Primary Nationality:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{client.nationality || 'American (US Citizen)'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Other Nationalities Held:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{client.otherNationalities || 'Indian (OCI Card Holder)'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Visa Requirements:</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Eligible for Visa-Free / ETA to UK, EU, UAE, Singapore & Japan.
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

      {/* ─── TAB 1: TRAVEL PREFERENCES ─── */}
      {activeTab === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
          {/* Seating & Inflight */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, color: 'primary.main' }}>
              ✈️ FLIGHT & CABIN PREFERENCES
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', rowGap: 1.5, fontSize: 14 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Preferred Cabin Class:</Typography>
              <Chip size="small" label={client.preferredCabinClass || 'Business Class'} color="primary" sx={{ fontWeight: 800, width: 'fit-content' }} />

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Seat Preference:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{client.seatPreference || 'Aisle Seat (Exit Row preferred)'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Meal Preference:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{client.mealPreference || 'Vegetarian (Asian Style)'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Special Assistance:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{client.specialAssistance || 'None'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Preferred Airlines:</Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {(client.preferredAirlines || ['British Airways', 'American Airlines', 'Emirates']).map(a => (
                  <Chip key={a} size="small" label={a} variant="outlined" sx={{ fontSize: '0.7rem' }} />
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Frequent Flyer Programs */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, color: 'warning.main' }}>
              💳 FREQUENT FLYER ACCOUNTS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {(client.frequentFlyer || [
                { airline: 'British Airways', program: 'Executive Club', number: 'BA-9832104', status: 'Silver' },
                { airline: 'Delta Airlines', program: 'SkyMiles', number: 'DL-4482019', status: 'Platinum Medallion' },
                { airline: 'Emirates', program: 'Skywards', number: 'EK-7729103', status: 'Gold' }
              ]).map((ff, i) => (
                <Box key={i} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{ff.airline} — {ff.program}</Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'text.secondary' }}>Account: {ff.number}</Typography>
                  </Box>
                  <Chip size="small" label={`🌟 ${ff.status}`} color="warning" sx={{ fontWeight: 700, fontSize: '0.68rem' }} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      )}

      {/* ─── TAB 2: BOOKING HISTORY ─── */}
      {activeTab === 2 && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>PASSENGER BOOKING HISTORY</Typography>
            <Chip size="small" label={`Total Lifetime Spent: ${client.totalSpent || '$24,225'}`} color="success" sx={{ fontWeight: 800 }} />
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 650 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9', background: '#FAFAFA' }}>
                  {['Booking Ref', 'PNR Code', 'Route', 'Travel Date', 'Cabin Class', 'Total Amount ($)', 'Booking Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#64748B', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockBookingsList.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#2563EB' }}>{b.id}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700 }}>{b.pnr || 'ABC12D'}</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FlightTakeoffIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                        {b.route}
                      </Box>
                    </td>
                    <td style={{ padding: '12px' }}>{b.travelDate}</td>
                    <td style={{ padding: '12px' }}>
                      <Chip size="small" label={b.cabinClass} variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    </td>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#10B981' }}>${b.sellingPrice?.toFixed(2) || b.sellingPrice}</td>
                    <td style={{ padding: '12px' }}>
                      <Chip
                        size="small"
                        label={b.bookingStatus || 'CONFIRMED'}
                        color={b.bookingStatus === 'TICKETED' || b.bookingStatus === 'COMPLETED' ? 'success' : 'primary'}
                        sx={{ fontSize: '0.68rem', fontWeight: 700 }}
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Button size="small" variant="text" onClick={() => navigate(`/super_admin/bookings/${b.id}`)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      )}

      {/* ─── TAB 3: PAYMENT HISTORY ─── */}
      {activeTab === 3 && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>FINANCIAL TRANSACTIONS & INVOICES</Typography>
            <Button size="small" variant="contained" color="secondary" onClick={() => setPaymentModalOpen(true)}>
              + Generate Payment Link
            </Button>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 650 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9', background: '#FAFAFA' }}>
                  {['Invoice #', 'Booking Ref', 'Amount ($)', 'Payment Gateway / Method', 'Status', 'Date Paid', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#64748B', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '12px', fontWeight: 800, fontFamily: 'monospace' }}>{inv.id}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#64748B' }}>{inv.bookingRef}</td>
                    <td style={{ padding: '12px', fontWeight: 900, color: '#10B981' }}>{inv.amount}</td>
                    <td style={{ padding: '12px' }}>{inv.method}</td>
                    <td style={{ padding: '12px' }}>
                      <Chip size="small" label={inv.status} color="success" sx={{ fontSize: '0.65rem', fontWeight: 800 }} />
                    </td>
                    <td style={{ padding: '12px', color: '#64748B' }}>{inv.date}</td>
                    <td style={{ padding: '12px' }}>
                      <Button size="small" variant="outlined" onClick={() => showAlert(`Invoice ${inv.id} PDF opened`, 'info')}>
                        View PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      )}

      {/* ─── TAB 4: COMMUNICATION LOG ─── */}
      {activeTab === 4 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' }, gap: 2.5 }}>
          {/* Feed */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              CHRONOLOGICAL COMMUNICATION TIMELINE
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {commLogs.map((log) => (
                <Box key={log.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        icon={log.channel === 'WhatsApp' ? <WhatsAppIcon /> : log.channel === 'Call' ? <PhoneIcon /> : <EmailIcon />}
                        label={log.channel}
                        color={log.channel === 'WhatsApp' || log.channel === 'Call' ? 'success' : 'primary'}
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>Agent: {log.agent}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{log.time}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#334155' }}>
                    {log.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Quick Note Composer */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: 'fit-content' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
              📝 LOG NEW COMMUNICATION
            </Typography>
            <FormControl size="small" fullWidth sx={{ mb: 2 }}>
              <InputLabel>Channel</InputLabel>
              <Select value={logChannel} label="Channel" onChange={e => setLogChannel(e.target.value)}>
                <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                <MenuItem value="Call">Phone Call (Telnyx)</MenuItem>
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="SMS">SMS</MenuItem>
                <MenuItem value="Internal Note">Internal Agent Note</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Enter details of passenger conversation, seat preferences, quote feedback..."
              value={newLogText}
              onChange={e => setNewLogText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddCommLog}
              sx={{ fontWeight: 700 }}
            >
              Save to Timeline
            </Button>
          </Paper>
        </Box>
      )}

      {/* Payment Link Modal */}
      <PaymentLinkModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={(data) => {
          setPaymentModalOpen(false);
          showAlert(`Payment link generated for ${client.firstName} — ${data.currency} ${Number(data.amount).toLocaleString()}`, 'success');
        }}
      />
    </Box>
  );
};

export default SuperAdminClientDetails;
