# TLP Organization Chart

Fyll inn her...

## Development

Run `pnpm install` in the root directory.

To make use of the package in our react testing application, we need to link the packages locally.

Go into the pakcage, and then tell npm we want to link this package

```console
cd packages/org-chart
npm link
```

Then we need to create the link in the react app

```console
cd ../../apps/react
npm link @digdir/organization-chart
```

Everything should now be set up for you to run `pnpm run:dev` in the root of the project.
