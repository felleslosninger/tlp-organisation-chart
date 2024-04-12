import React, { useEffect, useState } from 'react';
import { generateOrgChart } from '@digdir/organisation-chart';
import '@digdir/organisation-chart/dist/index.css';
import { Button } from '@digdir/designsystemet-react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import styles from './PlaygroundGUI.module.css';
import INITIALDATA from '../../data/short.json';

export default function PlaygroundGUI() {
  const [data, setData] = useState(INITIALDATA);
  const [editorData, setEditorData] = useState(data);

  useEffect(() => {
    generateOrgChart(data, 'chart');
  }, [data]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      setEditorData(JSON.parse(e.target.value));
    } catch (error) {
      return;
    }
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
