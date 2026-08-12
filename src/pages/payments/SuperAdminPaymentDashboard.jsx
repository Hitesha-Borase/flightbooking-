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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Icons
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LinkIcon from '@mui/icons-material/Link';
import DrawIcon from '@mui/icons-material/Draw';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SecurityIcon from '@mui/icons-material/Security';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import PageHeader from '../../components/PageHeader';
import AppTable from '../../components/AppTable';
import PaymentLinkModal from '../../components/PaymentLinkModal';
import ESignModal from '../../components/ESignModal';
import { useAlert } from '../../contexts/AlertContext';

// Payment Pipeline Mock Data (as per spec)
const PIPELINE_LINKS = [
  { link: 'https://payment.co/tx/001', customer: 'Karan Singh (BK-001)', amount: '$10,350', status: 'GENERATED', color: '#2563EB', bg: '#EFF6FF' },
  { link: 'https://payment.co/tx/002', customer: 'A. Lee (BK-002)', amount: '$3,200', status: 'VIEWED', color: '#7C3AED', bg: '#F5F3FF' },
  { link: 'https://payment.co/tx/003', customer: 'Michael Chen (BK-003)', amount: '$5,175', status: 'PAID', color: '#059669', bg: '#ECFDF5', highlight: true },
  { link: 'https://payment.co/tx/004', customer: 'P. Kumar (BK-004)', amount: '$8,400', status: 'DECLINED', color: '#DC2626', bg: '#FEF2F2' },
  { link: 'https://payment.co/tx/005', customer: 'Emma Novak (BK-005)', amount: '$2,100', status: 'REFUNDED', color: '#D97706', bg: '#FFFBEB' }
];

// Initial Transactions (as per spec)
const INITIAL_TRANSACTIONS = [
  {
    id: 'OFF132350',
    customerName: 'K. Singh',
    customerEmail: 'karan@example.com',
    bookingRef: 'BK-001',
    amount: 10350,
    method: 'Card (Visa •••• 4242)',
    riskScore: 'HIGH',
    riskTag: 'HIGH 🔴',
    status: 'PAID',
    date: '2026-06-18 14:32',
    gateway: 'Stripe Global 3DS',
    avsMatch: 'Partial (Zip match only)',
    ipCountry: 'India (DEL)',
    cardCountry: 'United States',
    cvvResult: 'Match',
    authFormSigned: false
  },
  {
    id: 'OFF132360',
    customerName: 'A. Lee',
    customerEmail: 'a.lee@example.com',
    bookingRef: 'BK-002',
    amount: 3200,
    method: 'Card (Mastercard •••• 8812)',
    riskScore: 'LOW',
    riskTag: 'LOW 🟢',
    status: 'PAID',
    date: '2026-06-18 11:15',
    gateway: 'Telnyx Pay',
    avsMatch: 'Full Match (Street & Zip)',
    ipCountry: 'United States (JFK)',
    cardCountry: 'United States',
    cvvResult: 'Match',
    authFormSigned: true
  },
  {
    id: 'OFF132370',
    customerName: 'M. Chen',
    customerEmail: 'mchen@example.com',
    bookingRef: 'BK-003',
    amount: 5175,
    method: 'Bank Wire (SWIFT / Fedwire)',
    riskScore: 'LOW',
    riskTag: 'LOW 🟢',
    status: 'PAID',
    date: '2026-06-17 16:40',
    gateway: 'Wire / ACH Transfer',
    avsMatch: 'Verified Bank',
    ipCountry: 'United States',
    cardCountry: 'N/A (Wire)',
    cvvResult: 'N/A',
    authFormSigned: true
  },
  {
    id: 'OFF132380',
    customerName: 'P. Kumar',
    customerEmail: 'pkumar@example.com',
    bookingRef: 'BK-004',
    amount: 8400,
    method: 'Card (Amex •••• 1004)',
    riskScore: 'MEDIUM',
    riskTag: 'MEDIUM 🟡',
    status: 'PAID',
    date: '2026-06-17 09:22',
    gateway: 'Stripe 3DS',
    avsMatch: 'Match',
    ipCountry: 'United Kingdom',
    cardCountry: 'United States',
    cvvResult: 'Match',
    authFormSigned: false
  }
];

export const SuperAdminPaymentDashboard = () => {
  const { showAlert } = useAlert();

  // Transactions State
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [pipelineLinks, setPipelineLinks] = useState(PIPELINE_LINKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  // Modals & Panels
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [eSignModalOpen, setESignModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Refund Form State
  const [refundData, setRefundData] = useState({
    txnId: '',
    customer: '',
    bookingRef: '',
    originalAmount: 0,
    airlinePenalty: 350,
    agencyServiceFee: 150,
    refundAmount: 0,
    reason: 'Customer requested cancellation (Visa rejection)'
  });

  // Calculate Net Refund
  const netRefundCalculated = useMemo(() => {
    const orig = Number(refundData.originalAmount) || 0;
    const penalty = Number(refundData.airlinePenalty) || 0;
    const fee = Number(refundData.agencyServiceFee) || 0;
    return Math.max(0, orig - penalty - fee);
  }, [refundData.originalAmount, refundData.airlinePenalty, refundData.agencyServiceFee]);

  const handleOpenRefund = (txn) => {
    setRefundData({
      txnId: txn.id,
      customer: txn.customerName,
      bookingRef: txn.bookingRef,
      originalAmount: txn.amount,
      airlinePenalty: 350,
      agencyServiceFee: 150,
      refundAmount: txn.amount - 500,
      reason: 'Customer requested flight cancellation'
    });
    setRefundModalOpen(true);
  };

  const handleProcessRefund = () => {
    setTransactions(prev => prev.map(t => t.id === refundData.txnId ? { ...t, status: 'REFUNDED', riskTag: 'REFUNDED 🟠' } : t));
    showAlert(`💸 Refund of $${netRefundCalculated.toLocaleString()} processed successfully for ${refundData.customer} (${refundData.bookingRef})`, 'success');
    setRefundModalOpen(false);
  };

  const handleOpenReview = (txn) => {
    setSelectedTxn(txn);
    setDrawerOpen(true);
  };

  const handleCopyLink = (url) => {
    navigator.clipboard?.writeText(url);
    showAlert('Payment Link copied to clipboard! 📋', 'info');
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch =
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.bookingRef.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRisk = riskFilter ? t.riskScore === riskFilter : true;
      return matchSearch && matchRisk;
    });
  }, [transactions, searchTerm, riskFilter]);

  const columns = [
    {
      id: 'transactionId',
      label: 'Transaction ID',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>
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
      id: 'bookingRef',
      label: 'Booking Ref',
      render: (row) => (
        <Chip size="small" label={row.bookingRef} color="default" sx={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.72rem' }} />
      )
    },
    {
      id: 'amount',
      label: 'Amount',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 900, color: row.status === 'REFUNDED' ? '#D97706' : '#10B981' }}>
          ${Number(row.amount).toLocaleString()}
        </Typography>
      )
    },
    {
      id: 'method',
      label: 'Method',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          {row.method.includes('Card') ? <CreditCardIcon sx={{ fontSize: 16, color: '#4F46E5' }} /> : <AccountBalanceIcon sx={{ fontSize: 16, color: '#059669' }} />}
          <Typography variant="caption" sx={{ fontWeight: 600 }}>{row.method}</Typography>
        </Box>
      )
    },
    {
      id: 'riskScore',
      label: 'Risk Score',
      render: (row) => {
        let chipBg = '#ECFDF5';
        let chipColor = '#065F46';
        if (row.riskScore === 'HIGH') {
          chipBg = '#FEF2F2';
          chipColor = '#991B1B';
        } else if (row.riskScore === 'MEDIUM') {
          chipBg = '#FFFBEB';
          chipColor = '#92400E';
        }
        return (
          <Chip
            size="small"
            label={row.riskTag || row.riskScore}
            sx={{ bgcolor: chipBg, color: chipColor, fontWeight: 800, fontSize: '0.68rem', height: 22 }}
          />
        );
      }
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Payment & Financial Transactions (/payments)"
        subtitle="Manage end-to-end payment links, credit card fraud radar, e-sign authorization forms & refund pipelines."
        action={
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LinkIcon />}
              onClick={() => setPaymentModalOpen(true)}
              sx={{ fontWeight: 700 }}
            >
              Generate Payment Link
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DrawIcon />}
              onClick={() => setESignModalOpen(true)}
              sx={{ fontWeight: 700 }}
            >
              Create E-Sign Auth
            </Button>
          </Box>
        }
      />

      {/* ─── SECTION 1: PAYMENT PIPELINE (AS PER SPEC) ─── */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MonetizationOnIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              ⚡ LIVE PAYMENT PIPELINE (SECURE PAYMENT GATEWAYS)
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">Real-time Webhook Status Tracker</Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 1.5 }}>
          {pipelineLinks.map((item, idx) => (
            <Paper
              key={idx}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: item.highlight ? '2px solid #10B981' : '1px solid #E2E8F0',
                bgcolor: item.bg,
                boxShadow: item.highlight ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none',
                position: 'relative'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Chip
                  size="small"
                  label={item.status}
                  sx={{
                    bgcolor: item.status === 'PAID' ? '#10B981' : item.color,
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.65rem',
                    height: 20
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>{item.amount}</Typography>
              </Box>

              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.customer}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'text.secondary' }}>
                  {item.link.replace('https://', '')}
                </Typography>
                <Tooltip title="Copy Link">
                  <IconButton size="small" onClick={() => handleCopyLink(item.link)}>
                    <ContentCopyIcon sx={{ fontSize: 13 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* ─── SECTION 2: TRANSACTION TABLE & SEARCH ─── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search Transaction ID, Customer, Booking Ref..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ width: { xs: '100%', md: 340 }, bgcolor: 'background.paper' }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Risk Filter</InputLabel>
          <Select
            value={riskFilter}
            label="Risk Filter"
            onChange={e => setRiskFilter(e.target.value)}
          >
            <MenuItem value="">All Risk Levels</MenuItem>
            <MenuItem value="LOW">🟢 Low Risk</MenuItem>
            <MenuItem value="MEDIUM">🟡 Medium Risk</MenuItem>
            <MenuItem value="HIGH">🔴 High Risk</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Transactions Table */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        <AppTable
          columns={columns}
          data={filteredTransactions}
          onRowClick={(row) => handleOpenReview(row)}
          actions={(row) => (
            <Box sx={{ display: 'flex', gap: 0.8, whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleOpenReview(row)}
                sx={{ py: 0.3, px: 1, fontSize: '0.72rem', fontWeight: 700 }}
              >
                Review
              </Button>

              {row.riskScore === 'HIGH' || row.status === 'PAID' ? (
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => handleOpenRefund(row)}
                  sx={{ py: 0.3, px: 1, fontSize: '0.72rem', fontWeight: 700 }}
                >
                  Refund
                </Button>
              ) : null}

              <Button
                size="small"
                variant="contained"
                color="secondary"
                startIcon={<AssignmentTurnedInIcon sx={{ fontSize: 13 }} />}
                onClick={() => setESignModalOpen(true)}
                sx={{ py: 0.3, px: 1, fontSize: '0.72rem', fontWeight: 700 }}
              >
                Auth Form
              </Button>
            </Box>
          )}
        />
      </Paper>

      {/* ─── SLIDE-OVER REVIEW & RISK RADAR DRAWER ─── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 3, bgcolor: '#FFFFFF' } }}
      >
        {selectedTxn && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  Transaction {selectedTxn.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Customer: <b>{selectedTxn.customerName}</b> &nbsp;|&nbsp; Booking: <b>{selectedTxn.bookingRef}</b>
                </Typography>
              </Box>
              <IconButton onClick={() => setDrawerOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider />

            {/* Risk Radar Card */}
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: selectedTxn.riskScore === 'HIGH' ? '#FEF2F2' : '#F0FDF4', border: '1px solid', borderColor: selectedTxn.riskScore === 'HIGH' ? '#FCA5A5' : '#86EFAC', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon sx={{ color: selectedTxn.riskScore === 'HIGH' ? '#DC2626' : '#16A34A' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: selectedTxn.riskScore === 'HIGH' ? '#DC2626' : '#16A34A' }}>
                    ANTI-FRAUD & 3D SECURE RADAR
                  </Typography>
                </Box>
                <Chip size="small" label={selectedTxn.riskTag} sx={{ fontWeight: 900, fontSize: '0.7rem' }} />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: 0.8, fontSize: 13 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>AVS Address Check:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800 }}>{selectedTxn.avsMatch}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Customer IP Country:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{selectedTxn.ipCountry}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Card BIN Country:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{selectedTxn.cardCountry}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>CVV / CVC2 Result:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main' }}>{selectedTxn.cvvResult}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>E-Sign Auth Form:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: selectedTxn.authFormSigned ? 'success.main' : 'error.main' }}>
                  {selectedTxn.authFormSigned ? '✅ Signed & Verified' : '⚠️ Missing E-Sign Authorization'}
                </Typography>
              </Box>
            </Paper>

            {/* Financial Details */}
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                💵 TRANSACTION DETAILS
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: 0.8, fontSize: 13 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Total Amount:</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'success.main' }}>${Number(selectedTxn.amount).toLocaleString()}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Payment Method:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{selectedTxn.method}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Payment Gateway:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedTxn.gateway}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Timestamp:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedTxn.date}</Typography>
              </Box>
            </Paper>

            <Box sx={{ mt: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<CurrencyExchangeIcon />}
                onClick={() => { setDrawerOpen(false); handleOpenRefund(selectedTxn); }}
                sx={{ fontWeight: 700 }}
              >
                Initiate Refund
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AssignmentTurnedInIcon />}
                onClick={() => { setDrawerOpen(false); setESignModalOpen(true); }}
                sx={{ fontWeight: 700 }}
              >
                E-Sign Auth Form
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* ─── REFUND WORKFLOW MODAL ─── */}
      <Dialog open={refundModalOpen} onClose={() => setRefundModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CurrencyExchangeIcon color="warning" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Flight Refund Workflow</Typography>
          </Box>
          <IconButton size="small" onClick={() => setRefundModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFFBEB', borderRadius: 2, border: '1px solid #FCD34D' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400E', mb: 1 }}>
              Booking: {refundData.bookingRef} ({refundData.customer})
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Transaction ID: <b>{refundData.txnId}</b> &nbsp;|&nbsp; Original Amount Paid: <b>${Number(refundData.originalAmount).toLocaleString()}</b>
            </Typography>
          </Paper>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              size="small"
              label="Airline Cancellation Penalty ($)"
              type="number"
              value={refundData.airlinePenalty}
              onChange={e => setRefundData({ ...refundData, airlinePenalty: Number(e.target.value) })}
            />
            <TextField
              size="small"
              label="Agency Service Fee ($)"
              type="number"
              value={refundData.agencyServiceFee}
              onChange={e => setRefundData({ ...refundData, agencyServiceFee: Number(e.target.value) })}
            />
          </Box>

          <TextField
            size="small"
            label="Refund Reason / Notes *"
            multiline
            rows={2}
            value={refundData.reason}
            onChange={e => setRefundData({ ...refundData, reason: e.target.value })}
          />

          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: 2, border: '1px solid #86EFAC' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Net Refund to Customer:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'success.main' }}>
                ${netRefundCalculated.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRefundModalOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleProcessRefund} variant="contained" color="warning" sx={{ fontWeight: 700 }}>
            Confirm & Process Refund
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── GENERATE PAYMENT LINK MODAL ─── */}
      <PaymentLinkModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={(data) => {
          setPaymentModalOpen(false);
          showAlert(`Payment link generated for ${data.customer} — ${data.currency} ${Number(data.amount).toLocaleString()}`, 'success');
        }}
      />

      {/* ─── E-SIGN AUTHORIZATION MODAL ─── */}
      <ESignModal
        open={eSignModalOpen}
        onClose={() => setESignModalOpen(false)}
        booking={selectedTxn || { bookingId: 'BK-001', customerName: 'Karan Singh', sellingPrice: 10350, cardLast4: '4242' }}
        onSigned={(res) => {
          setESignModalOpen(false);
          showAlert(`Credit card authorization signed digitally (${res.authId})`, 'success');
        }}
      />
    </Box>
  );
};

export default SuperAdminPaymentDashboard;
