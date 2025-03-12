import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { FC, useState } from 'react';

import { FormInput, FormPanel } from 'components/FormPanel';

const AuthenticateForDocumentDialog: FC<{
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}> = ({ open, onSuccess, onClose }) => {
  const [error, setError] = useState<any | null>(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Authenticate for Document</DialogTitle>
      <DialogContent>
        <FormPanel
          loading={false}
          error={error}
          onCancel={onClose}
          onSubmit={data => {
            setError(null);
            if (data.pin === '1234') {
              onSuccess();
            } else {
              const err = {
                graphQLErrors: [
                  {
                    extensions: {
                      code: 'BAD_USER_INPUT',
                    },
                    message: 'Invalid file number or PIN',
                  },
                ],
              };
              setError(err);
            }
          }}
        >
          <FormInput fullWidth type="password" fieldName="pin" label="PIN" defaultValue={''} />
        </FormPanel>
      </DialogContent>
    </Dialog>
  );
};

export default AuthenticateForDocumentDialog;
