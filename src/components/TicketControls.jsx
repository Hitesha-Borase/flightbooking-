import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAlert } from '../contexts/AlertContext';

export default function TicketControls({ selectedItem, onIssueTicketSuccess }) {
  const { showAlert } = useAlert();

  const [pnrCode, setPnrCode] = useState(selectedItem?.pnr || 'ABC12D');
  const [eTicketNumbers, setETicketNumbers] = useState('0172345678901\n0172345678902');
  const [validationError, setValidationError] = useState('');
  const [issuedSuccessState, setIssuedSuccessState] = useState(null);

  // Sync PNR when selectedItem changes
  useEffect(() => {
    if (selectedItem?.pnr) {
      setPnrCode(selectedItem.pnr);
      setValidationError('');
      setIssuedSuccessState(null);
    }
  }, [selectedItem]);

  const handleSubmit = () => {
    setValidationError('');

    // 1. PNR validation
    if (!pnrCode || !pnrCode.trim()) {
      setValidationError('Please enter or select a valid PNR code.');
      showAlert('PNR code is required for ticket issuance', 'warning');
      return;
    }

    // 2. E-ticket numbers validation (each line must be exactly 13 digits)
    const lines = eTicketNumbers
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) {
      setValidationError('Please enter at least one 13-digit e-ticket number.');
      showAlert('At least one e-ticket number is required', 'warning');
      return;
    }

    const invalidLines = lines.filter(line => !/^\d{13}$/.test(line));
    if (invalidLines.length > 0) {
      const err = `Invalid ticket number format: "${invalidLines[0]}". Each e-ticket number must be exactly 13 digits (e.g. 0172345678901).`;
      setValidationError(err);
      showAlert(err, 'error');
      return;
    }

    // 3. Frontend-only simulation of successful ticket issuance
    const successData = {
      bookingRef: selectedItem?.id || 'TK-451',
      customerName: selectedItem?.name || 'M. Chen',
      route: selectedItem?.route || 'JFK → LHR',
      pnr: pnrCode,
      eTickets: lines,
      status: 'Ticketed',
      dispatchStatus: 'Ready',
      issuedAt: new Date().toLocaleTimeString()
    };

    setIssuedSuccessState(successData);
    showAlert(`🎫 Ticket Issued Successfully! PNR: ${pnrCode}. Client notification simulated.`, 'success');

    if (onIssueTicketSuccess) {
      onIssueTicketSuccess(successData);
    }
  };

  const handleResetForNext = () => {
    setIssuedSuccessState(null);
    setValidationError('');
    setETicketNumbers('0172345678901\n0172345678902');
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <ConfirmationNumberIcon color="primary" fontSize="small" />
        <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
          TICKET ISSUANCE CONTROLS
        </Typography>
      </Box>

      {/* Description */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select a booking from the ready queue, enter the 13-digit e-ticket numbers from GDS notes, and submit.
      </Typography>

      {/* Context Alert Banner */}
      {!selectedItem ? (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
          Select a booking from the Ready Queue on the left to load its context for ticket issuance.
        </Alert>
      ) : (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2, borderRadius: 2 }}>
          Ready to issue ticket for: <b>Lead #{selectedItem.id} — {selectedItem.name}</b> ({selectedItem.route})
        </Alert>
      )}

      {/* ─── SUCCESS STATE DISPLAY ─── */}
      {issuedSuccessState ? (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            bgcolor: '#F0FDF4',
            border: '2px solid #86EFAC',
            borderRadius: 2,
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <VerifiedIcon color="success" fontSize="medium" />
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#166534' }}>
              TICKET ISSUED SUCCESSFULLY
            </Typography>
            <Chip size="small" label="TICKETED" color="success" sx={{ fontWeight: 900, ml: 'auto' }} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: 0.8, fontSize: '0.85rem', mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Booking Reference:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{issuedSuccessState.bookingRef}</Typography>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Customer Name:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{issuedSuccessState.customerName}</Typography>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Route:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>✈️ {issuedSuccessState.route}</Typography>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PNR Code:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>
              {issuedSuccessState.pnr}
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>E-Ticket Number(s):</Typography>
            <Box>
              {issuedSuccessState.eTickets.map((t, i) => (
                <Chip
                  key={i}
                  size="small"
                  label={`Ticket #${i + 1}: ${t}`}
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 800, fontFamily: 'monospace', mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Issuance Status:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>
              Ticketed & Dispatched
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Dispatch Status:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
              Ready (Email & WhatsApp Queued)
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 2, fontSize: '0.78rem' }}>
            💡 <i>Client notification simulated successfully.</i> (Frontend demo state).
          </Alert>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<RefreshIcon />}
            onClick={handleResetForNext}
            sx={{ fontWeight: 800, borderRadius: 2 }}
          >
            Issue Another Ticket
          </Button>
        </Paper>
      ) : (
        /* ─── FORM INPUT CONTROLS ─── */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Validation Error Alert */}
          {validationError && (
            <Alert severity="error" onClose={() => setValidationError('')} sx={{ borderRadius: 2 }}>
              {validationError}
            </Alert>
          )}

          {/* PNR Input */}
          <TextField
            fullWidth
            size="small"
            label="Enter PNR *"
            value={pnrCode}
            onChange={(e) => setPnrCode(e.target.value.toUpperCase())}
            placeholder="e.g. ABC12D"
            helperText="Sabre / GDS PNR record code"
            inputProps={{ style: { fontFamily: 'monospace', fontWeight: 800 } }}
          />

          {/* E-Ticket Numbers Textarea */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Enter 13-Digit E-Ticket Number(s) *"
            value={eTicketNumbers}
            onChange={(e) => setETicketNumbers(e.target.value)}
            placeholder="0172345678901&#10;0172345678902"
            helperText="Enter exact 13-digit numbers, one ticket number per line per passenger"
            sx={{
              '& textarea': {
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                bgcolor: '#F8FAFC',
                p: 1.2,
                borderRadius: 1.5
              }
            }}
          />

          <Divider sx={{ my: 0.5 }} />

          {/* Automated System Actions Notes */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 0.8, display: 'block' }}>
              System Automated Action Sequence:
            </Typography>
            {[
              '1. Validate PNR & 13-digit e-ticket codes',
              '2. Update booking status → Ticketed',
              '3. Generate PDF itinerary & receipt',
              '4. Dispatch client notification (Simulated)',
              '5. Move PNR to Auto-Tracker Live Feed'
            ].map(step => (
              <Typography key={step} variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                {step}
              </Typography>
            ))}
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="success"
            size="large"
            fullWidth
            startIcon={<SendIcon />}
            disabled={!selectedItem}
            onClick={handleSubmit}
            sx={{ py: 1.2, fontWeight: 800, borderRadius: 2 }}
          >
            Submit & Notify Client
          </Button>
        </Box>
      )}
    </Paper>
  );
}
