import React, { useEffect, useState } from 'react';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { Box, Typography, Button, Modal, Paper, CircularProgress, Divider, Stack } from '@mui/material';
import { getLocks, Lock, getLockOtpByPhoneNumber, LockOtpDetails, getLockStatusByPhoneNumber, LockStatusDetails } from 'services/api';
import dayjs from 'dayjs';

const LockPage = () => {
    const [locks, setLocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLock, setSelectedLock] = useState<LockOtpDetails | null>(null);
    const [selectedLockStatus, setSelectedLockStatus] = useState<LockStatusDetails | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Define columns for the table
    const columns = [
        // { label: 'Lock ID', fieldName: 'id', width: 300 },
        { label: 'Phone Number', fieldName: 'phone_number', width: 200 },
        { label: 'Action', fieldName: 'action', width: 120 },
    ];

    useEffect(() => {
        const fetchLocks = async () => {
            setLoading(true);
            try {
                const response = await getLocks();
                // Add an action button to each row
                const locksWithAction = response.data.map((lock: Lock) => ({
                    ...lock,
                    action: (
                        <Button
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={async e => {
                                e.stopPropagation();
                                setModalOpen(true);
                                setModalLoading(true);
                                setSelectedLock(null);
                                setSelectedLockStatus(null);
                                try {
                                    const details = await getLockOtpByPhoneNumber(lock.phone_number);
                                    const status = await getLockStatusByPhoneNumber(lock.phone_number);
                                    setSelectedLock(details.data);
                                    setSelectedLockStatus(status.data);
                                } catch {
                                    setSelectedLock(null);
                                    setSelectedLockStatus(null);
                                } finally {
                                    setModalLoading(false);
                                }
                            }}
                            sx={{ minWidth: 100 }}
                        >
                            Get OTP
                        </Button>
                    ),
                }));
                setLocks(locksWithAction);
            } catch (error) {
                setLocks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLocks();
    }, []);

    return (
        <SidebarLayout>
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Lock Management
                </Typography>
                <DataTable
                    data={locks}
                    columns={columns}
                    searchFields={['id', 'phone_number']}
                    filterLoading={loading}
                />
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4, minWidth: 380, borderRadius: 3, boxShadow: 8 }}>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Lock OTP Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {modalLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
                                <CircularProgress />
                            </Box>
                        ) : selectedLock ? (
                            <Stack spacing={1.5}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Lock ID</Typography>
                                    <Typography variant="body1" fontWeight={500}>{selectedLock.lock_id}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                                    <Typography variant="body1" fontWeight={500}>{selectedLock.lock_phone_number}</Typography>
                                </Box>
                                {selectedLockStatus && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Lock Status</Typography>
                                    <Typography variant="body1" fontWeight={500}>{selectedLockStatus.status_display}</Typography>
                                </Box>
                                )}
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">OTP</Typography>
                                    <Typography variant="body1" fontWeight={500}>{selectedLock.otp}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Is Used</Typography>
                                    <Typography variant="body1" fontWeight={500}>{selectedLock.is_used ? 'Yes' : 'No'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                                    <Typography variant="body1" fontWeight={500}>{dayjs(selectedLock.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Updated At</Typography>
                                    <Typography variant="body1" fontWeight={500}>{dayjs(selectedLock.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                                </Box>
                            </Stack>
                        ) : (
                            <Typography color="error">Failed to load lock OTP details.</Typography>
                        )}
                        <Box mt={4} display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="warning" onClick={() => setModalOpen(false)} sx={{ minWidth: 100 }}>
                                Close
                            </Button>
                        </Box>
                    </Paper>
                </Modal>
            </Box>
        </SidebarLayout>
    );
};

export default LockPage;
