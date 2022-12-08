import {useEffect, useState} from "react";
import './Game.css';

const Game = () => {

  const [api, setApi] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [country, setCountry] = useState("");
  const [hint, setHint] = useState("");
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  

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
    setHint(
      "This country is found in "+ api[num].subregion+", The capital is "+api[num].capital+", and the population is "+api[num].population+"."
    )
    setText("")
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

  const handleHint = () => {
    setText(hint)
  }

  useEffect(() => {
    setTimeout(() => {
      if (timeLeft) {
      setTimeLeft(timeLeft-1); }
    }, 1000);
  }, [timeLeft]);
  

  return (
    <>
      <div id="map">
      </div>
      <div id="app">
        <h1>Flag Guesser</h1>
        <img id="flag-img" src={imgUrl} alt="flag"/>
        <div id="actions">
          <button onClick={handleClick}>Gimme Another Flag!</button>
          <input type="text" placeholder="Enter your guess" value={guess} onInput={handleGuess}></input>
        </div>
        <span><button onClick={handleHint}>Need a hint?</button></span>
        <p>{text}</p>
        <div className="game">
          {timeLeft ? <h1>{timeLeft}</h1> : <h1>Time's up!</h1>}
          <h2>You're score is {score}</h2>
        </div>
      </div>
    </>
  );
}

export default Game;
