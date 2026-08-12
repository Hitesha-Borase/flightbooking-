import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useAlert } from '../../contexts/AlertContext';

export const ClientPortalLogin = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      showAlert('Please enter both username and password.', 'error');
      return;
    }
    
    // MOCK LOGIN: Accept any username as the client ID for demo purposes
    // In a real application, this would authenticate against the backend.
    const clientId = username.trim();

    showAlert('Login successful! Welcome to the Client Portal.', 'success');
    navigate(`/portal/documents/${clientId}`);
  };

  const handleQuickLogin = (clientId) => {
    setUsername(clientId);
    setPassword('password123');
    showAlert('Login successful! Welcome to the Client Portal.', 'success');
    navigate(`/portal/documents/${clientId}`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <Paper sx={{ p: 5, borderRadius: 3, maxWidth: 400, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              mx: 'auto',
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.5rem',
              mb: 2
            }}
          >
            A³
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Client Portal</Typography>
          <Typography variant="body2" color="text.secondary">Sign in to upload and manage your documents.</Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Username (Client ID)"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. client_123"
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button type="submit" variant="contained" color="secondary" size="large" fullWidth>
              Log In
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }}>
          <Chip label="DEMO QUICK LOGIN" size="small" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
        </Divider>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
          <Button variant="outlined" size="small" fullWidth onClick={() => handleQuickLogin('CL2001')}>
            Client: Elena (Golden Visa)
          </Button>
          <Button variant="outlined" size="small" fullWidth onClick={() => handleQuickLogin('CL2002')}>
            Client: Chloe (Study Visa)
          </Button>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            If you have issues logging in, please contact your Case Manager.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ClientPortalLogin;
