import React, { useCallback, useEffect, useState } from "react";

const GameButtons = React.memo(({ gameData, handleClick }) => {
  return gameData.map((countryName) => (
    <button key={countryName} id={countryName} onClick={handleClick}>
      {countryName}
    </button>
  ));
});

export default function CountryCapitalGame({ data }) {
  const [countryCapitalPairs, setCountryCapitalPairs] = useState({}); // Country:Capital, Capital:Country pairs
  const [gameData, setGameData] = useState([]); // Array of Buttons values
  const [clickedCountries, setClickedCountries] = useState([]); // Array of Clicked Countries

  const shuffle = (array) => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  // Initial Load, set gameData and set countryCapitalPairs
  useEffect(() => {
    let tempObj = {};
    for (let [key, value] of Object.entries(data)) {
      tempObj[key] = value;
      tempObj[value] = key;
    }
    setCountryCapitalPairs({ ...tempObj });
    let randomizedGameData = shuffle([
      ...Object.keys(data),
      ...Object.values(data),
    ]);
    setGameData([...randomizedGameData]);
  }, [data]);

  const setNormalSelectColor = (element) => {
    element.style.backgroundColor = "#0000ff"; // Blue
  };

  const setErrorSelectColor = (element) => {
    element.style.backgroundColor = "#ff0000"; // Red
  };

  const deleteGameData = (item) => {
    setGameData((prev) => prev.filter((gameDataItem) => gameDataItem !== item));
  };

  const countryMatchSuccess = useCallback((item1Html, item2Html) => {
    deleteGameData(item1Html.id);
    deleteGameData(item2Html.id);
  }, []);

  const countryMatchFailure = useCallback((item1Html, item2Html) => {
    setErrorSelectColor(item1Html);
    setErrorSelectColor(item2Html);
  }, []);

  const matchCountryCapital = useCallback(
    (item1, item2) => {
      let item1Html = document.getElementById(item1);
      let item2Html = document.getElementById(item2);
      if (
        countryCapitalPairs[item1Html.id] === item2Html.id ||
        countryCapitalPairs[item2Html.id] === item1Html.id
      ) {
        countryMatchSuccess(item1Html, item2Html);
      } else {
        countryMatchFailure(item1Html, item2Html);
      }
      setClickedCountries([]);
    },
    [countryCapitalPairs, countryMatchSuccess, countryMatchFailure]
  );

  useEffect(() => {
    if (clickedCountries.length === 2) {
      matchCountryCapital(clickedCountries[0], clickedCountries[1]);
    }
  }, [clickedCountries, matchCountryCapital]);

  const addToClickedCountries = (country) => {
    if (clickedCountries.indexOf(country) === -1)
      setClickedCountries([...clickedCountries, country]);
  };

  const clearAllColors = () => {
    let allButtons = document.getElementsByTagName("button");
    for (let i = 0; i < allButtons.length; i++) {
      allButtons[i].style.backgroundColor = "";
    }
  };

  const handleClick = (evt) => {
    if (clickedCountries.length === 0) {
      clearAllColors();
    }
    setNormalSelectColor(evt.target);
    addToClickedCountries(evt.target.id);
  };
  // Use console.log() for debugging
  return (
    <div>
      {gameData.length > 0 ? (
        <GameButtons gameData={gameData} handleClick={handleClick} />
      ) : (
        "Congratulations"
      )}
    </div>
  );
}
// You can also use class components
// export default class CountryCapitalGame extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         return <div>Your game component</div>;
//     }
// }
