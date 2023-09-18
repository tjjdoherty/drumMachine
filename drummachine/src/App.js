import './App.css';
import React, { useState, useEffect } from 'react';

const DATA = [
  { letter: 'Q',
    ascii: 81,
    id: 'Open-HH',
     url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  },
  { letter: 'W',
    ascii: 87,
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  },
  { letter: 'E',
    ascii: 69,
    id: 'Kick-and-Hat',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  },
    { letter: 'A',
    ascii: 65,
    id: 'Punchy-Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'
  },
  { letter: 'S',
    ascii: 83,
    id: 'Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  },
  { letter: 'D',
    ascii: 68,
    id: 'Snare',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'
  },
  { letter: 'Z',
    ascii: 90,
    id: 'Side-Stick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'
  },
  { letter: 'X',
    ascii: 88,
    id: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  },
  { letter: 'C',
    ascii: 67,
    id: 'Shaker',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'
  },
];

/* Pad is one of the 9 drum elements, will repeat this in the main app */ 

function Pad({ key, pad, power, volume, updateDisplay }) {
  const [playing, setPlaying] = useState(false);
  
/* guide to below useEffect update
no need for component did mount / unmount, the useEffect deals with this 
match the event key uppercased to the pad letter as a string.
still require the addEventListener and removeEventListener to avoid memory leaks. keydown event
the return function inside useEffect is a cleanup, remove the event listener when the component unmounts

*/

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toUpperCase() === pad.letter) {
        onPlay();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [pad.letter]);

  
  const onPlay = () => {
    if(power) {
      /* sound is an object when we do get element by Id, it's under an audio html tag, which comes with certain properties and methods e.g. play, volume, currentTime */
      const sound = document.getElementById(pad.letter);
      sound.currentTime = 0;
      sound.volume = volume;
      sound.play();
      updateDisplay(pad.id);
      setPlaying(true);
      setTimeout(() => {
        setPlaying(false)
      }, 80);
     }
  }
    /* audio tag is a reserved tag, we capture it by id and then it will have the .play method, .volume property, .currentTime etc */ 
  
      /* const style = null; */
      
      return (
        <div className="outerpad">
          <div 
            className="drum-pad"
            id={pad.id}
            onClick={onPlay}
          >
           <audio 
             id={pad.letter}
             src={pad.url}
             className="clip"
            >
            </audio>
            {pad.letter}
          </div>
        </div>
      )
    
}

function ControlPanel({ volumeInput, togglePower, changeVolume, currentSound, power}) {
    
    // create a style dependent on power on/off for button, volume control etc
    const style = power ? {background: "gold"} : {background: "gray", boxShadow: "none"};
    
    return (
      <div className="control-panel">
        <div className="label">DrumBoy</div>
        <div>
          <p>Power</p>
          <button className="power-button" style={style} onClick={togglePower}>I/O</button>
        </div>
        <div>
          <p>Volume</p>
          <input value={volumeInput} 
                 type="range"
                 min="1" 
                 max="100" 
                 onChange={changeVolume}>
          </input>
        </div>
        <div style={style} className="display" id="display">{currentSound}</div>
        <div className="speakers">
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
        </div>
      </div>
    )
}

function App() {
  const [currentSound, setCurrentSound] = useState('');
  const [power, setPower] = useState(true);
  const [volumeInput, setVolumeInput] = useState(50);
  const [volume, setVolume] = useState(0.5);
    
  /* these three methods are what the whole app needs to control - 
  is it on, change the display and change the volume, the individual drum pads don't control these. */

  const updateDisplay = (id) => {
    setCurrentSound(id);
    setTimeout(() => {
      setCurrentSound('');
    }, 2000);
  }
  
  const togglePower = () => {
    const message = !power && 'Hello!';
    setPower(!power);
    setCurrentSound(message);
    
    setTimeout(() => {
      setCurrentSound('');
    }, 2000);
    // welcome only runs when power is true === it's on

  }
  
  const changeVolume = (e) => {
    const volume = e.target.value / 100;
    const message = "Volume: " + e.target.value;
    setVolume(volume);
    setVolumeInput(e.target.value);
    setCurrentSound(message);
  }
    
      
  const pads = DATA.map((pad, i) => {
    return <Pad
            key={i}
            pad={pad}
            power={power}
            volume={volume}
            updateDisplay={updateDisplay}
            />
      });
      
  return (
      <div className="container">
        <div className="machine">
          <div className="pads">
            {pads}
          </div>
          <ControlPanel
            volumeInput={volumeInput}
            togglePower={togglePower}
            changeVolume={changeVolume}
            currentSound={currentSound}
            power={power}
          />
        </div>
      </div>
    )
}

export default App;
