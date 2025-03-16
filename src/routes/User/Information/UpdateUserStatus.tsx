import { FC, useState } from 'react';
import { UserStatusEnum } from '../../../types/api';
import { updateUserStatus } from '../../../services/api';
import { FormInput, FormPanelWithReadMode } from '../../../components/FormPanel';

interface UpdateUserStatusProps {
  id: string;
  status: UserStatusEnum;
}

const UpdateUserStatus: FC<UpdateUserStatusProps> = ({ id, status }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (data: { status: UserStatusEnum }) => {
    try {
      setLoading(true);
      setError(null);
      await updateUserStatus(id, data.status);
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
      title="Status"
    >
      <FormInput
        type="status_select"
        fieldName="status"
        label="Status"
        defaultValue={status}
        statusOptions={[UserStatusEnum.ACTIVE, UserStatusEnum.INACTIVE]}
      />
    </FormPanelWithReadMode>
  );
};

export default UpdateUserStatus;
