import { OrgChartData, Layout, Node, Column, Row } from "../types/types";

function createElement(type: string) {
  const element = document.createElement(type);
  return element;
}

export function generateOrgChart(data: OrgChartData, containerId: string) {
  const { nodes, layouts } = data;

  function findNodeById(id: string | string[]) {
    return nodes.find((node: Node) => node.id === id);
  }

  function createNode(node: Column) {
    const nodeData = findNodeById(node.id);
    if (nodeData) {
      const nodeElement = document.createElement(nodeData.url ? "a" : "div");

      //if nodeElement is anchor, provide href
      if (nodeData.url && nodeElement instanceof HTMLAnchorElement) {
        nodeElement.href = nodeData.url;
        nodeElement.target = "_blank";
      }
      nodeElement.className = "node";
      nodeElement.tabIndex = 0;
      nodeElement.style.backgroundColor = nodeData.backgroundColor;
      nodeElement.style.color = nodeData.textColor;
      nodeElement.innerHTML = nodeData.title;

      return nodeElement;
    } else {
      return null;
    }
  }

  function createColumn(column: Column) {
    const columnElement = createElement("div");

    columnElement.className = "column";

    if (typeof column.id === "string") {
      const innerColumn = createNode(column);
      if (innerColumn !== null) {
        columnElement.appendChild(innerColumn);
      }
    } else {
      const test = createElement("div");
      test.className = "node";
      test.style.backgroundColor = "red";
      test.innerHTML = "Special node";

      columnElement.appendChild(test);
    }
    return columnElement;
  }

  function createRow(row: Row) {
    const rowElement = createElement("div");
    rowElement.className = "row";

    row.row.forEach((column: Column) => {
      rowElement.appendChild(createColumn(column));
    });

    return rowElement;
  }

  function createRowsWrapper(layout: Layout) {
    const rows = createElement("div");
    rows.className = "rows";
    layout.rows.forEach((row: Row) => {
      rows.appendChild(createRow(row));
    });

    return rows;
  }

  const orgChart = createElement("div");
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
