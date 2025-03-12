import { gql, useMutation } from '@apollo/client';
import { FC } from 'react';
import { useParams } from 'react-router';

import ConfirmButton from 'components/ConfirmButton';

type RemoveUserMutationResponse = {
  removeUser: {
    id: string;
  };
};

type RemoveUserMutationVariables = {
  id: string;
};

const REMOVE_USER_MUTATION = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id) {
      id
    }
  }
`;

const RemoveUserDialogButton: FC<{ id: string; onComplete: () => void }> = ({ id, onComplete }) => {
  const { provinceId } = useParams<{ provinceId: string }>();

  const [removeUser, { loading, error }] = useMutation<
    RemoveUserMutationResponse,
    RemoveUserMutationVariables
  >(REMOVE_USER_MUTATION, {
    variables: {
      id,
    },
    update(cache, { data }) {
      if (!data) return;
      const { removeUser } = data;
      cache.modify({
        id: `ProvinceType:${provinceId}`,
        fields: {
          users(existingUsersRef, { readField }) {
            return existingUsersRef.filter(userRef => removeUser.id !== readField('id', userRef));
          },
        },
      });
    },
    onCompleted: onComplete,
  });

  return (
    <ConfirmButton onConfirm={removeUser} loading={loading} error={error}>
      Remove User
    </ConfirmButton>
  );
};

export default RemoveUserDialogButton;
