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

```html
<link ... />
```

```html
<script>
  window.generateOrgChart(data, 'chart');
</script>
```

---

Please read the documentation on [orgchart.digdir.no](https://orgchart.digdir.no) for more information about behaviour and data structure.
