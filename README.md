# TLP Organisation Chart

[![](https://img.shields.io/npm/v/@digdir/organisation-chart?label=latest%20release&color=0051be)](https://www.npmjs.com/package/@digdir/organisation-chart)

Display an accessible organisation chart. 

![Image showing organisation chart](https://i.imgur.com/5IZXdii.png)

## Get started

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


The first argument is your JSON data, read more about setting up your data HERE.
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

By default the chart gets a `role="tree"`, and every child get's a `role="treeitem"`. This is done to make screenreaders be able to parse the content as a tree of connected nodes.

You are free to choose the color of your boxes, however we don't check the contrast between background and foreground.



## Development

Run `pnpm install` in the root directory.

We have two applications, one for development, and one that is deployed on github pages.
When developing, you want to run the dev application:

```sh
pnpm run:dev
```

This links the package from the workspace, and watches for changes done in `packages/org-chart`, and rebuilds the package to be used in react.
