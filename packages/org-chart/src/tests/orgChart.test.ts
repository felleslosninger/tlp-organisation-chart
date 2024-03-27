import { generateOrgChart } from '../';
import data from './data.json';
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;

describe('generateOrgChart', () => {
  beforeAll(() => {
    return new Promise<void>((resolve) => {
      const container = document.createElement('div');
      container.id = 'test-container';
      document.body.appendChild(container);
      const containerId = 'test-container';

      generateOrgChart(data, containerId);

      resolve();
    });
  });

  it('should generate an org chart correctly', () => {
    // check if the root element to have aria-level 1
    expect(
      document.getElementById('och-root')?.getAttribute('aria-level'),
    ).toBe('1');

    // expect role tree and treeitem to be in the DOM
    expect(document.querySelector('[role="tree"]')).toBeDefined();
    expect(document.querySelector('[role="treeitem"]')).toBeDefined();
  });

  it('should generate the correct number of nodes', () => {
    const nodes = document.querySelectorAll('[role="treeitem"]');
    expect(nodes.length).toBe(10);
  });

  //test if the correct number of columns are generated
  it('should generate the correct number of columns', () => {
    const columns = document.querySelectorAll('.och-column');
    expect(columns.length).toBe(6);
  });

  //test if the correct number of rows are generated
  it('should generate the correct number of rows', () => {
    const rows = document.querySelectorAll('.och-row');
    expect(rows.length).toBe(4);
  });

  //test if the prefix is added to the node id
  it('should add the prefix to the node id', () => {
    const node = document.getElementById('och-root');
    expect(node).toBeDefined();
  });
});
