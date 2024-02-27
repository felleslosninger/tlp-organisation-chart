export type Meta = {
  title: string;
  langcode: string;
};

export type TableOfContentsItem = {
  title: string;
  color: string;
};

export type Node = {
  title: string;
  id: string;
  backgroundColor: string;
  textColor: string;
  url?: string; // Optional
  border?: string; // Optional
  opacity?: string;
};

export type Component = {
  type?: string;
  children?: string[];
};

export type Column = {
  id: string | string[];
  alignment: string;
  parent?: string; // Optional
  component?: Component; // Optional
};

export type Row = {
  row: Column[]; // Adjusted to reflect the actual JSON structure
};

export type Layout = {
  rows: Row[];
};

export type Layouts = {
  main: Layout;
  laptop?: Layout; // Optional
  tablet?: Layout; // Optional
};

export type OrgChartData = {
  meta: Meta;
  toc: TableOfContentsItem[];
  nodes: Node[];
  layouts: Layouts;
};
