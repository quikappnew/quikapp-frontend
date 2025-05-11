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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';

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
    // {
    //   key: 'dashboard',
    //   label: 'Dashboard & Analytics',
    //   icon: DashboardOutlinedIcon,
    //   route: '/dashboard',
    // },
    {
      key: 'orders',
      label: 'Orders',
      icon: ShoppingCartOutlinedIcon,
      route: '/orders',
      children: [
        {
          key: 'create-order',
          label: 'Create Order',
          route: '/orders/create-order',
        },
        {
          key: 'get-orders',
          label: 'Orders List',
          route: '/orders/get-orders',
        },
      ],
    },
    {
      key: 'trips',
      label: 'Trip Details',
      icon: ExploreOutlinedIcon,
      route: '/trips',
      children: [
        {
          key: 'overview',
          label: 'Trip List',
          route: '/trips',
        },
        {
          key: 'create-trip',
          label: 'Create Trip',
          route: '/trips/create-trip',
        },
        // {
        //   key: 'search',
        //   label: 'Search',
        //   route: '/dashboard/control-center',
        // },
        // {
        //   key: 'empty-trips',
        //   label: 'Empty Trips',
        //   route: '/dashboard/control-center',
        // },
        // {
        //   key: 'in-Transit',
        //   label: 'In Transit Trips',
        //   route: '/dashboard/control-center',
        // },
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
      children: [
        {
          key: 'vendor-onboarding',
          label: 'Vendor Onboarding',
          route: '/vendor/onboarding',
        },
        {
          key:'vendor-onboarding-list',
          label:'Vendor Onboarding List',
          route:'/vendor/onboarding-list'
        },
        {
          key: 'vendor-list',
          label: 'Vendor List',
          route: '/vendor/list',
        },
      ],
    },
    {
      key: 'client',
      label: 'Client',
      icon: AccountCircleOutlinedIcon,
      route: '/client',
    },
    // {
    //   key: 'drivers',
    //   label: 'Drivers',
    //   icon: PeopleOutlinedIcon,
    //   route: '/drivers',
    //   children: [
    //     {
    //       key: 'driver-details',
    //       label: 'Drivers Details',
    //       route: '/drivers',
    //     },
    //     {
    //       key: 'driver-payment-reports',
    //       label: 'Driver Payment Reports',
    //       route: '/drivers',
    //     },
        
        
    //   ],
    // },
    {
      key: 'vehicle-onboarding',
      label: 'Vehicle Onboarding',
      icon: AirportShuttleOutlinedIcon,
      route: '/vehicle-onboarding',
      children: [
        {
          key: 'vehicle-onboarding-form',
          label: 'Vehicle Onboarding',
          route: '/vehicle-onboarding',
        },
        {
          key: 'vehicle-onboarding-list',
          label: 'Vehicle Onboarding List',
          route: '/vehicle-onboarding/list',
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
          label: 'Vehicles',
          route: '/vehicle',
        },
        // {
        //   key: 'vehicles-bl',
        //   label: 'Vehicles BL',
        //   route: '/dashboard/vehicle-details',
        // },
        
      ],
    },
    {
      key: 'add-remove-locations',
      label: ' Locations',
      icon: LocationOnOutlinedIcon,
      route: '/locations'
    },
    // {
    //   key: 'manage-users',
    //   label: 'Manage Users',
    //   icon: ManageAccountsOutlinedIcon,
    //   route: '/users'
    // },
    // {
    //   key: 'lock',
    //   label: 'Lock',
    //   icon: LockOutlinedIcon,
    //   route: '/lock',
    // },
    {
      key: 'sign-out',
      label: 'Sign Out',
      icon: LogoutOutlinedIcon,
      route: '/dashboard'
    },
  ];
};

export default getSidebarTabs;
