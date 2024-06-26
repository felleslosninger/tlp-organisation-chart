import {
  OrgChartData,
  Layout,
  Node,
  Column,
  Row,
  TableOfContentsItem,
} from './types';

const prefix = 'och';

export function generateOrgChart(data: OrgChartData, containerId: string) {
  const { nodes, layouts, meta, toc } = data;

  //if meta.customIdPrefix is defined, set idPrefix to the value of meta.customIdPrefix
  const idPrefix = meta.customIdPrefix ? meta.customIdPrefix : prefix;

  let currentRowIndex = 0;
  let allowedBreakpoints = { main: 1500, laptop: 992, tablet: 768 };
  let mainContainerWidth =
    document.getElementById(containerId)?.offsetWidth || 0;
  let currentLayout = provideLayout(
    mainContainerWidth,
    allowedBreakpoints,
  ).providedLayout;

  let rootElementId = `${idPrefix}-${nodes[0].id}`;
  let lastElementId = findLastElementId(currentLayout);

  let isMobile = false;
  let isTablet = false;
  let isLaptop = false;
  let isMain = false;

  function provideLayout(
    mainContainerWidth: number,
    breakpoints: { main: number; laptop: number; tablet: number },
  ) {
    let providedLayout = layouts.main;
    let layoutName = 'main';

    const { main, laptop } = breakpoints;

    //if the window width is less than 1500px, set the currentLayout to laptop
    if (mainContainerWidth < main && layouts.laptop) {
      providedLayout = layouts.laptop;
      layoutName = 'laptop';
    }
    //if the window width is less than 992px, set the currentLayout to tablet.
    if (mainContainerWidth < laptop && layouts.tablet) {
      providedLayout = layouts.tablet;
      layoutName = 'tablet';
    }

    return { providedLayout: providedLayout, layoutName: layoutName };
  }

  function findNodeById(id: string | string[]) {
    return nodes.find((node: Node) => node.id === id);
  }

  function createChildren(
    parentSiblingsAmount: number,
    children: string[],
    parentId: string[],
  ) {
    const childrenList = createElement('div');

    childrenList.className = `${prefix}-node-children`;
    if (parentSiblingsAmount <= 2 && !isMobile) {
      childrenList.style.width = '290px';
    }

    children.forEach((childId: string, index: number) => {
      const childData = findNodeById(childId);
      const childElement = createElement('div');
      childElement.className = `${prefix}-node`;

      if (childData) {
        const innerChild = childData.url
          ? createElement('a')
          : createElement('div');

        //if nodeElement is anchor, provide href
        if (childData.url && innerChild instanceof HTMLAnchorElement) {
          innerChild.href = childData.url;
          innerChild.classList.add(`${prefix}-node-children-anchor`);
        }
        innerChild.id = `${idPrefix}-${childData.id}`;
        innerChild.setAttribute('role', 'treeitem');
        innerChild.setAttribute('aria-level', '3');

        if (!childData.url) {
          innerChild.tabIndex = -1;
        }

        innerChild.innerHTML = childData.title;
        innerChild.className = `${prefix}-node ${prefix}-inner-node ${prefix}-node-child`;
        innerChild.style.color = childData.textColor;
        innerChild.style.backgroundColor = childData.backgroundColor;

        const arrowNavigationAttributes = getChildArrowNavigation(
          index,
          children,
          parentId,
        );

        arrowNavigationAttributes.forEach((dataAttribute) => {
          innerChild.setAttribute(
            dataAttribute.key,
            `${idPrefix}-${dataAttribute.id}`,
          );
        });
        childElement.appendChild(innerChild);
        childrenList.appendChild(childElement);
      }
    });

    return childrenList;
  }

  function createNode({
    node,
    siblingsAmount,
    indexInRow,
    isLastRow,
    specialColumnList,
    isRoot,
  }: {
    node: Column;
    siblingsAmount: number;
    indexInRow: number;
    isLastRow: boolean;
    specialColumnList: number[];
    isRoot?: boolean | undefined;
  }) {
    const nodeData = findNodeById(node.id[0]);
    if (nodeData) {
      const nodeElement = createElement('div');

      const innerNode = document.createElement(nodeData.url ? 'a' : 'div');

      //give nodeElement id
      innerNode.id = `${idPrefix}-${nodeData.id}`;

      if (node.children && !isRoot) {
        innerNode.setAttribute(
          'aria-owns',
          createChildrenList(node.children, idPrefix).join(' '),
        );
      } else if (isRoot) {
        innerNode.setAttribute(
          'aria-owns',
          getRootChildren(currentLayout, idPrefix).join(' '),
        );
      }

      //give role treeitem to nodeElement
      innerNode.setAttribute('role', 'treeitem');
      innerNode.setAttribute('aria-level', `${isRoot ? 1 : 2}`);

      const arrowNavigationAttributes = getArrowNavigaitonData({
        layout: currentLayout,
        isRoot: isRoot ? true : false,
        indexInRow,
        siblingsAmount,
        currentRowIndex,
        isLastRow,
        children: node.children ? node.children : null,
        specialColumnList,
      });

      arrowNavigationAttributes.forEach((dataAttribute) => {
        innerNode.setAttribute(
          dataAttribute.key,
          `${idPrefix}-${dataAttribute.id}`,
        );
      });

      //tabIndex is 0 if nodeElement is anchor, else -1
      if (isRoot && !nodeData.url) {
        innerNode.tabIndex = 0;
      } else if (!nodeData.url) {
        innerNode.tabIndex = -1;
      }

      //if nodeData has border, provide border
      if (nodeData.border) {
        innerNode.style.border = `2px ${nodeData.border} #000`;
      }

      //if nodeElement is anchor, provide href
      if (nodeData.url && innerNode instanceof HTMLAnchorElement) {
        innerNode.href = nodeData.url;
      }
      innerNode.style.backgroundColor = nodeData.backgroundColor;
      innerNode.style.color = nodeData.textColor;
      innerNode.innerHTML = nodeData.title;
      nodeData.opacity && (innerNode.style.opacity = nodeData.opacity + '%');
      innerNode.classList.add(`${prefix}-node`, `${prefix}-inner-node`);
      nodeElement.appendChild(innerNode);
      nodeElement.classList.add(`${prefix}-node`);

      //if siblingsAmount is less 2, set max-with to 300px
      if (siblingsAmount && siblingsAmount <= 2 && !isMobile) {
        nodeElement.style.width = '290px';
      }

      if (!isMobile) {
        const nodeLines = createNodeLineClass({
          indexInRow,
          siblingsAmount,
          isLastRow,
          alignment: node.alignment ? node.alignment : undefined,
          specialColumnList,
          isTablet,
          isLaptop,
        });
        nodeLines && nodeElement.classList.add(...nodeLines);
      }

      return nodeElement;
    } else {
      return null;
    }
  }

  function createSpecialColumn({
    column,
    columnWidth,
    siblingsAmount,
    additionalWidth,
    indexInRow,
    isLastRow,
    wrapNodesContainer,
    indexToColumnsWithSpecialColumnList,
    isRoot,
  }: {
    column: Column;
    columnWidth: number;
    siblingsAmount: number;
    additionalWidth: number;
    indexInRow: number;
    isLastRow: boolean;
    wrapNodesContainer: boolean;
    indexToColumnsWithSpecialColumnList: number[];
    isRoot: boolean;
  }) {
    const columnElement = createElement('div');
    columnElement.className = `${prefix}-column`;
    isMobile
      ? (columnElement.style.width = '100%')
      : (columnElement.style.width = `calc(${columnWidth}% + ${additionalWidth}px)`);

    //if column.id is an array, create a special column
    if (Array.isArray(column.id) && column.id.length > 1) {
      const nodesWrapper = createElement('div');
      nodesWrapper.setAttribute('role', 'group');
      if (column.children) {
        nodesWrapper.setAttribute(
          'aria-owns',
          createChildrenList(column.children, idPrefix).join(' '),
        );
      }

      if (isMobile || isTablet) {
        if (isLastRow && indexInRow === siblingsAmount && !isMobile) {
          if (indexToColumnsWithSpecialColumnList.length === 1) {
            if (indexToColumnsWithSpecialColumnList.includes(4)) {
              nodesWrapper.className = `${prefix}-nodes-container-wrap`;
            } else if (
              indexToColumnsWithSpecialColumnList.includes(2) &&
              siblingsAmount === 2
            ) {
              nodesWrapper.className = `${prefix}-nodes-container-wrap`;
            } else {
              nodesWrapper.className = `${prefix}-nodes-container`;
            }
          } else if (
            indexToColumnsWithSpecialColumnList.length === 2 &&
            indexToColumnsWithSpecialColumnList.includes(4)
          ) {
            nodesWrapper.className = `${prefix}-nodes-container-wrap`;
          } else if (
            indexToColumnsWithSpecialColumnList.length === 2 &&
            indexToColumnsWithSpecialColumnList.includes(2) &&
            siblingsAmount === 2
          ) {
            nodesWrapper.className = `${prefix}-nodes-container-wrap`;
          } else {
            nodesWrapper.className = `${prefix}-nodes-container`;
          }
        } else {
          nodesWrapper.className = `${prefix}-nodes-container-wrap`;
        }
      } else {
        nodesWrapper.className = `${prefix}-nodes-container`;
      }

      wrapNodesContainer === true &&
        nodesWrapper.classList.add(`${prefix}-nodes-container-wrap`);

      if (!isMobile) {
        nodesWrapper.classList.add(
          createSpecialColumnLines({
            indexToColumnsWithSpecialColumnList,
            indexInRow,
            siblingsAmount,
            isWrapped: wrapNodesContainer,
            isLaptop,
            isTablet,
            isLastRow,
          }),
        );
      }

      column.id.forEach((nodeId: string, index: number) => {
        const nodeData = findNodeById(nodeId);
        if (nodeData) {
          const nodeElement = createElement('div');
          nodeElement.className = `${prefix}-node `;
          const innerNode = document.createElement(nodeData.url ? 'a' : 'div');
          innerNode.className = `${prefix}-inner-node`;
          innerNode.id = `${idPrefix}-${nodeId}`;

          //if nodeData has border, provide border
          if (nodeData.border) {
            innerNode.style.border = `2px ${nodeData.border} #000`;
          }

          //if nodeElement is anchor, provide href
          if (nodeData.url && innerNode instanceof HTMLAnchorElement) {
            innerNode.href = nodeData.url;
          }

          const arrowNavigationAttributes = getArrowNavigaitonDataSpecialColum({
            layout: currentLayout,
            indexInRow,
            siblingsAmount,
            currentRowIndex,
            isLastRow,
            children: column.children ? column.children : null,
            indexInColumn: index,
          });

          arrowNavigationAttributes.forEach((dataAttribute) => {
            innerNode.setAttribute(
              dataAttribute.key,
              `${idPrefix}-${dataAttribute.id}`,
            );
          });

          !nodeData.url && (innerNode.tabIndex = -1);

          innerNode.style.backgroundColor = nodeData.backgroundColor;
          innerNode.style.color = nodeData.textColor;
          innerNode.innerHTML = nodeData.title;
          innerNode.setAttribute('role', 'treeitem');
          innerNode.setAttribute('aria-level', '2');
          nodeElement.appendChild(innerNode);
          nodesWrapper.appendChild(nodeElement);
        }
      });

      columnElement.appendChild(nodesWrapper);
    } else {
      const simpleNode = createNode({
        node: column,
        siblingsAmount: siblingsAmount + 1,
        indexInRow,
        isLastRow,
        specialColumnList: indexToColumnsWithSpecialColumnList,
      });
      if (simpleNode !== null) {
        columnElement.appendChild(simpleNode);
      }
    }

    if (column.children && !isRoot) {
      columnElement.appendChild(
        createChildren(3, column.children ? column.children : [], column.id),
      );
    }

    return columnElement;
  }

  function createColumn({
    column,
    columnWidth,
    siblingsAmount,
    additionalWidth,
    indexInRow,
    isLastRow,
    specialColumnList,
    isRoot,
  }: {
    column: Column;
    columnWidth: number;
    siblingsAmount: number;
    additionalWidth: number;
    indexInRow: number;
    isLastRow: boolean;
    specialColumnList: number[];
    isRoot: boolean;
  }) {
    const columnElement = createElement('div');
    columnElement.className = `${prefix}-column`;

    // Allow alignment for columns in rows with 2 or less siblings
    if (column.alignment && siblingsAmount <= 2 && !isMobile) {
      columnElement.classList.add(
        `${prefix}-column-alignment-${siblingsAmount}-${column.alignment}`,
      );
      if (
        column.alignment === 'offset-left' ||
        column.alignment === 'offset-right'
      ) {
        columnElement.classList.add(
          `${prefix}-column-line-${column.alignment}`,
        );
      }
    }

    if (siblingsAmount === 2 && indexInRow === 1 && !isMobile) {
      columnElement.classList.add(`${prefix}-column-flex-end`);
    } else if (siblingsAmount === 2 && indexInRow === 2 && !isMobile) {
      columnElement.classList.add(`${prefix}-column-flex-start`);
    }

    const innerColumn = createNode({
      node: column,
      siblingsAmount,
      indexInRow,
      isLastRow,
      specialColumnList,
      isRoot,
    });

    columnElement.style.width = isMobile
      ? '100%'
      : `calc(${columnWidth}% + ${additionalWidth}px)`;

    if (innerColumn !== null) {
      columnElement.appendChild(innerColumn);
    }

    if (column.children && !isRoot) {
      columnElement.appendChild(
        createChildren(siblingsAmount, column.children, column.id),
      );
    }

    return columnElement;
  }

  function createRow(row: Row, isLastRow: boolean, isRoot: boolean) {
    const rowElement = createElement('div');

    rowElement.classList.add(`${prefix}-row`, `${prefix}-row-normal`);

    if (isEvenOrOne(row.row.length) && !isMobile) {
      if (row.row.length <= 2) {
        rowElement.classList.add(`${prefix}-row-center`);
      }
    }

    let count = 0;

    let rowContainsSpecialColumns = false;
    row.row.forEach((column: Column) => {
      if (Array.isArray(column.id) && column.id.length > 1) {
        rowContainsSpecialColumns = true;
      }
    });

    let indexToSpecialColumnList: number[] = [];

    if (rowContainsSpecialColumns) {
      row.row.forEach((column: Column, index: number) => {
        if (column.id.length > 1) {
          indexToSpecialColumnList.push(index + 1);
        }
      });
    }

    if (isLastRow) {
      const lastRowClass = getLastRowClass({
        row,
        isMobile,
        isLaptop,
        isTablet,
        rowContainsSpecialColumns,
        specialColumnList: indexToSpecialColumnList,
      });
      lastRowClass && rowElement.classList.add(...lastRowClass);
    }

    //find out if the row contains a column with alignment === offset-left or offset-right
    let rowContainsOffsetColumn = false;
    row.row.forEach((column: Column) => {
      if (
        column.alignment === 'offset-left' ||
        column.alignment === 'offset-right'
      ) {
        rowContainsOffsetColumn = true;
      }
    });

    row.row.forEach((column: Column) => {
      count++;

      const columnWidth = calculateColumnWidth({
        isMain,
        isLaptop,
        isTablet,
        siblingsAmount: row.row.length,
        indexInRow: count,
        isLastRow,
        rowContainsSpecialColumns,
        indexToSpecialColumnList,
        rowContainsOffsetColumn,
      });

      switch (rowContainsSpecialColumns) {
        case false:
          rowElement.appendChild(
            createColumn({
              column,
              columnWidth: columnWidth.width,
              siblingsAmount: row.row.length,
              additionalWidth: columnWidth.additionalWidth,
              indexInRow: count,
              isLastRow,
              specialColumnList: indexToSpecialColumnList,
              isRoot,
            }),
          );
          break;
        case true:
          rowElement.appendChild(
            createSpecialColumn({
              column,
              columnWidth: columnWidth.width,
              siblingsAmount: row.row.length,
              additionalWidth: columnWidth.additionalWidth,
              indexInRow: count,
              isLastRow,
              wrapNodesContainer: columnWidth.wrapNodesWrapper,
              indexToColumnsWithSpecialColumnList: indexToSpecialColumnList,
              isRoot: false,
            }),
          );
          break;
        default:
          break;
      }
      rowElement.classList.add(...columnWidth.additionalClass);
    });

    if (!isMobile && !isLastRow) {
      rowElement.classList.add(`${prefix}-row-line`);
    }
    if ((!isMain && row.row.length > 2) || (isMobile && row.row.length === 2)) {
      rowElement.classList.add(`${prefix}-wrap`);
    }

    if (!isMobile && isLastRow) {
      rowElement.style.setProperty(
        '--diff',
        calculateChildrenDifferenceInRow({
          row,
          siblingsAmount: row.row.length,
          isLaptop,
          isTablet,
          specialColumnList: indexToSpecialColumnList,
        }).toString(),
      );
    }

    return rowElement;
  }

  function createRowsWrapper(layout: Layout) {
    const rows = createElement('div');
    rows.className = `${prefix}-rows`;
    rows.setAttribute('role', 'tree');
    rows.setAttribute('aria-label', meta.title);
    rows.role = 'tree';

    layout.rows.forEach((row: Row, index: number) => {
      const isLastRow = index === layout.rows.length - 1;
      const isRoot = index === 0 ? true : false;

      rows.appendChild(createRow(row, isLastRow, isRoot));
      currentRowIndex = index + 1;
    });

    return rows;
  }

  //find the main container
  const mainContainer = document.getElementById(containerId);

  if (mainContainer) {
    // Create element to hold the org chart
    const orgChart = document.createElement('div');
    orgChart.setAttribute('lang', meta.langcode);
    orgChart.setAttribute('aria-label', meta.title);

    // Initial setup based on mainContainer's current width
    mainContainerWidth = mainContainer.offsetWidth;

    const device = getDevice(mainContainerWidth, allowedBreakpoints);
    isMobile = device.mobile;
    isLaptop = device.laptop;
    isTablet = device.tablet;
    isMain = device.main;

    orgChart.className = `${prefix}-org-chart${isMobile ? '-mobile' : ''}`;

    orgChart.appendChild(createTOC(toc, isMobile));

    // Insert the org chart into the container
    orgChart.appendChild(createRowsWrapper(currentLayout));

    // Set the last breakpoint based on mainContainer's width
    let lastBreakpoint = getBreakpointName(mainContainerWidth);

    // Function to update layout based on mainContainer's width
    const updateLayout = () => {
      // Update variables based on the current state
      mainContainerWidth = mainContainer.offsetWidth;

      const device = getDevice(mainContainerWidth, allowedBreakpoints);
      isMobile = device.mobile;
      isLaptop = device.laptop;
      isTablet = device.tablet;
      isMain = device.main;

      if (provideNewBreakpoint(lastBreakpoint, mainContainerWidth)) {
        lastBreakpoint = getBreakpointName(mainContainerWidth);

        currentLayout = provideLayout(
          mainContainerWidth,
          allowedBreakpoints,
        ).providedLayout;

        // Update org chart's class to reflect the current layout
        orgChart.className = `${prefix}-org-chart${isMobile ? '-mobile' : ''}`;

        // Clear and re-insert the org chart into the container
        orgChart.innerHTML = '';
        orgChart.appendChild(createTOC(toc, isMobile));
        orgChart.appendChild(createRowsWrapper(currentLayout));
        keyboardNavigationn(mainContainer, rootElementId, lastElementId);
      }
    };

    let timeoutId: any = null;
    const throttleUpdateLayout = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          updateLayout();
          timeoutId = null;
        }, 100); // Wait 100ms before running updateLayout again
      }
    };

    // Create a ResizeObserver to watch for changes in size of mainContainer
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(throttleUpdateLayout); // Use requestAnimationFrame for optimal updating
    });

    // Start observing the mainContainer
    resizeObserver.observe(mainContainer);

    // Clear the container of all existing children and add the org chart
    mainContainer.innerHTML = '';
    mainContainer.appendChild(orgChart);
    mainContainer.classList.add(`${prefix}-org-chart-main-container`);

    // Add arrow key navigation to the main container
    keyboardNavigationn(mainContainer, rootElementId, lastElementId);

    return mainContainer;
  }

  return null;
}

function getDevice(
  width: number,
  breakpoints: { main: number; laptop: number; tablet: number },
): {
  mobile: boolean;
  laptop: boolean;
  tablet: boolean;
  main: boolean;
} {
  let mobile: boolean = isMobile(width, breakpoints.tablet);
  let laptop: boolean = isLaptop(width, breakpoints.main, breakpoints.laptop);
  let tablet: boolean = isTablet(width, breakpoints.laptop, breakpoints.tablet);
  let main: boolean = isMain(width, breakpoints.main);
  return {
    mobile,
    laptop,
    tablet,
    main,
  };
}

function isMobile(width: number, tabletSize: number) {
  return width < tabletSize;
}
function isLaptop(width: number, mainSize: number, laptopSize: number) {
  return width < mainSize && width > laptopSize;
}
function isTablet(width: number, laptopSize: number, tabletSize: number) {
  return width < laptopSize && width > tabletSize;
}
function isMain(width: number, mainSize: number) {
  return width > mainSize;
}

function findLastElementId(layout: Layout) {
  let lastElementId = '';
  let lastRow = layout.rows[layout.rows.length - 1];
  let lastColumn = lastRow.row[lastRow.row.length - 1];
  if (lastColumn.children) {
    let lastNode = lastColumn.children[lastColumn.children.length - 1];
    lastElementId = `${prefix}-${lastNode}`;
  } else {
    let lastNode = lastColumn.id[lastColumn.id.length - 1];
    lastElementId = `${prefix}-${lastNode}`;
  }
  return lastElementId;
}

function keyboardNavigationn(
  mainContainer: HTMLElement,
  firstElementId: string,
  lastElementId: string,
) {
  const observer = new MutationObserver(() => {
    mainContainer.removeEventListener('keydown', handleKeyDown);
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    const activeElement = document.activeElement; // The element that is currently focused

    // Variable that will hold the ID of the element to be focused based on the key press
    let targetElementId;
    // Check which arrow key is pressed and assign the relevant ID based on the 'data-arrow-*' attributes
    switch (event.key) {
      case 'Home':
        targetElementId = firstElementId;

        break;
      case 'End':
        targetElementId = lastElementId;

        break;
      case 'ArrowRight':
        targetElementId = activeElement?.getAttribute('data-arrow-right');

        break;
      case 'ArrowLeft':
        targetElementId = activeElement?.getAttribute('data-arrow-left');

        break;
      case 'ArrowDown':
        targetElementId = activeElement?.getAttribute('data-arrow-down');

        break;
      case 'ArrowUp':
        targetElementId = activeElement?.getAttribute('data-arrow-up');

        break;
    }

    // Check if a valid ID for the next element was found
    if (targetElementId) {
      const nextElement = document.getElementById(targetElementId);
      if (nextElement) {
        nextElement.focus(); // Move focus to the next element based on ID
        event.preventDefault(); // Prevent default behavior (such as scrolling)
      }
    }
  };

  mainContainer.addEventListener('keydown', handleKeyDown);
  observer.observe(mainContainer, { childList: true, subtree: true });
}

function createSpecialColumnLines({
  indexToColumnsWithSpecialColumnList,
  indexInRow,
  siblingsAmount,
  isWrapped,
  isLaptop,
  isTablet,
  isLastRow,
}: {
  indexToColumnsWithSpecialColumnList: number[];
  indexInRow: number;
  siblingsAmount: number;
  isWrapped: boolean;
  isLaptop: boolean;
  isTablet: boolean;
  isLastRow: boolean;
}) {
  let className = `${prefix}-special-column`;

  let initialSiblingsAmount = siblingsAmount;
  siblingsAmount += indexToColumnsWithSpecialColumnList.length;
  // siblins are only special columns
  if (!isWrapped && !isTablet) {
    if (
      initialSiblingsAmount === indexToColumnsWithSpecialColumnList.length ||
      (indexInRow === 1 && siblingsAmount <= 4)
    ) {
      if (indexToColumnsWithSpecialColumnList.includes(3) && indexInRow === 3) {
        if (isLaptop) {
          if (isLastRow) {
            className += '-3-center';
          } else {
            className += '-1';
          }
        } else {
          className += '-2-long';
        }
      } else if (
        siblingsAmount === 2 &&
        indexToColumnsWithSpecialColumnList.length === 1 &&
        isLastRow
      ) {
        className += `-${indexInRow}-alone`;
      } else {
        className += `-${indexInRow}`;
      }
    } else if (siblingsAmount === 3) {
      className += `-${indexInRow}`;
    } else if (siblingsAmount === 4) {
      if (indexToColumnsWithSpecialColumnList.length === 1) {
        if (
          indexToColumnsWithSpecialColumnList.includes(1) &&
          indexInRow === 1
        ) {
          className += `-1`;
        } else {
          className += `-2`;
        }
      }
    } else if (siblingsAmount === 5) {
      if (!isLaptop) {
        if (indexToColumnsWithSpecialColumnList.length === 2) {
          if (
            indexToColumnsWithSpecialColumnList.includes(1) &&
            indexToColumnsWithSpecialColumnList.includes(2)
          ) {
            className += `-${indexInRow}`;
          } else if (
            indexToColumnsWithSpecialColumnList.includes(2) &&
            indexToColumnsWithSpecialColumnList.includes(3)
          ) {
            if (indexInRow === 2) {
              {
                className += `-1`;
              }
            } else {
              className += `-2`;
            }
          } else if (
            indexToColumnsWithSpecialColumnList.includes(1) &&
            indexToColumnsWithSpecialColumnList.includes(3)
          ) {
            if (indexInRow === 1) {
              {
                className += `-1-long`;
              }
            } else {
              className += `-2`;
            }
          }
        } else {
          if (
            indexToColumnsWithSpecialColumnList.includes(1) ||
            indexToColumnsWithSpecialColumnList.includes(2)
          ) {
            if (!indexToColumnsWithSpecialColumnList.includes(2)) {
              className += `-1-long`;
            } else {
              className += `-1`;
            }
          } else if (indexToColumnsWithSpecialColumnList.includes(4)) {
            className += `-2-long`;
          } else {
            className += `-2`;
          }
        }
      } else {
        if (indexToColumnsWithSpecialColumnList.length === 2) {
          if (isLastRow) {
            if (indexInRow === 3) {
              className += `-3-center`;
            } else if (indexInRow === 1) {
              className += `-1`;
            } else {
              className += `-2`;
            }
          } else {
            if (indexInRow === 1) {
              className += `-1`;
            } else if (indexInRow === 2) {
              className += `-2`;
            } else {
              className += `-1`;
            }
          }
        } else {
          if (isLastRow) {
            if (indexInRow >= 3) {
              className += `-3-center`;
            } else {
              if (indexInRow === 1) {
                className += `-1`;
              } else {
                className += `-2`;
              }
            }
          } else {
            if (indexInRow === 1) {
              className += `-1`;
            } else if (indexInRow === 2) {
              className += `-2`;
            } else {
              className += `-1`;
            }
          }
        }
      }
    } else if (siblingsAmount === 6) {
      if (!isLaptop) {
        if (indexToColumnsWithSpecialColumnList.length === 2) {
          if (
            indexToColumnsWithSpecialColumnList.includes(1) &&
            indexInRow === 1
          ) {
            className += `-1-long`;
          } else if (
            indexToColumnsWithSpecialColumnList.includes(2) &&
            !indexToColumnsWithSpecialColumnList.includes(1) &&
            indexInRow === 2
          ) {
            className += `-1`;
          } else if (
            indexToColumnsWithSpecialColumnList.includes(4) &&
            indexInRow === 4
          ) {
            className += `-2-long`;
          } else if (indexToColumnsWithSpecialColumnList.includes(3)) {
            className += `-2`;
          } else {
            className += `-2`;
          }
        } else {
          if (indexInRow <= 2) {
            className += `-${indexInRow === 1 ? '1-long' : '1'}`;
          } else {
            className += `-${indexInRow === 4 ? '2' : '2-long'}`;
          }
        }
      } else {
        if (
          (indexToColumnsWithSpecialColumnList.length === 2 &&
            indexInRow === initialSiblingsAmount &&
            isLastRow) ||
          (indexToColumnsWithSpecialColumnList.length === 1 &&
            indexInRow === initialSiblingsAmount &&
            isLastRow)
        ) {
          className += `-3-center`;
        } else {
          if (indexToColumnsWithSpecialColumnList.length === 2) {
            if (
              indexToColumnsWithSpecialColumnList.includes(2) &&
              indexToColumnsWithSpecialColumnList.includes(1)
            ) {
              if (indexInRow === 1) {
                className += `-1`;
              } else {
                className += `-2`;
              }
            } else if (
              indexToColumnsWithSpecialColumnList.includes(2) &&
              indexToColumnsWithSpecialColumnList.includes(3)
            ) {
              if (indexInRow === 2) {
                className += `-2`;
              } else {
                className += `-1`;
              }
            } else if (
              indexToColumnsWithSpecialColumnList.includes(3) &&
              indexToColumnsWithSpecialColumnList.includes(4)
            ) {
              if (indexInRow === 3) {
                className += `-2`;
              } else {
                className += `-1`;
              }
            } else if (
              indexToColumnsWithSpecialColumnList.includes(2) &&
              indexToColumnsWithSpecialColumnList.includes(4)
            ) {
              className += `-2`;
            } else if (
              indexToColumnsWithSpecialColumnList.includes(1) &&
              indexToColumnsWithSpecialColumnList.includes(3)
            ) {
              className += `-1`;
            } else if (
              indexToColumnsWithSpecialColumnList.includes(1) &&
              indexToColumnsWithSpecialColumnList.includes(4)
            ) {
              className += `-${indexInRow === 1 ? '1' : '2'}`;
            }
          } else {
            if (indexInRow === 1 || indexInRow === 4 || indexInRow === 5) {
              className += `-1`;
            } else {
              className += `-2`;
            }
          }
        }
      }
    }
  } else if (isWrapped && !isTablet) {
    if (!isLaptop) {
      if (indexInRow === 2) {
        className += `-3-right-short`;
      } else {
        className += `-3-left-long`;
      }
    } else {
      className += `-3-right-short`;
    }
  } else {
    if (
      isLastRow &&
      indexInRow === siblingsAmount - indexToColumnsWithSpecialColumnList.length
    ) {
      if (
        (indexToColumnsWithSpecialColumnList.length === 1 &&
          indexToColumnsWithSpecialColumnList.includes(4)) ||
        (indexToColumnsWithSpecialColumnList.length === 1 &&
          indexToColumnsWithSpecialColumnList.includes(2)) ||
        (indexToColumnsWithSpecialColumnList.length === 2 &&
          indexToColumnsWithSpecialColumnList.includes(4)) ||
        (indexToColumnsWithSpecialColumnList.length === 2 &&
          indexToColumnsWithSpecialColumnList.includes(2) &&
          initialSiblingsAmount === 2 &&
          indexInRow === 2)
      ) {
        className += `-3-left-short`;
      } else {
        className += `-3-center`;
      }
    } else {
      let direction = '';
      if (isOdd(indexInRow) || indexInRow === 1) {
        direction = `right`;
      } else {
        direction += `left`;
      }

      className += `-3-${direction}-short`;
    }
  }

  return className;
}

function createElement(type: string) {
  const element = document.createElement(type);
  return element;
}

//function to create the line between the nodes
function createNodeLineClass({
  indexInRow,
  siblingsAmount,
  isLastRow,
  alignment,
  specialColumnList,
  isTablet,
  isLaptop,
}: {
  indexInRow: number;
  siblingsAmount: number;
  isLastRow: boolean;
  alignment: string | undefined;
  specialColumnList: number[];
  isTablet: boolean;
  isLaptop: boolean;
}) {
  const className: string[] = [];
  const lineUp = `${prefix}-node-line-up`;

  if (specialColumnList.length <= 0) {
    if (siblingsAmount === 1) {
      if (alignment === 'left') {
        className.push(`${prefix}-node-line-right`);
      } else if (alignment === 'right') {
        className.push(`${prefix}-node-line-left`);
      }
      return className;
    }
    if (
      siblingsAmount === 2 &&
      alignment !== 'offset-left' &&
      alignment !== 'offset-right'
    ) {
      if (indexInRow === 1) {
        className.push(`${prefix}-node-line-right`);
      } else {
        className.push(`${prefix}-node-line-left`);
      }
      return className;
    }

    if (siblingsAmount > 2 && isOdd(siblingsAmount)) {
      //if the window width is greater than 1500px
      if (!isTablet && !isLaptop) {
        let lowerHalf = (siblingsAmount - 1) / 2;
        className.push(lineUp);
        if (indexInRow <= lowerHalf) {
          className.push(`${lineUp}-right`);
        } else {
          className.push(`${lineUp}-left`);
        }
        return className;
      }

      //if the window width is less than 1500px and greater than 992px
      if (isLaptop) {
        let lowerHalf = (siblingsAmount - 1) / 2;
        let upperHalf = siblingsAmount - lowerHalf;
        if (isLastRow) {
          className.push(lineUp);
          if (
            indexInRow === 1 ||
            (isOdd(indexInRow) && indexInRow !== siblingsAmount)
          ) {
            className.push(`${lineUp}-right`);
          } else {
            className.push(`${lineUp}-left`);
          }
        } else {
          className.push(lineUp);
          if (indexInRow <= lowerHalf) {
            className.push(`${lineUp}-right`);
          } else if (indexInRow > upperHalf && !isOdd(indexInRow)) {
            className.push(`${lineUp}-left`);
          } else if (indexInRow === siblingsAmount && siblingsAmount > 3) {
            className.push(`${lineUp}-right-long`);
          } else if (indexInRow === 3) {
            className.push(`${lineUp}-left-half`);
          } else {
            className.push(`${lineUp}-right-half`);
          }
        }
        return className;
      }

      if (isTablet) {
        className.push(lineUp);
        if (isOdd(indexInRow)) {
          className.push(`${lineUp}-right-half`);
        } else {
          className.push(`${lineUp}-left-half`);
        }
        return className;
      }
    } else if (siblingsAmount > 2) {
      if (!isTablet && !isLaptop) {
        className.push(lineUp);
        if (indexInRow <= siblingsAmount / 2) {
          className.push(`${lineUp}-right`);
        } else {
          className.push(`${lineUp}-left`);
        }
        return className;
      } else if (isLaptop) {
        if (siblingsAmount <= 4) {
          className.push(lineUp);
          if (indexInRow <= siblingsAmount / 2) {
            className.push(`${lineUp}-right`);
          } else {
            className.push(`${lineUp}-left`);
          }
        } else {
          if (indexInRow === 1 || indexInRow === 5) {
            className.push(lineUp, `${lineUp}-right-long`);
          } else if (indexInRow === siblingsAmount) {
            className.push(lineUp, `${lineUp}-right-half`);
          } else {
            className.push(lineUp, `${lineUp}-left`);
          }
        }
        return className;
      } else if (isTablet) {
        className.push(lineUp);
        if (isOdd(indexInRow) || indexInRow === 1) {
          className.push(`${lineUp}-right`);
        } else {
          className.push(`${lineUp}-left`);
        }
        return className;
      }
    } else {
      return className;
    }
  } else {
    if (isTablet) {
      if (isLastRow && indexInRow === siblingsAmount - 1 && isOdd(indexInRow)) {
        className.push(`${lineUp}-long`);
      } else {
        className.push(
          lineUp,
          `${lineUp}-${isOdd(indexInRow) ? 'right-half' : 'left-half'}`,
        );
      }
    } else {
      siblingsAmount += specialColumnList.length - 1;

      if (siblingsAmount === 3) {
        className.push(lineUp);
        if (indexInRow === 1) {
          className.push(`${lineUp}-right-half`);
        } else {
          className.push(`${lineUp}-left-half`);
        }
      } else if (siblingsAmount === 4) {
        if (isLastRow && specialColumnList.includes(2)) {
          if (indexInRow === 1) {
            className.push(`${lineUp}-right`, lineUp);
          } else {
            className.push(`${lineUp}-left`, lineUp);
          }
        } else {
          if (specialColumnList.includes(1)) {
            if (indexInRow === 2) {
              className.push(`${lineUp}-left-half`, lineUp);
            } else {
              className.push(`${lineUp}-left`, lineUp);
            }
          } else if (specialColumnList.includes(2)) {
            if (isLaptop) {
              if (indexInRow === 1) {
                className.push(`${lineUp}-right`, lineUp);
              } else {
                className.push(`${lineUp}-left-half`, lineUp);
              }
            } else {
              if (indexInRow === 1) {
                className.push(`${lineUp}-right-half`, lineUp);
              } else {
                className.push(`${lineUp}-left`, lineUp);
              }
            }
          } else if (specialColumnList.includes(3)) {
            if (indexInRow === 1) {
              className.push(`${lineUp}-right`, lineUp);
            } else {
              className.push(`${lineUp}-right-half`, lineUp);
            }
          }
        }
      } else if (siblingsAmount === 5) {
        if (specialColumnList.length === 2) {
          if (specialColumnList.includes(1) && specialColumnList.includes(2)) {
            className.push(
              `${lineUp}-${isLaptop ? 'right-half' : 'left'}`,
              lineUp,
            );
          } else if (
            specialColumnList.includes(2) &&
            specialColumnList.includes(3)
          ) {
            className.push(
              `${lineUp}-${isLaptop ? 'right-half' : 'right'}`,
              lineUp,
            );
          } else if (
            specialColumnList.includes(1) &&
            specialColumnList.includes(3)
          ) {
            className.push(
              `${lineUp}-${isLaptop ? 'left-half' : 'right-half'}`,
              lineUp,
            );
          }
        } else {
          if (
            (isLastRow && specialColumnList.includes(4)) ||
            (isLastRow && specialColumnList.includes(3))
          ) {
            if (indexInRow === 1) {
              className.push(
                `${lineUp}-${isLaptop || isTablet ? 'right-half' : 'right'}`,
                lineUp,
              );
            } else if (indexInRow === 2) {
              className.push(
                `${lineUp}-${isLaptop || isTablet ? 'left-half' : 'right'}`,
                lineUp,
              );
            } else if (indexInRow === 3) {
              className.push(`${lineUp}-right`, lineUp);
            } else if (indexInRow === 4) {
              className.push(`${lineUp}-left`, lineUp);
            }
          } else if (specialColumnList.includes(1)) {
            if (indexInRow === 2) {
              className.push(
                `${lineUp}-${isLaptop ? 'left-half' : 'right-half'}`,
                lineUp,
              );
            } else if (indexInRow === 3) {
              className.push(
                `${lineUp}-${isLaptop ? 'right-half' : 'left-half'}`,
                lineUp,
              );
            } else {
              className.push(
                `${lineUp}-${isLaptop ? 'left-half' : 'left'}`,
                lineUp,
              );
            }
          } else if (specialColumnList.includes(2)) {
            if (indexInRow === 1) {
              className.push(
                `${lineUp}-${isLaptop ? 'right-half' : 'right'}`,
                lineUp,
              );
            } else if (indexInRow === 3) {
              className.push(
                `${lineUp}-${isLaptop ? 'right' : 'left-half'}`,
                lineUp,
              );
            } else {
              if (isLastRow) {
                className.push(
                  `${lineUp}-${isLaptop ? 'left-half' : 'left'}`,
                  lineUp,
                );
              } else {
                className.push(
                  `${lineUp}-${isLaptop ? 'right-half' : 'left'}`,
                  lineUp,
                );
              }
            }
          } else if (specialColumnList.includes(3)) {
            if (indexInRow === 1) {
              className.push(
                `${lineUp}-${isLaptop ? 'right-half' : 'right'}`,
                lineUp,
              );
            } else if (indexInRow === 2) {
              className.push(
                `${lineUp}-${isLaptop ? 'left-half' : 'right-half'}`,
                lineUp,
              );
            } else {
              className.push(
                `${lineUp}-${isLaptop ? 'left-half' : 'left'}`,
                lineUp,
              );
            }
          } else if (specialColumnList.includes(4)) {
            if (indexInRow === 1) {
              className.push(`${lineUp}-right`, lineUp);
            } else if (indexInRow === 2) {
              className.push(`${lineUp}-right-half`, lineUp);
            } else {
              className.push(`${lineUp}-left`, lineUp);
            }
          }
        }
      } else if (siblingsAmount === 6) {
        if (specialColumnList.length === 2) {
          if (specialColumnList.includes(1) && specialColumnList.includes(2)) {
            if (isLaptop) {
              if (isLastRow) {
                className.push(
                  `${lineUp}-${indexInRow === 3 ? 'right-half' : 'left-half'}`,
                  lineUp,
                );
              } else {
                className.push(
                  `${lineUp}-${indexInRow === 3 ? 'right' : 'right-half'}`,
                  lineUp,
                );
              }
            } else {
              className.push(`${lineUp}-left`, lineUp);
            }
          } else if (
            specialColumnList.includes(3) &&
            specialColumnList.includes(4)
          ) {
            className.push(
              `${lineUp}-${indexInRow === 2 ? 'right-half' : 'right'}`,
              lineUp,
            );
          } else if (
            specialColumnList.includes(2) &&
            specialColumnList.includes(3)
          ) {
            if (isLaptop) {
              className.push(
                `${lineUp}-${indexInRow === 1 ? 'right-half' : 'left-half'}`,
                lineUp,
              );
            } else {
              className.push(
                `${lineUp}-${indexInRow === 1 ? 'right' : 'left'}`,
                lineUp,
              );
            }
          } else if (
            specialColumnList.includes(2) &&
            specialColumnList.includes(4)
          ) {
            if (isLaptop) {
              className.push(
                `${lineUp}-${indexInRow === 1 ? 'right-half' : 'right'}`,
                lineUp,
              );
            } else {
              className.push(
                `${lineUp}-${indexInRow === 1 ? 'right' : 'left-half'}`,
                lineUp,
              );
            }
          } else if (
            specialColumnList.includes(1) &&
            specialColumnList.includes(3)
          ) {
            if (isLaptop) {
              className.push(`${lineUp}-left-half`, lineUp);
            } else {
              className.push(
                `${lineUp}-${indexInRow === 2 ? 'right-half' : 'left'}`,
                lineUp,
              );
            }
          } else if (
            specialColumnList.includes(1) &&
            specialColumnList.includes(4)
          ) {
            if (isLaptop) {
              className.push(
                `${lineUp}-${indexInRow === 2 ? 'left-half' : 'right'}`,
                lineUp,
              );
            } else {
              className.push(
                `${lineUp}-${indexInRow === 2 ? 'right-half' : 'left-half'}`,
                lineUp,
              );
            }
          }
        } else {
          if (specialColumnList.includes(1)) {
            if (isLaptop) {
              className.push(
                `${lineUp}-${indexInRow === 3 ? 'right' : indexInRow === 2 ? 'left-half' : 'left'}`,
                lineUp,
              );
            } else {
              className.push(
                `${lineUp}-${indexInRow === 2 ? 'right-half' : indexInRow === 3 ? 'left-half' : 'left'}`,
                lineUp,
              );
            }
          } else if (specialColumnList.includes(2)) {
            if (isLaptop) {
              className.push(
                `${lineUp}-${indexInRow === 1 || indexInRow === 4 ? 'right-half' : indexInRow === 3 ? 'right' : 'left-half'}`,
                lineUp,
              );
            } else {
              className.push(
                `${lineUp}-${indexInRow === 1 ? 'right' : indexInRow === 3 ? 'left-half' : 'left'}`,
                lineUp,
              );
            }
          } else if (specialColumnList.includes(3)) {
            if (isLaptop) {
              className.push(
                `${lineUp}-${indexInRow === 1 || indexInRow === 4 ? 'right' : 'right-half'}`,
                lineUp,
              );
            } else {
              className.push(
                `${lineUp}-${indexInRow === 1 ? 'right' : indexInRow === 2 ? 'right-half' : 'left'}`,
                lineUp,
              );
            }
          } else if (specialColumnList.includes(4)) {
            if (isLaptop) {
              className.push(
                `${lineUp}-${indexInRow === 1 ? 'right' : indexInRow === 2 ? 'right-half' : 'left-half'}`,
                lineUp,
              );
            } else {
              className.push(
                `${lineUp}-${indexInRow === 3 ? 'right-half' : indexInRow === 5 ? 'left' : 'right'}`,
                lineUp,
              );
            }
          } else if (specialColumnList.includes(5)) {
            className.push(
              `${lineUp}-${indexInRow === 3 ? 'right-half' : indexInRow === 4 ? 'left-half' : 'right'}`,
              lineUp,
            );
          }
        }
      }
    }
    return className;
  }
}

// create a that takes a number, and return true if the number is even or 1, false if the number is odd
function isEvenOrOne(num: number) {
  return num % 2 === 0 || num === 1;
}

function isOdd(number: number) {
  return number % 2 !== 0;
}

function getBreakpointName(width: number) {
  let breakpointName: string;
  switch (true) {
    case width > 1500:
      breakpointName = 'main';
      break;
    case width > 992:
      breakpointName = 'laptop';
      break;
    case width > 768:
      breakpointName = 'tablet';
      break;
    default:
      breakpointName = 'mobile';
      break;
  }
  return breakpointName;
}

function provideNewBreakpoint(
  lastBreakpoint: string,
  mainContainerWidth: number,
): boolean {
  switch (lastBreakpoint) {
    case 'main':
      // For "main", only change the breakpoint if we go below or above 1500
      return mainContainerWidth < 1500;
    case 'laptop':
      // For "laptop", there's only a new breakpoint if we go outside of 992 to 1500
      return mainContainerWidth > 1500 || mainContainerWidth < 992;
    case 'tablet':
      // For "tablet", we don't change when going below 992 since that's already covered by "mobile"
      // But we switch if we go above 992 or below 768
      return mainContainerWidth > 992 || mainContainerWidth < 768;
    case 'mobile':
      // For "mobile", we switch to a new breakpoint if we are above 768
      return mainContainerWidth > 768;
    default:
      // If "lastBreakpoint" is not one of the above, we assume no change
      return false;
  }
}

function getLastRowClass({
  row,
  isMobile,
  isLaptop,
  isTablet,
  rowContainsSpecialColumns,
  specialColumnList,
}: {
  row: Row;
  isMobile: boolean;
  isLaptop: boolean;
  isTablet: boolean;
  rowContainsSpecialColumns: boolean;
  specialColumnList: number[];
}) {
  let rowLength = row.row.length;
  const tabletClass = isTablet ? '-tablet' : '';
  const isLaptopOrTablet = isLaptop ? '-laptop' : isTablet ? '-tablet' : '';
  const classList: string[] = [`${prefix}-row`];

  if (rowContainsSpecialColumns && specialColumnList) {
    rowLength += specialColumnList.length;
  }

  if (!isMobile && rowLength >= 5) {
    if (specialColumnList.length >= 2) {
      classList.push(
        `${prefix}-row-last-${rowLength}${isLaptopOrTablet}-${specialColumnList.length}-s-cols`,
      );
      return classList;
    } else if (rowLength === 5 && specialColumnList.length >= 1) {
      classList.push(
        `${prefix}-row-last-${rowLength}${isLaptopOrTablet}-1-s-cols`,
      );
      return classList;
    } else {
      classList.push(`${prefix}-row-last-${rowLength}${isLaptopOrTablet}`);
      return classList;
    }
  } else if (!isMobile && rowLength >= 2) {
    if (
      (specialColumnList.length && rowLength === 3 && isTablet) ||
      (specialColumnList.length && rowLength === 3 && isLaptop)
    ) {
      classList.push(`${prefix}-row-last-${rowLength}-1-s-cols`);
      return classList;
    } else if (specialColumnList.length && rowLength === 4) {
      if (specialColumnList.length === 2) {
        classList.push(`${prefix}-row-last-${rowLength}`);
        return classList;
      } else {
        classList.push(`${prefix}-row-last-${rowLength}${tabletClass}`);
        return classList;
      }
    } else {
      if (!rowContainsSpecialColumns) {
        classList.push(`${prefix}-row-last-${rowLength}${tabletClass}`);
        return classList;
      }
    }
  } else if (!isMobile && rowLength <= 2) {
    classList.push(`${prefix}-row-last-${rowLength}`);
    return classList;
  } else {
    return classList;
  }
}

function calculateChildrenDifferenceInRow({
  row,
  siblingsAmount,
  isLaptop,
  isTablet,
  specialColumnList,
}: {
  row: Row;
  siblingsAmount: number;
  isLaptop: boolean;
  isTablet: boolean;
  specialColumnList: number[];
}) {
  let diff = 0;
  if (specialColumnList.length > 0) {
    siblingsAmount += specialColumnList.length;
    if (isLaptop) {
      if (siblingsAmount === 4) {
        let upperHalfHighest = findHighestChildrenAmountInRow(row, 0, 1);

        diff = upperHalfHighest;
      } else if (siblingsAmount === 5) {
        if (specialColumnList.length === 1) {
          let upperHalfHighest = findHighestChildrenAmountInRow(row, 0, 1);
          let lowerHalfHighest = findHighestChildrenAmountInRow(row, 2, 3);
          diff = upperHalfHighest - lowerHalfHighest;
        } else {
          let firstColumn = findHighestChildrenAmountInRow(row, 0, 0);
          let secondColumn = findHighestChildrenAmountInRow(row, 1, 1);
          let thirdColumn = findHighestChildrenAmountInRow(row, 2, 2);

          diff = getHighestNumber(firstColumn, secondColumn) - thirdColumn;
        }
      } else if (siblingsAmount === 6) {
        let upperHalfHighest = 0;
        if (
          specialColumnList.length > 2 ||
          specialColumnList.includes(4) ||
          specialColumnList.includes(3)
        ) {
          upperHalfHighest = findHighestChildrenAmountInRow(row, 0, 2);
        } else if (
          specialColumnList.includes(2) ||
          specialColumnList.includes(1)
        ) {
          upperHalfHighest = findHighestChildrenAmountInRow(row, 0, 1);
        } else {
          upperHalfHighest = findHighestChildrenAmountInRow(row, 0, 3);
        }
        diff = upperHalfHighest;
      }
    } else if (isTablet) {
      if (siblingsAmount === 4) {
        let upperHalfHighest = findHighestChildrenAmountInRow(row, 0, 1);
        let lowerHalfHighest = findHighestChildrenAmountInRow(row, 2, 2);
        diff = upperHalfHighest - lowerHalfHighest;
      } else if (siblingsAmount === 5) {
        ///
        if (specialColumnList.length === 1) {
          let firstColumn = specialColumnList.includes(1)
            ? findHighestChildrenAmountInRow(row, 0, 0) + 1
            : findHighestChildrenAmountInRow(row, 0, 0);
          let secondColumn = specialColumnList.includes(2)
            ? findHighestChildrenAmountInRow(row, 1, 1) + 1
            : findHighestChildrenAmountInRow(row, 1, 1);
          let thirdColumn = specialColumnList.includes(3)
            ? findHighestChildrenAmountInRow(row, 2, 2) + 1
            : findHighestChildrenAmountInRow(row, 2, 2);
          let fourthColumn = specialColumnList.includes(4)
            ? findHighestChildrenAmountInRow(row, 3, 3) + 1
            : findHighestChildrenAmountInRow(row, 3, 3);

          diff =
            getHighestNumber(firstColumn, secondColumn) -
            getHighestNumber(thirdColumn, fourthColumn);
        } else {
          let firstColumn = specialColumnList.includes(1)
            ? findHighestChildrenAmountInRow(row, 0, 0) + 1
            : findHighestChildrenAmountInRow(row, 0, 0);
          let secondColumn = specialColumnList.includes(2)
            ? findHighestChildrenAmountInRow(row, 1, 1) + 1
            : findHighestChildrenAmountInRow(row, 1, 1);
          let thirdColumn = findHighestChildrenAmountInRow(row, 2, 2);

          diff = getHighestNumber(firstColumn, secondColumn) - thirdColumn;
        }
        //
      } else if (siblingsAmount === 6) {
        if (specialColumnList.length === 3) {
          let upperHalfHighest = findHighestChildrenAmountInRow(row, 0, 1);
          diff = upperHalfHighest;
        } else if (specialColumnList.length >= 2) {
          let firstColumn = specialColumnList.includes(1)
            ? findHighestChildrenAmountInRow(row, 0, 0) + 1
            : findHighestChildrenAmountInRow(row, 0, 0);
          let secondColumn = specialColumnList.includes(2)
            ? findHighestChildrenAmountInRow(row, 1, 1) + 1
            : findHighestChildrenAmountInRow(row, 1, 1);

          diff = getHighestNumber(firstColumn, secondColumn) - 1;
        } else {
          let upperThirdHighest = findHighestChildrenAmountInRow(row, 0, 1);
          let middleHalfHighest = findHighestChildrenAmountInRow(row, 2, 3);
          diff = upperThirdHighest + middleHalfHighest;
        }
      }
    }
  } else {
    if (isLaptop) {
      if (siblingsAmount === 5) {
        let upperThirdHighest = findHighestChildrenAmountInRow(row, 0, 1);
        diff = upperThirdHighest;
      }
      if (siblingsAmount === 6) {
        let upperThirdHighest = findHighestChildrenAmountInRow(row, 0, 2);
        diff = upperThirdHighest;
      }
    }
    if (isTablet) {
      if (siblingsAmount >= 5) {
        let upperThirdHighest = findHighestChildrenAmountInRow(row, 0, 1);
        let middleThirdHighest = findHighestChildrenAmountInRow(row, 2, 3);
        diff = upperThirdHighest + middleThirdHighest;
      }
      if (siblingsAmount === 4) {
        let upperHalfHighest = findHighestChildrenAmountInRow(row, 0, 1);
        let lowerHalfHighest = findHighestChildrenAmountInRow(row, 2, 3);
        diff = upperHalfHighest - lowerHalfHighest;
      }
      if (siblingsAmount === 3) {
        let upperHalfHighest = findHighestChildrenAmountInRow(row, 0, 1);
        let lowerHalfHighest = findHighestChildrenAmountInRow(row, 2, 2);
        diff = upperHalfHighest - lowerHalfHighest;
      }
    }
  }
  return diff.toString();
}

function getHighestNumber(num1: number, num2: number) {
  return num1 >= num2 ? num1 : num2;
}

function findHighestChildrenAmountInRow(
  row: Row,
  indexStart: number,
  indexEnd: number,
) {
  let highest = 0;
  for (let i = indexStart; i <= indexEnd; i++) {
    // Use optional chaining to safely access nested properties
    const childrenLength = row.row[i]?.children?.length ?? 0;
    if (childrenLength > highest) {
      highest = childrenLength;
    }
  }

  return highest;
}

function createTOC(toc: TableOfContentsItem[], isMobile?: boolean) {
  const tocBox = createElement('ul');
  tocBox.classList.add(`${prefix}-toc-box`);
  isMobile && tocBox.classList.add(`${prefix}-toc-box-mobile`);

  toc.forEach((tocItem) => {
    const tocItemElement = createElement('li');
    tocItemElement.className = `${prefix}-toc-item`;
    const tocItemColor = createElement('span');
    tocItemColor.className = `${prefix}-toc-item-color`;
    tocItemColor.style.background = tocItem.color;
    tocItemElement.appendChild(tocItemColor);
    const tocItemTitle = createElement('span');
    tocItemTitle.innerHTML = tocItem.title;
    tocItemElement.appendChild(tocItemTitle);
    tocBox.appendChild(tocItemElement);
  });

  return tocBox;
}

function addDataAttribute(
  dataAttributes: { key: string; id: string }[],
  key: string,
  id: string,
) {
  dataAttributes.push({ key, id });
}

/**
 * This function generates the arrow navigation data for nodes in a special column layout.
 * @param layout - The org chart layout.
 * @param indexInRow - The index of the node in the row.
 * @param siblingsAmount - The total number of nodes in the row.
 * @param currentRowIndex - The index of the current row.
 * @param isLastRow - Indicates if the current row is the last row.
 * @param children - The children of the node.
 * @param indexInColumn - The index of the node in the column.
 * @returns An array of data attributes for arrow navigation.
 */
function getArrowNavigaitonDataSpecialColum({
  layout,
  indexInRow,
  siblingsAmount,
  currentRowIndex,
  isLastRow,
  children,
  indexInColumn,
}: {
  layout: Layout;
  indexInRow: number;
  siblingsAmount: number;
  currentRowIndex: number;
  isLastRow: boolean;
  children: string[] | null;
  indexInColumn: number;
}) {
  const dataAttributes: { key: string; id: string }[] = [];
  let cri = currentRowIndex;

  // If the node has children, add data attribute for arrow down navigation
  if (children) {
    addDataAttribute(dataAttributes, 'data-arrow-down', children[0]);
  }

  if (indexInColumn === 0) {
    // If the node is the first node in the column, add data attribute for arrow right navigation
    addDataAttribute(
      dataAttributes,
      'data-arrow-right',
      layout.rows[cri].row[indexInRow - 1].id[1],
    );

    if (indexInRow === 1) {
      // If the node is the first node in the row, add data attribute for arrow left navigation to the last node in the previous row
      const previousRowLength = layout.rows[cri - 1].row.length;
      const previousRowLastItem =
        layout.rows[cri - 1].row[previousRowLength - 1].id[
          layout.rows[cri - 1].row[previousRowLength - 1].id.length - 1
        ];
      addDataAttribute(dataAttributes, 'data-arrow-left', previousRowLastItem);
    } else {
      // If the node is not the first node in the row, add data attribute for arrow left navigation to the previous node in the same row
      addDataAttribute(
        dataAttributes,
        'data-arrow-left',
        layout.rows[cri].row[indexInRow - 2].id[
          layout.rows[cri].row[indexInRow - 2].id.length - 1
        ],
      );
    }
  } else {
    // If the node is not the first node in the column, add data attribute for arrow left navigation to the previous node in the same row
    addDataAttribute(
      dataAttributes,
      'data-arrow-left',
      layout.rows[cri].row[indexInRow - 1].id[0],
    );

    if (siblingsAmount === indexInRow && isLastRow) {
      // If the node is the last node in the row and the last row, add data attribute for arrow right navigation to an empty value
      addDataAttribute(dataAttributes, 'data-arrow-right', '');
    } else if (siblingsAmount === indexInRow) {
      // If the node is the last node in the row, add data attribute for arrow right navigation to the first node in the next row
      const nextRowFirstItem = layout.rows[cri + 1].row[0].id[0];
      addDataAttribute(dataAttributes, 'data-arrow-right', nextRowFirstItem);
    } else {
      // If the node is not the last node in the row, add data attribute for arrow right navigation to the next node in the same row
      addDataAttribute(
        dataAttributes,
        'data-arrow-right',
        layout.rows[cri].row[indexInRow].id[0],
      );
    }
  }

  return dataAttributes;
}

/**
 * This function generates the arrow navigation data for nodes in a general layout.
 * @param layout - The org chart layout.
 * @param isRoot - Indicates if the current node is the root node.
 * @param indexInRow - The index of the node in the row.
 * @param siblingsAmount - The total number of nodes in the row.
 * @param currentRowIndex - The index of the current row.
 * @param isLastRow - Indicates if the current row is the last row.
 * @param children - The children of the node.
 * @returns An array of data attributes for arrow navigation.
 */
function getArrowNavigaitonData({
  layout,
  isRoot,
  indexInRow,
  siblingsAmount,
  currentRowIndex,
  isLastRow,
  children,
  specialColumnList,
}: {
  layout: Layout;
  isRoot: boolean;
  indexInRow: number;
  siblingsAmount: number;
  currentRowIndex: number;
  isLastRow: boolean;
  children: string[] | null;
  specialColumnList: number[];
}) {
  const dataAttributes: { key: string; id: string }[] = [];

  // If the node has children, add data attribute for arrow down navigation
  if (children && !isRoot) {
    addDataAttribute(dataAttributes, 'data-arrow-down', children[0]);
  }

  // If it is the root node, only arrow-right is an alternative
  if (isRoot) {
    addDataAttribute(
      dataAttributes,
      'data-arrow-right',
      layout.rows[1].row[0].id[0],
    );
  } else {
    //const to handle data attributes for arrow navigation in case of special columns
    let specialColumnLength = specialColumnList.length;
    if (specialColumnLength  === 2) {
      specialColumnLength = 1;
    }

    if (
      indexInRow !== 1 &&
      indexInRow !== siblingsAmount - specialColumnLength
    ) {
      // If the node is not the first or last in the row, add data attributes for arrow right and left navigation
      addDataAttribute(
        dataAttributes,
        'data-arrow-right',
        layout.rows[currentRowIndex].row[indexInRow].id[0],
      );
      addDataAttribute(
        dataAttributes,
        'data-arrow-left',
        layout.rows[currentRowIndex].row[indexInRow - 2].id[
          layout.rows[currentRowIndex].row[indexInRow - 2].id.length - 1
        ],
      );
    } else if (indexInRow === 1) {
      const previousRowLength = layout.rows[currentRowIndex - 1].row.length;
      const previousRowLastItem =
        layout.rows[currentRowIndex - 1].row[previousRowLength - 1].id[
          layout.rows[currentRowIndex - 1].row[previousRowLength - 1].id
            .length - 1
        ];

      if (siblingsAmount > 1) {
        // If the node is the first in the row and there are more than one sibling, add data attributes for arrow right and left navigation
        addDataAttribute(
          dataAttributes,
          'data-arrow-right',
          layout.rows[currentRowIndex].row[indexInRow].id[0],
        );
        addDataAttribute(
          dataAttributes,
          'data-arrow-left',
          previousRowLastItem,
        );
      } else if (siblingsAmount === 1 && !isRoot) {
        addDataAttribute(
          dataAttributes,
          'data-arrow-right',
          !isLastRow ? layout.rows[currentRowIndex + 1].row[0].id[0] : '',
        );
        addDataAttribute(
          dataAttributes,
          'data-arrow-left',
          previousRowLastItem,
        );
      } else {
        const nextRowFirstItem = layout.rows[currentRowIndex + 1].row[0].id[0];
        // If the node is the first in the row and there is only one sibling, add data attributes for arrow right and left navigation
        addDataAttribute(dataAttributes, 'data-arrow-right', nextRowFirstItem);
        addDataAttribute(
          dataAttributes,
          'data-arrow-left',
          previousRowLastItem,
        );
      }
    } else if (indexInRow === siblingsAmount - specialColumnLength) {
      // If the node is the last in the row, add data attribute for arrow left navigation
      addDataAttribute(
        dataAttributes,
        'data-arrow-left',
        layout.rows[currentRowIndex].row[indexInRow - 2].id[
          layout.rows[currentRowIndex].row[indexInRow - 2].id.length - 1
        ],
      );

      if (!isLastRow) {
        // If the node is not in the last row, add data attribute for arrow right navigation
        addDataAttribute(
          dataAttributes,
          'data-arrow-right',
          layout.rows[currentRowIndex + 1].row[0].id[0],
        );
      }
    }
  }

  return dataAttributes;
}

function getChildArrowNavigation(
  index: number,
  children: string[],
  parentId: string[],
) {
  const dataAttributes: { key: string; id: string }[] = [];

  // Add data attribute for arrow down navigation
  addDataAttribute(
    dataAttributes,
    'data-arrow-down',
    children[index + 1] || '',
  );

  // Add data attribute for arrow up navigation
  addDataAttribute(
    dataAttributes,
    'data-arrow-up',
    index === 0 ? parentId[parentId.length - 1] : children[index - 1],
  );

  return dataAttributes;
}

function getRootChildren(currentLayout: Layout, idPrefix: string): string[] {
  const rootChildren: string[] = [];

  // Iterate through the rows and columns in the layout
  for (const row of currentLayout.rows) {
    for (const column of row.row) {
      // Add all the ids in the column to the rootChildren array
      rootChildren.push(...column.id.map((id) => `${idPrefix}-${id}`));
    }
  }
  // Remove the first id in the array, which is the root id
  rootChildren.shift();

  return rootChildren;
}

function createChildrenList(children: string[], idPrefix: string) {
  const childrenList: string[] = [];
  children.forEach((childId: string) => {
    childrenList.push(`${idPrefix}-${childId}`);
  });
  return childrenList;
}
function calculateColumnWidth({
  isMain,
  isLaptop,
  isTablet,
  siblingsAmount,
  indexInRow,
  isLastRow,
  rowContainsSpecialColumns,
  indexToSpecialColumnList,
  rowContainsOffsetColumn,
}: {
  isMain: boolean;
  isLaptop: boolean;
  isTablet: boolean;
  siblingsAmount: number;
  indexInRow: number;
  isLastRow: boolean;
  rowContainsSpecialColumns: boolean;
  indexToSpecialColumnList: number[];
  rowContainsOffsetColumn?: boolean;
}) {
  let additionalClass: string[] = [];
  let width = 100;
  let additionalWidth = 0;
  let wrapNodesWrapper = false;

  switch (rowContainsSpecialColumns) {
    case true:
      return calculateColumnWidthWithSpecialColumn({
        isMain,
        isLaptop,
        isTablet,
        siblingsAmount,
        indexInRow,
        isLastRow,
        indexToSpecialColumnList,
        prefix,
      });
    case false:
      return calculateColumnWidthWithoutSpecialColumn({
        isMain,
        isLaptop,
        isTablet,
        siblingsAmount,
        indexInRow,
        isLastRow,
        rowContainsOffsetColumn,
      });
    default:
      return { width, additionalWidth, additionalClass, wrapNodesWrapper };
  }
}

function calculateColumnWidthWithoutSpecialColumn({
  isMain,
  isLaptop,
  isTablet,
  siblingsAmount,
  indexInRow,
  isLastRow,
  rowContainsOffsetColumn,
}: {
  isMain: boolean;
  isLaptop: boolean;
  isTablet: boolean;
  siblingsAmount: number;
  indexInRow: number;
  isLastRow: boolean;
  rowContainsOffsetColumn?: boolean;
}) {
  let additionalClass: string[] = [];
  let width = 100;
  let additionalWidth = 0;
  let wrapNodesWrapper = false;

  if (siblingsAmount <= 2 && rowContainsOffsetColumn) {
    width = 50;
  }

  if (siblingsAmount > 2 && isOdd(siblingsAmount)) {
    switch (true) {
      case isMain:
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
        break;
      case isLaptop:
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
        break;
      case isTablet:
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
        break;
    }
  } else if (siblingsAmount > 2) {
    switch (true) {
      case isMain:
        width = 100 / siblingsAmount;
        break;
      case isLaptop:
        width = 100 / 4;
        additionalWidth = -18;
        break;
      case isTablet:
        width = 100 / 2;
        additionalWidth = -12;
        break;
    }
  }
  return { width, additionalWidth, additionalClass, wrapNodesWrapper };
}

function calculateColumnWidthWithSpecialColumn({
  isMain,
  isLaptop,
  isTablet,
  siblingsAmount,
  indexInRow,
  isLastRow,
  indexToSpecialColumnList,
  prefix,
}: {
  isMain: boolean;
  isLaptop: boolean;
  isTablet: boolean;
  siblingsAmount: number;
  indexInRow: number;
  isLastRow: boolean;
  indexToSpecialColumnList: number[];
  prefix: string;
}) {
  let additionalClass: string[] = [];
  let width = 100;
  let additionalWidth = 0;
  let wrapNodesWrapper = false;
  additionalClass.push(`${prefix}-special-row`);
  //if row contains special column add the length of the special column to the siblingsAmount, because the special column takes up double node space
  siblingsAmount = siblingsAmount + indexToSpecialColumnList.length;
  if (siblingsAmount === 2) {
    width = 50;
    additionalWidth = -12;
    if (!isLastRow) {
      additionalWidth = -12;
      additionalClass.push(`${prefix}-special-row-1-column`);
    }
  }
  if (isMain) {
    if (siblingsAmount === 3) {
      if (isLastRow) {
        if (indexToSpecialColumnList.includes(indexInRow)) {
          width = (100 / 3) * 2;
          additionalWidth = 24;
        } else {
          width = 100 / 3;
        }
      } else {
        width = 50;
        additionalWidth = -12;
      }
    } else if (siblingsAmount === 4) {
      if (indexToSpecialColumnList.length < 2) {
        if (isLastRow) {
          if (indexToSpecialColumnList.includes(indexInRow)) {
            width = (100 / 4) * 2;
          } else {
            width = 100 / 4;
          }
        } else {
          if (indexToSpecialColumnList.includes(2)) {
            if (indexInRow === 1) {
              width = 50;
              additionalWidth = -12;
            } else {
              if (indexInRow === 2) {
                width = (50 / 3) * 2;
                additionalWidth = -18;
              } else if (indexInRow === 3) {
                width = 50 / 3;
                additionalWidth = -18;
              } else {
                width = 50;
                additionalWidth = -24;
              }
            }
          } else {
            if (indexToSpecialColumnList.includes(indexInRow)) {
              width = 50;
              additionalWidth = -12;
            } else {
              width = 25;
              additionalWidth = -18;
            }
          }
        }
      } else {
        if (isLastRow) {
          if (indexToSpecialColumnList.includes(indexInRow)) {
            width = (100 / 4) * 2;
          } else {
            width = 100 / 4;
          }
        } else {
          width = 50;
          additionalWidth = -12;
        }
      }
    } else if (siblingsAmount === 5) {
      if (indexToSpecialColumnList.length === 2) {
        if (isLastRow) {
          if (indexToSpecialColumnList.includes(indexInRow)) {
            width = (100 / 5) * 2;
            additionalWidth = 24;
          } else {
            width = 100 / 5;
          }
        } else {
          if (!indexToSpecialColumnList.includes(1)) {
            if (indexInRow === 1) {
              width = 50 / 3;
              additionalWidth = -18;
            } else if (indexInRow === 2) {
              width = (50 / 3) * 2;
              additionalWidth = -18;
            } else {
              width = 50;
              additionalWidth = -12;
            }
          } else if (!indexToSpecialColumnList.includes(2)) {
            if (indexInRow === 1) {
              width = (50 / 3) * 2;
              additionalWidth = -18;
            } else if (indexInRow === 2) {
              width = 50 / 3;
              additionalWidth = -18;
            } else {
              width = 50;
              additionalWidth = -12;
            }
          } else if (!indexToSpecialColumnList.includes(3)) {
            if (indexInRow === 1) {
              width = 50;
              additionalWidth = -12;
            } else if (indexInRow === 2) {
              width = (50 / 3) * 2;
              additionalWidth = -18;
            } else {
              width = 50 / 3;
              additionalWidth = -18;
            }
          }
        }
      } else {
        if (isLastRow) {
          if (indexToSpecialColumnList.includes(indexInRow)) {
            width = (100 / 5) * 2;
            additionalWidth = 26;
          } else {
            width = 100 / 5;
          }
        } else {
          if (indexToSpecialColumnList.includes(indexInRow)) {
            width = (50 / 3) * 2;
            additionalWidth = -24;
          } else if (indexToSpecialColumnList[0] >= 3) {
            if (indexInRow < 3) {
              width = 25;
              additionalWidth = -18;
            } else {
              width = 50 / 3;
              additionalWidth = -12;
            }
          } else if (indexToSpecialColumnList[0] <= 2) {
            if (indexInRow > 2) {
              width = 25;
              additionalWidth = -18;
            } else {
              width = 50 / 3;
              additionalWidth = -12;
            }
          }
        }
      }
    } else if (siblingsAmount === 6) {
      if (indexToSpecialColumnList.length === 3) {
        if (isLastRow) {
          width = 100 / 3;
        } else {
          if (indexInRow === 1) {
            width = 50;
            additionalWidth = -12;
          } else if (indexInRow === 2) {
            width = (50 / 3) * 2;
            additionalWidth = -18;
          } else {
            width = 50 / 3;
            additionalWidth = -18;
            wrapNodesWrapper = true;
          }
        }
      } else if (indexToSpecialColumnList.length === 2) {
        if (isLastRow) {
          if (indexToSpecialColumnList.includes(indexInRow)) {
            width = (100 / 6) * 2;
          } else {
            width = 100 / 6;
          }
        } else {
          if (
            indexToSpecialColumnList.includes(1) &&
            indexToSpecialColumnList.includes(2)
          ) {
            if (indexInRow === 1) {
              width = (50 / 3) * 2;
            } else if (indexInRow === 2) {
              width = 50 / 3;

              wrapNodesWrapper = true;
            } else {
              width = 25;
            }
          } else if (
            indexToSpecialColumnList.includes(3) &&
            indexToSpecialColumnList.includes(4)
          ) {
            if (indexInRow <= 2) {
              width = 25;
            } else if (indexInRow === 3) {
              width = (50 / 3) * 2;
            } else {
              width = 50 / 3;
              wrapNodesWrapper = true;
            }
          } else {
            if (indexToSpecialColumnList.includes(indexInRow)) {
              width = (50 / 3) * 2;
            } else {
              width = 50 / 3;
            }
          }
        }
      } else {
        if (isLastRow) {
          if (indexToSpecialColumnList.includes(indexInRow)) {
            width = (100 / 6) * 2;
          } else {
            width = 100 / 6;
          }
        } else {
          if (!indexToSpecialColumnList.includes(3)) {
            if (indexToSpecialColumnList.includes(indexInRow)) {
              width = (50 / 3) * 2;
              additionalWidth = 26;
            } else {
              width = 50 / 3;
            }
          } else {
            if (indexInRow <= 2) {
              width = 25;
              additionalWidth = -18;
            } else {
              width = 50 / 3;
              wrapNodesWrapper = true;
              additionalWidth = -20;
            }
          }
        }
      }
    }
  } else if (isLaptop) {
    if (siblingsAmount === 3) {
      if (isLastRow) {
        if (indexToSpecialColumnList.includes(indexInRow)) {
          width = (100 / 3) * 2;
          additionalWidth = 24;
        } else {
          width = 100 / 3;
        }
      } else {
        width = 50;
      }
    } else if (siblingsAmount === 4) {
      if (isLastRow) {
        if (indexToSpecialColumnList.includes(indexInRow)) {
          width = (100 / 4) * 2;
          additionalWidth = -12;
        } else {
          width = 100 / 4;
          additionalWidth = -18;
        }
      } else {
        if (indexToSpecialColumnList.length === 2) {
          width = 50;
        } else {
          if (indexToSpecialColumnList.includes(2)) {
            if (indexInRow === 3) {
              width = 50;
              additionalWidth = -12;
            } else {
              width = 25;
              additionalWidth = -18;
              wrapNodesWrapper = true;
            }
          } else {
            if (indexToSpecialColumnList.includes(indexInRow)) {
              width = 50;
              additionalWidth = -12;
            } else {
              width = 25;
              additionalWidth = -18;
            }
          }
        }
      }
    } else if (siblingsAmount === 5) {
      if (isLastRow) {
        if (indexToSpecialColumnList.length === 1) {
          if (
            indexToSpecialColumnList.includes(3) ||
            indexToSpecialColumnList.includes(4)
          ) {
            if (indexToSpecialColumnList.includes(indexInRow)) {
              width = (100 / 3) * 2;
              additionalWidth = -8;
            } else if (indexInRow < 3) {
              width = 50;
              additionalWidth = -12;
            } else {
              width = 100 / 3;
              additionalWidth = -16;
            }
          } else {
            width = 50;
            additionalWidth = -12;
          }
        } else {
          if (indexInRow === 3) {
            if (indexToSpecialColumnList.includes(indexInRow)) {
              width = 100;
            } else {
              width = 50;
              additionalWidth = -12;
            }
          } else {
            width = 50;
            additionalWidth = -12;
          }
        }
      } else {
        if (indexToSpecialColumnList.length === 2) {
          width = 50;
          additionalWidth = -12;
        } else {
          if (indexToSpecialColumnList.includes(indexInRow)) {
            width = 50;
            additionalWidth = -12;
          } else if (
            indexInRow === 1 ||
            indexToSpecialColumnList.includes(3) ||
            indexToSpecialColumnList.includes(1)
          ) {
            width = 50;
            additionalWidth = -12;
          } else {
            width = 25;
            additionalWidth = -18;
          }
        }
      }
    } else if (siblingsAmount === 6) {
      if (indexToSpecialColumnList.length === 3) {
        if (isLastRow && indexInRow === 3) {
          width = 100;
        } else {
          width = 50;
          additionalWidth = -12;
        }
      } else if (indexToSpecialColumnList.length === 2) {
        if (isLastRow) {
          if (
            indexToSpecialColumnList.includes(1) &&
            indexToSpecialColumnList.includes(2)
          ) {
            width = 50;
            additionalWidth = -12;
          } else if (
            indexToSpecialColumnList.includes(3) &&
            indexToSpecialColumnList.includes(4)
          ) {
            if (indexToSpecialColumnList.includes(indexInRow)) {
              if (indexInRow === 3) {
                width = 50;
                additionalWidth = -12;
              } else {
                width = 100;
              }
            } else {
              width = 25;
              additionalWidth = -18;
            }
          } else {
            if (
              (indexToSpecialColumnList.includes(1) &&
                !indexToSpecialColumnList.includes(2)) ||
              (indexToSpecialColumnList.includes(2) &&
                !indexToSpecialColumnList.includes(1))
            ) {
              if (indexInRow <= 2) {
                width = 50;
                additionalWidth = -12;
              } else if (indexToSpecialColumnList.includes(indexInRow)) {
                width = (100 / 3) * 2;
                additionalWidth = -8;
              } else {
                width = 100 / 3;
                additionalWidth = -16;
              }
            }
          }
        } else {
          if (
            (indexToSpecialColumnList.includes(1) &&
              indexToSpecialColumnList.includes(2)) ||
            (indexToSpecialColumnList.includes(3) &&
              indexToSpecialColumnList.includes(4))
          ) {
            if (indexToSpecialColumnList.includes(indexInRow)) {
              width = 50;
              additionalWidth = -12;
            } else {
              width = 25;
              additionalWidth = -18;
            }
          } else {
            width = 50;
            additionalWidth = -12;
          }
        }
      } else {
        if (indexToSpecialColumnList.includes(indexInRow)) {
          if (indexInRow === 5 && isLastRow) {
            width = 100;
          } else {
            width = 50;
            additionalWidth = -12;
          }
        } else if (indexToSpecialColumnList[0] <= 2) {
          if (indexInRow <= 2) {
            width = 50;
            additionalWidth = -12;
          } else if (indexInRow === 5) {
            width = 50;
            additionalWidth = -12;
          } else {
            width = 25;
            additionalWidth = -18;
          }
        } else if (indexToSpecialColumnList[0] === 4) {
          if (indexInRow >= 3) {
            width = 50;
            additionalWidth = -12;
          } else {
            width = 25;
            additionalWidth = -18;
          }
        } else {
          if (indexToSpecialColumnList.includes(indexInRow)) {
            width = 50;
            additionalWidth = -12;
          } else {
            width = 25;
            additionalWidth = -18;
          }
        }
      }
    }
  } else if (isTablet) {
    if (isLastRow && siblingsAmount - 1 === indexInRow) {
      if (
        (siblingsAmount === 5 &&
          indexToSpecialColumnList.includes(siblingsAmount - 2)) ||
        (siblingsAmount === 5 && indexToSpecialColumnList.length === 1) ||
        (siblingsAmount === 3 && indexToSpecialColumnList.length === 1)
      ) {
        width = 50;
        additionalWidth = -12;
      } else {
        width = 100;
      }
    } else if (
      indexInRow === 3 &&
      indexToSpecialColumnList.length === 3 &&
      isLastRow
    ) {
      width = 100;
    } else if (
      indexToSpecialColumnList.length === 2 &&
      siblingsAmount === 5 &&
      indexInRow === 3 &&
      isLastRow
    ) {
      width = 100;
    } else {
      width = 50;
      additionalWidth = -12;
    }
  }
  return { width, additionalWidth, additionalClass, wrapNodesWrapper };
}
