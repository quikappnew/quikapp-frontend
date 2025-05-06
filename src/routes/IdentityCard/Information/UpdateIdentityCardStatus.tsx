import { FC } from 'react';
import { useState } from 'react';

import { FormInput, FormPanelWithReadMode } from 'components/FormPanel';
import { updateIdentityCardStatus } from 'services/api';
import { IdentityCardStatusEnum } from 'types/api';

interface Props {
  id: string;
  status: IdentityCardStatusEnum;
}

const UpdateIdentityCardStatus: FC<Props> = ({ id, status }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (values: { status: IdentityCardStatusEnum }) => {
    setLoading(true);
    setError(null);
    try {
      await updateIdentityCardStatus(id, values.status);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPanelWithReadMode
      title="Update Status"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <FormInput
        fieldName="status"
        label="Status"
        type="status_select"
        defaultValue={status}
        statusOptions={Object.values(IdentityCardStatusEnum)}
      />
    </FormPanelWithReadMode>
  );
};

export default UpdateIdentityCardStatus;
