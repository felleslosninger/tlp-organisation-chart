import { useEffect, useState } from 'react';

import { NativeSelect } from '@digdir/designsystemet-react';

import { generateOrgChart } from '@digdir/organisation-chart';
import '@digdir/organisation-chart/dist/index.css';

import avdelinger from '../../data/avdelinger-og-seksjoner.json';
import leveranseomrader from '../../data/leveranseomrader.json';

import classes from './Chart.module.css';

export const Chart = () => {
  const [data, setData] = useState(avdelinger);
  useEffect(() => {
    generateOrgChart(data, 'chart');
  }, [data]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === '1') {
      setData(avdelinger);
    } else if (value === '2') {
      setData(leveranseomrader);
    }
  };

  return (
    <>
      <div className={classes.select}>
        <NativeSelect
          label='Velg ett kart'
          onChange={handleChange}
        >
          <option value='1'>Avdelinger og seksjoner</option>
          <option value='2'>Leveranseområder</option>
        </NativeSelect>
      </div>
      <div className={classes.wrapper}>
        <div id='chart' />
      </div>
    </>
  );
};
