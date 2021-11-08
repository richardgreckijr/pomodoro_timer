import React from "react"
import classNames from "../utils/class-names";

          // renders Play/Pause, and Stop buttons. 
function PlayStop({stopHandle, playPause, isTimerRunning, disableStop}){
  return(
          <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={stopHandle}
              disabled={disableStop}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
  )
}

export default PlayStop;