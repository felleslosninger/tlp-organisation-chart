import { OrgChartData, Layout, Node, Column, Layouts } from "../types/types";

export function generateOrgChart(data: OrgChartData, containerId: string) {
  const { nodes, layouts, toc } = data;

  function createRowsWrapper(layout: Layout) {
    const rows = document.createElement("div");
    rows.className = "rows";
    layout.rows.forEach((row: any) => {
      const rowElement = document.createElement("div");
      //add class name to the row element
      rowElement.className = "rowElement";
    });

    return rows;
  }

  const orgChart = document.createElement("div");
  orgChart.className = "org-chart";
  orgChart.role = "tree";

  const mainContainer = document.getElementById(containerId);
  //create element to hold the org chart

  if (mainContainer) {
    //insert the org chart into the container
    orgChart.appendChild(createRowsWrapper(layouts.desktop));
    //clear the container for all existing children
    mainContainer.innerHTML = "";
    mainContainer.appendChild(orgChart);

    return mainContainer;
  }

  return null;
}
