import { useEffect } from 'react';

import { NativeSelect } from '@digdir/designsystemet-react';

import { generateOrgChart } from '@digdir/organisation-chart';
import '@digdir/organisation-chart/dist/index.css';

import data from '../../data/avdelinger-og-seksjoner.json';

import classes from './Chart.module.css';

export const Chart = () => {
  useEffect(() => {
    generateOrgChart(data, 'chart');
  }, []);

  return (
    <>
      <NativeSelect label='Velg ett kart'>
        <option value='1'>Avdelinger og seksjoner</option>
        <option value='2'>Leveranseområder</option>
      </NativeSelect>
      <p></p>
      <div className={classes.wrapper}>
        <div id='chart' />
      </div>
    </>
  );
};
