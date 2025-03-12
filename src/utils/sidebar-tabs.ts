import settingsIcon from 'media/icons/settings.svg';
import usersIcon from 'media/icons/team.svg';

const getSidebarTabs = () => {
  return [
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
