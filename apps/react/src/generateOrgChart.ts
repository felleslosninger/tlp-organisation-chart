export function generateOrgChart(data: any, containerId: string) {
  const { nodes, layout } = data;

  function findNodeById(id: string) {
    return nodes.find((node: any) => node.id === id);
  }

  function generateNodeHTML(node: any) {
    if (node !== undefined && node.url !== undefined) {
      const nodeElement = document.createElement("a");
      nodeElement.role = "treeitem";
      nodeElement.style.backgroundColor = node.backgroundColor;
      nodeElement.className = "node";
      nodeElement.href = node.url;
      nodeElement.target = "_blank";
      nodeElement.innerText = node.title;

      return nodeElement;
    } else if (node !== undefined) {
      const nodeElement = document.createElement("div");
      nodeElement.role = "treeitem";
      nodeElement.tabIndex = 0;
      nodeElement.style.backgroundColor = node.backgroundColor;
      nodeElement.className = "node";
      nodeElement.innerText = node.title;

      return nodeElement;
    } else {
      const nodeElement = document.createElement("div");
      nodeElement.className = "node";
      return nodeElement;
    }
  }

  function generateNodesHTMLWithSharedChildren(nodeIds: [], children: []) {
    const nodeElement = document.createElement("div");
    nodeElement.className = "multipleParents";
    const nodeHeader = document.createElement("div");
    nodeHeader.tabIndex = 0;
    nodeHeader.className = "nodeHeader";

    nodeIds.forEach((nodeId: string) => {
      const node = findNodeById(nodeId);
      const headerElement = document.createElement("div");
      headerElement.appendChild(generateNodeHTML(node));

      nodeHeader.appendChild(headerElement);
      nodeElement.appendChild(nodeHeader);
    });

    //Add children to node element
    nodeElement.appendChild(createRowsWrapper(children));

    return nodeElement;
  }

  function createColumnElement(col: any) {
    const colElement = document.createElement("div");
    colElement.className = "column";

    //if column will have children, add role group
    if (col.layout) {
      colElement.role = "group";
    }

    colElement.style.gridColumn = "span " + col.nodeIds.length;

    //if shared parents
    if (col.nodeIds.length > 1) {
      colElement.appendChild(
        generateNodesHTMLWithSharedChildren(col.nodeIds, col.layout),
      );
      return colElement;
    } else {
      if (col.layout) {
        const node = findNodeById(col.nodeIds[0]);
        colElement.appendChild(generateNodeHTML(node));
        colElement.appendChild(createRowsWrapper(col.layout));
        return colElement;
      } else {
        const node = findNodeById(col.nodeIds[0]);
        colElement.appendChild(generateNodeHTML(node));
        return colElement;
      }
    }
  }

  function createRows(row: any) {
    const rows = document.createElement("div");
    rows.className = "row";
    row.forEach((column: any) => {
      rows.appendChild(createColumnElement(column.col));
    });

    return rows;
  }

  function createRowsWrapper(layout: Array<any>) {
    const rows = document.createElement("div");
    rows.className = "rows";
    layout.forEach((row: any) => {
      const rowElement = document.createElement("div");
      //add class name to the row element
      rowElement.className = "rowElement";
      rows.appendChild(createRows(row.cols));
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
    orgChart.appendChild(createRowsWrapper(layout));
    //clear the container for all existing children
    mainContainer.innerHTML = "";
    mainContainer.appendChild(orgChart);

    return mainContainer;
  }

  return null;
}
