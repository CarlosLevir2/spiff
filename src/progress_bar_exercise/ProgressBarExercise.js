import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
function ProgressBarV1() {
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

function ProgressBarV2({ breakpoints }) {
  const [buttonText, setButtonText] = useState('Start Request');
  const [requestStatus, setRequestStatus] = useState('notFetched');
  const [barVisibleStatus, setBarVisibleStatus] = useState('invisible');
  const [percentage, setPercentage] = useState({ value: 0, index: 0 });

  const timeoutRef = useRef(null);

  const animationDuration = useMemo(() => {
    if (requestStatus === 'fetched') {
      return 1;
    }

    return percentage.value * 0.1;
  }, [percentage.value, requestStatus]);

  function startRequest() {
    if (requestStatus !== 'notFetched') return;
    setPercentage({ value: breakpoints[0], index: 0 });

    setRequestStatus('fetching');
    setBarVisibleStatus('visible');
    setButtonText('Loading...');
  }

  const finishRequest = useCallback(() => {
    if (requestStatus !== 'fetching') return;
    clearInterval(timeoutRef.current);

    setPercentage({ value: 100, index: 0 });
    setRequestStatus('fetched');
    setButtonText('Start Request');

    setTimeout(() => {
      setBarVisibleStatus('invisible');
    }, 3000);

    setTimeout(() => {
      setPercentage({ value: 0, index: 0 });
      setRequestStatus('notFetched');
    }, 4000);
  }, [requestStatus]);

  useEffect(() => {
    if (requestStatus !== 'fetching' || percentage.value === 100) return;
    clearInterval(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (percentage.index + 1 === breakpoints.length) {
        setPercentage((prevPercentage) => ({
          value: 100,
          index: prevPercentage.index,
        }));

        setTimeout(() => {
          setRequestStatus('fetched');
          setButtonText('Start Request');
          setPercentage({ value: 0, index: 0 });
          setBarVisibleStatus('invisible');
        }, animationDuration * 1000 + 3000);

        setTimeout(() => {
          setRequestStatus('notFetched');
        }, animationDuration * 1000 + 4000);

        return;
      }

      setPercentage((prevPercentage) => ({
        value: breakpoints[prevPercentage.index + 1],
        index: prevPercentage.index + 1,
      }));
    }, animationDuration * 1000);
  }, [
    percentage,
    breakpoints,
    animationDuration,
    requestStatus,
    finishRequest,
  ]);

  return (
    <div>
      <div
        className={`progress-bar ${barVisibleStatus}`}
        style={{
          width: `${percentage.value}%`,
          transition: `width ${animationDuration}s `,
        }}
      />
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
      V1:
      <ProgressBarV1 />
      v2:
      <ProgressBarV2 breakpoints={[30, 60, 90]} />
    </div>
  );
};
