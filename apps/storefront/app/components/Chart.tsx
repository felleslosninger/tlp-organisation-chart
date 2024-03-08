import React, { useEffect } from 'react'

import { generateOrgChart } from "@digdir/organisation-chart";

import data from "../data/data.json";

export default function Chart() {

  useEffect(() => {
    generateOrgChart(data, "chart");
  }, []);

  console.log("running")

  return (
    <>
      <div>Chart</div>
      <div id="chart"></div>
    </>
  )
}
