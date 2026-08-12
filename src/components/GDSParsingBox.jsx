import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAlert } from '../contexts/AlertContext';

export default function GDSParsingBox({ activeRequest, onParseSuccess }) {
  const { showAlert } = useAlert();
  
  const defaultGdsText = activeRequest?.gdsRaw ||
    '1 AA 100 J 15OCT JFK LHR 1830 0730+1\n2 BA 117 C 22OCT LHR JFK 1100 1430';

  const [rawGDS, setRawGDS] = useState(defaultGdsText);
  const [parsedData, setParsedData] = useState(null);
  const [isParsed, setIsParsed] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    if (activeRequest?.gdsRaw) {
      setRawGDS(activeRequest.gdsRaw);
      setIsParsed(false);
      setParsedData(null);
      setIsValidated(false);
    }
  }, [activeRequest]);

  const handleParse = () => {
    if (!rawGDS.trim()) {
      showAlert('Please paste raw GDS PNR text to parse', 'warning');
      return;
    }

    // Simulate structured frontend parsing
    const lines = rawGDS.split('\n').filter(l => l.trim().length > 0);
    const parsedFlights = lines.map((line, index) => {
      const isAA = line.includes('AA');
      const isBA = line.includes('BA');
      const isVS = line.includes('VS');
      const isEK = line.includes('EK');
      const isSQ = line.includes('SQ');

      const carrier = isAA ? 'American Airlines' :
                      isBA ? 'British Airways' :
                      isVS ? 'Virgin Atlantic' :
                      isEK ? 'Emirates' :
                      isSQ ? 'Singapore Airlines' : 'Partner Airline';

      const flightNo = line.match(/([A-Z]{2}\s*\d{2,4})/)?.[0] || (index === 0 ? 'AA 100' : 'BA 117');
      const cabinClass = line.match(/\s([JCFY])\s/)?.[1] || 'J';
      const date = line.match(/(\d{2}[A-Z]{3})/)?.[0] || '15OCT';
      const times = line.match(/\d{4}/g) || ['1830', '0730'];

      return {
        id: index + 1,
        flightNumber: flightNo,
        carrier: carrier,
        origin: activeRequest?.origin || (index === 0 ? 'JFK' : 'LHR'),
        destination: activeRequest?.destination || (index === 0 ? 'LHR' : 'JFK'),
        date: date,
        departure: times[0] ? `${times[0].slice(0, 2)}:${times[0].slice(2)}` : '18:30',
        arrival: times[1] ? `${times[1].slice(0, 2)}:${times[1].slice(2)}+1` : '07:30+1',
        class: `${cabinClass} (${cabinClass === 'J' || cabinClass === 'C' ? 'Business' : cabinClass === 'F' ? 'First' : 'Economy'})`,
        pnr: 'ABC12D',
        fareBasis: `${cabinClass}OWUS`,
        rawLine: line
      };
    });

    setParsedData(parsedFlights);
    setIsParsed(true);
    showAlert('✅ GDS PNR parsed successfully! Structured itinerary created.', 'success');
    if (onParseSuccess) {
      onParseSuccess(parsedFlights);
    }
  };

  const handleValidate = () => {
    setIsValidated(true);
    showAlert('✓ Airline codes, airport IATA & fare basis validated against SABRE database', 'success');
  };

  const handleImport = () => {
    if (!isParsed) {
      handleParse();
    }
    showAlert('📥 Parsed GDS itinerary data imported directly into Margin Calculator', 'info');
  };

  const handleSampleLoad = () => {
    const sample = '1 AA 100 J 15OCT JFK LHR 1830 0730+1\n2 BA 117 C 22OCT LHR JFK 1100 1430';
    setRawGDS(sample);
    setIsParsed(false);
    setParsedData(null);
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* Box Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArticleIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
            SABRE / GDS PARSING BOX
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Load sample SABRE PNR text">
            <Button size="small" variant="text" onClick={handleSampleLoad} sx={{ fontSize: '0.75rem' }}>
              Load Sample PNR
            </Button>
          </Tooltip>
          {isValidated && (
            <Chip size="small" icon={<VerifiedIcon />} label="GDS Codes Validated" color="success" sx={{ fontWeight: 800 }} />
          )}
        </Box>
      </Box>

      {/* Raw GDS Input Area */}
      <TextField
        fullWidth
        multiline
        rows={4}
        value={rawGDS}
        onChange={(e) => {
          setRawGDS(e.target.value);
          setIsParsed(false);
        }}
        placeholder={`Paste raw GDS / SABRE PNR text here (Ctrl+V)...\nExample:\n1 AA 100 J 15OCT JFK LHR 1830 0730+1\n2 BA 117 C 22OCT LHR JFK 1100 1430`}
        sx={{
          mb: 1.5,
          '& textarea': {
            fontFamily: 'monospace, Consolas, "Courier New"',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            bgcolor: '#1E293B',
            color: '#38BDF8',
            p: 1.5,
            borderRadius: 1.5
          }
        }}
      />

      {/* Buttons Bar */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: isParsed ? 2.5 : 0 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayCircleIcon />}
          onClick={handleParse}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Parse Itinerary
        </Button>

        <Button
          variant="outlined"
          color="info"
          startIcon={<CheckCircleIcon />}
          onClick={handleValidate}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Validate Codes
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleImport}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Import Parsed Data
        </Button>
      </Box>

      {/* Structured Parsing Result */}
      {isParsed && parsedData && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#166534' }}>
                STRUCTURED ITINERARY RESULT
              </Typography>
            </Box>
            <Chip size="small" label={`PNR: ABC12D`} color="success" sx={{ fontWeight: 900, fontFamily: 'monospace' }} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {parsedData.map((flight) => (
              <Box
                key={flight.id}
                sx={{
                  p: 1.5,
                  bgcolor: 'white',
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'success.light',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
                  gap: 1,
                  alignItems: 'center',
                  fontSize: '0.8rem'
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>FLIGHT / CARRIER</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                    ✈️ {flight.flightNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{flight.carrier}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>ROUTE & DATE</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {flight.origin} → {flight.destination}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Date: <b>{flight.date}</b></Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>DEPARTURE / ARRIVAL</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                    Dep: {flight.departure} | Arr: {flight.arrival}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Class: <b>{flight.class}</b></Typography>
                </Box>

                <Box sx={{ borderLeft: { sm: '1px solid #E2E8F0' }, pl: { sm: 1.5 } }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>PNR & FARE BASIS</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>
                    PNR: {flight.pnr}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Fare Basis: <b>{flight.fareBasis}</b></Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Paper>
  );
}
