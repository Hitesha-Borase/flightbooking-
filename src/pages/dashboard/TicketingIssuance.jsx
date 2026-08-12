import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

import DualClock from '../../components/DualClock';
import IssuanceQueue, { DEMO_ISSUANCE_QUEUE } from '../../components/IssuanceQueue';
import TicketControls from '../../components/TicketControls';
import PNRTracker, { DEMO_PNR_FEED } from '../../components/PNRTracker';
import { useAlert } from '../../contexts/AlertContext';

export default function TicketingIssuance() {
  const { showAlert } = useAlert();

  const [queueItems, setQueueItems] = useState(DEMO_ISSUANCE_QUEUE);
  const [selectedItem, setSelectedItem] = useState(DEMO_ISSUANCE_QUEUE[0]);
  const [pnrFeed, setPnrFeed] = useState(DEMO_PNR_FEED);

  const handleSelectForIssue = (item) => {
    setSelectedItem(item);
  };

  const handleIssueTicketSuccess = (successData) => {
    // 1. Visually remove/move item from queue in frontend state
    setQueueItems(prev => prev.filter(i => i.id !== successData.bookingRef));
    setSelectedItem(null);

    // 2. Add ticketed item to PNR Auto-Tracker feed
    const newTrackerEntry = {
      pnr: successData.pnr,
      customer: successData.customerName,
      route: successData.route,
      date: 'Today',
      status: 'Ticketed & Dispatched — PDF Itinerary Sent',
      category: 'GREEN',
      tone: 'success',
      ago: 'Just now',
      original: null,
      updated: null,
      needsAction: false
    };

    setPnrFeed(prev => [newTrackerEntry, ...prev]);
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
              bgcolor: 'success.50',
              color: 'success.main',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ConfirmationNumberIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                Ticketing Team — Issuance & Tracking
              </Typography>
              <Chip size="small" label="Ticketing Operations" color="success" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              E-Ticket issuance queue, GDS 13-digit code validation & active PNR monitoring
            </Typography>
          </Box>
        </Box>

        {/* Dual Clock UI: Agent Local & Client Local */}
        <DualClock compact client={{ timezone: 'America/New_York', label: 'Client EST' }} />
      </Paper>

      {/* ─── 2. THREE-COLUMN DASHBOARD LAYOUT (Desktop 30% / 40% / 30%) ─── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '30% 40% 30%' },
          gap: 2.5,
          alignItems: 'start'
        }}
      >
        {/* ══ LEFT COLUMN: Ready-for-Issuance Queue (~30%) ══ */}
        <Box>
          <IssuanceQueue
            items={queueItems}
            selectedId={selectedItem?.id}
            onSelectIssue={handleSelectForIssue}
          />
        </Box>

        {/* ══ CENTER COLUMN: Ticket Issuance Controls (~40%) ══ */}
        <Box>
          <TicketControls
            selectedItem={selectedItem}
            onIssueTicketSuccess={handleIssueTicketSuccess}
          />
        </Box>

        {/* ══ RIGHT COLUMN: Flight PNR Auto-Tracker (~30%) ══ */}
        <Box>
          <PNRTracker
            feed={pnrFeed}
          />
        </Box>
      </Box>
    </Box>
  );
}
