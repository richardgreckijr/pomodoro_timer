import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import PlayStop from "./PlayStop"
import Focus from "./Focus"
import Break from "./Break"
import SessionTimer from "./SessionTimer"

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
 /**
* State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
*/
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

// state management
function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState(null);
  const [disableStop, setDisableStop] = useState(true);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [disableMenu, setDisableMenu] = useState(false);
  
  // Increase & decrease functionality
  const breakDecrease = () => {
      setBreakDuration(Math.max(1, breakDuration - 1));
  };
  const focusDecrease = () => {
    setFocusDuration(Math.max(5, focusDuration - 5));
  };
  
  const breakIncrease = () => {
    setBreakDuration(Math.min(15, breakDuration + 1));
  }
  
  const focusIncrease = () => {
    setFocusDuration (Math.min(60, focusDuration + 5));
  }
  
  // Custom hook that invokes the callback function every second
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  // play/pause functionality; Called when Play/pause is clicked
  function playPause() {
    setDisableStop(false)
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
       // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }
  
  // Click handler for stop button; Resets pomodoro
  function stopHandle () {
    setDisableStop(true);
    setIsTimerRunning(false);
    setDisableMenu(false);
    setFocusDuration(25);
    setBreakDuration(5);
    setSession(null);
  }

  return (
    <div className="pomodoro">
      <div className="row">
    <Focus
      disableMenu={disableMenu}
      focusDuration={focusDuration}
      focusIncrease={focusIncrease}
      focusDecrease={focusDecrease}
      />
    <Break breakIncrease={breakIncrease}
      breakDecrease={breakDecrease}
      breakDuration={breakDuration}
      disableMenu={disableMenu}/>
      </div>
      <div className="row">
     <PlayStop 
       disableStop={disableStop}
       playPause={playPause}
       isTimerRunning={isTimerRunning}
       stopHandle={stopHandle}/>
       </div>
       <div className="row" style={{display:'grid', justifyContent: 'center'}}>
     <SessionTimer session={session}
       focusDuration={focusDuration}
       breakDuration={breakDuration} />
      </div>
    </div>
  );
}

export default Pomodoro;
