import React, {createRef} from 'react';
import ReactDOM from 'react-dom';
import './css/styles.css';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import FluenceReact from './js/components/FluenceReact';

const TOAST_TIMEOUT = 4000;

function App(props) {

  const { addToast } = useToasts();

  function toast(message, type='info') {
    addToast(message, { 
      appearance: type,
      autoDismiss: true,
      autoDismissTimeout: TOAST_TIMEOUT
    });
  }

  return (
    <div>
      <h1>Welcome to Fluence</h1>
      <FluenceReact toast={toast} />
    </div>
  );
}

ReactDOM.render(
  <ToastProvider>
    <App />
  </ToastProvider>
, document.getElementById('root'));