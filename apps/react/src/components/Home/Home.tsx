import React, { useEffect, useState } from "react";
// import jsonData1 from "../../data/data1.json";
// import jsonData2 from "../../data/data2.json";
// import jsonData3 from "../../data/data3.json";
// import jsonData4 from "../../data/data4.json";
// import jsonData5 from "../../data/data5.json";
// import jsonData6 from "../../data/data6.json";
// import jsonData7 from "../../data/data7.json";
// import jsonData8 from "../../data/data8.json";
import jsonData9 from "../../data/data9.json";
import jsonData10 from "../../data/data10.json";
import jsonDigdir1 from "../../data/digdir1.json";
import jsonDigdir2 from "../../data/digdir2.json";
import jsonDigdir3 from "../../data/digdir3.json";
import { generateOrgChart } from "../../function/generateOrgChartV2";
import { Button } from "@digdir/design-system-react";
import styles from "./Home.module.css";

const Home = () => {
  const [data, setData] = useState(jsonData10);

  useEffect(() => {
    generateOrgChart(data, "test");
  });

  return (
    <div>
      <h1>Lag organisasjonsKart</h1>
      <div className={styles.wrapper}>
        <Button onClick={() => setData(jsonDigdir1)}>Digdir 1</Button>
        <Button onClick={() => setData(jsonDigdir2)}>Digdir 2</Button>
        <Button onClick={() => setData(jsonDigdir3)}>Digdir 3</Button>
        <Button onClick={() => setData(jsonData9)}>Data 9</Button>
        <Button onClick={() => setData(jsonData10)}>Data 10</Button>
        {/* <Button onClick={() => setData(jsonData1)}>Data 1</Button> 
        <Button onClick={() => setData(jsonData2)}>Data 2</Button>
        <Button onClick={() => setData(jsonData3)}>Data 3</Button> 
        <Button onClick={() => setData(jsonData4)}>Data 4</Button>  
        <Button onClick={() => setData(jsonData5)}>Data 5</Button>
        <Button onClick={() => setData(jsonData6)}>Data 6</Button>
        <Button onClick={() => setData(jsonData7)}>Data 7</Button>
        <Button onClick={() => setData(jsonData8)}>Data 8</Button> */}
      </div>
      <div className={styles.test} id="test"></div>
    </div>
  );
};

export default Home;
