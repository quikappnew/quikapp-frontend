import settingsIcon from 'media/icons/settings.svg';
import usersIcon from 'media/icons/team.svg';
import dashboardIcon from 'media/icons/dashboard.svg';
import FourKIcon from '@mui/icons-material/FourK';
export interface TabItem {
  key: string;
  label: string;
  route: string;
  icon?: string;
  exact?: boolean;
  children?: TabItem[];
}

const getSidebarTabs = (): TabItem[] => {
  return [
    {
      key: 'dashboard',
      label: 'Dashboard & Analytics',
      icon: dashboardIcon,
      route: '/dashboard',
    },
    {
      key: 'trips',
      label: 'Trip Details',
      icon: usersIcon,
      route: '/trips',
      children: [
        {
          key: 'overview',
          label: 'Dashboard Overview',
          route: '/trips',
        },
        {
          key: 'create-trip',
          label: 'Create Trip',
          route: '/dashboard/control-center',
        },
        {
          key: 'search',
          label: 'Search',
          route: '/dashboard/control-center',
        },
        {
          key: 'empty-trips',
          label: 'Empty Trips',
          route: '/dashboard/control-center',
        },
        {
          key: 'in-Transit',
          label: 'In Transit Trips',
          route: '/dashboard/control-center',
        },
      ],
    },
    // {
    //   key: 'reports',
    //   label: 'Reports',
    //   icon: dashboardIcon,
    //   route: '/reports',
    // },
    // {
    //   key: 'driver-payment',
    //   label: 'Driver Payment Requests',
    //   icon: dashboardIcon,
    //   route: '/driver-payment-requests',
    // },
    // {
    //   key: 'accounts-payable',
    //   label: 'Accounts Payable',
    //   icon: dashboardIcon,
    //   route: '/accounts-payable',
    // },
    {
      key: 'vendor',
      label: 'Vendor',
      icon: dashboardIcon,
      route: '/vendor',
    },
    {
      key: 'client',
      label: 'Client',
      icon: dashboardIcon,
      route: '/client',
    },
    {
      key: 'drivers',
      label: 'Drivers',
      icon: dashboardIcon,
      route: '/drivers',
      children: [
        {
          key: 'driver-details',
          label: 'Drivers Details',
          route: '/drivers',
        },
        {
          key: 'driver-payment-reports',
          label: 'Driver Payment Reports',
          route: '/drivers',
        },
        
        
      ],
    },
    {
      key: 'vehicles',
      label: 'Vehicles',
      icon: dashboardIcon,
      route: '/vehicle',
      children: [
        {
          key: 'vehicle-details',
          label: 'Vehicle Details',
          route: '/vehicle',
        },
        {
          key: 'vehicles-bl',
          label: 'Vehicles BL',
          route: '/dashboard/vehicle-details',
        },
        
      ],
    },
    {
      key: 'add-remove-locations',
      label: 'Add/Remove Locations',
      icon: dashboardIcon,
      route: '/locations'
    },
    {
      key: 'manage-users',
      label: 'Manage Users',
      icon: dashboardIcon,
      route: '/users'
    },
    {
      key: 'sign-out',
      label: 'Sign Out',
      icon: dashboardIcon,
      route: '/dashboard'
    },
  ];
};

export default getSidebarTabs;
