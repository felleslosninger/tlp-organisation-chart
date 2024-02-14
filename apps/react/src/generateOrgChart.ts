export function generateOrgChart(data: any, containerId: string) {
  const { nodes, layout } = data;

  const cssPropList: {
    id: string;
    property: string;
    value: string;
  }[] = [];

  type OrgNode = {
    url: string;
  };

  function findNodeById(id: string) {
    return nodes.find((node: any) => node.id === id);
  }

  function generateNodeHTML(node: any, size: string) {
    if (node !== undefined && node.url !== undefined) {
      const nodeElement = document.createElement("a");
      nodeElement.role = "treeitem";
      nodeElement.style.backgroundColor = node.backgroundColor;
      nodeElement.className = "node";
      nodeElement.href = node.url;
      nodeElement.target = "_blank";
      nodeElement.innerText = node.title;
      nodeElement.id = node.id;

      return nodeElement;
    } else if (node !== undefined) {
      const nodeElement = document.createElement("div");
      nodeElement.role = "treeitem";
      nodeElement.tabIndex = 0;
      nodeElement.style.backgroundColor = node.backgroundColor;
      nodeElement.className = "node";
      nodeElement.innerText = node.title;
      nodeElement.id = node.id;

      if (size === "L") {
        const element = findNodeById(node.id);

        let parentId = "";
        element.parent.forEach((parent: any) => {
          parentId += parent;
        });

        //const parentElement = document.getElementById(parentId);
        const countParents = element.parent.length;

        cssPropList.push({
          id: parentId,
          property: "--parent-count",
          value: countParents.toString(),
        });
        //   //get the parent elements with
        //   const parentElement = document.getElementById(parentId);
        //   const parentWidth = parentElement?.clientWidth;
        //   const countParents = element.parent.length;
        //   let remainingSpace = 0;
        //   if (parentWidth !== undefined) {
        //     remainingSpace = parentWidth - 300 * countParents;
        //     remainingSpace = remainingSpace / (countParents + 1);
        //     remainingSpace = remainingSpace + remainingSpace + 40;
        //   }
        //   //set nodeElement width to be 100% -  remainingSpace
        //   nodeElement.style.minWidth = "calc(100% - " + remainingSpace + "px)";
        //   nodeElement.style.margin = "0 auto 12px auto";
      }

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

    let createNodeId = "";

    nodeIds.forEach((nodeId: string) => {
      createNodeId += nodeId;

      const node = findNodeById(nodeId);
      const headerElement = document.createElement("div");
      headerElement.appendChild(generateNodeHTML(node, "M"));

      nodeHeader.appendChild(headerElement);
      nodeElement.appendChild(nodeHeader);
    });

    children.forEach((child: any) => {
      child.cols.forEach((col: any) => {
        const child = findNodeById(col.col.nodeIds[0]);
        nodeElement.appendChild(generateNodeHTML(child, "L"));
      });
    });

    //Give the nodeElement a unique id
    nodeElement.id = createNodeId;

    //Add children to node element
    //nodeElement.appendChild(createRowsWrapper(children));

    return nodeElement;
  }

  function createColumnElement(col: any) {
    const colElement = document.createElement("div");
    colElement.className = "column";

    //if column will have children, add role group
    if (col.layout) {
      colElement.role = "group";
    }

    colElement.style.setProperty("grid-column", "span " + col.nodeIds.length);

    //if shared parents
    if (col.nodeIds.length > 1) {
      colElement.appendChild(
        generateNodesHTMLWithSharedChildren(col.nodeIds, col.layout),
      );
      return colElement;
    } else {
      if (col.layout) {
        const node = findNodeById(col.nodeIds[0]);
        colElement.appendChild(generateNodeHTML(node, "M"));
        colElement.appendChild(createRowsWrapper(col.layout));
        return colElement;
      } else {
        const node = findNodeById(col.nodeIds[0]);
        colElement.appendChild(generateNodeHTML(node, "M"));
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

  function applyCssProperty(id: string, property: string, value: any) {
    const element = document.getElementById(id);
    element?.style.setProperty(property, value);
    console.log(element?.style.getPropertyValue(property));
  }

  if (mainContainer) {
    //insert the org chart into the container
    orgChart.appendChild(createRowsWrapper(layout));
    //clear the container for all existing children
    mainContainer.innerHTML = "";
    mainContainer.appendChild(orgChart);

    cssPropList.forEach((prop: any) => {
      applyCssProperty(prop.id, prop.property, prop.value);
    });

    return mainContainer;
  }

  return null;
}
