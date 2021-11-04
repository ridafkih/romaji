import { hiraganaArray } from "@utils/hiragana";
import Character from "@components/Character";

import { toRomaji } from "kana-romaji";
import japanese from "@koozaki/romaji-conv";

import CharacterPair from "typings/CharacterPair";
import React, { useEffect, useRef, useState } from "react";
import Toggle from "@components/Toggle";

const getRandomHiragana = () => {
  return hiraganaArray[Math.floor(Math.random() * hiraganaArray.length)];
};

const getRandomCharacterSet = (amount: number): CharacterPair[] => {
  return [...Array(amount)].map(() => {
    const randomHiragana = getRandomHiragana();
    let associatedRomaji;
    try {
      associatedRomaji = toRomaji(randomHiragana);
    } catch {}

    return { romaji: associatedRomaji, hiragana: randomHiragana };
  });
};

const Table = () => {
  const [showRomaji, setShowRomaji] = useState<boolean>(true);
  const [characterSet, setCharacterSet] = useState<CharacterPair[]>([]);
  const [completedCharacterSet, setCompletedCharacterSet] = useState<
    CharacterPair[]
  >([]);

  const [focused, setFocused] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const randomCharacterSet = getRandomCharacterSet(36);
    setCharacterSet(randomCharacterSet);
    const { current: input } = inputRef;
    if (input) input.blur();
  }, []);

  useEffect(() => {
    const { current: input } = inputRef;
    if (input) input.focus();
  }, [inputRef.current]);

  const reset = () => {
    setCharacterSet(getRandomCharacterSet(36));
    setCompletedCharacterSet([]);
    setValue("");
    const { current: input } = inputRef;
    if (input) input.focus();
  };

  const romajiToDivs = (romaji: string | undefined) => {
    if (!romaji) return;
    return [...romaji].map((character, index) => (
      <div key={index}>{character}</div>
    ));
  };

  const textToCharacterPair = (text: string): CharacterPair => {
    const hiragana = japanese(text).toHiragana();
    let romaji;
    try {
      romaji = toRomaji(hiragana);
    } catch {}
    return { hiragana, romaji };
  };

  const characterSetToTable = ({ romaji, hiragana }, successful, index) => {
    return (
      <div
        className={`border rounded-sm text-sm w-16 h-16 m-1 grid place-items-center ${
          successful ? "text-green-500 border-green-800" : ""
        } ${
          !successful && !index
            ? "text-gray-200 border-gray-500"
            : "text-gray-500 border-gray-700"
        }`}
        key={index}
      >
        <div className="flex flex-col items-center">
          {showRomaji && (
            <div
              className={`text-xs flex justify-evenly ${
                successful ? "text-green-600" : ""
              } ${!successful && !index ? "text-gray-100" : "text-gray-600"}`}
            >
              {romajiToDivs(romaji)}
            </div>
          )}
          <div className="text-xl">{hiragana}</div>
        </div>
      </div>
    );
  };

  const handleTableClick = () => {
    const { current: input } = inputRef;
    if (input) input.focus();
  };

  useEffect(() => {
    if (!window) return;
    const localStorageShowRomaji = JSON.parse(
      window.localStorage.getItem("showRomaji")
    );
    setShowRomaji(localStorageShowRomaji);
  }, []);

  const handleRomajiToggle = () => {
    setShowRomaji((previous) => {
      if (window)
        window.localStorage.setItem("showRomaji", JSON.stringify(!previous));
      return !previous;
    });
    const { current: input } = inputRef;
    if (input) input.focus();
  };

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const [firstCharacter] = characterSet;

    if (value.length > 3) return;
    if (!firstCharacter) return;
    if (value === firstCharacter.romaji) {
      setCharacterSet(() => {
        const newCharacterSet = characterSet.slice(1, characterSet.length);
        if (newCharacterSet.length === 0) {
          reset();
          return [];
        } else return newCharacterSet;
      });
      setCompletedCharacterSet([...completedCharacterSet, firstCharacter]);
      setValue("");
    } else setValue(value.replace(/\s/g, ""));
  };

  const handleFocus = () => setFocused(false);
  const handleBlur = () => setFocused(true);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="h-32 max-w-full overflow-x-auto whitespace-nowrap mb-8">
          <Character
            characterPair={
              value
                ? textToCharacterPair(value)
                : completedCharacterSet[completedCharacterSet.length - 1] ||
                  textToCharacterPair(value)
            }
          />
        </div>
        <div
          className={`grid sm:grid-cols-6 grid-cols-4 grid-rows-6 filter transition-all select-none ${
            focused ? "blur-sm cursor-pointer" : ""
          }`}
          onClick={handleTableClick}
        >
          {completedCharacterSet.map((characterSet, index) =>
            characterSetToTable(characterSet, true, index)
          )}
          {characterSet.map((characterSet, index) =>
            characterSetToTable(characterSet, false, index)
          )}
        </div>
      </div>
      <input
        type="text"
        className="off-screen"
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      <Toggle
        value={showRomaji}
        onClick={handleRomajiToggle}
        onLabel={"Hide Romaji"}
        offLabel={"Show Romaji"}
      />
    </>
  );
};

export default Table;
