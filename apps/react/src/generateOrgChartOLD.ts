type Node = {
  title: string;
  id: string;
  backgroundColor: string;
  url?: string; // Optional because not all nodes might have a URL
  parents?: string[]; // Optional because not all nodes might have parents
};

type Column = {
  nodeIds: string[];
  layout?: Layout[]; // Optional to support nested layouts
};

type Row = {
  col: Column;
};

type Layout = {
  cols: Row[];
};

// Function argument type for `generateOrgChart`
type OrgChartData = {
  nodes: Node[];
  layout: Layout[];
};

export function generateOrgChart(data: OrgChartData, containerId: string) {
  const { nodes, layout } = data;

  const cssPropList: {
    id: string;
    property: string;
    value: string;
  }[] = [];

  function findNodeById(id: string) {
    return nodes.find((node: Node) => node.id === id);
  }

  function generateNodeHTML(node: Node, size: string) {
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

        if (element?.parents) {
          let parentId = "";
          element.parents.forEach((parent: string) => {
            parentId += parent;
          });

          const countParents = element.parents.length;

          cssPropList.push({
            id: parentId,
            property: "--parent-count",
            value: countParents.toString(),
          });
        }
      }

      return nodeElement;
    } else {
      const nodeElement = document.createElement("div");
      nodeElement.className = "node";
      return nodeElement;
    }
  }

  function generateNodesHTMLWithSharedChildren(
    nodeIds: string[],
    children: any,
  ) {
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
      if (node) {
        headerElement.appendChild(generateNodeHTML(node, "M"));
      }

      nodeHeader.appendChild(headerElement);
      nodeElement.appendChild(nodeHeader);
    });

    children.forEach((child: any) => {
      child.cols.forEach((col: any) => {
        const child = findNodeById(col.col.nodeIds[0]);
        if (child) {
          nodeElement.appendChild(generateNodeHTML(child, "L"));
        }
      });
    });

    //Give the nodeElement a unique id
    nodeElement.id = createNodeId;

    //Add children to node element
    //nodeElement.appendChild(createRowsWrapper(children));

    return nodeElement;
  }

  function createColumnElement(col: Column) {
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
        if (node) {
          colElement.appendChild(generateNodeHTML(node, "M"));
          colElement.appendChild(createRowsWrapper(col.layout));
        }

        return colElement;
      } else {
        const node = findNodeById(col.nodeIds[0]);
        if (node) {
          colElement.appendChild(generateNodeHTML(node, "M"));
        }
        return colElement;
      }
    }
  }

  function createRows(row: Row[]) {
    const rows = document.createElement("div");
    rows.className = "row";
    row.forEach((column: any) => {
      rows.appendChild(createColumnElement(column.col));
    });

    return rows;
  }

  function createRowsWrapper(layout: Layout[]) {
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

  function applyCssProperty(id: string, property: string, value: string) {
    const element = document.getElementById(id);
    element?.style.setProperty(property, value);
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
