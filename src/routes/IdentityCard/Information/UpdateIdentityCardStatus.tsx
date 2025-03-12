import { useMutation } from '@apollo/client';
import { gql } from '__generated__';
import { IdentityCardStatusEnumType } from '__generated__/graphql';
import { FC } from 'react';

import { FormInput, FormPanelWithReadMode } from 'components/FormPanel';

const UPDATE_IDENTITY_CARD_MUTATION = gql(`
  mutation UpdateIdentityCardStatus($id: ID!, $status: IdentityCardStatusEnumType!) {
    updateIdentityCardStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`);

const UpdateIdentityCardStatus: FC<{
  id: string;
  status: IdentityCardStatusEnumType;
}> = ({ id, status }) => {
  const [updateIdentityCard, { loading, error }] = useMutation(UPDATE_IDENTITY_CARD_MUTATION);

  return (
    <FormPanelWithReadMode
      loading={loading}
      error={error}
      onSubmit={data => {
        updateIdentityCard({
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
        statusOptions={[
          IdentityCardStatusEnumType.Active,
          IdentityCardStatusEnumType.Inactive,
          IdentityCardStatusEnumType.PendingPrinting,
        ]}
      />
    </FormPanelWithReadMode>
  );
};

export default UpdateIdentityCardStatus;
