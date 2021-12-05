import React, {createRef} from 'react';
import ReactDOM from 'react-dom';
import './css/styles.css';
import ImageBenRazorHead from './images/br-head-1.png';

function App(props) {
  return (
    <div>
      <img alt="Ben Razor Head" src={ImageBenRazorHead} />
      <h1>Welcome to REACT</h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));