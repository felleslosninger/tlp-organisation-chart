# Organisation Chart

[![](https://img.shields.io/npm/v/@digdir/organisation-chart?label=latest%20release&color=0051be)](https://www.npmjs.com/package/@digdir/organisation-chart)

Display an accessible organisation chart.

![Image showing organisation chart](https://i.imgur.com/5IZXdii.png)

---

## 🚀 Get started

The package exposes one javascript function that can be used on any website, or in any framework.
Keep in mind that the function **always** attaches itself to `window`.

### Installing via npm

```shell
npm install @digdir/organisation-chart
```

After the package is installed, we need to import the css, either globally or only on the page you are using the chart.

```js
import '@digdir/organisation-chart/dist/index.css';
```

then import the function, and use it

```js
import { generateOrgChart } from '@digdir/organisation-chart';

generateOrgChart(data, 'chart');
```

The first argument is your JSON data, read more about setting up your data below.
The second argument is the id of the container where you want the chart to show.

### Installing via `<link>`

We recommend to build your own copy of the package, and then add it to your website.
You can read about how to do this below.

```html
<link
  rel="preload"
  src="path/to/orgchart"
/>
```

```html
<script>
  window.generateOrgChart(data, 'chart');
</script>
```

It it possible to use services like jsdelivr to get the package, but we recommend to build your own copy.

---

## Behaviour

The chart is responsive on any device, and looks at the width of the parent container to check if it needs to change.
This means that if your chart is in a small container, it will change to fit that container - no media queries needed.

We use these breakpoints:

| Name   | Breakpoint   |
| ------ | ------------ |
| main   | > 1500       |
| laptop | < 1500 > 992 |
| tablet | < 992 > 768  |
| mobile | < 768        |

### Rules

Coming..

#### Limitations

Coming..

#### Gotchas

Coming..

---

## Accessibility

By default the chart gets a `role="tree"`, and every child gets a `role="treeitem"`. This is done to make screenreaders be able to parse the content as a tree of connected nodes.
We automatically add levels to the nodes, and the screenreader will read out the level of the node.

Some browsers or screenreaders might work differently, but this is a limitation with the programs, and not the chart.

You are free to choose the color of your boxes, however we don't check the contrast between background and foreground.

---

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

You can send in more props, to further customize how the nodes look.
For example, you can make the node a link.

| Key             | Type   |
| --------------- | ------ |
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
We do not generate this, so make sure to keep this updated to be on par with your nodes.

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
  "meta": {
    "title": "Test",
    "langcode": "no"
  }
}
```

## Development

### Running locally

Run `pnpm install` in the root directory.

We have two applications, one for development, and one that is deployed on github pages.
When developing, you want to run the dev application:

```shell
pnpm run:dev
```

This links the package from the workspace, and watches for changes done in `packages/org-chart`, and rebuilds the package to be used in react.

### Building the package

Run `pnpm build:chart` in the root directory.

This will build everything into the `packages/org-chart/dist` folder. The folder container everything you need.

If you need a copy of the code on your server, this is what you should copy over.

### Publishing the package

#### Versioning

We use [changesets](https://github.com/changesets/changesets) for versioning and changelogs.

This makes a PR before each version, and handles versioning based on changesets merged from other PRs.

When you create a new PR for merging, changesets will automatically add a comment to prompt you to make a new changeset.
You can do this at any time, but it is recommended to do this a soon as possible, and keep it updated with any changes you make.

#### Publishing to NPM

After we merge the PR with the new version, we have to publish the package to npm.

First, **always** make sure you are in the `main` branch, with all changes pulled.

Secondly, run `npm whoami` to make sure you are logged in to npm on an account that has access to the digdir organisation.

Since the PR we merged contains a version changeset already, we only need to run the publish command.
Now we are safe to publish the package. We will run this commands:

```shell
pnpm changeset publish
```

This will create a tag we need to push to github.
You need to make sure you have the correct permissions to the repository.

To push the new tag, run

```shell
git push origin <tag_name>
```

or, if you are **certain** you only have one tag to push

```shell
git push --tags
```

_This is not recommended_
