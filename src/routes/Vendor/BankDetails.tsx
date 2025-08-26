import { Box, Button, Card, Grid, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useState, FC, useEffect } from "react";
import DataTable from "components/DataTable";
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { 
  getVendorBankAccounts,
  createVendorBankAccount,
  updateVendorBankAccount,
  deleteVendorBankAccount,
  setPrimaryBankAccount
} from 'services/api';
import type { 
  VendorBankAccount,
  CreateBankAccountData
} from 'types/api';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import ConfirmButton from 'components/ConfirmButton';

interface ExtendedBankAccount extends VendorBankAccount {
  action?: React.ReactNode;
}

const VendorBankDetails: FC = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams<{ vendorId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankAccounts, setBankAccounts] = useState<ExtendedBankAccount[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<VendorBankAccount | null>(null);
  const [formData, setFormData] = useState<CreateBankAccountData>({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: 'CURRENT'
  });

  const fetchBankAccounts = async () => {
    if (!vendorId) return;
    
    try {
      setLoading(true);
      const response = await getVendorBankAccounts(vendorId);
      
      const accountsWithActions = response.data.map(account => ({
        ...account,
        action: (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={account.isPrimary ? "Primary Account" : "Set as Primary"}>
              <IconButton 
                size="small" 
                color={account.isPrimary ? "warning" : "default"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetPrimary(account.id);
                }}
                disabled={account.isPrimary}
              >
                {account.isPrimary ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Account">
              <IconButton 
                size="small" 
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditAccount(account);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Account">
              <ConfirmButton
                onConfirm={() => handleDeleteAccount(account.id)}
                title="Delete Bank Account"
                description="Are you sure you want to delete this bank account? This action cannot be undone."
                buttonText=""
                color="error"
                variant="text"
                disabled={account.isPrimary}
              />
            </Tooltip>
          </Box>
        ),
      }));
      setBankAccounts(accountsWithActions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bank accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, [vendorId]);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setFormData({
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branchName: '',
      accountType: 'CURRENT'
    });
    setDialogOpen(true);
  };

  const handleEditAccount = (account: VendorBankAccount) => {
    setEditingAccount(account);
    setFormData({
      accountHolderName: account.accountHolderName,
      accountNumber: account.accountNumber,
      ifscCode: account.ifscCode,
      bankName: account.bankName,
      branchName: account.branchName,
      accountType: account.accountType
    });
    setDialogOpen(true);
  };

  const handleSaveAccount = async () => {
    if (!vendorId) return;

    try {
      if (editingAccount) {
        await updateVendorBankAccount(vendorId, editingAccount.id, formData);
        toast.success('Bank account updated successfully');
      } else {
        await createVendorBankAccount(vendorId, formData);
        toast.success('Bank account added successfully');
      }
      setDialogOpen(false);
      fetchBankAccounts();
    } catch (error) {
      toast.error(editingAccount ? 'Failed to update bank account' : 'Failed to add bank account');
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!vendorId) return;

    try {
      await deleteVendorBankAccount(vendorId, accountId);
      toast.success('Bank account deleted successfully');
      fetchBankAccounts();
    } catch (error) {
      toast.error('Failed to delete bank account');
    }
  };

  const handleSetPrimary = async (accountId: string) => {
    if (!vendorId) return;

    try {
      await setPrimaryBankAccount(vendorId, accountId);
      toast.success('Primary account updated successfully');
      fetchBankAccounts();
    } catch (error) {
      toast.error('Failed to set primary account');
    }
  };

  const columns = [
    { label: 'Account Holder', fieldName: 'accountHolderName', width: 200, type: 'STRING' as const },
    { label: 'Account Number', fieldName: 'accountNumber', width: 150, type: 'STRING' as const },
    { label: 'IFSC Code', fieldName: 'ifscCode', width: 120, type: 'STRING' as const },
    { label: 'Bank Name', fieldName: 'bankName', width: 200, type: 'STRING' as const },
    { label: 'Branch', fieldName: 'branchName', width: 200, type: 'STRING' as const },
    { label: 'Account Type', fieldName: 'accountType', width: 120, type: 'STRING' as const },
    { label: 'Primary', fieldName: 'isPrimary', width: 100, type: 'BOOLEAN' as const },
    { label: 'Actions', fieldName: 'action', width: 150, type: 'STRING' as const },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading bank accounts: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, background: "#fff" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              Vendor Bank Details
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAccount}
          >
            Add Bank Account
          </Button>
        </Box>

        <DataTable 
          data={bankAccounts} 
          columns={columns}
          searchFields={['accountHolderName', 'accountNumber', 'bankName', 'branchName']}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAccount ? 'Edit Bank Account' : 'Add Bank Account'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Holder Name"
                value={formData.accountHolderName}
                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IFSC Code"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bank Name"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Branch Name"
                value={formData.branchName}
                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value as any })}
                  label="Account Type"
                >
                  <MenuItem value="SAVINGS">Savings</MenuItem>
                  <MenuItem value="CURRENT">Current</MenuItem>
                  <MenuItem value="BUSINESS">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveAccount} variant="contained">
            {editingAccount ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorBankDetails;
