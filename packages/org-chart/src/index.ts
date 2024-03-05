import "./orgChart.css";

import { generateOrgChart } from "./orgChart";

(function (window, document, undefined) {
  window.orgChart = generateOrgChart;
})(window, document);

export { generateOrgChart };
