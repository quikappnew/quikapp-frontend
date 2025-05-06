import EditorJS, { BlockToolConstructable, OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import { default as List } from '@editorjs/list';
import { FC, useId, useRef } from 'react';
import { useEffect, useState } from 'react';

import theme from './theme.module.scss';

const Editor = ({
  id,
  editorRef,
  prevData,
  readOnly,
  onChange,
}: {
  id: string;
  editorRef: React.MutableRefObject<EditorJS | null>;
  prevData?: OutputData | undefined;
  readOnly?: boolean;
  onChange?: (OutputData) => void;
}) => {
  const [editor, setEditor] = useState<EditorJS | null>(null);

  useEffect(() => {
    setEditor(prevEditor => {
      if (prevEditor) return null;

      return new EditorJS({
        holder: `editor${id}`,
        readOnly,
        tools: {
          header: Header,
          list: {
            class: List as unknown as BlockToolConstructable,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered',
            },
          },
        },
        data: prevData,
        onReady: () => {
          editorRef.current = editor;
        },
        onChange: async api => {
          const data = await api.saver.save();
          if (onChange) onChange(data);
        },
      });
    });
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id={`editor${id}`} className={theme.container}></div>;
};

type TextEditorProps = {
  prevData?: OutputData;
  readOnly?: boolean;
  onChange?: (OutputData) => void;
};

const TextEditor: FC<TextEditorProps> = ({ prevData, readOnly, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const id = useId();

  return (
    <Editor
      id={id}
      editorRef={editorRef}
      prevData={prevData}
      readOnly={readOnly}
      onChange={data => {
        if (onChange) onChange(data);
      }}
    />
  );
};

export default TextEditor;
