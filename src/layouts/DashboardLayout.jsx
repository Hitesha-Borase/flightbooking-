import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Popover from '@mui/material/Popover';
import Collapse from '@mui/material/Collapse';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ForumIcon from '@mui/icons-material/Forum';
import GroupsIcon from '@mui/icons-material/Groups';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import CableIcon from '@mui/icons-material/Cable';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ChatIcon from '@mui/icons-material/Chat';
import FlightIcon from '@mui/icons-material/Flight';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SecurityIcon from '@mui/icons-material/Security';
// Contexts & Hooks
import { useThemeMode } from '../contexts/ThemeContext';
import { useAlert } from '../contexts/AlertContext';
import { useAuth } from '../hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../services/dbService';
import SearchBar from '../components/SearchBar';

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

export const DashboardLayout = () => {
  const { mode, toggleTheme } = useThemeMode();
  const { currentUser, changeRole, logout, isAdmin, isConsultant, isFinance, isOperations } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: dbService.getNotifications,
    refetchInterval: 3000,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: dbService.getConversations,
    refetchInterval: 3000,
  });

  const getPlatformUnread = (platform) => {
    return conversations
      .filter(c => c.platform === platform)
      .reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  };

  const whatsappUnread = getPlatformUnread('whatsapp');
  const instagramUnread = getPlatformUnread('instagram');
  const facebookUnread = getPlatformUnread('facebook');
  const telegramUnread = getPlatformUnread('telegram');
  const totalSocialUnread = whatsappUnread + instagramUnread + facebookUnread + telegramUnread;

  const { data: customizationSettings } = useQuery({
    queryKey: ['customization-settings'],
    queryFn: dbService.getCustomizationSettings
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [socialMenuOpen, setSocialMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [connectedPlatforms, setConnectedPlatforms] = useState(() => {
    try {
      const saved = localStorage.getItem('crm-connected-platforms');
      return saved ? JSON.parse(saved) : {
        whatsapp: {},
        facebook: {},
        instagram: {},
        telegram: {}
      };
    } catch (e) {
      return { whatsapp: {}, facebook: {}, instagram: {}, telegram: {} };
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('crm-connected-platforms');
        if (saved) {
          setConnectedPlatforms(JSON.parse(saved));
        } else {
          setConnectedPlatforms({
            whatsapp: {},
            facebook: {},
            instagram: {},
            telegram: {}
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith('/social-inbox')) {
      setSocialMenuOpen(true);
    }
  }, [location.pathname]);

  // UI state hooks
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [searchVal, setSearchVal] = useState('');

  const handleProfileMenuOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const handleNotifMenuOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifMenuClose = () => setNotifAnchorEl(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleRoleChange = (event) => {
    const role = event.target.value;
    changeRole(role);
    showAlert(`Role switched to ${role.toUpperCase()}`, 'info');
    // Navigate to the role-specific dashboard
    const roleDashboardMap = {
      super_admin: '/super_admin/dashboard',
      admin: '/admin/dashboard',
      team_leader: '/team_leader/dashboard',
      consultant: '/agent/dashboard',
      flight_expert: '/flight_expert/dashboard',
      ticketing_agent: '/ticketing_agent/dashboard',
      finance: '/finance/dashboard',
      operations: '/operations/dashboard',
      marketing: '/marketing-manager/dashboard',
    };
    navigate(roleDashboardMap[role] || '/dashboard');
  };

  const navigateTo = (path) => {
    localStorage.setItem('routing-click-log', `Clicked: ${path} at ${new Date().toLocaleTimeString()}`);
    // If navigating to main client lists, clear their sessionStorage filters
    if (path.endsWith('/clients')) {
      sessionStorage.removeItem('adminClientList_filters');
      sessionStorage.removeItem('adminClientList_cardInfo');
      sessionStorage.removeItem('operationsClientList_filters');
      sessionStorage.removeItem('operationsClientList_cardInfo');
      sessionStorage.removeItem('agentClientList_filters');
      sessionStorage.removeItem('agentClientList_cardInfo');
    }
    // If navigating to main leads list, clear its sessionStorage filters
    if (path.endsWith('/leads')) {
      sessionStorage.removeItem('leadList_filters');
      sessionStorage.removeItem('leadList_cardInfo');
    }
    // If navigating to main payments invoice list
    if (path.endsWith('/payments/invoices') || path.endsWith('/payments')) {
      sessionStorage.removeItem('invoiceList_filters');
      sessionStorage.removeItem('invoiceList_cardInfo');
    }

    navigate(path, { state: { resetFilters: true } });
    setMobileOpen(false);
  };

  const markReadMutation = useMutation({
    mutationFn: dbService.markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: dbService.markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
    showAlert('All notifications marked as read', 'success');
  };

  const handleNotifClick = (id) => {
    markReadMutation.mutate(id);
    handleNotifMenuClose();
  };

  const getRolePrefix = () => {
    if (!currentUser) return '';
    if (currentUser.role === 'consultant') return 'agent';
    if (currentUser.role === 'super_admin') return 'super_admin';
    if (currentUser.role === 'marketing') return 'marketing-manager';
    if (currentUser.role === 'team_leader') return 'team_leader';
    if (currentUser.role === 'flight_expert') return 'flight_expert';
    if (currentUser.role === 'ticketing_agent') return 'ticketing_agent';
    return currentUser.role;
  };

  const getDynamicPath = (item) => {
    let prefix = getRolePrefix();
    if (!prefix) return item.path;

    // Special override: Dashboard should map strictly to the exact role if it exists
    if (item.path === '/dashboard') {
      if (currentUser.role === 'super_admin') return '/super_admin/dashboard';
      if (currentUser.role === 'marketing') return '/marketing-manager/dashboard';
      if (currentUser.role === 'team_leader') return '/team_leader/dashboard';
      if (currentUser.role === 'flight_expert') return '/flight_expert/dashboard';
      if (currentUser.role === 'ticketing_agent') return '/ticketing_agent/dashboard';
    }

    // Special override: Integrations is a shared page — do not prefix it
    if (currentUser.role === 'team_leader' && ['/quotes', '/bookings', '/agents', '/agents/performance'].includes(item.path)) return item.path;
    if (currentUser.role === 'flight_expert' && ['/quotes', '/flights', '/bookings'].includes(item.path)) return item.path;
    if (currentUser.role === 'ticketing_agent' && ['/bookings', '/flight-alerts', '/ticketing'].includes(item.path)) return item.path;
    if (currentUser.role === 'finance' && item.path === '/agents/performance') return item.path;
    if (item.path === '/integrations') return '/integrations';

    if (item.path.startsWith(`/${prefix}`)) return item.path;

    // Add prefix to paths
    if (item.path.startsWith('/')) {
      return `/${prefix}${item.path}`;
    }
    return item.path;
  };

  const isActive = (item) => {
    const currentPath = location.pathname;
    const itemPath = getDynamicPath(item);

    // Social inbox matching
    if (itemPath.includes('/social-inbox')) {
      return currentPath.includes('/social-inbox') && itemPath === getDynamicPath({ path: location.pathname + location.search });
    }

    // Default prefix match
    return currentPath.startsWith(itemPath.split('?')[0]);
  };

  const menuItems = [
    // WORKSPACE
    { section: 'WORKSPACE', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'consultant', 'sales_agent', 'operations', 'finance', 'super_admin', 'marketing', 'team_leader', 'flight_expert', 'ticketing_agent'] },
    { section: 'WORKSPACE', label: 'Leads', icon: <PeopleIcon />, path: '/leads', roles: ['admin', 'consultant', 'sales_agent', 'operations', 'super_admin', 'marketing', 'team_leader'] },
    { section: 'WORKSPACE', label: 'Customers', icon: <BusinessCenterIcon />, path: '/customers', roles: ['admin', 'consultant', 'sales_agent', 'operations', 'super_admin', 'team_leader', 'flight_expert'] },
    { section: 'WORKSPACE', label: 'Flight Requests', icon: <CalendarMonthIcon />, path: '/consultations/calendar', roles: ['operations', 'super_admin', 'team_leader'] },

    // TRAVEL OPERATIONS
    { section: 'TRAVEL OPERATIONS', label: 'Flight Requests', icon: <FlightIcon />, path: '/flights', roles: ['super_admin', 'flight_expert', 'operations'] },
    { section: 'TRAVEL OPERATIONS', label: 'Quotes', icon: <RequestQuoteIcon />, path: '/quotes', roles: ['admin', 'super_admin', 'team_leader', 'sales_agent', 'consultant', 'flight_expert'] },
    { section: 'TRAVEL OPERATIONS', label: 'Bookings', icon: <AirplaneTicketIcon />, path: '/bookings', roles: ['admin', 'super_admin', 'team_leader', 'sales_agent', 'consultant', 'flight_expert', 'ticketing_agent', 'operations'] },
    { section: 'TRAVEL OPERATIONS', label: 'PNR / Tracking', icon: <ConnectingAirportsIcon />, path: '/flight-alerts', roles: ['super_admin', 'ticketing_agent', 'operations'] },
    { section: 'TRAVEL OPERATIONS', label: 'Ticketing', icon: <ConfirmationNumberIcon />, path: '/ticketing', roles: ['super_admin', 'ticketing_agent'] },

    // FINANCE
    { section: 'FINANCE', label: 'Payments', icon: <MonetizationOnIcon />, path: '/payments', roles: ['admin', 'finance', 'super_admin'] },
    { section: 'FINANCE', label: 'Invoices', icon: <ReceiptIcon />, path: '/payments/invoices', roles: ['admin', 'finance', 'super_admin'] },
    { section: 'FINANCE', label: 'Refunds', icon: <CurrencyExchangeIcon />, path: '/payments/refund-commission', roles: ['admin', 'super_admin', 'finance', 'operations'] },

    // MANAGEMENT
    { section: 'MANAGEMENT', label: 'Team', icon: <GroupsIcon />, path: '/agents', roles: ['admin', 'operations', 'super_admin', 'team_leader'] },
    { section: 'MANAGEMENT', label: 'Suppliers', icon: <StorefrontIcon />, path: '/suppliers', roles: ['super_admin', 'finance'] },
    { section: 'MANAGEMENT', label: 'Reports', icon: <AssessmentIcon />, path: '/agents/performance', roles: ['admin', 'operations', 'super_admin', 'team_leader', 'finance', 'marketing'] },

    // COMMUNICATION
    { section: 'COMMUNICATION', label: 'Social Inbox', icon: <ForumIcon />, path: '/social-inbox', roles: ['admin', 'consultant', 'sales_agent', 'operations', 'super_admin', 'team_leader', 'marketing'] },

    // ADMINISTRATION
    { section: 'ADMINISTRATION', label: 'Users', icon: <SecurityIcon />, path: '/active-cases', roles: ['admin', 'operations', 'super_admin'] },
    { section: 'ADMINISTRATION', label: 'Documents', icon: <AssignmentTurnedInIcon />, path: '/documents/verify', roles: ['admin', 'operations', 'super_admin'] },
    { section: 'ADMINISTRATION', label: 'Settings', icon: <SettingsIcon />, path: '/super_admin/customization', roles: ['super_admin'] },
  ];


  const ALL_SUB_ITEMS = [
    {
      label: 'WhatsApp',
      channel: 'whatsapp',
      icon: <WhatsAppIcon />,
      path: '/social-inbox?channel=whatsapp'
    },
    {
      label: 'Facebook',
      channel: 'facebook',
      icon: <FacebookIcon />,
      path: '/social-inbox?channel=facebook'
    },
    {
      label: 'Instagram',
      channel: 'instagram',
      icon: <InstagramIcon />,
      path: '/social-inbox?channel=instagram'
    },
    {
      label: 'Telegram',
      channel: 'telegram',
      icon: <TelegramIcon />,
      path: '/social-inbox?channel=telegram'
    },
    {
      label: 'LinkedIn',
      channel: 'linkedin',
      icon: <LinkedInIcon sx={{ color: '#0A66C2' }} />,
      path: '/social-inbox?channel=linkedin'
    },
    {
      label: 'Twitter / X',
      channel: 'twitter',
      icon: <TwitterIcon sx={{ color: '#1DA1F2' }} />,
      path: '/social-inbox?channel=twitter'
    },
    {
      label: 'Pinterest',
      channel: 'pinterest',
      icon: <PinterestIcon sx={{ color: '#BD081C' }} />,
      path: '/social-inbox?channel=pinterest'
    },
    {
      label: 'WeChat',
      channel: 'wechat',
      icon: <ChatIcon sx={{ color: '#07C160' }} />,
      path: '/social-inbox?channel=wechat'
    },
    {
      label: 'LINE',
      channel: 'line',
      icon: <ChatIcon sx={{ color: '#06C755' }} />,
      path: '/social-inbox?channel=line'
    },
    {
      label: 'Viber',
      channel: 'viber',
      icon: <ChatIcon sx={{ color: '#7360F2' }} />,
      path: '/social-inbox?channel=viber'
    },
    {
      label: 'Discord',
      channel: 'discord',
      icon: <ChatIcon sx={{ color: '#5865F2' }} />,
      path: '/social-inbox?channel=discord'
    },
    {
      label: 'Snapchat',
      channel: 'snapchat',
      icon: <ChatIcon sx={{ color: '#FFFC00' }} />,
      path: '/social-inbox?channel=snapchat'
    },
    {
      label: 'TikTok',
      channel: 'tiktok',
      icon: <ChatIcon sx={{ color: '#010101' }} />,
      path: '/social-inbox?channel=tiktok'
    },
    {
      label: 'YouTube',
      channel: 'youtube',
      icon: <ChatIcon sx={{ color: '#FF0000' }} />,
      path: '/social-inbox?channel=youtube'
    }
  ];

  const isSalesWorkspace = ['consultant', 'sales_agent', 'team_leader'].includes(currentUser?.role);
  const subItems = isSalesWorkspace
    ? ALL_SUB_ITEMS.filter(item => ['whatsapp', 'facebook', 'instagram', 'telegram'].includes(item.channel))
    : ALL_SUB_ITEMS.filter(item => connectedPlatforms[item.channel]);

  const handleSocialClick = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
      setSocialMenuOpen(true);
    } else {
      setSocialMenuOpen(!socialMenuOpen);
    }
  };

  const renderSocialInboxMenu = (item) => {
    const active = isActive(item);
    const showUnread = totalSocialUnread > 0;

    return (
      <React.Fragment key={item.label}>
        <ListItemButton
          onClick={handleSocialClick}
          selected={active && !socialMenuOpen}
          sx={{
            py: 1.2,
            px: sidebarOpen ? 2.5 : 2,
            borderRadius: 2.5,
            mx: 1.5,
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarOpen ? 'initial' : 'center',
            color: active ? 'secondary.main' : 'text.secondary',
            '&.Mui-selected': {
              backgroundColor: 'background.neutral',
              color: 'secondary.main',
              '& .MuiListItemIcon-root': {
                color: 'secondary.main',
              },
              '&:hover': {
                backgroundColor: 'background.neutral',
              },
            },
            '&:hover': {
              backgroundColor: 'background.neutral',
              color: 'text.primary',
              opacity: 0.95,
            },
            transition: 'all 0.2s ease',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: sidebarOpen ? 2 : 'auto',
              justifyContent: 'center',
              color: active ? 'secondary.main' : 'text.secondary',
              transition: 'color 0.2s ease',
            }}
          >
            <Badge badgeContent={showUnread ? totalSocialUnread : 0} color="error">
              {item.icon}
            </Badge>
          </ListItemIcon>
          {sidebarOpen && (
            <ListItemText
              primary={item.label}
              sx={{ m: 0 }}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 500,
                color: 'inherit',
                lineHeight: 1,
              }}
            />
          )}
          {sidebarOpen && (
            socialMenuOpen ? <ExpandLess sx={{ fontSize: '1.2rem', color: 'text.secondary' }} /> : <ExpandMore sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
          )}
        </ListItemButton>

        <Collapse in={socialMenuOpen && sidebarOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3.5 }}>
            {subItems.map((subItem) => {
              const subActive = location.pathname === '/social-inbox' && location.search === `?channel=${subItem.channel}`;
              const subUnread = getPlatformUnread(subItem.channel);

              return (
                <ListItemButton
                  key={subItem.label}
                  onClick={() => navigateTo(getDynamicPath(subItem))}
                  selected={subActive}
                  sx={{
                    py: 0.8,
                    px: 2,
                    borderRadius: 2,
                    mb: 0.5,
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    color: subActive ? 'secondary.main' : 'text.secondary',
                    '&.Mui-selected': {
                      backgroundColor: 'background.neutral',
                      color: 'secondary.main',
                      '& .MuiListItemIcon-root': {
                        color: 'secondary.main',
                      },
                      '&:hover': {
                        backgroundColor: 'background.neutral',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'background.neutral',
                      color: 'text.primary',
                      opacity: 0.95,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 1.5,
                      justifyContent: 'center',
                      color: subActive ? 'secondary.main' : 'text.secondary',
                      transition: 'color 0.2s ease',
                      '& svg': {
                        fontSize: '1.1rem'
                      }
                    }}
                  >
                    <Badge badgeContent={subUnread} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
                      {subItem.icon}
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={subItem.label}
                    sx={{ m: 0 }}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      fontWeight: subActive ? 600 : 500,
                      color: 'inherit',
                      lineHeight: 1,
                    }}
                  />
                  {subUnread > 0 && (
                    <Box
                      sx={{
                        backgroundColor: 'error.main',
                        color: 'error.contrastText',
                        borderRadius: '10px',
                        px: 1,
                        py: 0.2,
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        lineHeight: 1,
                      }}
                    >
                      {subUnread}
                    </Box>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      </React.Fragment>
    );
  };

  // Render navigation item
  const renderNavItem = (item) => {
    // 1. If user has custom permissions enabled, check against their custom list
    if (currentUser?.customPermissions?.enabled) {
      const allowedMenus = currentUser.customPermissions.menus || [];
      if (!allowedMenus.includes(item.label)) return null;
    } else {
      // 2. Otherwise fall back to role-based settings (or static fallback)
      if (currentUser?.role !== 'super_admin') {
        if (customizationSettings && customizationSettings[currentUser?.role]) {
          const allowedMenus = customizationSettings[currentUser?.role].menus || [];
          if (!allowedMenus.includes(item.label)) return null;
        } else {
          // Fallback to static check if settings are not loaded yet
          if (!item.roles.includes(currentUser?.role)) return null;
        }
      } else {
        // Super admin can see all options they are allowed statically
        if (!item.roles.includes(currentUser?.role)) return null;
      }
    }

    // 3. Granular permission-based menu filtering
    if (currentUser?.customPermissions?.enabled) {
      const perms = currentUser.customPermissions.granular || {};
      // Hide finance section items if viewFinanceReports is disabled
      if (['Payments', 'Invoices', 'Refunds'].includes(item.label) && !perms.viewPayment) return null;
      if (item.label === 'Reports' && !perms.viewFinanceReports) return null;
    }

    if (item.label === 'Social Inbox') {
      return renderSocialInboxMenu(item);
    }


    const active = isActive(item);
    const itemPath = getDynamicPath(item);

    return (
      <ListItemButton
        key={item.label}
        onClick={() => navigateTo(itemPath)}
        selected={active}
        sx={{
          py: 1.2,
          px: sidebarOpen ? 2.5 : 2,
          borderRadius: 2.5,
          mx: 1.5,
          mb: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'initial' : 'center',
          color: active ? 'secondary.main' : 'text.secondary',
          '&.Mui-selected': {
            backgroundColor: 'background.neutral',
            color: 'secondary.main',
            '& .MuiListItemIcon-root': {
              color: 'secondary.main',
            },
            '&:hover': {
              backgroundColor: 'background.neutral',
            },
          },
          '&:hover': {
            backgroundColor: 'background.neutral',
            color: 'text.primary',
            opacity: 0.95,
          },
          transition: 'all 0.2s ease',
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: sidebarOpen ? 2 : 'auto',
            justifyContent: 'center',
            color: active ? 'secondary.main' : 'text.secondary',
            transition: 'color 0.2s ease',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {sidebarOpen && (
          <ListItemText
            primary={
              currentUser?.role === 'consultant' && item.label === 'Leads' ? 'My Leads' : 
              currentUser?.role === 'consultant' && item.label === 'Customers' ? 'My Customers' : 
              item.label
            }
            sx={{ m: 0 }}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: active ? 600 : 500,
              color: 'inherit',
              lineHeight: 1,
            }}
          />
        )}
      </ListItemButton>
    );
  };

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Logo Header */}
      <Box
        sx={{
          py: 2.5,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          justifyContent: sidebarOpen ? 'space-between' : 'center',
        }}
      >
        <Box onClick={() => navigateTo('/dashboard')} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}
          >
            ✈
          </Box>
          {sidebarOpen && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                WOW MY FLIGHT
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                TRAVEL AGENCY CRM
              </Typography>
            </Box>
          )}
        </Box>
        {sidebarOpen && (
          <IconButton onClick={toggleSidebar} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider />

      {/* Navigation Links */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        <List disablePadding>
          {Object.entries(
            menuItems.reduce((acc, item) => {
              if (!acc[item.section]) acc[item.section] = [];
              acc[item.section].push(item);
              return acc;
            }, {})
          ).map(([section, items]) => {
            const renderedItems = items.map((item) => renderNavItem(item)).filter(Boolean);
            if (renderedItems.length === 0) return null;
            return (
              <React.Fragment key={section}>
                {sidebarOpen && (
                  <Typography
                    variant="caption"
                    sx={{
                      px: 3,
                      pt: 2,
                      pb: 1,
                      display: 'block',
                      fontWeight: 700,
                      color: 'text.secondary',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      fontSize: '0.65rem'
                    }}
                  >
                    {section}
                  </Typography>
                )}
                {renderedItems}
              </React.Fragment>
            );
          })}

          <ListItemButton
            onClick={logout}
            sx={{
              py: 1.2,
              px: sidebarOpen ? 2.5 : 2,
              borderRadius: 2.5,
              mx: 1.5,
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'initial' : 'center',
              color: 'secondary.main',
              '&:hover': {
                backgroundColor: 'background.neutral',
                color: 'secondary.main',
                opacity: 0.95,
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: sidebarOpen ? 2 : 'auto',
                justifyContent: 'center',
                color: 'inherit',
                transition: 'color 0.2s ease',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {sidebarOpen && (
              <ListItemText
                primary="Logout"
                sx={{ m: 0 }}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'inherit',
                  lineHeight: 1,
                }}
              />
            )}
          </ListItemButton>
        </List>
      </Box>

      {/* Collapsed Toggle Footer for Sidebar */}
      {!sidebarOpen && (
        <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={toggleSidebar} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* User Status Bar at footer */}
      {sidebarOpen && (
        <Box sx={{ p: 2, m: 1.5, borderRadius: 3, backgroundColor: 'background.neutral' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={currentUser?.avatar} sx={{ width: 36, height: 36 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, noWrap: true, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser?.name}
              </Typography>
              <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                {currentUser?.role} Mode
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: {
            xs: '100%',
            md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${collapsedDrawerWidth}px)`,
          },
          ml: {
            xs: 0,
            md: sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
          },
          backgroundColor: (theme) => theme.palette.mode === 'light' ? '#FFFFFF' : theme.palette.background.paper,
          color: 'text.primary',
          boxShadow: '0px 1px 3px 0px rgba(15, 23, 42, 0.05)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar sx={{ px: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          {/* Left: Collapse Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            {!sidebarOpen && (
              <IconButton
                color="inherit"
                aria-label="expand sidebar"
                onClick={toggleSidebar}
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Search Input Box */}
            <Box sx={{ display: { xs: 'none', sm: 'block' }, width: 280 }}>
              <SearchBar
                value={searchVal}
                onChange={setSearchVal}
                onClear={() => setSearchVal('')}
                placeholder="Global CRM search..."
              />
            </Box>
          </Box>

          {/* Right: Tools & Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

            {/* Social Inbox Shortcut */}
            <Tooltip title="Social Inbox">
              <IconButton color="inherit" onClick={() => navigateTo(getDynamicPath({ path: '/social-inbox' }))}>
                <Badge badgeContent={totalSocialUnread} color="error">
                  <ForumIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Notifications Popover */}
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotifMenuOpen}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Notifications list popup */}
            <Popover
              open={Boolean(notifAnchorEl)}
              anchorEl={notifAnchorEl}
              onClose={handleNotifMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: { width: 340, maxHeight: 440, borderRadius: 3, mt: 1 },
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Recent Notifications
                </Typography>
                {unreadCount > 0 && (
                  <Button size="small" onClick={handleMarkAllRead} sx={{ fontSize: '0.75rem' }}>
                    Mark all read
                  </Button>
                )}
              </Box>
              <Divider />
              <List sx={{ p: 0 }}>
                {notifications.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                    <Typography variant="body2">No notifications found</Typography>
                  </Box>
                ) : (
                  notifications.map((notif) => (
                    <ListItemButton
                      key={notif.id}
                      onClick={() => handleNotifClick(notif.id)}
                      sx={{
                        px: 2,
                        py: 1.5,
                        backgroundColor: notif.read ? 'transparent' : 'background.neutral',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { border: 0 },
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: notif.read ? 500 : 700 }}>
                          {notif.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                          {notif.time}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  ))
                )}
              </List>
            </Popover>

            {/* Profile Dropdown */}
            <IconButton onClick={handleProfileMenuOpen} size="small" sx={{ p: 0.5 }}>
              <Avatar src={currentUser?.avatar} sx={{ width: 32, height: 32 }} />
            </IconButton>



            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose}
              PaperProps={{
                sx: { width: 200, borderRadius: 3, mt: 1 },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {currentUser?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentUser?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => navigateTo('/settings')}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                General Settings
              </MenuItem>
              <MenuItem onClick={logout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar: Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
            boxSizing: 'border-box',
            backgroundColor: (theme) => theme.palette.mode === 'light' ? '#FFFFFF' : theme.palette.background.paper,
            borderRight: '1px solid',
            borderColor: 'divider',
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        open
      >
        {sidebarContent}
      </Drawer>

      {/* Sidebar: Mobile (Drawer) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: (theme) => theme.palette.mode === 'light' ? '#FFFFFF' : theme.palette.background.paper,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        className="flex-grow h-full overflow-y-auto overflow-x-hidden flex flex-col box-border min-w-0 w-full pt-[72px] px-1.5 sm:px-2 md:px-2.5 pb-2.5"
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
