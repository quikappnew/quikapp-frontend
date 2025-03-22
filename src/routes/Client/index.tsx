import { Box, Button, Grid } from "@mui/material";
import Navbar from "components/Navbar";
import SidebarLayout from "layouts/SidebarLayout"
import { useState } from "react";
import ClientModal from "./clientModal";
import BasicCard from "components/Card";
import DataTable from "components/DataTable";
const Client = () => {
    const client = "Sowmya";
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);
    const list = [
        {
            count: 4,
            description: "Total Number Clients"
        },
        {
            count: 10,
            description: "TotalNumber of Trips"  
        },
       
    ]
    const handleViewTrips = (clientName: string) => {
        // Implement the logic to view trips for the selected client
        console.log(`Viewing trips for ${clientName}`);
    };

    const columns = [
        { label: 'Client Name', fieldName: 'clientName', width: 200 },
        { label: 'GST Number', fieldName: 'gstNumber', width: 150 },
        { label: 'PAN Number', fieldName: 'panNumber', width: 150 },
        { label: 'SPOC Name', fieldName: 'spocName', width: 200 },
        { label: 'Action', fieldName: 'action', width: 150 },
    ];

    const data = [
        { id: 1, clientName: 'Test Client', gstNumber: 'GST123', panNumber: 'PAN123', spocName: 'John Doe' },
        { id: 2, clientName: 'Test Client1', gstNumber: 'GST123', panNumber: 'PAN123', spocName: 'John Doe' },
        { id: 3, clientName: 'Test Client2', gstNumber: 'GST123', panNumber: 'PAN123', spocName: 'John Doe' },
        { id: 4, clientName: 'Test Client3', gstNumber: 'GST123', panNumber: 'PAN123', spocName: 'John Doe' },
    ].map(item => ({
        ...item,
        action: (
            <Button variant="contained" color="info" size="small" onClick={() => handleViewTrips(item.clientName)}>
                View Trips
            </Button>
        ),
    }));
  
    return (
        <SidebarLayout>
            {/* <Navbar title="Client" subTitle="Client" /> */}
            <h2 style={{marginBottom: "20px"}}>Welcome {client}</h2>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{marginBottom: "20px"}}>
                Add Client
            </Button>
            <Box  display="flex" justifyContent="space-between">
                <Grid container spacing={2} >

                    {list.map((item) => (
                        <Grid item xs={12} md={6} lg={6} key={item.count}>
                            <BasicCard key={item.count} count={item.count} description={item.description} />
                        </Grid>
                    ))}
                   
                </Grid>
        </Box>
                <DataTable data={data} columns={columns}  />
        <ClientModal open={modalOpen} onClose={handleClose} />

        </SidebarLayout>
    )
}   
export default Client;
