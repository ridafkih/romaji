import next from "next";
import CharacterPair from "typings/CharacterPair";

interface CharacterProps {
  characterPair: CharacterPair;
}

const Character = ({ characterPair }: CharacterProps) => {
  const isEnglish = () => {
    return characterPair.hiragana === characterPair.romaji;
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`text-gray-400 text-xs flex justify-evenly w-full ${
          isEnglish() ? "invisible" : "visible"
        }`}
      >
        {characterPair.romaji.split(" ").map((englishCharacter, index) => {
          return <div key={index}>{englishCharacter}</div>;
        })}
      </div>
      <div className="text-7xl text-gray-300 mt-4">
        {characterPair.hiragana}
      </div>
    </div>
  );
};

export default Character;
