import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AppModal from './AppModal';

export const DEMO_ISSUANCE_QUEUE = [
  {
    id: 'TK-451',
    name: 'M. Chen',
    route: 'JFK → LHR',
    pnr: 'ABC12D',
    amount: '$1,250.00',
    date: '15 Oct 2026',
    cabinClass: 'Business',
    passengers: 2,
    ttl: '38 mins remaining',
    isTtlUrgent: true,
    paymentStatus: 'Payment Confirmed',
    ticketingStatus: 'Pending Issuance'
  },
  {
    id: 'TK-452',
    name: 'A. Lee',
    route: 'DEL → SIN',
    pnr: 'LMN78F',
    amount: '$530.00',
    date: '20 Nov 2026',
    cabinClass: 'Economy',
    passengers: 1,
    ttl: '2h 15m remaining',
    isTtlUrgent: false,
    paymentStatus: 'Payment Confirmed',
    ticketingStatus: 'Pending Issuance'
  },
  {
    id: 'TK-453',
    name: 'K. Singh',
    route: 'DXB → LHR',
    pnr: 'QRS90G',
    amount: '$1,850.00',
    date: '05 Dec 2026',
    cabinClass: 'First Class',
    passengers: 3,
    ttl: '4h 30m remaining',
    isTtlUrgent: false,
    paymentStatus: 'Payment Confirmed',
    ticketingStatus: 'Pending Issuance'
  }
];


export default function IssuanceQueue({
  items = DEMO_ISSUANCE_QUEUE,
  selectedId,
  onSelectIssue
}) {
  const [reviewItem, setReviewItem] = useState(null);

  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
          READY-FOR-ISSUANCE QUEUE
        </Typography>
        <Chip
          label={`${items.length} Leads Ready`}
          color={items.length > 0 ? 'success' : 'default'}
          size="small"
          icon={<NotificationsActiveIcon sx={{ fontSize: '0.85rem !important' }} />}
          sx={{ fontWeight: 800, fontSize: '0.7rem' }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Paid leads are awaiting ticket generation.
      </Typography>

      {/* Empty State */}
      {items.length === 0 && (
        <Box sx={{ py: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="body2" color="success.main" sx={{ fontWeight: 800 }}>
            🎉 All tickets in queue issued!
          </Typography>
          <Typography variant="caption" color="text.secondary">
            New paid bookings will automatically appear here.
          </Typography>
        </Box>
      )}

      {/* Queue Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: 1.5, 
        overflowX: 'auto', 
        pb: 1.5,
        pt: 0.5,
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.15)', borderRadius: 3 }
      }}>
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <Paper
              key={item.id}
              variant="outlined"
              sx={{
                p: 1.8,
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? '#EFF6FF' : 'background.paper',
                boxShadow: isSelected ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
                transition: 'all 0.2s ease',
                minWidth: 265,
                flexShrink: 0,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: isSelected ? '#EFF6FF' : '#F8FAFC'
                }
              }}
            >
              {/* Ref & Class */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>
                  Lead #{item.id} — {item.name}
                </Typography>
                <Chip
                  size="small"
                  label={item.cabinClass || 'Business'}
                  variant="outlined"
                  sx={{ fontSize: '0.62rem', height: 18, fontWeight: 700 }}
                />
              </Box>

              {/* Route & Date */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <FlightTakeoffIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {item.route}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  · {item.date}
                </Typography>
              </Box>

              {/* Payment Confirmed */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 800 }}>
                  Payment Confirmed ({item.amount})
                </Typography>
              </Box>

              {/* Sabre PNR */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  ◉ PNR: <b style={{ fontFamily: 'monospace', color: '#0F172A' }}>{item.pnr}</b>
                </Typography>
                {item.ttl && (
                  <Chip
                    size="small"
                    label={`⏱️ ${item.ttl}`}
                    color={item.isTtlUrgent ? "error" : "default"}
                    sx={{
                      height: 18,
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      bgcolor: item.isTtlUrgent ? '#FEE2E2' : '#F1F5F9',
                      color: item.isTtlUrgent ? '#B91C1C' : '#475569'
                    }}
                  />
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>

                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<ConfirmationNumberIcon sx={{ fontSize: 13 }} />}
                  sx={{ fontSize: '0.7rem', fontWeight: 800, py: 0.4, px: 0.5 }}
                  onClick={() => onSelectIssue(item)}
                >
                  Issue Ticket
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  startIcon={<VisibilityIcon sx={{ fontSize: 13 }} />}
                  sx={{ fontSize: '0.7rem', fontWeight: 700, py: 0.4, px: 0.5 }}
                  onClick={() => setReviewItem(item)}
                >
                  Review
                </Button>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Review Details Modal */}
      <AppModal
        open={!!reviewItem}
        onClose={() => setReviewItem(null)}
        title={reviewItem ? `Booking Review: Lead #${reviewItem.id}` : ''}
        maxWidth="sm"
        actions={
          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setReviewItem(null)}>
              Close
            </Button>
            {reviewItem && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<ConfirmationNumberIcon />}
                onClick={() => {
                  onSelectIssue(reviewItem);
                  setReviewItem(null);
                }}
              >
                Proceed to E-Ticket Issuance
              </Button>
            )}
          </Box>
        }
      >
        {reviewItem && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: 1, fontSize: '0.85rem' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Customer Name:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>{reviewItem.name}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Booking Reference:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>Lead #{reviewItem.id}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Route:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>✈️ {reviewItem.route}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Travel Date:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{reviewItem.date}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Cabin & Pax:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{reviewItem.cabinClass} ({reviewItem.passengers || 2} Passengers)</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Payment Status:</Typography>
                <Chip size="small" label="✓ Payment Confirmed" color="success" sx={{ width: 'fit-content', fontWeight: 800, height: 20 }} />

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Payment Amount:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 900, color: 'success.main' }}>{reviewItem.amount}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Sabre PNR Code:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>{reviewItem.pnr}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Ticketing Status:</Typography>
                <Chip size="small" label={reviewItem.ticketingStatus || 'Pending Issuance'} color="warning" sx={{ width: 'fit-content', fontWeight: 800, height: 20 }} />
              </Box>
            </Paper>
          </Box>
        )}
      </AppModal>
    </Paper>
  );
}
