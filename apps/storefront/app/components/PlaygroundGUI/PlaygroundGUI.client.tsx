import React, { useEffect, useState } from 'react';
import { generateOrgChart } from '@digdir/organisation-chart';
import '@digdir/organisation-chart/dist/index.css';
import { Button } from '@digdir/designsystemet-react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import styles from './PlaygroundGUI.module.css';

const INITIALDATA = {
  meta: {
    title: 'Test',
    langcode: 'no',
  },
  toc: [
    { title: 'Root', color: '#0062BA' },
    { title: 'Item', color: '#1e2b3c' },
  ],
  nodes: [
    {
      title: 'Root',
      id: 'root',
      backgroundColor: '#0062BA',
      textColor: '#1e2b3c',
    },
    {
      title: 'Item',
      id: 'item1',
      backgroundColor: '#1e2b3c',
      textColor: 'white',
      url: 'https://www.digdir.no/',
    },
  ],
  layouts: {
    main: {
      rows: [
        {
          row: [
            {
              id: ['root'],
              alignment: 'center',
              component: {
                type: 'root',
                children: ['item1'],
              },
            },
          ],
        },
        {
          row: [
            {
              id: ['item1'],
            },
          ],
        },
      ],
    },
  },
};

export default function PlaygroundGUI() {
  const [data, setData] = useState(INITIALDATA);
  const [editorData, setEditorData] = useState(data);

  useEffect(() => {
    generateOrgChart(data, 'chart');
  }, [data]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorData(JSON.parse(e.target.value));
  };

  const handleGenerateChart = () => {
    setData(editorData);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.editor}>
        <div className={styles.input}>
          <CodeEditor
            value={JSON.stringify(editorData, null, 2)}
            language='json'
            placeholder='Please enter JSON code.'
            padding={0}
            minHeight={800}
            onChange={handleCodeChange}
            style={{
              borderRadius: '4px',
              fontSize: 16,
              fontFamily:
                'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
          />
        </div>
        <Button
          color='first'
          size='medium'
          variant='primary'
          onClick={handleGenerateChart}
        >
          Generer organisasjonskart
        </Button>
      </div>
      <div className={styles.chart}>
        <div id='chart' />
      </div>
    </div>
  );
}
