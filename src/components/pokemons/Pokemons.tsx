import axios from "axios";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQuery } from "react-query";
import {
  AllPokemonResponse,
  PokemonResponse,
  TypeResponse,
  TypesResponse,
} from "../../interfaces/types";
import PokeCard from "../card/PokeCards";
import PokemonCharts from "../charts/PokemonsCharts";
import Loader from "../loader/Loader";
import PokemonsDetails from "../modal/PokemonsDetails";

const Pokemons = () => {
  const { ref, inView } = useInView();
  const [selectTypes, setSelectTypes] = useState<string | null>(null);
  const [selectPokemons, setSelectPokemons] = useState<PokemonResponse | null>(
    null
  );
  const [typesColors, setTypesColors] = useState<Record<string, string>>({});
  const {
    data: pokemons,
    isLoading: isLoadingPokemons,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["pokemons"],
    async ({ pageParam }) => {
      const data = (
        await axios.get<AllPokemonResponse>(
          pageParam ?? "https://pokeapi.co/api/v2/pokemon"
        )
      ).data;
      const pokemons = await Promise.all(
        data?.results.map(
          async (result) =>
            (
              await axios.get(result.url)
            ).data as PokemonResponse
        )
      );
      return { ...data, results: pokemons };
    },
    { getNextPageParam: (page) => page.next }
  );
  if (selectTypes === null && inView && hasNextPage) {
    fetchNextPage();
  }
  const { isLoading, data: types } = useQuery(
    ["Type"],
    async () => {
      const resp = (
        await axios.get<TypesResponse>("https://pokeapi.co/api/v2/type/")
      ).data;
      const types = await Promise.all(
        resp.results.map(async (type) => ({
          ...type,
          ...(await axios.get<TypeResponse>(type.url)).data,
        }))
      );
      return { ...resp, results: types };
    },
    {
      onSuccess: ({ results }) => {
        let colors: Record<string, string> = {};
        let randomColor = () =>
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
            .toUpperCase();
        results.forEach((type) => (colors[type.name] = randomColor()));
        setTypesColors(colors);
      },
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingFilteredPokemons,
    data: filteredPokemons,
    refetch,
  } = useQuery(["typePokemon", selectTypes], async () => {
    return Promise.all(
      types?.results
        .find((type) => type.name === selectTypes)
        ?.pokemon.map(
          async (pokemon) =>
            (await axios.get<PokemonResponse>(pokemon.pokemon.url)).data
        ) ?? []
    );
  });

  const pokemonsToShow = () => {
    if (selectTypes) {
      return filteredPokemons;
    }
    return pokemons?.pages.flatMap((page) => page.results);
  };

  useEffect(() => {
    refetch();
  }, [selectTypes]);

  return (
    <main className="container py-3 ">
      <PokemonCharts
        onClick={({ name }) => setSelectTypes(name)}
        types={
          types?.results.map((type) => ({
            name: type.name,
            count: type.pokemon.length,
            color: typesColors[type.name],
          })) ?? []
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
        {pokemonsToShow()?.map((pokemon) => (
          <PokeCard
            onClick={() => setSelectPokemons(pokemon)}
            key={pokemon.id}
            pokemon={{
              title: pokemon.name,
              abilities: pokemon.abilities.map(
                (ability) => ability.ability.name
              ),
              heigth: pokemon.height,
              weigth: pokemon.weight,
              types: pokemon.types.map((type) => ({
                name: type.type.name,
                color: typesColors[type.type.name],
              })),
              image: pokemon.sprites.front_default,
            }}
          />
        ))}
      </div>
      <div className="w-full flex justify-center my-5" ref={ref}>
        {(isFetchingNextPage ||
          isLoading ||
          isLoadingPokemons ||
          isLoadingFilteredPokemons) && <Loader />}
      </div>
      {selectPokemons && (
        <PokemonsDetails
          open={true}
          onClose={() => setSelectPokemons(null)}
          pokemon={selectPokemons}
        />
      )}
    </main>
  );
};

export default Pokemons;
