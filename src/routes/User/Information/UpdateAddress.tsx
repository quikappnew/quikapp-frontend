import { useMutation } from '@apollo/client';
import { gql } from '__generated__';
import { AddressType } from '__generated__/graphql';
import { FC } from 'react';

import Columns from 'components/Columns';
import { FormInput, FormPanelWithReadMode } from 'components/FormPanel';

import countries from 'utils/countries-enum.json';

const UPDATE_ADDRESS_MUTATION = gql(`
  mutation UpdateAddress(
    $id: ID!
    $line1: String!
    $line2: String
    $city: String!
    $postalCode: String!
    $state: String!
    $country: String!
  ) {
    updateAddress(
      id: $id
      line1: $line1
      line2: $line2
      city: $city
      postalCode: $postalCode
      state: $state
      country: $country
    ) {
      id
      line1
      line2
      city
      state
      postalCode
      country
    }
  }
`);

const UpdateAddress: FC<{ address: AddressType }> = ({ address }) => {
  const [updateAddress, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_ADDRESS_MUTATION);

  return (
    <FormPanelWithReadMode
      loading={updateLoading}
      error={updateError}
      onSubmit={data => {
        updateAddress({
          variables: {
            id: address.id,
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            postalCode: data.postalCode,
            state: data.state,
            country: data.country,
          },
        });
      }}
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
