import React from "react";

type PokemonData = {
  title: string;
  image: string;
  heigth: number;
  weigth: number;
  abilities: string[];
  types: { name: string; color: string }[];
};

export const PokeCard: React.FC<{
  onClick: () => void;
  pokemon: PokemonData;
}> = ({ pokemon, onClick }) => {
  const { abilities, heigth, title, types, weigth, image } = pokemon;
  return (
    <div
      onClick={onClick}
      style={{
        background:
          types.length === 1
            ? types[0].color + "50"
            : `linear-gradient(to bottom,${types
                .map(({ color }) => color + "50")
                .join(",")})`,
        borderColor: types[0].color,
      }}
      className="flex w-full  border-2 rounded-xl"
    >
      <div className="w-7/12 py-4 pl-4 h-full">
        <h4 className="font-bold text-xl mb-2">{title}</h4>
        <ol className="ml-2 leading-5">
          <li>Heigth: {heigth}</li>
          <li>Weigth: {weigth}</li>
          <li className="whitespace-nowrap truncate">
            Abilities: {abilities.join(", ")}
          </li>
        </ol>
        <div className="flex mt-2 ml-2 gap-2">
          {types.map((type) => (
            <span
              style={{ backgroundColor: type.color }}
              key={type.name}
              className=" rounded p-2 leading-none"
            >
              {type.name}
            </span>
          ))}
        </div>
      </div>
      <div className="w-5/12 flex">
        <img className="w-32 m-auto" src={image} />
      </div>
    </div>
  );
};
