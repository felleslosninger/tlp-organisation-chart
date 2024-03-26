import { generateOrgChart } from '../';
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;

const data = {
  meta: {
    title: 'Test',
    langcode: 'no',
  },
  toc: [
    { title: 'Root', color: '#0062BA' },
    { title: 'Item', color: '#1e2b3c' },
  ],
  nodes: [
    {
      title: 'Root',
      id: 'root',
      backgroundColor: '#0062BA',
      textColor: '#1e2b3c',
    },
    {
      title: 'Item',
      id: 'item1',
      backgroundColor: '#1e2b3c',
      textColor: 'white',
      url: 'https://www.digdir.no/',
    },
  ],
  layouts: {
    main: {
      rows: [
        {
          row: [
            {
              id: ['root'],
              alignment: 'center',

              children: ['item1'],
            },
          ],
        },
        {
          row: [
            {
              id: ['item1'],
            },
          ],
        },
      ],
    },
  },
};

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
