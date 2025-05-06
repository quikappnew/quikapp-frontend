import { Modal, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

const ConfirmationModal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box>ConfirmationModal</Box>
            </Modal>
    )
}
export default ConfirmationModal;

