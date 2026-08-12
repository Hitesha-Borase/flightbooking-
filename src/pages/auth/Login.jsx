import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { dbService } from '../../services/dbService';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';

// Icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupsIcon from '@mui/icons-material/Groups';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const { data: consultants = [] } = useQuery({
    queryKey: ['consultants'],
    queryFn: dbService.getConsultants,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    // Simulate API login
    await new Promise((resolve) => setTimeout(resolve, 800));

    const enteredEmail = data.email.toLowerCase().trim();
    const enteredPassword = data.password;

    // 1. Check Super Admin
    if (enteredEmail === 'admin@aaa.com' || enteredEmail === 'admin@wowmyflight.com') {
      login({
        id: 'super-admin',
        name: 'Wael Madi (CEO)',
        email: 'wael.m@wowmyflight.com',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      });
      showAlert('Logged in as Super Administrator', 'success');
      navigate('/dashboard');
      return;
    }

    // 2. Check dynamic consultants
    const matchedConsultant = consultants.find(
      (c) => c.email && c.email.toLowerCase().trim() === enteredEmail
    );

    if (matchedConsultant) {
      const expectedPassword = matchedConsultant.password || 'password123';
      if (enteredPassword === expectedPassword) {
        login({
          id: matchedConsultant.id,
          name: matchedConsultant.name,
          email: matchedConsultant.email,
          role: matchedConsultant.role || 'consultant',
          avatar: matchedConsultant.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          customPermissions: matchedConsultant.customPermissions,
        });
        showAlert(`Logged in successfully as Consultant: ${matchedConsultant.name}`, 'success');
        navigate('/dashboard');
        return;
      }
    }

    // 3. Fallback / error case
    showAlert('Invalid login credentials. Please check email/password.', 'error');
  };

  const handleQuickLogin = (role) => {
    let mockUser = {
      id: 'admin-1',
      name: 'General Manager',
      email: 'manager@wowmyflight.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    };

    if (role === 'consultant') {
      mockUser = {
        id: 'c1',
        name: 'Sofia Rodriguez',
        email: 'sofia.r@wowmyflight.com',
        role: 'consultant',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      };
    } else if (role === 'team_leader') {
      mockUser = {
        id: 'tl-1',
        name: 'David Sales Lead',
        email: 'david.lead@wowmyflight.com',
        role: 'team_leader',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };
    } else if (role === 'flight_expert') {
      mockUser = {
        id: 'fe-1',
        name: 'Carlos GDS Expert',
        email: 'carlos.gds@wowmyflight.com',
        role: 'flight_expert',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      };
    } else if (role === 'ticketing_agent') {
      mockUser = {
        id: 'tk-1',
        name: 'Ticketing Agent',
        email: 'ticketing@wowmyflight.com',
        role: 'ticketing_agent',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      };
    } else if (role === 'finance') {
      mockUser = {
        id: 'finance-staff',
        name: 'Elena Finance',
        email: 'finance@wowmyflight.com',
        role: 'finance',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      };
    } else if (role === 'operations') {
      mockUser = {
        id: 'operations-staff',
        name: 'Carlos Ops',
        email: 'ops@wowmyflight.com',
        role: 'operations',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      };
    } else if (role === 'super_admin') {
      mockUser = {
        id: 'super-admin',
        name: 'Wael Madi (CEO)',
        email: 'wael.m@wowmyflight.com',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      };
    } else if (role === 'marketing') {
      mockUser = {
        id: 'marketing-staff',
        name: 'Marketing Manager',
        email: 'marketing@wowmyflight.com',
        role: 'marketing',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
      };
    }

    login(mockUser);
    showAlert(`Logged in as Demo ${role.toUpperCase().replace('_', ' ')}`, 'success');

    // Route directly to role dashboard
    if (role === 'super_admin') navigate('/super_admin/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'team_leader') navigate('/team_leader/dashboard');
    else if (role === 'flight_expert') navigate('/flight_expert/dashboard');
    else if (role === 'ticketing_agent') navigate('/ticketing_agent/dashboard');
    else if (role === 'finance') navigate('/finance/dashboard');
    else if (role === 'operations') navigate('/operations/dashboard');
    else if (role === 'marketing') navigate('/marketing-manager/dashboard');
    else navigate('/agent/dashboard');
  };

  return (
    <Box>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your credentials to access the Travel CRM portal.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            {...register('email')}
            label="Email Address"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            {...register('password')}
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2" color="secondary" underline="hover">
              Forgot password?
            </Link>
          </Box>

          <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>
        </Box>
      </form>

      <Divider sx={{ my: 3 }}>
        <Chip label="DEMO QUICK LOGIN (ALL ROLES)" size="small" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
      </Divider>

      {/* Grid of All 9 Quick Login Role Buttons */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
        <Button variant="outlined" size="small" sx={{ py: 0.6, fontSize: '0.68rem', fontWeight: 700 }} startIcon={<AdminPanelSettingsIcon />} fullWidth onClick={() => handleQuickLogin('super_admin')}>
          Super Admin
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.6, fontSize: '0.68rem', fontWeight: 700 }} startIcon={<SupervisorAccountIcon />} fullWidth onClick={() => handleQuickLogin('admin')}>
          Admin
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.6, fontSize: '0.68rem', fontWeight: 700 }} startIcon={<GroupsIcon />} fullWidth onClick={() => handleQuickLogin('team_leader')}>
          Team Leader
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.6, fontSize: '0.68rem', fontWeight: 700 }} startIcon={<SupportAgentIcon />} fullWidth onClick={() => handleQuickLogin('consultant')}>
          Sales Executive
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.6, fontSize: '0.68rem', fontWeight: 700 }} startIcon={<FlightTakeoffIcon />} fullWidth onClick={() => handleQuickLogin('flight_expert')}>
          Flight Expert (GDS)
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.6, fontSize: '0.68rem', fontWeight: 700 }} startIcon={<ConfirmationNumberIcon />} fullWidth onClick={() => handleQuickLogin('ticketing_agent')}>
          Ticketing Agent
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.6, fontSize: '0.68rem', fontWeight: 700 }} startIcon={<AccountBalanceWalletIcon />} fullWidth onClick={() => handleQuickLogin('finance')}>
          Finance
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.6, fontSize: '0.68rem', fontWeight: 700 }} startIcon={<SettingsSuggestIcon />} fullWidth onClick={() => handleQuickLogin('operations')}>
          Operations
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.6, fontSize: '0.68rem', fontWeight: 700 }} startIcon={<CampaignIcon />} fullWidth onClick={() => handleQuickLogin('marketing')}>
          Marketing
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Are you a client looking for your portal?
        </Typography>
        <Button 
          component={RouterLink} 
          to="/portal/login" 
          variant="text" 
          color="primary"
          sx={{ fontWeight: 'bold' }}
        >
          Go to Client Portal Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
