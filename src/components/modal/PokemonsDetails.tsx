import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useQuery } from "react-query";
import { PokemonLocation, PokemonResponse } from "../../interfaces/types";

type PokemonsTypeProps = {
  open: boolean;
  pokemon: PokemonResponse;
  onClose: () => void;
  colorPokemon: string[];
};
const PokemonsDetails: React.FC<PokemonsTypeProps> = ({
  open,
  onClose,
  pokemon,
  colorPokemon,
}) => {
  const { data, isLoading } = useQuery(
    ["Encounters", pokemon.name],
    async () =>
      (
        await axios.get<PokemonLocation[]>(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}/encounters`
        )
      ).data
  );
  return (
    <Dialog
      as="div"
      className="bg-white fixed top-0 h-screen"
      open={open}
      onClose={() => onClose()}
    >
      <Dialog.Panel
        style={{
          borderColor: colorPokemon[0],
          background:
            colorPokemon.length === 1
              ? colorPokemon[0] + "50"
              : `linear-gradient(to bottom,${colorPokemon
                  .map((color) => color + "50")
                  .join(",")})`,
        }}
        className="p-5 h-full w-full border-2 rounded-r-xl overflow-y-auto"
      >
        <Dialog.Title>{pokemon.name}</Dialog.Title>
        <div className="w-24">
          <img src={pokemon.sprites.front_default} />
        </div>
        <ul>
          {pokemon.stats.map((stat, i) => (
            <li key={i}>
              {stat.stat.name}:{stat.base_stat}
            </li>
          ))}
          {!isLoading && data && data.length > 0 && (
            <>
              <li>Location:</li>
              {data.map((item, i) => (
                <li key={i}>-{item.location_area.name}</li>
              ))}
            </>
          )}
        </ul>
      </Dialog.Panel>
    </Dialog>
  );
};

export default PokemonsDetails;
