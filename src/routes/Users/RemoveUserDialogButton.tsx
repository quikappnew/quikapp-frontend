import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ConfirmButton from '../../components/ConfirmButton';
import { deleteUser } from '../../services/api';
import { ApiError } from '../../types/api';

interface Props {
  id: string;
  onComplete: () => void;
}

const RemoveUserDialogButton: FC<Props> = ({ id, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const navigate = useNavigate();

  const handleRemoveUser = async () => {
    try {
      setLoading(true);
      await deleteUser(id);
      onComplete();
      navigate('/users');
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmButton
      onConfirm={handleRemoveUser}
      loading={loading}
      error={error}
      title="Remove User"
      description="Are you sure you want to remove this user? This action cannot be undone."
      buttonText="Remove User"
      color="error"
    />
  );
};

export default RemoveUserDialogButton;
