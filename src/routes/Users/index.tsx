import { Box, Button, Grid } from '@mui/material';
import Navbar from 'components/Navbar';
import SidebarLayout from 'layouts/SidebarLayout';
import { useState } from 'react';
import UserModal from './userModal';
import BasicCard from 'components/Card';
import DataTable from 'components/DataTable';
import ConfirmDeactivateModal from './ConfirmDeactivateModal';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  status: string;
  capacity?: number;
}

const AdministrationUsers = () => {
  const client = 'Sowmya';
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleOpen = () => {
    setEditUser(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditUser(null);
  };

  const handleDeactivateClick = (user: User) => {
    setSelectedUser(user);
    setConfirmDeactivate(true);
  };

  const handleDeactivate = () => {
    // Implement deactivation logic here
    console.log('Deactivating user:', selectedUser);
    setConfirmDeactivate(false);
    setSelectedUser(null);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const columns = [
    { label: 'First Name', fieldName: 'firstName', width: 200 },
    { label: 'Last Name', fieldName: 'lastName', width: 150 },
    { label: 'Email', fieldName: 'email', width: 150 },
    { label: 'Phone Number', fieldName: 'phoneNumber', width: 150 },
    { label: 'Password', fieldName: 'password', width: 150 },
    { label: 'Role', fieldName: 'role', width: 150 },
    { label: 'Actions', fieldName: 'actions', width: 200 },
  ];

  const data = [
    {
      id: 1,
      firstName: 'Test Client',
      lastName: 'Active',
      email: 'GST123',
      phoneNumber: 'PAN123',
      password: 'John Doe',
      role: 'John Doe',
      status: 'Active'
    },
    {
      id: 2,
      firstName: 'Test Client1',
      lastName: 'Active',
      email: 'GST123',
      phoneNumber: 'PAN123',
      password: 'John Doe',
      role: 'John Doe',
      status: 'Active',
      capacity: 1000,
    },
    {
      id: 3,
      firstName: 'Test Client2',
      lastName: 'Active',
      email: 'GST123',
      phoneNumber: 'PAN123',
      password: 'John Doe',
      role: 'John Doe',
      status: 'Active',
      capacity: 1000,
    },
    {
      id: 4,
      firstName: 'Test Client3',
      lastName: 'Active',
      email: 'GST123',
      phoneNumber: 'PAN123',
      password: 'John Doe',
      role: 'John Doe',
      status: 'Active',
      capacity: 1000,
    },
  ].map(item => ({
    ...item,
    actions: (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          color="info"
          onClick={() => handleEdit(item)}
        >
          Edit
        </Button>
        {item.status === 'Active' && (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeactivateClick(item)}
          >
            Deactivate
          </Button>
        )}
      </Box>
    ),
  }));

  return (
    <SidebarLayout>
      {/* <Navbar title="Client" subTitle="Client" /> */}
      <h2 style={{ marginBottom: '20px' }}>Welcome {client}</h2>
      <Button
        variant="contained"
          color="info"
          onClick={handleOpen}
        style={{ marginBottom: '20px' }}
      >
        Add User
      </Button>
  
      <DataTable data={data} columns={columns} />
      <UserModal 
        open={modalOpen} 
        onClose={handleClose} 
        user={editUser}
      />
      <ConfirmDeactivateModal
        open={confirmDeactivate}
        onClose={() => {
          setConfirmDeactivate(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeactivate}
        userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
      />
    </SidebarLayout>
  );
};

export default AdministrationUsers;
