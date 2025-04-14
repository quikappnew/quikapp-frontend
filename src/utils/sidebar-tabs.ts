import React from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export interface TabItem {
  key: string;
  label: string;
  route: string;
  icon?: React.ElementType;
  exact?: boolean;
  children?: TabItem[];
}

const getSidebarTabs = (): TabItem[] => {
  return [
    {
      key: 'dashboard',
      label: 'Dashboard & Analytics',
      icon: DashboardOutlinedIcon,
      route: '/dashboard',
    },
    {
      key: 'trips',
      label: 'Trip Details',
      icon: ExploreOutlinedIcon,
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
      icon: StorefrontOutlinedIcon,
      route: '/vendor',
    },
    {
      key: 'client',
      label: 'Client',
      icon: AccountCircleOutlinedIcon,
      route: '/client',
    },
    {
      key: 'drivers',
      label: 'Drivers',
      icon: PeopleOutlinedIcon,
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
      icon: LocalShippingOutlinedIcon,
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
      icon: LocationOnOutlinedIcon,
      route: '/locations'
    },
    {
      key: 'manage-users',
      label: 'Manage Users',
      icon: ManageAccountsOutlinedIcon,
      route: '/users'
    },
    {
      key: 'sign-out',
      label: 'Sign Out',
      icon: LogoutOutlinedIcon,
      route: '/dashboard'
    },
  ];
};

export default getSidebarTabs;
