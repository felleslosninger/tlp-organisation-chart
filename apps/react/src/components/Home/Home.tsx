import React, { useEffect, useState } from "react";
import jsonData1 from "../../data/data1.json";
import jsonData2 from "../../data/data2.json";
import jsonData3 from "../../data/data3.json";
import jsonData4 from "../../data/data4.json";
import jsonData5 from "../../data/data5.json";
import jsonData6 from "../../data/data6.json";
import jsonData7 from "../../data/data7.json";
import jsonData8 from "../../data/data8.json";
import jsonData9 from "../../data/data9.json";
import jsonData10 from "../../data/data10.json";
import jsonDigdir1 from "../../data/digdir1.json";
import jsonDigdir3 from "../../data/digdir3.json";
import { generateOrgChart } from "../../function/generateOrgChartV2";
import { Button, Combobox } from "@digdir/design-system-react";
import styles from "./Home.module.css";

const Home = () => {
  const [wrapperWidth, setWrapperWidth] = useState("1800px");

  const [data, setData] = useState(jsonDigdir1);

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
  };

  useEffect(() => {
    generateOrgChart(data, "test");
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
            label="Velg ett datasett til organisasjonskart"
            inputValue=""
            onValueChange={(value) => handleDatasetChange(value[0])}
            size="medium"
          >
            <Combobox.Empty>Fant ingen treff</Combobox.Empty>
            <Combobox.Option value="digdir1">
              Avdelinger og seksjoner
            </Combobox.Option>
            <Combobox.Option value="digdir3">Leveranseområder</Combobox.Option>¨
            <Combobox.Option value="data1">Data 1</Combobox.Option>
            <Combobox.Option value="data2">Data 2</Combobox.Option>
            <Combobox.Option value="data3">Data 3</Combobox.Option>
            <Combobox.Option value="data4">Data 4</Combobox.Option>
            <Combobox.Option value="data5">Data 5</Combobox.Option>
            <Combobox.Option value="data6">Data 6</Combobox.Option>
            <Combobox.Option value="data7">Data 7</Combobox.Option>
            <Combobox.Option value="data8">Data 8</Combobox.Option>
            <Combobox.Option value="data9">Data 9</Combobox.Option>
            <Combobox.Option value="data10">Data 10</Combobox.Option>
          </Combobox>
        </div>
        <div className={styles.menuRight}>
          <Button onClick={() => setWrapperWidth("1800px")}>Desktop</Button>
          <Button onClick={() => setWrapperWidth("1500px")}>Laptop</Button>
          <Button onClick={() => setWrapperWidth("992px")}>Tablet</Button>
          <Button onClick={() => setWrapperWidth("768px")}>Mobil</Button>
        </div>
      </div>
      <h2>Aktiv max-bredde: {wrapperWidth}</h2>
      <div
        style={{ maxWidth: wrapperWidth }}
        className={styles.test}
        id="test"
      ></div>
    </div>
  );
};

export default Home;
