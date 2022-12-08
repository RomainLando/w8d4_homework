import {useEffect, useState} from "react";
import './Game.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Game = () => {

  const [api, setApi] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [country, setCountry] = useState("");
  const [hint, setHint] = useState("");
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [location, setLocation] = useState([0,0]);
  

  useEffect(() => {
    
    fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      setApi(data);
      randomFlag(data);
    });
  }, [])

  useEffect(() => {
    checkGuess();
  }, [guess])


  const handleClick = () => {
    randomFlag(api);
    setGuess("")
  }

  const randomFlag = (api) => {
    const num = Math.floor((Math.random() * 250))
    setImgUrl(api[num].flags.png);
    setCountry(api[num].name.common);
    setLocation(api[num].latlng)
    setHint(
      "This country is found in "+ api[num].subregion+", The capital is "+api[num].capital+", and the population is "+api[num].population+"."
    )
  }

  const handleGuess = (evt) => {
    setGuess(evt.target.value);
    checkGuess(evt.target);
  }

  const checkGuess = (guessInput=guess) => {
    if (!api) {
      return null;
    } else if (guessInput.value === country && timeLeft) {
      randomFlag(api);
      guessInput.value = "";
      setScore(score+1)
      setGuess("")
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (timeLeft) {
      setTimeLeft(timeLeft-1); }
    }, 1000);
  }, [timeLeft]);
  

  return (
      <div id="app">
        <div id="game-container">
          <h1>Flag Guesser</h1>
          <div id="game">
            <div className="game-text">
              {timeLeft ? <h1>{timeLeft}</h1> : <h1>Time's up!</h1>}
              <h2>You're score is {score}</h2>
            </div>
          </div>
        </div>
        <div id="main-container">

          <div id="flag-game">
            <img id="flag-img" src={imgUrl} alt="flag"/>
          </div>

          <div id="map-container">
            <MapContainer id="map" center={[0, 0]} zoom={1.4} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={location}>
                <Popup>
                  {hint}
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div id="actions">
            <button onClick={handleClick}>Gimme Another Flag!</button>
            <input type="text" placeholder="Enter your guess" value={guess} onInput={handleGuess}></input>
          </div>  
          
        </div>
      </div>
  );
}

export default Game;
