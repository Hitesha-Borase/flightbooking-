import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

// Icons
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import PageHeader from '../../components/PageHeader';
import PaymentLinkModal from '../../components/PaymentLinkModal';
import { MOCK_BOOKINGS } from '../../constants/mockData';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';


const STATUS_STEPS = [
  'Quoted',
  'Confirmed',
  'PNR Created',
  'Payment Received',
  'Ticketed',
  'Dispatched',
  'Completed'
];

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { currentUser } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const hasPermission = (key) => {
    if (currentUser?.customPermissions?.enabled) {
      return !!currentUser.customPermissions.granular?.[key];
    }
    return true;
  };


  const found = (MOCK_BOOKINGS || []).find(b => b.id === id || b.bookingId === id);
  const [booking, setBooking] = useState(() => found || {
    id: id || 'BK-001',
    bookingId: id || 'BK-001',
    customerName: 'Karan Singh',
    customerEmail: 'karan@example.com',
    customerPhone: '+1 212 555 0199',
    route: 'DEL → LHR',
    origin: 'DEL',
    destination: 'LHR',
    airline: 'British Airways (BA)',
    flightNumber: 'BA-117',
    travelDate: '15 Oct 2026',
    returnDate: '22 Oct 2026',
    cabinClass: 'Business',
    passengers: 2,
    pnr: 'SAB78K',
    gdsBookingRef: '1S-9923841',
    netFare: 8800,
    markupPct: 15,
    fixedMarkup: 230,
    sellingPrice: 10350,
    amountPaid: 10350,
    balanceDue: 0,
    profit: 1550,
    bookingStatus: 'Confirmed',
    paymentStatus: 'PAID',
    ticketStatus: 'ISSUED',
    createdBy: 'Maria S. (Senior Flight Specialist)',
    createdAt: '2026-06-18',
    passengerList: [
      { name: 'Karan Singh', dob: '1988-05-12', passport: 'US98234109', expiry: '2031-08-15', nationality: 'American', eTicket: '125-9834102941' },
      { name: 'Pooja Singh', dob: '1990-11-24', passport: 'US77102934', expiry: '2030-04-10', nationality: 'American', eTicket: '125-9834102942' }
    ]
  });

  const handleUpdateStatus = (newStatus) => {
    setBooking(prev => ({ ...prev, bookingStatus: newStatus, status: newStatus }));
    showAlert(`Booking status updated to ${newStatus}`, 'success');
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Button
        startIcon={<KeyboardArrowLeftIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 1.5, color: 'text.secondary' }}
      >
        Back to Bookings
      </Button>

      {/* Header */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                {booking.bookingId || booking.id}
              </Typography>
              <Chip size="small" label={booking.bookingStatus || 'Confirmed'} color="primary" sx={{ fontWeight: 800 }} />
              <Chip size="small" label={`PNR: ${booking.pnr || 'SAB78K'}`} color="secondary" variant="outlined" sx={{ fontWeight: 800, fontFamily: 'monospace' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Passenger: <b>{booking.customerName}</b> &nbsp;|&nbsp; Route: <b>{booking.route}</b> &nbsp;|&nbsp; Date: <b>{booking.travelDate}</b>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={() => showAlert('Official Itinerary PDF downloaded', 'info')}
            >
              Print Itinerary
            </Button>
            {hasPermission('createTicket') && (
              <Button
                variant="contained"
                color="success"
                startIcon={<ConfirmationNumberIcon />}
                onClick={() => handleUpdateStatus('Ticketed')}
              >
                Issue E-Tickets
              </Button>
            )}
            {hasPermission('createPaymentRequest') && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MonetizationOnIcon />}
                onClick={() => setPaymentModalOpen(true)}
              >
                Payment Link
              </Button>
            )}
          </Box>

        </Box>
      </Paper>

      {/* Status Flow Stepper */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#F8FAFC' }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1.5, textTransform: 'uppercase' }}>
          INTERACTIVE BOOKING LIFECYCLE STATUS FLOW
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
          {STATUS_STEPS.map((step, idx) => {
            const currentStatus = booking.bookingStatus || 'Confirmed';
            const currentIdx = STATUS_STEPS.indexOf(currentStatus);
            const isPassed = currentIdx >= idx;
            const isCurrent = currentStatus === step;
            return (
              <Chip
                key={step}
                label={`${idx + 1}. ${step}`}
                onClick={() => handleUpdateStatus(step)}
                color={isCurrent ? 'primary' : isPassed ? 'success' : 'default'}
                variant={isCurrent || isPassed ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem', py: 0.5 }}
              />
            );
          })}
          {['Cancelled', 'Refunded'].map(ex => (
            <Chip
              key={ex}
              label={ex}
              onClick={() => handleUpdateStatus(ex)}
              color="error"
              variant={booking.bookingStatus === ex ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem' }}
            />
          ))}
        </Box>
      </Paper>

      {/* 2-Column Main View */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: 2.5 }}>
        {/* Left Column: Flight & Passenger Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Flight Details */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #BAE6FD', bgcolor: '#F0F9FF', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'info.main', mb: 2 }}>
              ✈️ FLIGHT & GDS DETAILS
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: 1.2, fontSize: 14 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Airline / Flight No:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>{booking.airline || 'British Airways'} ({booking.flightNumber || 'BA-117'})</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Origin → Destination:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 900 }}>{booking.origin || 'DEL'} → {booking.destination || 'LHR'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Departure Date:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{booking.travelDate || '15 Oct 2026'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Cabin Class:</Typography>
              <Chip size="small" label={booking.cabinClass || 'Business'} color="primary" sx={{ fontWeight: 800, width: 'fit-content' }} />

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Sabre PNR:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>{booking.pnr || 'SAB78K'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>GDS Booking Ref:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{booking.gdsBookingRef || '1S-9923841'}</Typography>
            </Box>
          </Paper>

          {/* Passenger Manifest */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              👥 PASSENGERS & 13-DIGIT E-TICKETS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {(booking.passengerList || [
                { name: booking.customerName || 'Karan Singh', passport: 'US98234109', nationality: 'American', eTicket: '125-9834102941' },
                { name: 'Pooja Singh', passport: 'US77102934', nationality: 'American', eTicket: '125-9834102942' }
              ]).map((p, i) => (
                <Box key={i} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Pax #{i + 1}: {p.name}</Typography>
                    <Chip size="small" label={p.nationality} variant="outlined" sx={{ fontSize: '0.68rem' }} />
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 0.5, fontSize: 13 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Passport No:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{p.passport}</Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>13-Digit E-Ticket:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'success.main', fontFamily: 'monospace' }}>
                      {p.eTicket || '125-9834102941'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Right Column: Pricing & Financials */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Pricing Card */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #86EFAC', bgcolor: '#F0FDF4', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'success.main', mb: 2 }}>
              💰 PRICING & NET PROFIT MARGIN
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: 1.5, fontSize: 14 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Net Fare (Cost):</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>${Number(booking.netFare || 8800).toLocaleString()}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Manual Markup %:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{booking.markupPct || 15}%</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Fixed Markup USD:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>${booking.fixedMarkup || 230}</Typography>

              <Divider sx={{ gridColumn: 'span 2', my: 0.5 }} />

              <Typography variant="body1" sx={{ fontWeight: 800 }}>Selling Price:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'success.main' }}>
                ${Number(booking.sellingPrice || 10350).toLocaleString()}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Amount Paid:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>${Number(booking.amountPaid || 10350).toLocaleString()}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Balance Due:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: (booking.sellingPrice - booking.amountPaid) > 0 ? '#DC2626' : '#10B981' }}>
                ${Math.max(0, (booking.sellingPrice - booking.amountPaid) || 0).toLocaleString()}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Net Profit Margin:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 900, color: '#2563EB' }}>
                +${Number(booking.profit || 1550).toLocaleString()} ({booking.markupPct || 15}%)
              </Typography>
            </Box>
          </Paper>

          {/* Booking Metadata */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
              📋 BOOKING METADATA
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: 1, fontSize: 13 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Booking Reference:</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{booking.bookingId || booking.id}</Typography>

              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Created By Agent:</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{booking.createdBy || 'Maria S.'}</Typography>

              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Created Date:</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{booking.createdAt || '2026-06-18'}</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Payment Link Modal */}
      <PaymentLinkModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={(data) => {
          setPaymentModalOpen(false);
          showAlert(`Payment link generated for ${data.customer} — ${data.currency} ${Number(data.amount).toLocaleString()}`, 'success');
        }}
      />
    </Box>
  );
}
