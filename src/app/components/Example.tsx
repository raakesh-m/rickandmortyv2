"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaTransgenderAlt, FaFemale, FaMale } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { GiEarthAmerica } from "react-icons/gi";
import { Listbox } from "@headlessui/react";
import Pagination from "./Pagination";

interface Origin {
  name: string;
}

interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
  gender: string;
  location: {
    name: string;
  };
  origin: Origin;
  episode: string[];
}

const statuses = ["All Status", "Alive", "Dead", "unknown"];
const genders = ["All Genders", "Female", "Male", "unknown"];

export default function Example() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [genderFilter, setGenderFilter] = useState<string>("All Genders");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState<number | null>(1);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const initialPages = 3; // Number of pages to load initially
      let allCharacters: Character[] = [];

      for (let i = 1; i <= initialPages; i++) {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character?page=${i}`
        );
        const data = await response.json();
        allCharacters = [...allCharacters, ...data.results];

        if (i === initialPages && data.info.next) {
          setNextPage(initialPages + 1);
        } else if (!data.info.next) {
          setNextPage(null);
        }
      }

      setCharacters(allCharacters);
      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

  const loadMoreData = async () => {
    if (nextPage) {
      setIsLoading(true);
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${nextPage}`
      );
      const data = await response.json();

      setCharacters((prevCharacters) => [...prevCharacters, ...data.results]);

      if (data.info.next) {
        setNextPage(nextPage + 1);
      } else {
        setNextPage(null);
      }
      setIsLoading(false);
    }
  };

  const fetchAllPages = async () => {
    setIsLoading(true);
    let allCharacters: Character[] = [];
    let page = 1;
    while (true) {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${page}`
      );
      const data = await response.json();
      allCharacters = [...allCharacters, ...data.results];
      if (!data.info.next) {
        break;
      }
      page++;
    }
    setCharacters(allCharacters);
    setIsLoading(false);
  };

  // Function to format episodes
  const formatEpisodes = (episodes: string[]) => {
    const episodeNumbers = episodes.map((url) =>
      parseInt(url.split("/").pop() || "0")
    );
    episodeNumbers.sort((a, b) => a - b);

    const ranges: string[] = [];
    let start = episodeNumbers[0];
    let end = episodeNumbers[0];

    for (let i = 1; i < episodeNumbers.length; i++) {
      if (episodeNumbers[i] === end + 1) {
        end = episodeNumbers[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = episodeNumbers[i];
        end = episodeNumbers[i];
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);

    return ranges.join(", ");
  };

  // Function to get status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Alive":
        return <span className="text-green-400">{status}</span>; // Green for alive
      case "Dead":
        return <span className="text-red-500">{status}</span>; // Red for dead
      default:
        return <span className="text-orange-200">Probably dead</span>; // Display IDK for unknown
    }
  };

  // Function to get gender icon
  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "Female":
        return <FaFemale className="text-gray-400" />;
      case "Male":
        return <FaMale className="text-gray-400" />;
      default:
        return <FaTransgenderAlt className="text-gray-400" />;
    }
  };

  const filteredCharacters = characters.filter((character) => {
    const matchesSearch = character.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || character.status === statusFilter;
    const matchesGender =
      genderFilter === "All Genders" || character.gender === genderFilter;

    return matchesSearch && matchesStatus && matchesGender;
  });

  const itemsPerPage = 15;
  const indexOfLastCharacter = currentPage * itemsPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - itemsPerPage;
  const currentCharacters = filteredCharacters.slice(
    indexOfFirstCharacter,
    indexOfLastCharacter
  );

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setGenderFilter("All Genders");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchAllPages();
  };

  const handleGenderChange = (gender: string) => {
    setGenderFilter(gender);
    setCurrentPage(1);
    fetchAllPages();
  };

  useEffect(() => {
    if (searchTerm) {
      fetchAllPages();
    }
  }, [searchTerm]);

  return (
    <div className="bg-gradient-to-b from-purple-950 to-black">
      <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="space-y-12">
          <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
            <h2 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
              Meet Our Characters
            </h2>
            <p className="text-xl text-gray-300">
              Explore the quirky characters of Rick and Morty!
            </p>
          </div>

          {/* Search Bar and Filters */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="flex-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Status Filter Dropdown */}
            <Listbox value={statusFilter} onChange={handleStatusChange}>
              <div className="relative">
                <Listbox.Button className="relative w-full px-12 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {statusFilter}
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
                  {statuses.map((status) => (
                    <Listbox.Option key={status} value={status}>
                      {({ active }) => (
                        <span
                          className={`block px-4 py-2 text-sm cursor-default ${
                            active
                              ? "bg-indigo-500 text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {status}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

            {/* Gender Filter Dropdown */}
            <Listbox value={genderFilter} onChange={handleGenderChange}>
              <div className="relative">
                <Listbox.Button className="relative w-full px-12 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {genderFilter}
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
                  {genders.map((gender) => (
                    <Listbox.Option key={gender} value={gender}>
                      {({ active }) => (
                        <span
                          className={`block px-4 py-2 text-sm cursor-default ${
                            active
                              ? "bg-indigo-500 text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {gender}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Clear Filters Button */}
          <div className="text-right">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          {/* Characters Grid */}
          <ul
            role="list"
            className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:grid-cols-3 lg:gap-8"
          >
            {currentCharacters.map((character) => (
              <li
                key={character.id}
                className="py-10 px-6 bg-gray-800 text-center rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl xl:px-10 xl:text-left"
              >
                <div className="space-y-6 xl:space-y-10">
                  <Image
                    className="mx-auto h-40 w-40 rounded-full border-4 border-indigo-400 shadow-md xl:w-56 xl:h-56"
                    src={character.image}
                    alt={character.name}
                    width={224}
                    height={224}
                  />
                  <div className="space-y-2 xl:flex xl:items-center xl:justify-between">
                    <div className="font-medium text-lg leading-6 space-y-1">
                      <h3 className="text-white">{character.name}</h3>
                      <p className="text-indigo-400">{character.species}</p>
                      <p>{getStatusDisplay(character.status)}</p>
                      <div className="flex items-center space-x-2">
                        {getGenderIcon(character.gender)}
                        <span className="text-gray-300">
                          {character.gender}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MdLocationOn className="text-gray-400" />
                        <span className="text-gray-300">
                          {character.location.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GiEarthAmerica className="text-gray-400" />
                        <span className="text-gray-300">
                          {character.origin.name}
                        </span>
                      </div>
                      <p className="text-gray-300">
                        {character.episode.length === 1
                          ? "Episode"
                          : "Episodes"}
                        : {formatEpisodes(character.episode)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            loadMoreData={loadMoreData}
          />
        </div>
      </div>
    </div>
  );
}
