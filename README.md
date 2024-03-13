# Organisation Chart

[![](https://img.shields.io/npm/v/@digdir/organisation-chart?label=latest%20release&color=0051be)](https://www.npmjs.com/package/@digdir/organisation-chart)

Display an accessible organisation chart. 

![Image showing organisation chart](https://i.imgur.com/5IZXdii.png)

---

## 🚀 Get started

The package exposes one javascript function that can be used on any website, or in any framework.
Keep in mind that the function **always** attaches itself to `window`.

### Installing via npm


```sh
npm install @digdir/organisation-chart
```


After the package is installed, we need to import the css, either globally or only on the page you are using the chart.


```js
import '@digdir/organisation-chart/dist/index.css'
```

then import the function, and use it

```js
import { generateOrgChart } from '@digdir/organisation-chart';

generateOrgChart(data, 'chart');
```

The first argument is your JSON data, read more about setting up your data below.
The second argument is the id of the container where you want the chart to show.

### Installing via `<link>`

```html
<link ...>
```

```html
<script>
  window.generateOrgChart(data, 'chart');
</script>
```

---

## Behaviour

The chart is responsive on any device, and looks at the width of the parent container to check if it needs to change.
We use these breakpoints:

| device   | breakpoint |
|----------|------------|
| standard | >1500      |
| laptop   | <1500 >992 |
| tablet   | <992 >768  |
| mobile   | <768       |


### Rules

JENS FYLL INN HER


### A11y

By default the chart gets a `role="tree"`, and every child gets a `role="treeitem"`. This is done to make screenreaders be able to parse the content as a tree of connected nodes.

You are free to choose the color of your boxes, however we don't check the contrast between background and foreground.

## JSON structure

### Nodes

Nodes are the boxes that will be rendered out, this is where you customize the rendered content.
Each node must always have an id and a title. Keep in mind that the id must be unique.

```json
{
  "nodes": [
    { "id": "1", "title": "Root" },
    { "id": "2", "title": "Item" }
  ]
}
```

You can send in more props, to further customize how the nodes look, and if it should be a link.

| Key             | Type   |
|-----------------|--------|
| id              | string |
| title           | string |
| url             | string |
| backgroundColor | string |
| textColor       | string |

### Layouts

The layouts key is used to define how the nodes should connect to eachother.
This is always required, and might be difficult to understand at first.

You can see examples on [Github](https://github.com/felleslosninger/tlp-organization-chart/tree/main/apps/react/src/data).

```json
{
  "layouts": {
    "main": {
      "rows": [
        {
          "row": [
            {
              "id": ["root"],
              "alignment": "center",
              "component": {
                "type": "root",
                "children": ["item1"]
              }
            }
          ]
        },
        {
          "row": [
            {
              "id": ["item1"]
            }
          ]
        }
      ]
    }
  }
}
```

You can define a layout for each of our breakpoints, or you can use the same layout for all of them.

We split the layout into rows, and each row can have multiple nodes. Refer to the REGLER HERE for more information 
about limitations.

### TOC

The TOC (Table of Contents) is a legend that shows what your different nodes are. 
This is optional, and can be turned off by not sending it in your data. It is, however, recommended to use it.

```json
{
  "toc": {
    { "title": "Root", "uid": "root" },
    { "title": "Item", "uid": "child" }
  }
}
```

### Meta

The meta object is used to define a name, and the language code. This key is optional.

```json
{
  "meta":{
    "title": "Test",
    "langcode": "no"
  }
}
```

---

## Development

Run `pnpm install` in the root directory.

We have two applications, one for development, and one that is deployed on github pages.
When developing, you want to run the dev application:

```sh
pnpm run:dev
```

This links the package from the workspace, and watches for changes done in `packages/org-chart`, and rebuilds the package to be used in react.
