import settingsIcon from 'media/icons/settings.svg';
import usersIcon from 'media/icons/team.svg';
import dashboardIcon from 'media/icons/dashboard.svg';
import analyticsIcon from 'media/icons/analytics.svg';

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
      label: 'Dashboard',
      icon: dashboardIcon,
      route: '/dashboard',
      children: [
        {
          key: 'overview',
          label: 'Overview',
          route: '/dashboard/overview',
        },
        {
          key: 'analytics',
          label: 'Analytics',
          icon: analyticsIcon,
          route: '/dashboard/analytics',
        },
      ],
    },
    {
      key: 'users',
      label: 'People',
      icon: usersIcon,
      route: '/users',
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: settingsIcon,
      route: '/settings',
    },
  ];
};

export default getSidebarTabs;
