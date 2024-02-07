export function generateOrgChart(data: any, containerId: string) {
  const mainContainer = document.getElementById(containerId);
  //create element to hold the org chart
  const orgChartWrapper = document.createElement("div");

  if (mainContainer) {
    //insert the org chart into the container
    mainContainer.appendChild(orgChartWrapper);

    return mainContainer;
  }

  return null;
}
