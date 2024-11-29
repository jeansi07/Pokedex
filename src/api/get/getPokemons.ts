import axios from "axios";
import {
  AllPokemonResponse,
  PokemonResponse,
  TypeResponse,
} from "../../interfaces/types";

export const fetchAllPokemons = async (
  offset = 0,
  limit = 20,
  name: string
) => {
  const data = (
    await axios.get<AllPokemonResponse>(
      `https://pokeapi.co/api/v2/pokemon?offset=${name ? 1 : offset}&limit=${
        name ? 10000 : limit
      }`
    )
  ).data;

  const results = name
    ? data.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(name.toLowerCase())
      )
    : data.results;

  const pokemons = await Promise.all(
    results.map(
      async (result) => (await axios.get<PokemonResponse>(result.url)).data
    )
  );
  return { ...data, results: pokemons };
};

export const fetchPokemonTypes = async () => {
  const resp = (
    await axios.get<AllPokemonResponse>("https://pokeapi.co/api/v2/type/")
  ).data;
  const types = await Promise.all(
    resp.results.map(async (type) => ({
      ...type,
      ...(await axios.get<TypeResponse>(type.url)).data,
    }))
  );
  return { ...resp, results: types };
};
