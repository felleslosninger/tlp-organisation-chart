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
    expect(document.getElementById('och-root')?.getAttribute('aria-level')).toBe('1');

    // expect role tree and treeitem to be in the DOM
    expect(document.querySelector('[role="tree"]')).toBeDefined();
    expect(document.querySelector('[role="treeitem"]')).toBeDefined();
  });
});