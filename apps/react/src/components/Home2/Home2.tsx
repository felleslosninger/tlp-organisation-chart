import React, { useEffect } from "react";
import jsonData from "../../data/data.json";
import { generateOrgChart } from "../../generateOrgChart";

const Home = () => {
  useEffect(() => {
    generateOrgChart(jsonData, "test");
  });

  return (
    <div>
      <h1>Lag organisasjonsKart</h1>
      <div id="test"></div>
    </div>
  );
};

export default Home;
