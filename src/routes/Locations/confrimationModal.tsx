import { Modal, Box } from '@mui/material';
import { useState } from 'react';

const ConfirmationModal = () => {
    const [open, setOpen] = useState(false);
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

