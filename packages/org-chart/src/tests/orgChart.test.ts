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

  //test if item 1 has aria-level 2
  it('should generate the correct aria-level', () => {
    const parentNode = document.getElementById('och-item1');
    const childNode = document.getElementById('och-child1');
    expect(parentNode?.getAttribute('aria-level')).toBe('2');
    expect(childNode?.getAttribute('aria-level')).toBe('3');
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

  //och-item2 should have data property data-arrow-down="och-child3, data-arrow-left="och-item1", data-arrow-right="och-item3"
  it('should have the correct data properties', () => {
    const node = document.getElementById('och-item2');
    expect(node).toBeDefined();
    expect(node?.getAttribute('data-arrow-down')).toBe('och-child3');
    expect(node?.getAttribute('data-arrow-left')).toBe('och-item1');
    expect(node?.getAttribute('data-arrow-right')).toBe('och-item3');
  });

  //testing special column data properties
  //och-item4 should have data property data-arrow-down="och-child1, data-arrow-left="och-item3", data-arrow-right="och-item5"
  it('should have the correct data properties for special columns', () => {
    const node = document.getElementById('och-item4');
    expect(node).toBeDefined();
    expect(node?.getAttribute('data-arrow-down')).toBe('och-child1');
    expect(node?.getAttribute('data-arrow-left')).toBe('och-item3');
    expect(node?.getAttribute('data-arrow-right')).toBe('och-item5');
  });

  //special column child should have data property data-arrow-up="och-item5"
  it('should have the correct data properties for special column children', () => {
    const node = document.getElementById('och-child1');
    expect(node).toBeDefined();
    expect(node?.getAttribute('data-arrow-up')).toBe('och-item5');
  });

  //testing if the focus moves correctly
  it('should move the focus to the first node when home is pressed', () => {
    const root = document.getElementById('och-item1');
    root?.focus();
    root?.dispatchEvent(new KeyboardEvent('keyup', { key: 'Home' }));
    setTimeout(() => {
      const firstNode = document.getElementById('och-item1');
      expect(document.activeElement).toBe(firstNode);
    }, 0);
  });

  it('should move the focus to the last node when end is pressed', () => {
    const root = document.getElementById('och-root');
    root?.focus();
    root?.dispatchEvent(new KeyboardEvent('keyup', { key: 'End' }));
    setTimeout(() => {
      const lastNode = document.getElementById('och-item6');
      expect(document.activeElement).toBe(lastNode);
    }, 0);
  });

  //if the focus is on the last node, and arrow right is pressed, the focus should stay on the last node
  it('should keep the focus on the last node when arrow right is pressed', () => {
    const lastNode = document.getElementById('och-item6');
    lastNode?.focus();
    lastNode?.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    setTimeout(() => {
      expect(document.activeElement).toBe(lastNode);
    }, 0);
  });
});
