import React, { useEffect, useState } from "react";
import jsonData1 from "../../data/v2Data/data1.json";
//import jsonData2 from "../../data/v2Data/data2.json";
import { generateOrgChart } from "../../function/generateOrgChartV2";
import { Button } from "@digdir/design-system-react";

const Home = () => {
  const [data, setData] = useState(jsonData1);

  useEffect(() => {
    generateOrgChart(data, "test");
  });

  return (
    <div>
      <h1>Lag organisasjonsKart</h1>
      <div
        style={{
          margin: "50px 0 50px 0",
          display: "flex",
          gap: "50px",
          width: "100%",
          alignItems: "center",
          borderBottom: "1px solid #000",
        }}
      >
        <Button onClick={() => setData(jsonData1)}>Data 1</Button> 
        {/* <Button onClick={() => setData(jsonData2)}>Data 2</Button> */}
        {/* <Button onClick={() => setData(jsonData3)}>Data 3</Button>  */}
      </div>
      <div id="test"></div>
    </div>
  );
};

export default Home;
