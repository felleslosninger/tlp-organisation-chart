import type { MetaFunction } from "@remix-run/node";

import Chart from "../components/Chart";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Organisation Chart</h1>
      <Chart />
    </div>
  );
}
