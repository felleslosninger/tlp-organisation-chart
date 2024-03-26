import { generateOrgChart } from '../';
import data from './data.json';
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;

describe('generateOrgChart', () => {
  it('should generate an org chart correctly', () => {

    const container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    const containerId = 'test-container';

    generateOrgChart(data, containerId);

    expect(document.getElementById('root')).toBeDefined();
    expect(document.getElementById('item1')).toBeDefined();

    // expect role tree and treeitem to be in the DOM
    expect(document.querySelector('[role="tree"]')).toBeDefined();
    expect(document.querySelector('[role="treeitem"]')).toBeDefined();
  });
});
