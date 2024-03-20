import React, { useEffect, useState } from 'react';
import { Button, Combobox } from '@digdir/design-system-react';
import { generateOrgChart } from '@digdir/organisation-chart';

import jsonData1 from '../../data/data1.json';
import jsonData2 from '../../data/data2.json';
import jsonData3 from '../../data/data3.json';
import jsonData4 from '../../data/data4.json';
import jsonData5 from '../../data/data5.json';
import jsonData6 from '../../data/data6.json';
import jsonData7 from '../../data/data7.json';
import jsonData8 from '../../data/data8.json';
import jsonData9 from '../../data/data9.json';
import jsonData10 from '../../data/data10.json';
import jsonData11 from '../../data/data11.json';
import jsonData12 from '../../data/data12.json';
import jsonData13 from '../../data/data13.json';
import jsonData14 from '../../data/data14.json';
import jsonData15 from '../../data/data15.json';
import jsonData16 from '../../data/data16.json';
import jsonData17 from '../../data/data17.json';
import jsonDataSpecial1 from '../../data/dataSpecial1.json';
import jsonDataSpecial2 from '../../data/dataSpecial2.json';
import jsonDataOffset1 from '../../data/dataOffset1.json';
import jsonDataOffset2 from '../../data/dataOffset2.json';
import jsonDigdir1 from '../../data/digdir1.json';
import jsonDigdir3 from '../../data/digdir3.json';

import styles from './Home.module.css';

const datasets: { [key: string]: any } = {
  digdir1: jsonDigdir1,
  digdir3: jsonDigdir3,
  data1: jsonData1,
  data2: jsonData2,
  data3: jsonData3,
  data4: jsonData4,
  data5: jsonData5,
  data6: jsonData6,
  data7: jsonData7,
  data8: jsonData8,
  data9: jsonData9,
  data10: jsonData10,
  data11: jsonData11,
  data12: jsonData12,
  data13: jsonData13,
  data14: jsonData14,
  data15: jsonData15,
  data16: jsonData16,
  data17: jsonData17,
  special1: jsonDataSpecial1,
  special2: jsonDataSpecial2,
  offset1: jsonDataOffset1,
  offset2: jsonDataOffset2,
};

const Home = () => {
  const [wrapperWidth, setWrapperWidth] = useState('1800px');

  const [data, setData] = useState(jsonData17);

  useEffect(() => {
    generateOrgChart(data, 'test');
  }, [data]);

  const handleDatasetChange = (selectedKey: string) => {
    setData(datasets[selectedKey]);
  };

  return (
    <div className={styles.layout}>
      <h1>Lag organisasjonskart</h1>
      <div className={styles.menu}>
        <div className={styles.menuLeft}>
          <Combobox
            label='Velg ett datasett til organisasjonskart'
            onValueChange={(value) => handleDatasetChange(value[0])}
            size='medium'
          >
            <Combobox.Empty>Fant ingen treff</Combobox.Empty>
            <Combobox.Option value='data11'>
              Ender med 1 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data12'>
              Ender med 2 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data13'>
              Ender med 3 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data14'>
              Ender med 4 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data15'>
              Ender med 5 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data16'>
              Ender med 6 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data2'>Kun main layout</Combobox.Option>
            <Combobox.Option value='data3'>Med tre layouts</Combobox.Option>
            <Combobox.Option value='data5'>Ender med 1 kol</Combobox.Option>
            <Combobox.Option value='data6'>Ender med 2 kol</Combobox.Option>
            <Combobox.Option value='data7'>Ender med 3 kol</Combobox.Option>
            <Combobox.Option value='data8'>Ender med 4 kol</Combobox.Option>
            <Combobox.Option value='data9'>Ender med 5 kol</Combobox.Option>
            <Combobox.Option value='data10'>Ender med 6 kol</Combobox.Option>
            <Combobox.Option value='special1'>
              Med spesial-kolonne 1
            </Combobox.Option>
            <Combobox.Option value='special2'>
              Med spesial-kolonne 2
            </Combobox.Option>
            <Combobox.Option value='digdir1'>
              Avdelinger og seksjoner
            </Combobox.Option>
            <Combobox.Option value='digdir3'>Leveranseområder</Combobox.Option>
            <Combobox.Option value='data1'>
              Kombinasjoner uten barn
            </Combobox.Option>
            <Combobox.Option value='data4'>
              Kombinasjoner med barn
            </Combobox.Option>
            <Combobox.Option value='data11'>
              Ender med 1 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data12'>
              Ender med 2 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data13'>
              Ender med 3 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data14'>
              Ender med 4 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data15'>
              Ender med 5 kol & barn
            </Combobox.Option>
            <Combobox.Option value='data16'>
              Ender med 6 kol & barn
            </Combobox.Option>
            <Combobox.Option value='offset1'>Offset 1</Combobox.Option>
            <Combobox.Option value='offset2'>Offset 2</Combobox.Option>
          </Combobox>
        </div>
        <div className={styles.menuRight}>
          <Button onClick={() => setWrapperWidth('1800px')}>Desktop</Button>
          <Button onClick={() => setWrapperWidth('1400px')}>Laptop</Button>
          <Button onClick={() => setWrapperWidth('900px')}>Tablet</Button>
          <Button onClick={() => setWrapperWidth('760px')}>Mobil</Button>
        </div>
      </div>
      <h2>Aktiv max-bredde: {wrapperWidth}</h2>
      <div
        style={{ maxWidth: wrapperWidth }}
        className={styles.test}
        id='test'
      ></div>
    </div>
  );
};

export default Home;
