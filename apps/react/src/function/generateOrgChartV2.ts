import { OrgChartData, Layout, Node, Column, Row } from "../types/types";

function createElement(type: string) {
  const element = document.createElement(type);
  return element;
}

// create a that takes a number, and return true if the number is even or 1, false if the number is odd
function isEvenOrOne(num: number) {
  return num % 2 === 0 || num === 1;
}

export function generateOrgChart(data: OrgChartData, containerId: string) {
  const { nodes, layouts } = data;

  function findNodeById(id: string | string[]) {
    return nodes.find((node: Node) => node.id === id);
  }

  function createNode(node: Column, siblingsAmount?: number) {
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
      //if siblingsAmount is less 2, set max-with to 300px
      if (siblingsAmount && siblingsAmount < 2) {
        nodeElement.style.maxWidth = "300px";
      }

      return nodeElement;
    } else {
      return null;
    }
  }

  function createColumn(
    column: Column,
    columnWidth: number,
    siblingsAmount: number,
  ) {
    const columnElement = createElement("div");

    columnElement.className = "column";

    if (typeof column.id === "string") {
      const innerColumn = createNode(column, siblingsAmount);
      columnElement.style.width = `${columnWidth}%`;
      if (innerColumn !== null) {
        columnElement.appendChild(innerColumn);
      }
    } else {
      const test = createElement("div");
      columnElement.style.width = `${columnWidth}%`;
      test.className = "node";
      test.style.backgroundColor = "red";
      test.innerHTML = "Special node";

      columnElement.appendChild(test);
    }
    return columnElement;
  }

  function createRow(row: Row, isLastRow: boolean) {
    const rowElement = createElement("div");

    let rowClass = "row";

    if (isEvenOrOne(row.row.length) && isLastRow) {
      if (row.row.length === 1) {
        rowClass += " row-center";
      }
      if (row.row.length === 2) {
        rowClass += " row-center";
      }
    }

    rowElement.className = rowClass;

    let count = 0;
    row.row.forEach((column: Column) => {
      count++;
      let colWidth = 100;

      if (row.row.length === 3) {
        if (count === 1) {
          colWidth = 50;
        } else {
          colWidth = 25;
        }
      }

      if (row.row.length === 4) {
        colWidth = 100 / row.row.length;
      }

      if (row.row.length === 5 && !isLastRow) {
        if (count === 1 || count === 2) {
          colWidth = 25;
        } else {
          colWidth = 50 / 3;
        }
      }

      if (row.row.length === 6) {
        colWidth = 100 / row.row.length;
      }

      rowElement.appendChild(createColumn(column, colWidth, row.row.length));
    });

    return rowElement;
  }

  function createRowsWrapper(layout: Layout) {
    const rows = createElement("div");
    rows.className = "rows";

    const numberOfRows = layout.rows.length;
    let isLastRow = false;
    layout.rows.forEach((row: Row, index: Number) => {
      if (index === numberOfRows - 1) {
        isLastRow = true;
      }
      rows.appendChild(createRow(row, isLastRow));
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
