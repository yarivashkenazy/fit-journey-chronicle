
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, register the service worker
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // When new content is available, show a notification
    if (registration && registration.waiting) {
      if (window.confirm('New version available! Reload to update?')) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  },
});
