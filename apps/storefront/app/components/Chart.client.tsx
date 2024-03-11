import { useEffect } from 'react';

import { generateOrgChart } from '@digdir/organisation-chart';
import '@digdir/organisation-chart/dist/index.css';

import data from '../data/data.json';

export const Chart = () => {
  useEffect(() => {
    generateOrgChart(data, 'chart');
    console.log('running');
  }, []);

  return (
    <div
      id='chart'
      style={{ width: '100%' }}
    />
  );
};
