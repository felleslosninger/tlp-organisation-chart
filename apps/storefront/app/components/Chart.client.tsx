import { useEffect } from 'react';
import { Button } from '@digdir/designsystemet-react';

import { generateOrgChart } from '@digdir/organisation-chart';
import '@digdir/organisation-chart/dist/index.css';

import data from '../data/data.json';

export const Chart = () => {
  useEffect(() => {
    generateOrgChart(data, 'chart');
    console.log('running');
  }, []);

  return (
    <>
      <Button>Button</Button>
      <div id='chart'></div>
    </>
  );
};
