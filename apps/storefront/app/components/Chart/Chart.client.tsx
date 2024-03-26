import { useEffect, useState } from 'react';

import { NativeSelect } from '@digdir/designsystemet-react';

import { generateOrgChart } from '@digdir/organisation-chart';
import '@digdir/organisation-chart/dist/index.css';
import { charts } from './charts';

import classes from './Chart.module.css';

export const Chart = () => {
  const [data, setData] = useState(charts.avdelinger);
  useEffect(() => {
    generateOrgChart(data, 'chart');
  }, [data]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setData(charts[value as keyof typeof charts]);
  };

  return (
    <>
      <div className={classes.select}>
        <NativeSelect
          label='Velg ett kart'
          onChange={handleChange}
        >
          {Object.keys(charts).map((key) => (
            <option
              key={key}
              value={key}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className={classes.wrapper}>
        <div id='chart' />
      </div>
    </>
  );
};
