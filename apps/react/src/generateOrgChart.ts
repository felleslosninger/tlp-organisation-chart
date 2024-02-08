export function generateOrgChart(data: any, containerId: string) {
  const { nodes, layout } = data;
  /////

  function findNodeById(id: string) {
    return nodes.find((node: any) => node.id === id);
  }

  function generateNodeHTML(node: any) {
    const nodeElement = document.createElement("div");
    nodeElement.className = "node";
    if (node !== undefined) {
      nodeElement.style.backgroundColor = node.backgroundColor;
      if (node.url) {
        const link = document.createElement("a");
        link.href = node.url;
        link.target = "_blank";
        link.innerText = node.title;
        nodeElement.appendChild(link);
      } else {
        nodeElement.innerText = node.title;
      }
    }
    return nodeElement;
  }

  const orgChart = document.createElement("div");
  orgChart.className = "org-chart";

  function createColumnElement(col: any) {
    const colElement = document.createElement("div");
    colElement.className = "column";

    col.forEach((id: string) => {
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
