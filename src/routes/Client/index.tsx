import { Box, Button, Grid } from "@mui/material";
import Navbar from "components/Navbar";
import SidebarLayout from "layouts/SidebarLayout"
import { useState, Fragment } from "react";
import ClientModal from "./clientModal";
import BasicCard from "components/Card";
import DataTable from "components/DataTable";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TableRow, TableCell } from "@mui/material";
import { getRandomColor } from "utils/randomColorGenerator";

const Client = () => {
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
            <Button variant="contained" color="info" size="small" onClick={(e) => {
                e.stopPropagation();
                handleViewTrips(item.clientName);
            }}>
                View Trips
            </Button>
        ),
    }));

    const customRowRender = (row: any) => {
        const isExpanded = expandedRows.includes(row.id);
        
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
                            {row[column.fieldName]}
                        </TableCell>
                    ))}
                    <TableCell>
                        <ExpandMoreIcon 
                            sx={{ 
                                transform: isExpanded ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.2s'
                            }} 
                        />
                    </TableCell>
                </TableRow>
                {isExpanded && (
                    <TableRow>
                        <TableCell colSpan={columns.length + 1} sx={{ py: 0 }}>
                            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                                <h4>Client Details</h4>
                                <p>Client ID: {row.id}</p>
                                <p>Client Name: {row.clientName}</p>
                                <p>GST Number: {row.gstNumber}</p>
                                <p>PAN Number: {row.panNumber}</p>
                                <p>SPOC Name: {row.spocName}</p>
                                <p>Created Date: {new Date().toLocaleDateString()}</p>
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
                    Add Client
                </Button>
            </Box>
            <Box display="flex" justifyContent="space-between">
                <Grid container spacing={2} marginBottom="20px">
                    {list.map((item) => (
                        <Grid item xs={12} md={6} lg={6} key={item.description}>
                            <BasicCard 
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
                customRowRender={customRowRender}
            />
            <ClientModal open={modalOpen} onClose={handleClose} />
        </SidebarLayout>
    )
}   
export default Client;
