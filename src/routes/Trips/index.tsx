import { Box, Button, Card, Grid } from "@mui/material";
import Navbar from "components/Navbar";
import SidebarLayout from "layouts/SidebarLayout"
import { useState, Fragment, useMemo, FC, useEffect } from "react";
import BasicCard from "components/Card";
import DataTable from "components/DataTable";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TableRow, TableCell } from "@mui/material";
import { getRandomColor } from "utils/randomColorGenerator";
import TripStatusOverview from './TripDetails/TripStatusOverview';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { getTrips, TripDetails } from 'services/api';

interface ExtendedTripDetails extends TripDetails {
    action?: React.ReactNode;
}

const Trips: FC = () => {
    const client = "Sowmya";
    // const [modalOpen, setModalOpen] = useState(false);
    // const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trips, setTrips] = useState<ExtendedTripDetails[]>([]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setLoading(true);
                const response = await getTrips();
                const tripsWithActions = response.data.map(trip => ({
                    ...trip,
                    // action: (
                    //     <Button 
                    //         variant="contained" 
                    //         color="info" 
                    //         size="small" 
                    //         onClick={(e) => {
                    //             e.stopPropagation();
                    //             handleViewTrips(trip.id);
                    //         }}
                    //     >
                    //         View Trip
                    //     </Button>
                    // ),
                }));
                setTrips(tripsWithActions);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch trips');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    // const handleOpen = () => setModalOpen(true);
    // const handleClose = () => setModalOpen(false);

    const handleViewTrips = (tripId: string) => {
        navigate(`/trips/${tripId}/view`);
    };

    const columns = [
        { label: 'Vendor Name', fieldName: 'vendor_name', width: 200, type: 'STRING' as const },
        { label: 'From Location', fieldName: 'from_location_name', width: 200, type: 'STRING' as const },
        { label: 'To Location', fieldName: 'to_location_name', width: 200, type: 'STRING' as const },
        { label: 'Reference ID', fieldName: 'reference_id', width: 150, type: 'STRING' as const },
        { label: 'Client Name', fieldName: 'client_name', width: 150, type: 'STRING' as const },
        { label: 'Status', fieldName: 'latest_status', width: 150, type: 'STRING' as const },
        { label: 'Created At', fieldName: 'created_at', width: 200, type: 'DATE' as const },
        // { label: 'Action', fieldName: 'action', width: 150, type: 'STRING' as const },
    ];

    if (loading) {
        return (
            <SidebarLayout>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </SidebarLayout>
        );
    }

    if (error) {
        return (
            <SidebarLayout>
                <Alert severity="error">
                    Error loading trips: {error}
                </Alert>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
             <Box sx={{ p: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            background: "#fff",

          }}
        >
           <h4 className="text-xl font-bold mb-2 text-gray-500">Trips</h4>
            <DataTable 
                data={trips} 
                columns={columns}
                searchFields={['vendor_name', 'from_location_name', 'to_location_name', 'reference_id', 'client_name', 'latest_status']}
            />
            </Card>
            </Box>
        </SidebarLayout>
    );
}   

export default Trips;
