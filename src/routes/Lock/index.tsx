import React from 'react';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { Box, Typography } from '@mui/material';

const Lock = () => {
    // Define columns for the table
    const columns = [
        { label: 'Lock ID', fieldName: 'lockId', width: 120 },
        { label: 'Location', fieldName: 'location', width: 200 },
        { label: 'Status', fieldName: 'status', width: 120 },
        { label: 'Battery Level', fieldName: 'batteryLevel', width: 150 },
        { label: 'Last Active', fieldName: 'lastActive', width: 180 },
        { label: 'Assigned To', fieldName: 'assignedTo', width: 200 }
    ];

    // Dummy data for the table
    const data = [
        {
            id: 1,
            lockId: 'LCK001',
            location: 'Warehouse A',
            status: 'Active',
            batteryLevel: '85%',
            lastActive: '2024-03-19 10:30 AM',
            assignedTo: 'John Doe'
        },
        {
            id: 2,
            lockId: 'LCK002',
            location: 'Gate B',
            status: 'Inactive',
            batteryLevel: '45%',
            lastActive: '2024-03-19 09:15 AM',
            assignedTo: 'Jane Smith'
        },
        {
            id: 3,
            lockId: 'LCK003',
            location: 'Storage Room C',
            status: 'Active',
            batteryLevel: '92%',
            lastActive: '2024-03-19 11:45 AM',
            assignedTo: 'Mike Johnson'
        },
        {
            id: 4,
            lockId: 'LCK004',
            location: 'Main Entrance',
            status: 'Active',
            batteryLevel: '78%',
            lastActive: '2024-03-19 10:00 AM',
            assignedTo: 'Sarah Wilson'
        },
        {
            id: 5,
            lockId: 'LCK005',
            location: 'Loading Dock',
            status: 'Inactive',
            batteryLevel: '25%',
            lastActive: '2024-03-18 05:30 PM',
            assignedTo: 'Tom Brown'
        }
    ];

    return (
        <SidebarLayout>
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Lock Management
                </Typography>
                <DataTable 
                    data={data}
                    columns={columns}
                    searchFields={['lockId', 'location', 'status', 'assignedTo']}
                />
            </Box>
        </SidebarLayout>
    );
};

export default Lock;
