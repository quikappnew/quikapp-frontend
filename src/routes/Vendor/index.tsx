import { Box, Button, Grid, Table, TableBody } from "@mui/material";
import Navbar from "components/Navbar";
import SidebarLayout from "layouts/SidebarLayout"
import { useState, Fragment, useMemo } from "react";
import VendorModal from "./vendorModal";
import BasicCard from "components/Card";
import DataTable from "components/DataTable";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TableRow, TableCell } from "@mui/material";
import { getRandomColor } from "utils/randomColorGenerator";

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

const Vendor = () => {
    const client = "Sowmya";
    const [modalOpen, setModalOpen] = useState(false);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

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

    const handleViewTrips = (clientName: string) => {
        console.log(`Viewing trips for ${clientName}`);
    };

    const columns = [
        { label: 'Vendor Name', fieldName: 'vendorName', width: 200 },
        { label: 'GST Number', fieldName: 'gstNumber', width: 150 },
        { label: 'PAN Number', fieldName: 'panNumber', width: 150 },
        { label: 'SPOC Name', fieldName: 'spocName', width: 180 }
    ];

    const data = [
        { id: 1, vendorName: 'Test Vendor', gstNumber: 'GST123', panNumber: 'PAN123', spocName: 'John Doe' },
        { id: 2, vendorName: 'Test Vendor1', gstNumber: 'GST123', panNumber: 'PAN123', spocName: 'John Doe' },
        { id: 3, vendorName: 'Test Vendor2', gstNumber: 'GST123', panNumber: 'PAN123', spocName: 'John Doe' },
        { id: 4, vendorName: 'Test Vendor3', gstNumber: 'GST123', panNumber: 'PAN123', spocName: 'John Doe' },
    ]

    // Add mock trips data - you can replace this with actual API data later
    const mockTrips = {
        1: [
            { tripId: "T001", source: "Mumbai", destination: "Delhi", date: "2024-03-20", status: "In Progress" },
            { tripId: "T002", source: "Delhi", destination: "Bangalore", date: "2024-03-21", status: "Completed" }
        ],
        2: [
            { tripId: "T003", source: "Chennai", destination: "Kolkata", date: "2024-03-19", status: "Scheduled" }
        ],
        3: [
            { tripId: "T004", source: "Hyderabad", destination: "Pune", date: "2024-03-22", status: "In Progress" }
        ],
        4: [
            { tripId: "T005", source: "Bangalore", destination: "Mumbai", date: "2024-03-23", status: "Scheduled" }
        ]
    };

    const customRowRender = (row: any) => {
        const isExpanded = expandedRows.includes(row.id);
        const vendorTrips = mockTrips[row.id as keyof typeof mockTrips] || [];
        
        return (
            <Fragment key={row.id}>
                <TableRow
                    hover
                    onClick={() => handleRowClick(row.id)}
                    sx={{ cursor: 'pointer' }}
                >
                    {columns.map(column => (
                        <TableCell 
                            key={column.fieldName} 
                            onClick={(e) => {
                                if (column.fieldName !== 'action') {
                                    e.stopPropagation();
                                    handleRowClick(row.id);
                                }
                            }}
                        >
                            {column.fieldName === 'action' ? row.action : row[column.fieldName]}
                        </TableCell>
                    ))}
                    <TableCell align="left">
                        View Trips<ExpandMoreIcon 
                            sx={{ 
                                transform: isExpanded ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.2s',
                                borderTop: '1px solid #e0e0e0'
                            }} 
                        />
                    </TableCell>
                </TableRow>
                {isExpanded && (
                    <TableRow>
                        <TableCell colSpan={columns.length + 1} sx={{ py: 0, borderBottom: 'none' }}>
                            <Box sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                        

                                <Box>
                                
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Trip ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Destination</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                            </TableRow>
                                            {vendorTrips.map((trip, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{trip.tripId}</TableCell>
                                                    <TableCell>{trip.source}</TableCell>
                                                    <TableCell>{trip.destination}</TableCell>
                                                    <TableCell>{trip.date}</TableCell>
                                                    <TableCell>{trip.status}</TableCell>
                                                </TableRow>
                                            ))}
                                            {vendorTrips.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center">
                                                        No trips found for this vendor
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Box>
                        </TableCell>
                    </TableRow>
                )}
            </Fragment>
        );
    };
  
    return (
        <SidebarLayout>
            {/* <Navbar title="Client" subTitle="Client" /> */}
            <h2 style={{marginBottom: "20px"}}>Welcome {client}</h2>
            <Box sx={{ display: 'flex', gap: 2, marginBottom: "20px" }}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add Vendor
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
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <DataTable 
                data={data} 
                columns={columns}
                customRowRender={customRowRender}
                searchFields={['vendorName', 'gstNumber', 'panNumber', 'spocName']}
                showAccordion={true}
            />
            {/* <VendorModal open={modalOpen} onClose={handleClose} /> */}
        </SidebarLayout>
    )
}   
export default Vendor;
