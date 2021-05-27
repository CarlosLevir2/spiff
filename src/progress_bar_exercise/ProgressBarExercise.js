import React, { useState } from 'react';
import Exercise from '../exercise/Exercise';

import './styles.css';

const ProgressBarExercise = () => {
  return (
    <div className="progress-bar-exercise">
      <Exercise
        solution={<Solution />}
        specsUrl="https://github.com/SpiffInc/spiff_react_exercises/issues/1"
        title="Progress Bar Exercise"
      />
    </div>
  );
};

export default ProgressBarExercise;

// ----------------------------------------------------------------------------------

function ProgressBar() {
  const [buttonText, setButtonText] = useState('Start Request');
  const [requestStatus, setRequestStatus] = useState('notFetched');
  const [barVisibleStatus, setBarVisibleStatus] = useState('invisible');

  function startRequest() {
    if (requestStatus === 'fetching' || requestStatus === 'fetched') return;

    setRequestStatus('fetching');
    setBarVisibleStatus('visible');
    setButtonText('Loading...');
  }

  function finishRequest() {
    if (requestStatus !== 'fetching') return;

    setRequestStatus('fetched');
    setButtonText('Start Request');

    setTimeout(() => {
      setBarVisibleStatus('invisible');
    }, 3000);

    setTimeout(() => {
      setRequestStatus('notFetched');
    }, 4000);
  }

  return (
    <div>
      <div className={`progress-bar ${requestStatus} ${barVisibleStatus}`} />
      <div>
        <button className="button button-start" onClick={startRequest}>
          {buttonText}
        </button>
        <button className="button button-finish" onClick={finishRequest}>
          Finish Request
        </button>
      </div>
    </div>
  );
}

const Solution = () => {
  return (
    <div>
      <ProgressBar />
    </div>
  );
};
