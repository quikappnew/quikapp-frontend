import { useMutation } from '@apollo/client';
import { gql } from '__generated__';
import { UserStatusEnumType } from '__generated__/graphql';
import { FC } from 'react';

import { FormInput, FormPanelWithReadMode } from 'components/FormPanel';

const UPDATE_USER_MUTATION = gql(`
  mutation UpdateUserStatus($id: ID!, $status: UserStatusEnumType!) {
    updateUserStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`);

const UpdateUserStatus: FC<{
  id: string;
  status: UserStatusEnumType;
}> = ({ id, status }) => {
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION);

  return (
    <FormPanelWithReadMode
      loading={loading}
      error={error}
      onSubmit={data => {
        updateUser({
          variables: {
            id,
            status: data.status,
          },
        });
      }}
      title="Status"
    >
      <FormInput
        type="status_select"
        fieldName="status"
        label="Status"
        defaultValue={status}
        statusOptions={[UserStatusEnumType.Active, UserStatusEnumType.Inactive]}
      />
    </FormPanelWithReadMode>
  );
};

export default UpdateUserStatus;
