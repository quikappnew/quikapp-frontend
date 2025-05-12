import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Chip,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import SidebarLayout from 'layouts/SidebarLayout';
import { getVendors, vehicleOnboarding } from 'services/api';
import { useNavigate } from 'react-router-dom';
import SelectInput from 'react-select';

const initialState = {
  vehicle_number: '',
  chassis_number: '',
  vehicle_owner: '',
  vendor_id: '',
  truck_length_feet: '',
  registration_date: '',
  fitness_certificate_expiry: '',
  tax_expiry_date: '',
  insurance_expiry_date: '',
  national_permit_validity: '',
};

const fileFields = [
  { name: 'fitness_certificate_file', label: 'Fitness Certificate File', required: true },
  { name: 'tax_certificate_file', label: 'Tax Certificate File', required: true },
  { name: 'insurance_file', label: 'Insurance File', required: true },
  { name: 'national_permit_file', label: 'National Permit File', required: true },
  { name: 'rc_documents_file', label: 'RC Documents File', required: true },
  { name: 'pucc_file', label: 'PUCC File', required: true },
];

const VehicleOnboardingForm = () => {
  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendorOptions, setVendorOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles({ ...files, [e.target.name]: e.target.files?.[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    Object.entries(files).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(key, file);
      }
    });

    try {
      await vehicleOnboarding(formData);
      setSuccess(true);
      setForm(initialState);
      setFiles({});
      navigate('/vehicle-onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to onboard vehicle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (form.vehicle_owner === '1') {
      setIsLoadingVendors(true);
      getVendors().then(res => {
        setVendorOptions(
          (res.data || []).map(v => ({ value: v.id, label: v.name }))
        );
      }).finally(() => setIsLoadingVendors(false));
    }
  }, [form.vehicle_owner]);

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: 'auto',
        my: 4,
        p: { xs: 2, sm: 4 },
        background: '#fff',
        borderRadius: 4,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
      }}
    >
    
      <h4 className="text-xl font-bold mb-8 text-gray-500">Vehicle Onboarding</h4>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Vehicle onboarded successfully!</Alert>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField {...{
              label: "Vehicle Number",
              name: "vehicle_number",
              value: form.vehicle_number,
              onChange: handleChange,
              fullWidth: true,
              required: true,
              sx: { borderRadius: 2, background: '#fafbfc' },
              InputProps: { style: { borderRadius: 6 } },
            }} />
          </Grid>
          <Grid item xs={6}>
            <TextField {...{
              label: "Chassis Number ",
              name: "chassis_number",
              value: form.chassis_number,
              onChange: handleChange,
              fullWidth: true,
              required: true,
              sx: { borderRadius: 2, background: '#fafbfc' },
              InputProps: { style: { borderRadius: 6 } },
            }} />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required sx={{ borderRadius: 2, background: '#fafbfc' }}>
              <InputLabel id="vehicle-owner-label">Vehicle Owner</InputLabel>
              <Select
                labelId="vehicle-owner-label"
                id="vehicle_owner"
                name="vehicle_owner"
                value={form.vehicle_owner}
                label="Vehicle Owner"
                onChange={handleSelectChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="0">Own fleet</MenuItem>
                <MenuItem value="1">Vendor fleet</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {form.vehicle_owner === '1' && (
            <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: '-10px', position: 'relative'  }}>
              <InputLabel sx={{ fontWeight: 600, mb: 0.5, ml: '2px' }}>Vendor</InputLabel>
              <Box sx={{
                background: '#fafbfc',
                borderRadius: 1.5,
                border: '1px solid #c4c4c4',
                height: 40,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                p: 0,
                position: 'absolute',
              }}>
                <SelectInput
                  options={vendorOptions}
                  value={vendorOptions.find(opt => opt.value === form.vendor_id) || null}
                  onChange={option => setForm(f => ({ ...f, vendor_id: option ? option.value : '' }))}
                  isLoading={isLoadingVendors}
                  placeholder="Search and select vendor..."
                  isClearable
                  menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: 38,
                      height: 38,
                      border: 'none',
                      boxShadow: 'none',
                      background: 'transparent',
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      height: 38,
                      padding: '0 8px',
                    }),
                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: 38,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  theme={theme => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                      ...theme.colors,
                      primary25: '#e3f2fd',
                      primary: '#1976d2',
                    },
                  })}
                />
              </Box>
            </Grid>
          )}
          <Grid item xs={6}>
            <FormControl fullWidth required sx={{ borderRadius: 2, background: '#fafbfc' }}>
              <InputLabel id="truck-length-label">Truck Length (feet)</InputLabel>
              <Select
                labelId="truck-length-label"
                id="truck_length_feet"
                name="truck_length_feet"
                value={form.truck_length_feet}
                label="Truck Length (feet)"
                onChange={handleSelectChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="7ft">7 Feet</MenuItem>
                <MenuItem value="8ft">8 Feet</MenuItem>
                <MenuItem value="10ft">10 Feet</MenuItem>
                <MenuItem value="14ft">14 Feet</MenuItem>
                <MenuItem value="17ft">17 Feet</MenuItem>
                <MenuItem value="20ft">20 Feet</MenuItem>
                <MenuItem value="22ft">22 Feet</MenuItem>
                <MenuItem value="24ft">24 Feet</MenuItem>
                <MenuItem value="32ft">32 Feet</MenuItem>
                <MenuItem value="40ft">40 Feet</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField {...{
              label: "Registration Date ",
              name: "registration_date",
              type: "date",
              value: form.registration_date,
              onChange: handleChange,
              fullWidth: true,
              required: true,
              InputLabelProps: { shrink: true },
              sx: { borderRadius: 2, background: '#fafbfc' },
              InputProps: { style: { borderRadius: 6 } },
            }} />
          </Grid>
          <Grid item xs={6}>
            <TextField {...{
              label: "Fitness Certificate Expiry ",
              name: "fitness_certificate_expiry",
              type: "date",
              value: form.fitness_certificate_expiry,
              onChange: handleChange,
              fullWidth: true,
              required: true,
              InputLabelProps: { shrink: true },
              sx: { borderRadius: 2, background: '#fafbfc' },
              InputProps: { style: { borderRadius: 6 } },
            }} />
          </Grid>
          <Grid item xs={6}>
            <TextField {...{
              label: "Tax Expiry Date ",
              name: "tax_expiry_date",
              type: "date",
              value: form.tax_expiry_date,
              onChange: handleChange,
              fullWidth: true,
              required: true,
              InputLabelProps: { shrink: true },
              sx: { borderRadius: 2, background: '#fafbfc' },
              InputProps: { style: { borderRadius: 6 } },
            }} />
          </Grid>
          <Grid item xs={6}>
            <TextField {...{
              label: "Insurance Expiry Date ",
              name: "insurance_expiry_date",
              type: "date",
              value: form.insurance_expiry_date,
              onChange: handleChange,
              fullWidth: true,
              required: true,
              InputLabelProps: { shrink: true },
              sx: { borderRadius: 2, background: '#fafbfc' },
              InputProps: { style: { borderRadius: 6 } },
            }} />
          </Grid>
          <Grid item xs={6}>
            <TextField {...{
              label: "National Permit Validity ",
              name: "national_permit_validity",
              type: "date",
              value: form.national_permit_validity,
              onChange: handleChange,
              fullWidth: true,
              required: true,
              InputLabelProps: { shrink: true },
              sx: { borderRadius: 2, background: '#fafbfc' },
              InputProps: { style: { borderRadius: 6 } },
            }} />
          </Grid>
          {/* File Uploads */}
          {fileFields.map((field) => (
            <Grid item xs={6} key={field.name}>
              <InputLabel sx={{ fontWeight: 600, mb: 1 }}>{field.label} {field.required ? '*' : ''}</InputLabel>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  color: '#ff9800',
                  borderColor: '#ff9800',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  '&:hover': { borderColor: '#fb8c00', background: '#fff3e0' },
                }}
                fullWidth={false}
              >
                Choose File
                <input type="file" name={field.name} hidden onChange={handleFileChange} required />
              </Button>
              <Typography variant="body2" sx={{ ml: 2, display: 'inline', color: '#888' }}>
                {files[field.name]?.name ? files[field.name].name : 'No file chosen'}
              </Typography>
            </Grid>
          ))}
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                color: '#fff',
                borderRadius: 3,
                boxShadow: 2,
                '&:hover': {
                  background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
                },
              }}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default VehicleOnboardingForm;