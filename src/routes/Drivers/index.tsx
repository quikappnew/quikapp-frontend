import { Box, Button, Grid } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import { useState } from 'react';
import DriverModal from './driverModal';
import BasicCard from 'components/Card';
import DataTable from 'components/DataTable';
// import ConfirmationModal from './confrimationModal';
import ConfirmButton from 'components/ConfirmButton';
import { getRandomColor } from 'utils/randomColorGenerator';
import ConfirmationModal from './confirmationModal';

interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  phoneNumber: string;
  salary: number;
  action?: React.ReactNode;
}

const generateMockDrivers = (count: number): Driver[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Driver ${index + 1}`,
    licenseNumber: `LIC${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    phoneNumber: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    salary: Math.floor(Math.random() * 30000) + 20000, // Random salary between 20000 and 50000
  }));
};

const Drivers = () => {
  const client = 'Sowmya';
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleCloseConfirmationModal = () => setConfirmationModalOpen(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const list = [
    {
      count: 100,
      description: 'Total Number Drivers',
    }
  ];

  const handleOpenConfirmationModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setConfirmationModalOpen(true);
  };

  const columns = [
    { label: 'Name', fieldName: 'name', width: 200 },
    { label: 'License Number', fieldName: 'licenseNumber', width: 150 },
    { label: 'Phone Number', fieldName: 'phoneNumber', width: 150 },
    { label: 'Salary', fieldName: 'salary', width: 150 },
    { label: 'Action', fieldName: 'action', width: 150 },
  ];

  const initialData: Driver[] = generateMockDrivers(100);

  const data = initialData.map(item => ({
    ...item,
    action: (
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => handleOpenConfirmationModal(item)}
      >
        View Details
      </Button>
    ),
  }));

  return (
    <SidebarLayout>
      {/* <Navbar title="Client" subTitle="Client" /> */}
      <h2 style={{ marginBottom: '20px' }}>Welcome {client}</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ marginBottom: '20px' }}
      >
        Add Driver
      </Button>
      <Box display="flex" justifyContent="space-between" marginBottom="20px">
        <Grid container spacing={2}>
          {list.map(item => (
            <Grid item xs={12} md={6} lg={6} key={item.count}>
              <BasicCard 
                key={item.count} 
                count={item.count} 
                description={item.description} 
                bgColor={getRandomColor()} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <DataTable
        data={data}
        columns={columns}
        searchFields={['name', 'licenseNumber', 'phoneNumber']}
        pagination={{
          page,
          rowsPerPage,
          totalRows: data.length,
          onPageChange: handleChangePage,
          onRowsPerPageChange: handleChangeRowsPerPage
        }}
      />
      <DriverModal open={modalOpen} onClose={handleClose} />
      {selectedDriver && (
        <ConfirmationModal
          open={confirmationModalOpen}
          onClose={handleCloseConfirmationModal}
          driverDetails={selectedDriver}
        />
      )}
    </SidebarLayout>
  );
};
export default Drivers;
