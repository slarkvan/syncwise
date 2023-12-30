import { wait } from '@liuli-util/async';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useMount } from 'react-use';

const CallbackView: React.FC = () => {
  function init() {
    const p = new URLSearchParams(location.search);
    window.postMessage(
      {
        type: 'FROM_PAGE',
        data: {
          code: p.get('code'),
          state: JSON.parse(p.get('state')!),
        },
      },
      '*',
    );
  }
  useMount(async () => {
    console.log('page mount');
    await wait(() => !!document.body.dataset.contentScript);
    init();
    setTimeout(() => {
      window.close();
    }, 1000);
  });
  return <div>callback...</div>;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <CallbackView />,
);
