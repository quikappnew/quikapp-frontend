// src/components/ClientForm.tsx
import React from 'react';
import SidebarLayout from 'layouts/SidebarLayout';
import VendorForm from 'components/VendorForm';

const VendorOnBoardingForm: React.FC = () => {
  return (
    <SidebarLayout>
      <VendorForm />
    </SidebarLayout>
  );
};

export default VendorOnBoardingForm;