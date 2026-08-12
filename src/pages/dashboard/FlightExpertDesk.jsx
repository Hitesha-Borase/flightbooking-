import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

import DualClock from '../../components/DualClock';
import FlightRequestQueue, { DEMO_QUEUE_REQUESTS } from '../../components/FlightRequestQueue';
import GDSParsingBox from '../../components/GDSParsingBox';
import MarginCalculator from '../../components/MarginCalculator';
import UpsellEngine from '../../components/UpsellEngine';
import FareRulesView from '../../components/FareRulesView';
import { useAlert } from '../../contexts/AlertContext';

export default function FlightExpertDesk() {
  const { showAlert } = useAlert();

  const [requestsList, setRequestsList] = useState(DEMO_QUEUE_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(DEMO_QUEUE_REQUESTS[0]);

  const handleSelectRequest = (req) => {
    setSelectedRequest(req);
  };

  const handlePublishQuote = (quoteData) => {
    // Update local demo state to reflect status update
    setRequestsList(prev =>
      prev.map(r => r.id === quoteData.requestId ? { ...r, status: 'Quote Ready' } : r)
    );
    if (selectedRequest && selectedRequest.id === quoteData.requestId) {
      setSelectedRequest(prev => ({ ...prev, status: 'Quote Ready' }));
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* ─── 1. TOPBAR ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          px: 3,
          mb: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              bgcolor: 'primary.50',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FlightTakeoffIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                Flight Expert / GDS Desk
              </Typography>
              <Chip size="small" label="Flight Operations" color="primary" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              GDS PNR Parsing, Margin Optimization, Upsell Engine & Quote Publishing Center
            </Typography>
          </Box>
        </Box>

        {/* Dual Clocks UI: Agent Local & Client Local */}
        <DualClock compact client={{ timezone: 'America/New_York', label: 'Client EST' }} />
      </Paper>

      {/* ─── 2. TWO-COLUMN LAYOUT (Left 35% Queue, Right 65% GDS Workspace) ─── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '35% 65%' },
          gap: 2.5,
          alignItems: 'start'
        }}
      >
        {/* ══ LEFT: Flight Request Queue ══ */}
        <Box>
          <FlightRequestQueue
            requests={requestsList}
            selectedId={selectedRequest?.id}
            onSelectRequest={handleSelectRequest}
          />
        </Box>

        {/* ══ RIGHT: GDS Workspace & Calculators ══ */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Active Request Indicator Banner */}
          {selectedRequest && (
            <Paper
              elevation={0}
              sx={{
                p: 1.8,
                px: 2.5,
                border: '1px solid',
                borderColor: 'primary.light',
                borderRadius: 2.5,
                bgcolor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FlightTakeoffIcon color="primary" fontSize="small" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                    Active Request #{selectedRequest.id} &nbsp;·&nbsp; {selectedRequest.origin} → {selectedRequest.destination}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Date: <b>{selectedRequest.travelDate}</b> &nbsp;|&nbsp;
                    Class: <b>{selectedRequest.cabinClass}</b> &nbsp;|&nbsp;
                    Pax: <b>{selectedRequest.passengers} Pax</b> &nbsp;|&nbsp;
                    Agent: <b>{selectedRequest.salesAgent}</b>
                  </Typography>
                </Box>
              </Box>

              <Chip
                size="small"
                label={selectedRequest.status}
                color={selectedRequest.status === 'Quote Ready' ? 'info' : 'primary'}
                sx={{ fontWeight: 800 }}
              />
            </Paper>
          )}

          {/* 1. GDS / SABRE Parsing Box */}
          <GDSParsingBox
            activeRequest={selectedRequest}
          />

          {/* 2. Margin Calculator UI */}
          <MarginCalculator
            activeRequest={selectedRequest}
            onPublishQuote={handlePublishQuote}
          />

          {/* 3. Upsell Suggestions Engine */}
          <UpsellEngine />

          {/* 4. Fare Rules View */}
          <FareRulesView
            activeRequest={selectedRequest}
          />
        </Box>
      </Box>
    </Box>
  );
}
