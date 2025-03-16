import { FC, useState } from 'react';
import dayjs from 'dayjs';
import { User } from '../../../types/api';
import { updateUser } from '../../../services/api';
import Columns from '../../../components/Columns';
import { FormInput, FormPanelWithReadMode } from '../../../components/FormPanel';
import countries from '../../../utils/countries-enum.json';

interface UpdateUserData {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  category: string;
  provinceOfOrigin?: string;
  photo?: File;
}

const UpdateUser: FC<{ user: User }> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (data: UpdateUserData) => {
    try {
      setLoading(true);
      setError(null);
      await updateUser(user.id, {
        ...data,
        dateOfBirth: dayjs(data.dateOfBirth).format('YYYY-MM-DDTHH:mm:ssZ'),
      });
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
      title="User Information"
    >
      <Columns number={2} bordered>
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
