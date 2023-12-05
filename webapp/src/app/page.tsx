"use client";

import "aframe";
import { Entity, Scene } from "aframe-react";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

// import image from './assets/360_world.jpg';

export default function Home() {
  const [image, setImage] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const audio = new Audio("/sound.mp3");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleGoClick = async (prompt?) => {
    if (
      typeof prompt == "undefined" ||
      prompt.constructor.name === "SyntheticBaseEvent"
    ) {
      prompt = searchValue;
    }

    if (prompt == "") {
      setMessage("Please enter a search term");
      return;
    }
    setMessage("");
    setIsLoading(true);
    console.log("Go button clicked. Search value: ", prompt);
    // you can call any function you wish to execute on Go button click here

    const response = await fetch("/api/portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      setMessage("Error: " + response.statusText);
      return;
    }

    const data = await response.json();
    // console.log("data: ", data);

    const image = data.result;
    setImage(image);
    // console.log("image: ", image);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      audio.loop = true;
      audio.play();
    } else {
      console.log("trying pause");
      audio.pause();
    }

    // Cleanup function to pause audio when component unmounts
    return () => {
      console.log("component unmounted, pausing audio");
      audio.pause();
    };
  }, [isLoading]); // Add isLoading to dependencies

  const generatePrompt = async () => {
    // pick a random prompt from the list
    const prompts = [
      "The Shire, Hobbit Hole",
      "Underwater, Shipwreck, Atlantis",
      "Minecraft",
      "Candyland, Gingerbread House",
      "R2D2, Spaceship",
      "Snowy Trail, Pandas",
      "Ancient Egypt, Pyramids",
      "Haunted Mansion, Ghost Party",
      "Magic Kingdom, Cinderella's Castle",
      "Moon, Lunar Base",
      "Old West, Gold Mine",
      "Jungle, Hidden Temple",
      "Jurassic Era, Dinosaur Den",
      "Tropical Island, Pirate Treasure",
      "Middle-Earth, Mordor",
      "Narnia, Winter Wonderland",
      "Alien Planet, Extraterrestrial Life",
      "Underground, Crystal Caves",
      "Secret Garden, Enchanted Forest",
      "Sky City, Cloud Palace",
      "Arctic, Polar Bears",
      "Galaxy Far Away, Death Star",
      "Starship Enterprise, Space",
      "Fairyland, Toadstool Houses",
      "Undersea, Mermaid Kingdom",
      "Volcanic Island, Dragon Nest",
      "Wild West, Cowboy Camp",
      "Medieval Castle, Knights",
      "retro arcade, 1980s, neon",
      "Gotham city, Bat cave",
    ];

    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    setSearchValue(prompt);
    await handleGoClick(prompt);
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      {isLoading && (
        <div className="flex justify-center h-screen w-screen">
          <img
            src="/giphy.gif"
            className="w-1/2"
            alt="360 World"
            style={{ position: "absolute", zIndex: 10 }}
          />
        </div>
      )}
      <Scene>
        <Entity
          primitive="a-sky"
          src={`data:image/png;base64,${image}`}
          rotation="0 0 0"
        ></Entity>{" "}
        {/* <Entity primitive="a-text" font="kelsonsans" value="Puy de Sancy, France" width="6" position="-2.5 0.25 -1.5" rotation="0 15 0"></Entity> */}
      </Scene>

      <div
        className={`p-4 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        style={{ zIndex: 10 }}
      >
        {message != "" && <p className="bg-white">{message}</p>}

        <div className="flex flex-row justify-between">
          <div>
            <input
              className="shadow appearance-none border rounded w-60 py-2 px-3 mr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Think of a place, any place..."
              value={searchValue}
              onChange={handleSearchChange}
              disabled={isLoading}
            />

            <button
              className="mt-2 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleGoClick}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Go"}
            </button>

            <button
              className="mt-2 ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={generatePrompt}
              disabled={isLoading}
            >
              Surprise Me
            </button>
          </div>

          <div className="flex justify-center items-center">
            <a href="https://embeds.beehiiv.com/ddfae031-3d41-4b68-8e9e-c8950acbbd3a">
              <p className="mx-auto text-center text-blue-500">
                Get email updates
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
