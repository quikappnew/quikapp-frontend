import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Columns from '../components/Columns';
import ErrorMessage from '../components/ErrorMessage';
import { FormInput, FormPanel } from '../components/FormPanel';
import LoadingIndicator from '../components/LoadingIndicator';
import Navbar from '../components/Navbar';
import { createUser, getProvinces } from '../services/api';
import { ApiError, Province } from '../types/api';

import countries from '../utils/countries-enum.json';

const CreateUserPage: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<ApiError | undefined>(undefined);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const data = await getProvinces();
        setProvinces(data);
        setError(undefined);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage error={error} onRetry={() => navigate(0)} />;
  if (!provinces.length) return <ErrorMessage error={{ message: 'No provinces found', code: 404, status: 'Not Found' }} />;

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
        onSubmit={async data => {
          try {
            setCreateLoading(true);
            await createUser({
              provinceId: data.provinceId,
              firstName: data.firstName,
              lastName: data.lastName,
              gender: data.gender,
              dateOfBirth: dayjs(data.dateOfBirth).format('YYYY-MM-DD'),
              nationality: data.nationality,
              provinceOfOrigin: data.provinceOfOrigin,
              category: data.category,
              photo: data.photo,
              address: {
                line1: data.line1,
                line2: data.line2,
                city: data.city,
                state: data.state,
                country: data.country,
                postalCode: data.postalCode,
              },
            });
            navigate('/users');
          } catch (err) {
            setCreateError(err as ApiError);
          } finally {
            setCreateLoading(false);
          }
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
            options={Object.keys(countries).map(key => ({
              value: key,
              label: countries[key],
            }))}
            validators={{
              required: true,
            }}
          />
          <FormInput
            fullWidth
            type="string"
            fieldName="provinceOfOrigin"
            label="Province of Origin"
            defaultValue={''}
          />
        </Columns>
        <FormInput
          fullWidth
          type="upload"
          fieldName="photo"
          label="Photo"
          defaultValue={''}
        />
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
        <Columns number={2}>
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
        </Columns>
        <Columns number={2}>
          <FormInput
            fullWidth
            type="select"
            fieldName="country"
            label="Country"
            defaultValue={'PAPUA_NEW_GUINEA'}
            options={Object.keys(countries).map(key => ({
              value: key,
              label: countries[key],
            }))}
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
      </FormPanel>
    </div>
  );
};

export default CreateUserPage;
