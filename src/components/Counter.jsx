import React from 'react'
import { useState, useEffect, useRef } from 'react';
import "./counter.scss";

function Counter() {
    const [timer, setTimer] = useState("00:00");
    const Ref = useRef(null);

    const fetchTime = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        // const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, minutes, seconds
        };
    };

    const startTimer = (e) => {
        let { total, minutes, seconds }
            = fetchTime(e);
        if (total >= 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    };

    const clearTimer = (e) => {

        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next    
        setTimer('00:05');

        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    };

    const getDeadTime = () => {
        let deadline = new Date();

        // This is where you need to adjust if 
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + 5);
        return deadline;
    }

    useEffect(() => {
        clearTimer(getDeadTime());
    }, [])


    return (
        <div className='counter-main'>
            <div className='counter-middle'>
                {/* <span>Recording<br/>starts in</span> */}
                <div className="counter-timer">
                    {timer}
                </div>
            </div>
        </div>
    )
}

export default Counter;