import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@digdir/design-system-tokens/brand/digdir/tokens.css';
import '@digdir/organisation-chart/dist/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(<App />);

reportWebVitals();
