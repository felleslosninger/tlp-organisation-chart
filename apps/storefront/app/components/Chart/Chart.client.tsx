import { useEffect } from 'react';

import { generateOrgChart } from '@digdir/organisation-chart';
import '@digdir/organisation-chart/dist/index.css';

import data from '../../data/data.json';

import classes from './Chart.module.css';

export const Chart = () => {
  useEffect(() => {
    generateOrgChart(data, 'chart');
  }, []);

  return (
    <div className={classes.wrapper}>
      <div id='chart' />
    </div>
  );
};
