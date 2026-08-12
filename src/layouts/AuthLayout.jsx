import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useTheme } from '@mui/material/styles';

export const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      {/* Left Pane: Brand Banner (Hidden on mobile/tablet) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: { md: '50%', lg: '55%' },
          height: '100%',
          position: 'relative',
          backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexDirection: 'column',
          justify: 'space-between',
          p: { md: 5, lg: 6 },
          color: '#FFFFFF',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.78)', // Overlay Royal Navy
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <FlightTakeoffIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: 'white', lineHeight: 1 }}>
                WOW MY FLIGHT
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 800, letterSpacing: 0.8 }}>
                TRAVEL AGENCY CRM
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ zIndex: 2, mb: 4, textAlign: 'left' }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', mb: 2, lineHeight: 1.25 }}>
            Your Global Partner for Seamless Flight Bookings.
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: 540, fontSize: '1rem', lineHeight: 1.6 }}>
            Specializing in International Flight Reservations, GDS Pricing & Margin Optimization, PNR Tracking, Corporate Travel Management, and Automated E-Ticket Issuance.
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ zIndex: 2, color: 'rgba(255,255,255,0.6)', textAlign: 'left', fontWeight: 600 }}>
          © {new Date().getFullYear()} WOW MY FLIGHT. Travel Agency CRM Portal.
        </Typography>
      </Box>

      {/* Right Pane: Login Card */}
      <Box
        sx={{
          flex: 1,
          width: { xs: '100%', md: '50%', lg: '45%' },
          height: '100%',
          display: 'flex',
          justify: 'center',
          alignItems: 'center',
          px: { xs: 2, sm: 4, md: 5 },
          py: 4,
          position: 'relative',
          overflowY: 'auto',
          background:
            theme.palette.mode === 'light'
              ? 'radial-gradient(circle at 0% 0%, #FFFFFF 0%, #EEF2F6 100%)'
              : 'radial-gradient(circle at 0% 0%, #0B1426 0%, #050A14 100%)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 500,
            borderRadius: 4,
            border: '1px solid',
            borderColor: theme.palette.mode === 'light' ? 'rgba(226, 232, 240, 0.9)' : 'rgba(255, 255, 255, 0.05)',
            background:
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(11, 20, 38, 0.75)',
            backdropFilter: 'blur(20px)',
            boxShadow:
              theme.palette.mode === 'light'
                ? '0px 20px 40px -15px rgba(15, 23, 42, 0.08)'
                : '0px 25px 50px -12px rgba(0, 0, 0, 0.5)',
            p: { xs: 3, sm: 4.5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          {/* Brand Header (Visible on mobile/tablet) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1.5,
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <FlightTakeoffIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1, color: 'primary.main' }}>
                WOW MY FLIGHT
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Travel Agency CRM Portal
              </Typography>
            </Box>
          </Box>

          <Outlet />
        </Paper>
      </Box>
    </Box>
  );
};

export default AuthLayout;
