import { OrgChartData, Layout, Node, Column, Row } from "../types/types";

function createElement(type: string) {
  const element = document.createElement(type);
  return element;
}

// create a that takes a number, and return true if the number is even or 1, false if the number is odd
function isEvenOrOne(num: number) {
  return num % 2 === 0 || num === 1;
}

function isOdd(number: number) {
  return number % 2 !== 0;
}

function calculateColumnWidth(siblingsAmount: number, indexInRow: number) {
  let width = 100;
  let additionalWidth = 0;

  if (siblingsAmount > 2 && isOdd(siblingsAmount)) {
    if (indexInRow < siblingsAmount / 2) {
      width = 100 / (siblingsAmount - 1);
      additionalWidth = 24 / ((siblingsAmount - 1) / 2);
    } else {
      width = 50 / (siblingsAmount - (siblingsAmount - 1) / 2);
    }
  } else if (siblingsAmount > 2) {
    width = 100 / siblingsAmount;
  }

  return { width, additionalWidth };
}

function createNodeLineClass(indexInRow: number, siblingsAmount: number) {
  let className = " node-line";

  if (siblingsAmount === 2) {
    if (indexInRow === 1) {
      className += "-right";
    } else {
      className += "-left";
    }
  } else if (siblingsAmount > 2 && isOdd(siblingsAmount)) {
    let lowerHalf = (siblingsAmount - 1) / 2;
    if (indexInRow <= lowerHalf) {
      className += "-up-right node-line-up";
    } else {
      className += "-up-left node-line-up";
    }
  } else if (siblingsAmount > 2) {
    if (indexInRow <= siblingsAmount / 2) {
      className += "-up-right node-line-up";
    } else {
      className += "-up-left node-line-up";
    }
  } else {
    className = "";
  }

  return className;
}

export function generateOrgChart(data: OrgChartData, containerId: string) {
  const { nodes, layouts } = data;

  function findNodeById(id: string | string[]) {
    return nodes.find((node: Node) => node.id === id);
  }

  function createNode(
    node: Column,
    siblingsAmount: number,
    indexInRow: number,
  ) {
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
      if (siblingsAmount && siblingsAmount <= 2) {
        nodeElement.style.maxWidth = "300px";
      }

      nodeElement.className += createNodeLineClass(indexInRow, siblingsAmount);

      return nodeElement;
    } else {
      return null;
    }
  }

  function createColumn(
    column: Column,
    columnWidth: number,
    siblingsAmount: number,
    additionalWidth: number,
    indexInRow: number,
  ) {
    const columnElement = createElement("div");

    columnElement.className = "column";

    if (siblingsAmount === 2 && indexInRow === 1) {
      columnElement.className += " column-flex-end";
    } else if (siblingsAmount === 2 && indexInRow === 2) {
      columnElement.className += " column-flex-start";
    }

    if (typeof column.id === "string") {
      const innerColumn = createNode(column, siblingsAmount, indexInRow);

      columnElement.style.width = `calc(${columnWidth}% + ${additionalWidth}px)`;

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

    if (isEvenOrOne(row.row.length)) {
      if (row.row.length <= 2) {
        rowClass += " row-center";
      }
    }

    rowElement.className = rowClass;

    let count = 0;

    row.row.forEach((column: Column) => {
      count++;

      if (!isLastRow) {
        const columnWidth = calculateColumnWidth(row.row.length, count);

        rowElement.appendChild(
          createColumn(
            column,
            columnWidth.width,
            row.row.length,
            columnWidth.additionalWidth,
            count,
          ),
        );
      } else {
        rowElement.appendChild(
          createColumn(column, 100, row.row.length, 0, count),
        );
      }
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
