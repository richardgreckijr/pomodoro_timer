import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import PlayStop from "./PlayStop"
import Focus from "./Focus"
import Break from "./Break"
import SessionTimer from "./SessionTimer"

function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

function nextSession(focusDuration, breakDuration) {
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

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState(null);
  const [disableStop, setDisableStop] = useState(true);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [disableMenu, setDisableMenu] = useState(false);
  
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
  
  
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    setDisableMenu(true)
    setDisableStop(false)
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
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
  
  function stopHandle () {
    setDisableStop(true)
    setIsTimerRunning(false)
    setDisableMenu(false)
    setFocusDuration(25)
    setBreakDuration(5)
    setSession(null)
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
     <SessionTimer session={session}
       focusDuration={focusDuration}
       breakDuration={breakDuration} />
      </div>
    </div>
  );
}

export default Pomodoro;
