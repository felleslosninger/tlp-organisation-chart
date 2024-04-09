import { generateOrgChart } from '../';
import data from './data.json';
import ResizeObserver from 'resize-observer-polyfill';
import userEvent from '@testing-library/user-event';

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
    expect(columns.length).toBe(5);
  });

  //test if the correct number of rows are generated
  it('should generate the correct number of rows', () => {
    const rows = document.querySelectorAll('.och-row');
    expect(rows.length).toBe(3);
  });

  //test if the prefix is added to the node id
  it('should add the prefix to the node id', () => {
    const node = document.getElementById('och-root');
    expect(node?.id.startsWith('och-')).toBe(true);
    expect(node?.id.startsWith('ch-')).toBe(false);
  });

  //och-item2 should have data property data-arrow-down="och-child3, data-arrow-left="och-item1", data-arrow-right="och-item3"
  it('should have the correct data properties', () => {
    const node = document.getElementById('och-item2');
    expect(node).toBeDefined();
    expect(node?.getAttribute('data-arrow-down')).toBe('och-child1');
    expect(node?.getAttribute('data-arrow-left')).toBe('och-item1');
    expect(node?.getAttribute('data-arrow-right')).toBe('och-item3');
  });

  //testing special column data properties
  //och-item4 should have data property data-arrow-down="och-child1, data-arrow-left="och-item3", data-arrow-right="och-item5"
  it('should have the correct data properties for special columns', () => {
    const node = document.getElementById('och-item4');
    expect(node).toBeDefined();
    expect(node?.getAttribute('data-arrow-down')).toBe('och-child3');
    expect(node?.getAttribute('data-arrow-left')).toBe('och-item3');
    expect(node?.getAttribute('data-arrow-right')).toBe('och-item5');
  });

  //special column child should have data property data-arrow-up="och-item5"
  it('should have the correct data properties for special column children', () => {
    const node = document.getElementById('och-child3');
    expect(node?.getAttribute('data-arrow-up')).toBe('och-item5');
  });

  // test that all classes are prefixd with och-
  it('should prefix all classes with och-', () => {
    const nodes = document.querySelectorAll('[class*="och-"]');
    //find all classes that do not start with och-
    const invalidClasses = Array.from(nodes).filter(
      (node) => !node.className.startsWith('och-'),
    );
    expect(invalidClasses.length).toBe(0);
    expect(nodes.length).toBeGreaterThan(0);
  });

  //Arrow navation tests
  it('should navigate from root to last level 2 element', () => {
    const root = document.getElementById('och-root');
    const lastLevel2 = document.getElementById('och-item5');
    const lastElement = document.getElementById('och-child4');
    const item2 = document.getElementById('och-item2');
    const child1 = document.getElementById('och-child1');
    root?.focus();
    userEvent.keyboard('{ArrowRight>5/}');
    expect(document.activeElement).toBe(lastLevel2);
    userEvent.keyboard('{ArrowLeft>5/}');
    expect(document.activeElement).toBe(root);
    userEvent.keyboard('{ArrowRight>2/}{ArrowDown>1/}');
    expect(document.activeElement).not.toBe(item2);
    expect(document.activeElement).toBe(child1);
    userEvent.keyboard('{ArrowUp>1/}');
    expect(document.activeElement).toBe(item2);
    userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(lastElement);
    expect(document.activeElement).not.toBe(root);
    userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(root);
    expect(document.activeElement).not.toBe(lastElement);
    userEvent.keyboard('{ArrowLeft/}');
    expect(document.activeElement).toBe(root);
    userEvent.keyboard('{End}{ArrowRight/}');
    expect(document.activeElement).toBe(lastElement);
  });
});
