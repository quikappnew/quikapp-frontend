import { useMutation } from '@apollo/client';
import { gql } from '__generated__';
import { UserType } from '__generated__/graphql';
import dayjs from 'dayjs';
import { FC } from 'react';

import Columns from 'components/Columns';
import { FormInput, FormPanelWithReadMode } from 'components/FormPanel';

import countries from 'utils/countries-enum.json';

const UPDATE_USER_MUTATION = gql(`
  mutation UpdateUser(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $email: String
    $phoneNumber: String!
    $dateOfBirth: String!
    $gender: GenderEnumType!
    $nationality: NationalityEnumType!
    $provinceOfOrigin: String
    $category: CategoryEnumType!
    $photo: Upload
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      phoneNumber: $phoneNumber
      gender: $gender
      dateOfBirth: $dateOfBirth
      nationality: $nationality
      category: $category
      provinceOfOrigin: $provinceOfOrigin
      photo: $photo
    ) {
      id
      firstName
      lastName
      email
      phoneNumber
      gender
      dateOfBirth
      nationality
      category
      provinceOfOrigin
      photo
    }
  }
`);

const UpdateUser: FC<{ user: UserType }> = ({ user }) => {
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION);

  return (
    <FormPanelWithReadMode
      loading={loading}
      error={error}
      onSubmit={data => {
        updateUser({
          variables: {
            id: user.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            dateOfBirth: dayjs(data.dateOfBirth).format('YYYY-MM-DDTHH:mm:ssZ'),
            nationality: data.nationality,
            category: data.category,
            provinceOfOrigin: data.provinceOfOrigin,
            ...(data.photo instanceof File ? { photo: data.photo } : {}),
          },
        });
      }}
      title="User Information"
    >
      <Columns number={3} bordered>
        <FormInput
          fullWidth
          type="string"
          fieldName="firstName"
          label="First Name"
          defaultValue={user.firstName}
          validators={{
            required: true,
          }}
        />
        <FormInput
          fullWidth
          type="string"
          fieldName="middleName"
          label="Middle Name"
          defaultValue={user.middleName || ''}
        />
        <FormInput
          fullWidth
          type="string"
          fieldName="lastName"
          label="Last Name"
          defaultValue={user.lastName}
          validators={{
            required: true,
          }}
        />
      </Columns>

      <Columns number={2} bordered>
        <FormInput
          fullWidth
          type="select"
          fieldName="gender"
          label="Gender"
          defaultValue={user.gender}
          options={[
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
            { value: 'OTHER', label: 'Other' },
          ]}
          validators={{
            required: true,
          }}
        />
        <FormInput
          fullWidth
          type="date"
          fieldName="dateOfBirth"
          label="Date of Birth"
          defaultValue={user.dateOfBirth}
          validators={{
            required: true,
          }}
        />
      </Columns>
      <Columns number={2} bordered>
        <FormInput
          fullWidth
          type="string"
          fieldName="email"
          label="Email"
          defaultValue={user.email}
        />
        <FormInput
          fullWidth
          type="string"
          fieldName="phoneNumber"
          label="Phone Number"
          defaultValue={user.phoneNumber || ''}
        />
      </Columns>
      <Columns number={2} bordered>
        <FormInput
          fullWidth
          type="select"
          fieldName="nationality"
          label="Nationality"
          defaultValue={user.nationality || 'PAPUA_NEW_GUINEA'}
          options={
            Object.keys(countries).map(key => ({
              value: key,
              label: countries[key],
            })) as { value: string; label: string }[]
          }
          validators={{
            required: true,
          }}
        />
        <FormInput
          fullWidth
          type="select"
          fieldName="category"
          label="Category"
          defaultValue={user.category}
          options={[
            {
              label: 'NC',
              value: 'NON_CITIZEN',
            },
            {
              label: 'PS',
              value: 'PUBLIC_SERVANT',
            },
            {
              label: 'MP',
              value: 'MEMBER_OF_PARLIAMENT',
            },
          ]}
          validators={{
            required: true,
          }}
        />
      </Columns>
      <Columns number={2} bordered>
        <FormInput
          fullWidth
          type="upload"
          fieldName="photo"
          label="Photo"
          defaultValue={user.photo}
        />
        <FormInput
          fullWidth
          type="string"
          fieldName="provinceOfOrigin"
          label="Province Of Origin"
          defaultValue={user.provinceOfOrigin || ''}
        />
      </Columns>
    </FormPanelWithReadMode>
  );
};

export default UpdateUser;
