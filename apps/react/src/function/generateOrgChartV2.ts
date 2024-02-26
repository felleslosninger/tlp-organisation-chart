import { OrgChartData, Layout, Node, Column, Row } from "../types/types";

export function generateOrgChart(data: OrgChartData, containerId: string) {
  const { nodes, layouts } = data;

  let allowedBreakpoints = { main: 1500, laptop: 992, tablet: 768 };
  let mainContainerWidth = 0;
  let currentLayout = provideLayout(
    mainContainerWidth,
    allowedBreakpoints,
  ).providedLayout;

  let isMobile = false;

  function provideLayout(
    mainContainerWidth: number,
    breakpoints: { main: number; laptop: number; tablet: number },
  ) {
    let providedLayout = layouts.main;
    let layoutName = "main";

    const { main, laptop } = breakpoints;

    //if the window width is less than 1500px, set the currentLayout to laptop
    if (mainContainerWidth < main && layouts.laptop) {
      providedLayout = layouts.laptop;
      layoutName = "laptop";
    }
    //if the window width is less than 992px, set the currentLayout to tablet
    if (mainContainerWidth < laptop && layouts.tablet) {
      providedLayout = layouts.tablet;
      layoutName = "tablet";
    }

    return { providedLayout: providedLayout, layoutName: layoutName };
  }

  function findNodeById(id: string | string[]) {
    return nodes.find((node: Node) => node.id === id);
  }

  function createChildren(parentSiblingsAmount: number, children: string[]) {
    const childrenList = createElement("ul");
    childrenList.className = "node-children";

    if (parentSiblingsAmount === 2) {
      childrenList.style.maxWidth = "300px";
    }

    children.forEach((childId: string) => {
      const childData = findNodeById(childId);
      if (childData) {
        const childElement = createElement("li");
        const innerChild = childData.url
          ? createElement("a")
          : createElement("div");
        innerChild.tabIndex = 0;
        innerChild.innerHTML = childData.title;
        innerChild.className = "node node-child";
        innerChild.style.color = childData.textColor;
        innerChild.style.backgroundColor = childData.backgroundColor;
        childElement.appendChild(innerChild);
        childrenList.appendChild(childElement);
      }
    });

    return childrenList;
  }

  function createNode(
    node: Column,
    siblingsAmount: number,
    indexInRow: number,
    isLastRow: boolean,
  ) {
    const nodeData = findNodeById(node.id[0]);
    if (nodeData) {
      const nodeElement = document.createElement(nodeData.url ? "a" : "div");

      //if nodeData has border, provide border
      if (nodeData.border) {
        nodeElement.style.border = `2px ${nodeData.border} #000`;
      }

      //if nodeElement is anchor, provide href
      if (nodeData.url && nodeElement instanceof HTMLAnchorElement) {
        nodeElement.href = nodeData.url;
      }
      nodeElement.className = "node ";
      nodeElement.tabIndex = 0;
      nodeElement.style.backgroundColor = nodeData.backgroundColor;
      nodeElement.style.color = nodeData.textColor;
      nodeElement.innerHTML = nodeData.title;
      nodeData.opacity && (nodeElement.style.opacity = nodeData.opacity + "%");
      //if siblingsAmount is less 2, set max-with to 300px
      if (siblingsAmount && siblingsAmount <= 2 && !isMobile) {
        nodeElement.style.maxWidth = "300px";
      }

      nodeElement.className += createNodeLineClass(
        indexInRow,
        siblingsAmount,
        mainContainerWidth,
        allowedBreakpoints,
        isLastRow,
      );

      return nodeElement;
    } else {
      return null;
    }
  }

  function createSpecialColumn(
    column: Column,
    columnWidth: number,
    siblingsAmount: number,
    additionalWidth: number,
    indexInRow: number,
    isLastRow: boolean,
  ) {
    const columnElement = createElement("div");
    columnElement.className = "column";
    isMobile
      ? (columnElement.style.width = "100%")
      : (columnElement.style.width = `calc(${columnWidth}% + ${additionalWidth}px)`);

    //if column.id is an array, create a special column
    if (Array.isArray(column.id) && column.id.length > 1) {
      const nodesWrapper = createElement("div");
      isMobile
        ? (nodesWrapper.className = "nodes-wrapper-mobile")
        : (nodesWrapper.className = "nodes-wrapper");

      column.id.forEach((nodeId: string) => {
        const nodeData = findNodeById(nodeId);
        if (nodeData) {
          const nodeElement = document.createElement(
            nodeData.url ? "a" : "div",
          );

          //if nodeData has border, provide border
          if (nodeData.border) {
            nodeElement.style.border = `2px ${nodeData.border} #000`;
          }

          //if nodeElement is anchor, provide href
          if (nodeData.url && nodeElement instanceof HTMLAnchorElement) {
            nodeElement.href = nodeData.url;
          }
          nodeElement.className = "node ";
          nodeElement.tabIndex = 0;
          nodeElement.style.backgroundColor = nodeData.backgroundColor;
          nodeElement.style.color = nodeData.textColor;
          nodeElement.innerHTML = nodeData.title;
          nodesWrapper.appendChild(nodeElement);
        }
      });

      columnElement.appendChild(nodesWrapper);
    } else {
      const simpleNode = createNode(
        column,
        siblingsAmount + 1,
        indexInRow,
        isLastRow,
      );
      if (simpleNode !== null) {
        columnElement.appendChild(simpleNode);
      }
    }

    if (column.component?.children) {
      columnElement.appendChild(
        createChildren(
          3,
          column.component.children ? column.component.children : [],
        ),
      );
    }

    return columnElement;
  }

  function createColumn(
    column: Column,
    columnWidth: number,
    siblingsAmount: number,
    additionalWidth: number,
    indexInRow: number,
    isLastRow: boolean,
  ) {
    const columnElement = createElement("div");

    columnElement.className = "column";

    if (siblingsAmount === 2 && indexInRow === 1) {
      columnElement.className += " column-flex-end";
    } else if (siblingsAmount === 2 && indexInRow === 2) {
      columnElement.className += " column-flex-start";
    }

    const innerColumn = createNode(
      column,
      siblingsAmount,
      indexInRow,
      isLastRow,
    );

    columnElement.style.width = `calc(${columnWidth}% + ${additionalWidth}px)`;

    if (innerColumn !== null) {
      columnElement.appendChild(innerColumn);
    }

    if (column.component?.children) {
      columnElement.appendChild(
        createChildren(siblingsAmount, column.component.children),
      );
    }

    return columnElement;
  }

  function createRow(row: Row, isLastRow: boolean) {
    const rowElement = createElement("div");

    let rowClass = "row row-normal";

    if (isEvenOrOne(row.row.length)) {
      if (row.row.length <= 2) {
        rowClass += " row-center";
      }
    }

    if (
      isLastRow &&
      row.row.length === 5 &&
      mainContainerWidth < allowedBreakpoints.laptop
    ) {
      rowClass = "row row-last-5";
    } else if (
      isLastRow &&
      row.row.length === 3 &&
      mainContainerWidth < allowedBreakpoints.laptop
    ) {
      rowClass = "row row-last-3";
    } else if (
      isLastRow &&
      row.row.length === 4 &&
      mainContainerWidth < allowedBreakpoints.laptop
    ) {
      rowClass = "row row-last-4";
    } else if (
      isLastRow &&
      row.row.length === 6 &&
      mainContainerWidth < allowedBreakpoints.main
    ) {
      rowClass = "row row-last-6";
    }

    rowElement.className = rowClass;

    let count = 0;

    let rowContainsSpecialColumns = false;
    row.row.forEach((column: Column) => {
      if (Array.isArray(column.id) && column.id.length > 1) {
        rowContainsSpecialColumns = true;
      }
    });

    let indexToColumnsWithSpecialColumnList: number[] = [];

    if (rowContainsSpecialColumns) {
      row.row.forEach((column: Column, index: number) => {
        if (column.id.length > 1) {
          indexToColumnsWithSpecialColumnList.push(index + 1);
        }
      });
    }

    row.row.forEach((column: Column) => {
      count++;

      const columnWidth = calculateColumnWidth(
        row.row.length,
        count,
        mainContainerWidth,
        allowedBreakpoints,
        isLastRow,
        rowContainsSpecialColumns,
        indexToColumnsWithSpecialColumnList,
      );

      if (!rowContainsSpecialColumns) {
        rowElement.appendChild(
          createColumn(
            column,
            columnWidth.width,
            row.row.length,
            columnWidth.additionalWidth,
            count,
            isLastRow,
          ),
        );
      } else {
        rowElement.appendChild(
          createSpecialColumn(
            column,
            columnWidth.width,
            row.row.length,
            columnWidth.additionalWidth,
            count,
            isLastRow,
          ),
        );
      }
      rowElement.className += " " + columnWidth.additionalClass;
    });

    !isMobile && rowElement.classList.add("row-line");

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

  function provideLayoutClass(mainContainerWidth: number) {
    let layoutClass = " org-chart main";

    if (mainContainerWidth < allowedBreakpoints.main && layouts.laptop) {
      layoutClass = "org-chart laptop";
    }
    if (mainContainerWidth < allowedBreakpoints.laptop && layouts.tablet) {
      layoutClass = "org-chart tablet";
    }

    return layoutClass;
  }

  //find the main container
  const mainContainer = document.getElementById(containerId);

  if (mainContainer) {
    // Create element to hold the org chart
    const orgChart = document.createElement("div");

    orgChart.className = provideLayoutClass(mainContainerWidth);

    orgChart.role = "tree";

    // Initial setup based on mainContainer's current width
    mainContainerWidth = mainContainer.offsetWidth;

    // Check if the window width is less than 768px
    isMobile = mainContainerWidth < allowedBreakpoints.tablet;

    // Insert the org chart into the container
    orgChart.appendChild(createRowsWrapper(currentLayout));

    // Set the last breakpoint based on mainContainer's width
    let lastBreakpoint = getBreakpointName(mainContainerWidth);

    // Function to update layout based on mainContainer's width
    const updateLayout = () => {
      // Update variables based on the current state
      mainContainerWidth = mainContainer.offsetWidth;

      // Check if the window width is less than 768px
      isMobile = mainContainerWidth < allowedBreakpoints.tablet;

      if (provideNewBreakpoint(lastBreakpoint, mainContainerWidth)) {
        lastBreakpoint = getBreakpointName(mainContainerWidth);

        currentLayout = provideLayout(
          mainContainerWidth,
          allowedBreakpoints,
        ).providedLayout;

        // Update org chart's class to reflect the current layout
        orgChart.className = provideLayoutClass(mainContainerWidth);

        // Clear and re-insert the org chart into the container
        orgChart.innerHTML = "";
        orgChart.appendChild(createRowsWrapper(currentLayout));
      }
    };

    let timeoutId: any = null;
    const throttleUpdateLayout = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          updateLayout();
          timeoutId = null;
        }, 100); // Vent 100ms før du kjører updateLayout igjen
      }
    };

    // Create a ResizeObserver to watch for changes in size of mainContainer
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(throttleUpdateLayout); // Use requestAnimationFrame for optimal updating
    });

    // Start observing the mainContainer
    resizeObserver.observe(mainContainer);

    // Clear the container of all existing children and add the org chart
    mainContainer.innerHTML = "";
    mainContainer.appendChild(orgChart);

    return mainContainer;
  }

  return null;
}

//function to calculate the width of the columns
//TODO: Refactor this function to make it more readable
function calculateColumnWidth(
  siblingsAmount: number,
  indexInRow: number,
  mainContainerWidth: number,
  breakpoints: { main: number; laptop: number; tablet: number },
  isLastRow: boolean,
  rowContainsSpecialColumn: boolean,
  indexToSpecialColumnList: number[],
) {
  let additionalClass = "";
  let width = 100;
  let additionalWidth = 0;

  //destructuring the breakpoints object
  const { main, laptop, tablet } = breakpoints;
  if (!rowContainsSpecialColumn) {
    if (siblingsAmount > 2 && isOdd(siblingsAmount)) {
      if (mainContainerWidth > main) {
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
      if (mainContainerWidth <= main && mainContainerWidth > laptop) {
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
            width = 100 / 3;
            additionalWidth = -(24 - 24 / siblingsAmount);
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

      if (mainContainerWidth <= laptop && mainContainerWidth > tablet) {
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
      if (mainContainerWidth > tablet) {
        width = 100 / siblingsAmount;
      }
      if (mainContainerWidth <= main && mainContainerWidth > laptop) {
        width = 100 / 4;
        additionalWidth = -18;
      }
      if (mainContainerWidth <= laptop && mainContainerWidth > tablet) {
        width = 100 / 2;
        additionalWidth = -12;
      }
    }
  } else {
    additionalClass = " special-row";
    //if row contains special column add the length of the special column to the siblingsAmount, because the special column takes up double node space
    siblingsAmount = siblingsAmount + indexToSpecialColumnList.length;

    if (mainContainerWidth > main) {
      if (siblingsAmount === 3) {
        width = 50;
        additionalWidth = -12;
      } else if (siblingsAmount === 4) {
        if (indexToSpecialColumnList.includes(indexInRow)) {
          width = 50;
          additionalWidth = -18;
        } else {
          width = 25;
          additionalWidth = -18;
        }
      }
    } else if (mainContainerWidth <= main && mainContainerWidth > laptop) {
      if (siblingsAmount === 3) {
        width = 50;
        additionalWidth = -12;
      } else if (siblingsAmount === 4) {
        if (indexToSpecialColumnList.includes(indexInRow)) {
          width = 50;
          additionalWidth = -18;
        } else {
          width = 25;
          additionalWidth = -18;
        }
      }
    } else if (mainContainerWidth <= laptop && mainContainerWidth > tablet) {
      if (siblingsAmount === 3) {
        width = 100;
        additionalWidth = -12;
      } else if (siblingsAmount === 4) {
        if (indexToSpecialColumnList.includes(indexInRow)) {
          width = 100;
        } else {
          width = 50;
          additionalWidth = -12;
        }
      }
    }
  }

  return { width, additionalWidth, additionalClass };
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

//function to create the line between the nodes
function createNodeLineClass(
  indexInRow: number,
  siblingsAmount: number,
  mainContainerWidth: number,
  breakpoints: { main: number; laptop: number; tablet: number },
  isLastRow: boolean,
) {
  //destructuring the breakpoints object
  const { main, laptop, tablet } = breakpoints;

  let className = "";
  if (siblingsAmount === 2) {
    if (indexInRow === 1) {
      className = " node-line-right";
    } else {
      className = " node-line-left";
    }
    return className;
  }

  if (siblingsAmount > 2 && isOdd(siblingsAmount)) {
    //if the window width is greater than 1500px
    if (mainContainerWidth > main) {
      let lowerHalf = (siblingsAmount - 1) / 2;
      if (indexInRow <= lowerHalf) {
        className = " node-line-up-right node-line-up";
      } else {
        className = " node-line-up-left node-line-up";
      }
      return className;
    }

    //if the window width is less than 1500px and greater than 992px
    if (mainContainerWidth <= main && mainContainerWidth > laptop) {
      let lowerHalf = (siblingsAmount - 1) / 2;
      let upperHalf = siblingsAmount - lowerHalf;
      if (isLastRow) {
        if (
          indexInRow === 1 ||
          (isOdd(indexInRow) && indexInRow !== siblingsAmount)
        ) {
          className = " node-line-up-right node-line-up";
        } else {
          className = " node-line-up-left node-line-up";
        }
      } else {
        if (indexInRow <= lowerHalf) {
          className = " node-line-up-right node-line-up";
        } else if (indexInRow > upperHalf && !isOdd(indexInRow)) {
          className = " node-line-up-left node-line-up";
        } else if (indexInRow === siblingsAmount && siblingsAmount > 3) {
          className = " node-line-up-right-long node-line-up";
        } else if (indexInRow === 3) {
          className = " node-line-up-left-half node-line-up";
        } else {
          className = " node-line-up-right-half node-line-up";
        }
      }
      return className;
    }

    if (mainContainerWidth <= laptop && mainContainerWidth > tablet) {
      if (isOdd(indexInRow)) {
        className = " node-line-up-right-half node-line-up";
      } else {
        className = " node-line-up-left-half node-line-up";
      }
      return className;
    }
  } else if (siblingsAmount > 2) {
    if (mainContainerWidth > main) {
      if (indexInRow <= siblingsAmount / 2) {
        className = " node-line-up-right node-line-up";
      } else {
        className = " node-line-up-left node-line-up";
      }
      return className;
    } else if (mainContainerWidth <= main && mainContainerWidth > laptop) {
      if (siblingsAmount <= 4) {
        if (indexInRow <= siblingsAmount / 2) {
          className = " node-line-up-right node-line-up";
        } else {
          className = " node-line-up-left node-line-up";
        }
      } else {
        if (indexInRow === 1 || indexInRow === 5) {
          className = " node-line-up-right-long node-line-up";
        } else if (indexInRow === siblingsAmount) {
          className = " node-line-up-right-half node-line-up";
        } else {
          className = " node-line-up-left node-line-up";
        }
      }
      return className;
    } else if (mainContainerWidth <= laptop && mainContainerWidth > tablet) {
      if (isOdd(indexInRow) || indexInRow === 1) {
        className = " node-line-up-right node-line-up";
      } else {
        className = " node-line-up-left node-line-up";
      }
      return className;
    }
  } else {
    className = "";
    return className;
  }
}

function getBreakpointName(width: number) {
  let breakpointName =
    width > 1500
      ? "main"
      : width > 992
        ? "laptop"
        : width > 768
          ? "tablet"
          : "mobile";
  return breakpointName;
}

function provideNewBreakpoint(
  lastBreakpoint: string,
  mainContainerWidth: number,
): boolean {
  switch (lastBreakpoint) {
    case "main":
      // For "main", only change the breakpoint if we go below or above 1500
      return mainContainerWidth < 1500;
    case "laptop":
      // For "laptop", there's only a new breakpoint if we go outside of 992 to 1500
      return mainContainerWidth > 1500 || mainContainerWidth < 992;
    case "tablet":
      // For "tablet", we don't change when going below 992 since that's already covered by "mobile"
      // But we switch if we go above 992 or below 768
      return mainContainerWidth > 992 || mainContainerWidth < 768;
    case "mobile":
      // For "mobile", we switch to a new breakpoint if we are above 768
      return mainContainerWidth > 768;
    default:
      // If "lastBreakpoint" is not one of the above, we assume no change
      return false;
  }
}
