import { OutputData } from '@editorjs/editorjs';
import { FC } from 'react';

import TextEditor from '.';

const TextEditorFormInput: FC<{
  onChange: (data: OutputData) => void;
  value?: OutputData;
}> = ({ onChange, value }) => {
  return (
    <>
      <TextEditor
        onChange={data => {
          onChange(data);
        }}
        prevData={value}
      />
    </>
  );
};

export default TextEditorFormInput;
