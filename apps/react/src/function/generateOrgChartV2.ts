import { OrgChartData, Layout, Node, Column, Row } from "../types/types";

export function generateOrgChart(data: OrgChartData, containerId: string) {
  const { nodes, layouts } = data;

  let allowedBreakpoints = { main: 1500, laptop: 992, tablet: 768 };
  let windowWidth = window.innerWidth;
  let currentLayout = provideLayout(
    windowWidth,
    allowedBreakpoints,
  ).providedLayout;
  //let layoutName = provideLayout(windowWidth, allowedBreakpoints).layoutName;
  let isMobile = windowWidth < allowedBreakpoints.tablet;
  let rowHasWrapped = true;

  function provideLayout(
    windowWidth: number,
    breakpoints: { main: number; laptop: number; tablet: number },
  ) {
    let providedLayout = layouts.main;
    let layoutName = "main";

    const { main, laptop } = breakpoints;

    //if the window width is less than 1500px, set the currentLayout to laptop
    if (windowWidth < main && layouts.laptop) {
      providedLayout = layouts.laptop;
      layoutName = "laptop";
    }
    //if the window width is less than 992px, set the currentLayout to tablet
    if (windowWidth < laptop && layouts.tablet) {
      providedLayout = layouts.tablet;
      layoutName = "tablet";
    }

    return { providedLayout: providedLayout, layoutName: layoutName };
  }

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
      if (siblingsAmount && siblingsAmount <= 2 && !isMobile) {
        nodeElement.style.maxWidth = "300px";
      }

      nodeElement.className += createNodeLineClass(
        indexInRow,
        siblingsAmount,
        windowWidth,
        allowedBreakpoints,
        rowHasWrapped,
      );

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

      const columnWidth = calculateColumnWidth(
        row.row.length,
        count,
        windowWidth,
        allowedBreakpoints,
        isLastRow,
      );

      rowElement.appendChild(
        createColumn(
          column,
          columnWidth.width,
          row.row.length,
          columnWidth.additionalWidth,
          count,
        ),
      );
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

  function provideLayoutClass(windowWidth: number) {
    let layoutClass = " org-chart main";

    if (windowWidth < allowedBreakpoints.main && layouts.laptop) {
      layoutClass = "org-chart laptop";
    }
    if (windowWidth < allowedBreakpoints.laptop && layouts.tablet) {
      layoutClass = "org-chart tablet";
    }

    return layoutClass;
  }

  //find the main container
  const mainContainer = document.getElementById(containerId);

  if (mainContainer) {
    //create element to hold the org chart
    const orgChart = createElement("div");
    orgChart.className = provideLayoutClass(windowWidth);
    orgChart.role = "tree";

    //insert the org chart into the container
    orgChart.appendChild(createRowsWrapper(currentLayout));

    //add event listener to the window to listen for resize
    window.addEventListener("resize", () => {
      //clear the org chart
      orgChart.innerHTML = "";

      //get the current window width and provide the layout
      windowWidth = window.innerWidth;

      //check if the window width is less than 768px
      isMobile = windowWidth < allowedBreakpoints.tablet;

      //get the current layout
      currentLayout = provideLayout(
        windowWidth,
        allowedBreakpoints,
      ).providedLayout;

      //set the class of the org chart to the current layout
      orgChart.className = provideLayoutClass(windowWidth);

      //insert the org chart into the container
      orgChart.appendChild(createRowsWrapper(currentLayout));
    });

    //clear the container for all existing children
    mainContainer.innerHTML = "";
    mainContainer.appendChild(orgChart);

    return mainContainer;
  }

  return null;
}

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

//function to calculate the width of the columns
//TODO: Refactor this function to make it more readable
function calculateColumnWidth(
  siblingsAmount: number,
  indexInRow: number,
  windowWidth: number,
  breakpoints: { main: number; laptop: number; tablet: number },
  isLastRow: boolean,
) {
  let width = 100;
  let additionalWidth = 0;

  //destructuring the breakpoints object
  const { main, laptop, tablet } = breakpoints;

  if (siblingsAmount > 2 && isOdd(siblingsAmount)) {
    if (windowWidth > main) {
      if (isLastRow) {
        width = 100 / siblingsAmount;
      } else {
        if (indexInRow < siblingsAmount / 2) {
          width = 100 / (siblingsAmount - 1);
          additionalWidth = 24 / ((siblingsAmount - 1) / 2);
        } else {
          width = 50 / (siblingsAmount - (siblingsAmount - 1) / 2);
        }
      }
    }
    if (windowWidth <= main && windowWidth > laptop) {
      if (isLastRow) {
        if (siblingsAmount > 3) {
          if (indexInRow <= 2) {
            width = 100 / 2;
            additionalWidth = -12;
          } else {
            width = 100 / 3;
            additionalWidth = -16;
          }
        } else {
          width = 100 / 2;
          additionalWidth = -12;
        }
      } else {
        if (siblingsAmount > 4) {
          width = 100 / 4;
          additionalWidth = -(24 - (siblingsAmount + 1));
        } else {
          if (indexInRow < siblingsAmount / 2) {
            width = 100 / (siblingsAmount - 1);
            additionalWidth = -(24 / 2);
          } else {
            width = 50 / (siblingsAmount - (siblingsAmount - 1) / 2);
            additionalWidth = -(24 - (siblingsAmount + 3));
          }
        }
      }
    }

    if (windowWidth <= laptop && windowWidth > tablet) {
      if (siblingsAmount > 2) {
        width = 100 / 2;
        additionalWidth = -(24 / 2);
      } else {
        if (indexInRow < siblingsAmount / 2) {
          width = 100 / (siblingsAmount - 1);
          additionalWidth = -(24 / 2);
        } else {
          width = 50 / (siblingsAmount - (siblingsAmount - 1) / 2);
          additionalWidth = -(24 - (siblingsAmount + 3));
        }
      }
    }
  } else if (siblingsAmount > 2) {
    if (windowWidth > tablet) {
      width = 100 / siblingsAmount;
    }
    if (windowWidth <= main && windowWidth > laptop) {
      width = 100 / 4;
      additionalWidth = -18;
    }
    if (windowWidth <= laptop && windowWidth > tablet) {
      width = 100 / 2;
      additionalWidth = -12;
    }
  }

  return { width, additionalWidth };
}

//function to create the line between the nodes
function createNodeLineClass(
  indexInRow: number,
  siblingsAmount: number,
  windowWidth: number,
  breakpoints: { main: number; laptop: number; tablet: number },
  isLastRow: boolean,
) {
  let width = 100;
  let additionalWidth = 0;

  //destructuring the breakpoints object
  const { main, laptop, tablet } = breakpoints;

  let className = " node-line";
  if (siblingsAmount === 2) {
    if (indexInRow === 1) {
      className += "-right";
    } else {
      className += "-left";
    }
    return className;
  }

  if (siblingsAmount > 2 && isOdd(siblingsAmount)) {
    //if the window width is greater than 1500px
    if (windowWidth > main) {
      let lowerHalf = (siblingsAmount - 1) / 2;
      if (indexInRow <= lowerHalf) {
        className += "-up-right node-line-up";
      } else {
        className += "-up-left node-line-up";
      }
      return className;
    }

    //if the window width is less than 1500px and greater than 992px
    if (windowWidth <= main && windowWidth > laptop) {
      let lowerHalf = (siblingsAmount - 1) / 2;
      if (indexInRow <= lowerHalf) {
        className += "-up-right node-line-up";
      }
      if (indexInRow === siblingsAmount && siblingsAmount > 3) {
        className += "-up-right-long node-line-up";
      } else {
        className += "-up-left node-line-up";
      }
      return className;
    }

    if (windowWidth <= laptop && windowWidth > tablet) {
      let lowerHalf = (siblingsAmount - 1) / 2;
      if (indexInRow <= lowerHalf) {
        className += "-up-right node-line-up";
      } else {
        className += "-up-left node-line-up";
      }
      return className;
    }

    // if (siblingsAmount > 2 && isOdd(siblingsAmount)) {
    //   let lowerHalf = (siblingsAmount - 1) / 2;
    //   if (indexInRow <= lowerHalf) {
    //     className += "-up-right node-line-up";
    //   } else {
    //     className += "-up-left node-line-up";
    //   }
    //   return className;
    // } else if (siblingsAmount > 2) {
    //   if (indexInRow <= siblingsAmount / 2) {
    //     className += "-up-right node-line-up";
    //   } else {
    //     className += "-up-left node-line-up";
    //   }
    //   return className;
    // } else {
    //   className = "";
    //   return className;
    // }
  }
  // else if (siblingsAmount > 2) {
  //   if (indexInRow <= siblingsAmount / 2) {
  //     className += "-up-right node-line-up";
  //   } else {
  //     className += "-up-left node-line-up";
  //   }
  //   return className;
  // }
  else {
    className = "";
    return className;
  }
}
