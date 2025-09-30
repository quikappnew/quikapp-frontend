import { Box, Button, Grid } from "@mui/material";
import SidebarLayout from "layouts/SidebarLayout"
import { useState, useMemo, useEffect } from "react";
import ClientModal from "./clientModal";
import BasicCard from "components/Card";
import DataTable from "components/DataTable";
import { getClients as fetchClients } from "services/api";
import { useNavigate } from 'react-router-dom';

const initialList = [
    {
        count: 4,
        description: "Total Number Clients"
    },
    {
        count: 10,
        description: "TotalNumber of Trips"  
    },
];
// get clients list



const Client = () => {
    const client = "Sowmya";
    const [modalOpen, setModalOpen] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const navigate = useNavigate();

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);


    // Memoize the list with random colors
    const listWithColors = useMemo(() => {
        return initialList.map(item => ({
            ...item,
            color: "#000000",
            bgColor: "#f0f0f0",
        }));
    }, []); // Empty dependency array means this runs once



    const handleViewDetails = (clientId: string) => {
        navigate(`/clients/${clientId}`);
    };

    const loadClients = async () => {
        const response = await fetchClients();
        setClients(response.data);
    };

    useEffect(() => {
        loadClients();
    }, []);

    const columns = [
        { label: 'Client Name', fieldName: 'name', width: 200 },
        { label: 'GST Number', fieldName: 'gst', width: 150 },
        { label: 'PAN Number', fieldName: 'pan', width: 150 },
        { label: 'SPOC Name', fieldName: 'spoc_name', width: 200 },
        { label: 'Action', fieldName: 'action', width: 150 },
    ];

    const data = clients.map(item => ({
        ...item,
        action: (
            <Button variant="contained" color="info" size="small" onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(item.id);
            }}>
                View Details
            </Button>
        ),
    }));

   
  
    return (
        <SidebarLayout>
            {/* <Navbar title="Client" subTitle="Client" /> */}
            <h2 style={{marginBottom: "20px"}}>Welcome {client}</h2>
            <Box sx={{ display: 'flex', gap: 2, marginBottom: "20px" }}>
                <Button variant="contained" color="info" onClick={handleOpen}>
                    Add Client
                </Button>
            </Box>
            <Box display="flex" justifyContent="space-between">
                <Grid container spacing={2} marginBottom="20px">
                    {listWithColors.map((item) => (
                        <Grid item xs={12} md={6} lg={6} key={item.description}>
                            <BasicCard 
                                count={item.count} 
                                description={item.description} 
                                bgColor={item.bgColor}
                                color={item.color}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <DataTable 
                data={data} 
                columns={columns}
                // customRowRender={customRowRender}
                searchFields={['clientName', 'gstNumber', 'panNumber', 'spocName']}
            />
            <ClientModal open={modalOpen} onClose={handleClose} />
        </SidebarLayout>
    )
}   
export default Client;
