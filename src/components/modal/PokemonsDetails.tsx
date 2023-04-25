import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useQuery } from "react-query";
import { PokemonLocation, PokemonResponse } from "../../interfaces/types";

type PokemonsTypeProps = {
  open: boolean;
  pokemon: PokemonResponse;
  onClose: () => void;
};
const PokemonsDetails: React.FC<PokemonsTypeProps> = ({
  open,
  onClose,
  pokemon,
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
      className="bg-gray-200 fixed top-0 h-screen p-5 overflow-y-auto"
      open={open}
      onClose={() => onClose()}
    >
      <Dialog.Panel>
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
