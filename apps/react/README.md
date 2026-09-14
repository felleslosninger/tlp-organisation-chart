# React dev playground

Local development app for `@digdir/organisation-chart`. It links the package from
the workspace so you can try out chart data and breakpoints while working on the
library. It is not deployed anywhere — the deployed site is `apps/storefront`.

## Scripts

Run from the repository root:

| Command            | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `pnpm run:dev`     | Rebuilds the chart package on change and runs this app             |
| `pnpm start:react` | Runs only this app on [http://localhost:3000](http://localhost:3000) |

Or from this directory:

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start the Vite dev server            |
| `pnpm build`   | Typecheck and build to `build/`      |
| `pnpm preview` | Serve the production build locally   |

## Data

The datasets in the dropdown live in `src/data`. Add a JSON file there and
register it in `src/components/Home/Home.tsx` to make it selectable.

