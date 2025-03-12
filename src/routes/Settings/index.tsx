import { FC } from 'react';

import SidebarLayout from 'layouts/SidebarLayout';

import Button from 'components/Button';
import Navbar from 'components/Navbar';

import { logout } from 'utils/auth';

const SettingsPage: FC = () => {
  const renderContent = () => {
    return (
      <Button variant="contained" onClick={logout}>
        Logout
      </Button>
    );
  };

  return (
    <SidebarLayout>
      <Navbar
        title="Settings"
        subTitle="Manage your account, security and notification preferences"
      />
      {renderContent()}
    </SidebarLayout>
  );
};

export default SettingsPage;
