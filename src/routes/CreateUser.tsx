import { gql, useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import Columns from 'components/Columns';
import ErrorMessage from 'components/ErrorMessage';
import { FormInput, FormPanel } from 'components/FormPanel';
import LoadingIndicator from 'components/LoadingIndicator';
import Navbar from 'components/Navbar';

import countries from 'utils/countries-enum.json';

const USER_FRAGMENT = gql`
  fragment UserFragmentCreateUserNew on UserType {
    id
    province {
      id
      name
    }
    firstName
    lastName
    fullName
    gender
    dateOfBirth
    nationality
    provinceOfOrigin
    address {
      line1
      line2
      city
      state
      postalCode
      country
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation CreateUser(
    $provinceId: ID!
    $firstName: String!
    $lastName: String!
    $gender: GenderEnumType!
    $dateOfBirth: String!
    $nationality: NationalityEnumType!
    $provinceOfOrigin: String
    $category: CategoryEnumType!
    $photo: Upload
    $line1: String!
    $line2: String
    $city: String!
    $state: String!
    $country: String!
    $postalCode: String!
  ) {
    createUser(
      provinceId: $provinceId
      firstName: $firstName
      lastName: $lastName
      gender: $gender
      dateOfBirth: $dateOfBirth
      nationality: $nationality
      provinceOfOrigin: $provinceOfOrigin
      category: $category
      photo: $photo
      line1: $line1
      line2: $line2
      city: $city
      state: $state
      country: $country
      postalCode: $postalCode
    ) {
      ...UserFragmentCreateUserNew
    }
  }
`;

const PROVINCES_QUERY = gql`
  query ProvincesNew {
    provinces {
      id
      name
    }
  }
`;

const CreateUserPage: FC = () => {
  const navigate = useNavigate();

  const {
    data: provincesData,
    loading: provincesLoading,
    error: provincesError,
  } = useQuery(PROVINCES_QUERY);

  const [createUser, { loading: createLoading, error: createError }] = useMutation(
    CREATE_USER_MUTATION,
    {
      refetchQueries: ['AdministrationUsers'],
      onCompleted: () => {
        window.location.href = '/users';
      },
    }
  );

  if (provincesLoading) return <LoadingIndicator />;
  if (provincesError || !provincesData || !provincesData.provinces)
    return <ErrorMessage error={provincesError} />;

  const provinces = provincesData.provinces;

  return (
    <div className="max-w-3xl mx-auto mt-4 px-4">
      <Navbar
        title="Add Person"
        subTitle="Add a new person to the system and manage their personal information"
        onBackButtonClick={() => {
          navigate('/users');
        }}
      />
      <FormPanel
        loading={createLoading}
        error={createError}
        onSubmit={data => {
          createUser({
            variables: {
              provinceId: data.provinceId,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              password: data.password,
              gender: data.gender,
              dateOfBirth: dayjs(data.dateOfBirth),
              nationality: data.nationality,
              provinceOfOrigin: data.provinceOfOrigin,
              category: data.category,
              photo: data.photo || null,
              line1: data.line1,
              line2: data.line2,
              city: data.city,
              state: data.state,
              country: data.country,
              postalCode: data.postalCode,
            },
          }).then(() => {
            // Handle navigation after success
            // You might want to add react-router navigation here
          });
        }}
        submitButtonLabel="Create"
      >
        <Columns number={2}>
          <FormInput
            fullWidth
            type="select"
            fieldName="provinceId"
            label="Province"
            defaultValue={provinces[0].id}
            options={provinces.map(province => ({
              value: province.id,
              label: province.name,
            }))}
            validators={{
              required: true,
            }}
          />
          <FormInput
            fullWidth
            type="select"
            fieldName="category"
            label="Category"
            defaultValue={'NON_CITIZEN'}
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
        <FormInput
          fullWidth
          type="string"
          fieldName="firstName"
          label="First Name"
          defaultValue={''}
          validators={{
            required: true,
          }}
        />
        <FormInput
          fullWidth
          type="string"
          fieldName="lastName"
          label="Last Name"
          defaultValue={''}
          validators={{
            required: true,
          }}
        />
        <Columns number={2}>
          <FormInput
            fullWidth
            type="select"
            fieldName="gender"
            label="Gender"
            defaultValue={''}
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
            defaultValue={''}
            validators={{
              required: true,
            }}
          />
        </Columns>
        <Columns number={2}>
          <FormInput
            fullWidth
            type="select"
            fieldName="nationality"
            label="Nationality"
            defaultValue={'PAPUA_NEW_GUINEA'}
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
            type="string"
            fieldName="provinceOfOrigin"
            label="Province Of Origin"
            defaultValue={''}
          />
        </Columns>
        <FormInput fullWidth type="upload" fieldName="photo" label="Photo" defaultValue={''} />
        <FormInput
          fullWidth
          type="string"
          fieldName="line1"
          label="Address Line 1"
          defaultValue={''}
          validators={{
            required: true,
          }}
        />
        <FormInput
          fullWidth
          type="string"
          fieldName="line2"
          label="Address Line 2"
          defaultValue={''}
        />
        <FormInput
          fullWidth
          type="string"
          fieldName="city"
          label="City"
          defaultValue={''}
          validators={{
            required: true,
          }}
        />
        <Columns number={2}>
          <FormInput
            fullWidth
            type="string"
            fieldName="state"
            label="State/Province"
            defaultValue={''}
            validators={{
              required: true,
            }}
          />
          <FormInput
            fullWidth
            type="string"
            fieldName="postalCode"
            label="Postal Code"
            defaultValue={''}
            validators={{
              required: true,
            }}
          />
        </Columns>
        <FormInput
          fullWidth
          type="select"
          fieldName="country"
          label="Country"
          defaultValue={'PAPUA_NEW_GUINEA'}
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
      </FormPanel>
    </div>
  );
};

export default CreateUserPage;
