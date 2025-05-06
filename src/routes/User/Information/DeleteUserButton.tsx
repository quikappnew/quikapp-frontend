import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmButton from '../../../components/ConfirmButton';
import { deleteUser } from '../../../services/api';
import { ApiError } from '../../../types/api';

const DeleteUserButton: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | undefined>(undefined);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(undefined);
      await deleteUser(id);
      navigate('/users');
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmButton
      onConfirm={handleDelete}
      loading={loading}
      error={error}
      title="Delete User"
      description="This will delete all data concerning this user. This action cannot be undone."
      buttonText="Delete"
      color="error"
    />
  );
};

export default DeleteUserButton;
