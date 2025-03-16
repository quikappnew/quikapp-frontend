import { FC, useState } from 'react';
import { Address } from '../../../types/api';
import { updateAddress } from '../../../services/api';
import Columns from '../../../components/Columns';
import { FormInput, FormPanelWithReadMode } from '../../../components/FormPanel';
import countries from '../../../utils/countries-enum.json';

interface UpdateAddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const UpdateAddress: FC<{ address: Address }> = ({ address }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (data: UpdateAddressData) => {
    try {
      setLoading(true);
      setError(null);
      await updateAddress(address.id, data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPanelWithReadMode
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      title="Address"
    >
      <FormInput
        fieldName="line1"
        type="string"
        fullWidth
        defaultValue={address.line1}
        label="Line 1"
        validators={{
          required: true,
        }}
      />
      <FormInput
        fieldName="line2"
        type="string"
        fullWidth
        defaultValue={address.line2 || ''}
        label="Line 2"
      />
      <Columns number={2} bordered>
        <FormInput
          fieldName="city"
          type="string"
          fullWidth
          defaultValue={address.city}
          label="City"
          validators={{
            required: true,
          }}
        />
        <FormInput
          fieldName="state"
          type="string"
          fullWidth
          defaultValue={address.state}
          label="State"
          validators={{
            required: true,
          }}
        />
      </Columns>
      <Columns number={2} bordered>
        <FormInput
          fieldName="postalCode"
          type="string"
          fullWidth
          defaultValue={address.postalCode || ''}
          label="Postal Code"
          validators={{
            required: true,
          }}
        />
        <FormInput
          fieldName="country"
          type="select"
          fullWidth
          defaultValue={address.country || 'PG'}
          label="Country"
          options={Object.keys(countries).map(country => ({
            label: countries[country],
            value: country,
          }))}
          validators={{
            required: true,
          }}
        />
      </Columns>
    </FormPanelWithReadMode>
  );
};

export default UpdateAddress;
