import { Box, Button, Grid } from "@mui/material";
import Navbar from "components/Navbar";
import SidebarLayout from "layouts/SidebarLayout"
import { useState, Fragment, useMemo, FC } from "react";
import BasicCard from "components/Card";
import DataTable from "components/DataTable";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TableRow, TableCell } from "@mui/material";
import { getRandomColor } from "utils/randomColorGenerator";
import TripStatusOverview from './TripDetails/TripStatusOverview';
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

const Trips: FC = () => {
    const client = "Sowmya";
    const [modalOpen, setModalOpen] = useState(false);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const navigate = useNavigate();

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const handleRowClick = (rowId: number) => {
        setExpandedRows(prev => 
            prev.includes(rowId) 
                ? prev.filter(id => id !== rowId)
                : [...prev, rowId]
        );
    };

    // Memoize the list with random colors
    const listWithColors = useMemo(() => {
        return initialList.map(item => ({
            ...item,
            bgColor: getRandomColor(),
        }));
    }, []); // Empty dependency array means this runs once

    const handleViewTrips = (tripId: number) => {
        navigate(`/trips/${tripId}/view`);
    };

    const columns = [
        { label: 'Trip Name', fieldName: 'tripName', width: 200, type: 'STRING' as const },
        { label: 'Trip Number', fieldName: 'tripNumber', width: 150, type: 'STRING' as const },
        { label: 'Trip Status', fieldName: 'tripStatus', width: 150, type: 'TRIP_STATUS' as const },
        { label: 'Created At', fieldName: 'createdAt', width: 200, type: 'DATE' as const },
        { label: 'Action', fieldName: 'action', width: 150, type: 'STRING' as const },
    ];

    const data = [
        { id: 1, tripName: 'Test Trip', tripNumber: 'Trip123', tripStatus: 'Active', createdAt: '2021-01-01' },
        { id: 2, tripName: 'Test Trip1', tripNumber: 'Trip123', tripStatus: 'In Transit', createdAt: '2021-01-01' },
        { id: 3, tripName: 'Test Trip2', tripNumber: 'Trip123', tripStatus: 'Completed', createdAt: '2021-01-01' },
        { id: 4, tripName: 'Test Trip3', tripNumber: 'Trip123', tripStatus: 'Cancelled', createdAt: '2021-01-01' },
    ].map(item => ({
        ...item,
        action: (
            <Button variant="contained" color="info" size="small" onClick={(e) => {
                e.stopPropagation();
                handleViewTrips(item.id);
            }}>
                View Trips
            </Button>
        ),
    }));

  
    // Example data - replace with actual data from your API/state management
    const tripStatusCounts = {
        loading: 0,
        scheduled: 2,
        inTransit: 59,
        unloading: 0,
        completed: 2953,
        cancelled: 0,
        paid: 0,
        history: 96,
    };

    return (
        <SidebarLayout>
            {/* <Navbar title="Client" subTitle="Client" /> */}
            <h1 style={{marginBottom: "10px"}}>Welcome {client}</h1>
            {/* <h2 style={{marginBottom: "20px"}}>Dashboard Overview</h2>
            <TripStatusOverview statusCounts={tripStatusCounts} /> */}
         
            <DataTable 
                data={data} 
                columns={columns}
                searchFields={['tripName', 'tripNumber', 'tripStatus', 'createdAt']}
            />
        </SidebarLayout>
    )
}   
export default Trips;
