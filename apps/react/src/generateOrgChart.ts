export function generateOrgChart(data: any, containerId: string) {
  const { nodes, layout } = data;

  function findNodeById(id: string) {
    return nodes.find((node: any) => node.id === id);
  }

  function generateNodeWithChildrenHTML(node: any) {
    const nodeElement = document.createElement("div");
    nodeElement.className = "node";
    const nodeList = document.createElement("ul");
    nodeList.className = "node-list";
    nodeElement.appendChild(nodeList);

    const listTitle = document.createElement("li");
    listTitle.appendChild(generateNodeHTML(node));

    nodeList.appendChild(listTitle);

    if (node.children) {
      node.children.forEach((childId: string) => {
        const child = findNodeById(childId);
        if (child) {
          const listElement = document.createElement("li");
          listElement.appendChild(generateNodeHTML(child));
          nodeList.appendChild(listElement);
        }
      });
    }
    return nodeElement;
  }

  function generateNodeHTML(node: any) {
    const nodeElement = document.createElement("div");
    nodeElement.className = "node";

    if (node !== undefined) {
      nodeElement.style.backgroundColor = node.backgroundColor;

      const heading = document.createElement("h3");

      if (node.url) {
        const link = document.createElement("a");
        link.href = node.url;
        link.target = "_blank";
        link.innerText = node.title;
        heading.appendChild(link);
      } else {
        heading.innerText = node.title;
      }
      nodeElement.appendChild(heading);
    }
    return nodeElement;
  }

  function createColumnElement(col: any) {
    const colElement = document.createElement("div");
    colElement.className = "column";
    console.log(col.nodeIds);
    col.nodeIds.forEach((id: string) => {
      const node = findNodeById(id);

      colElement.appendChild(generateNodeHTML(node));
    });
    return colElement;
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
