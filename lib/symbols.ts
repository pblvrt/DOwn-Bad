import {
  adjacentSymbolMoneyModifier,
  getAdjacentIndices,
  getAdjacentSymbols,
  isAdjacentToSymbols,
} from "./utils";
import { Symbol, effectResult } from "@/types/game";
// Symbol definitions
export const symbolTypes: Symbol[] = [
  {
    id: "empty",
    name: "Empty",
    value: 0,
    rarity: "special",
    emoji: "",
    type: "void",
  },
  // {
  //   id: "amethyst",
  //   name: "Amethyst",
  //   value: 1,
  //   rarity: "rare",
  //   emoji: "🟣",
  //   effectDescription:
  //     "Whenever another symbol makes this symbol give additional Coin, this symbol permanently gives Coin 1 more.",
  //   // Special effect handled in game logic
  // },
  {
    id: "anchor",
    name: "Anchor",
    value: 1,
    rarity: "common",
    emoji: "⚓",
    type: "other",
    effectDescription: "Gives +4 Coin more when in a corner.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Check if in corner (0, 4, 20, 24 for a 5x5 grid)
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "other");
      const corners = [0, 3, 11, 15];
      if (corners.includes(index)) {
        return { isDestroyed: false, bonusValue: 4 * (1 + multiplier) };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "apple",
    name: "Apple",
    value: 3,
    rarity: "rare",
    emoji: "🍎",
    type: "food",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "food");
      return { isDestroyed: false, bonusValue: 3 * multiplier };
    },
  },
  {
    id: "banana",
    name: "Banana",
    value: 1,
    rarity: "common",
    emoji: "🍌",
    type: "food",
    effectDescription: "Adds <banana_peel> when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "food");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["monkey"]);
      if (isAdjacent) {
        return {
          isDestroyed: true,
          bonusValue: 1 * multiplier,
          add: ["banana_peel"],
        };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
    // Destruction effect handled in game logic
  },
  {
    id: "banana_peel",
    name: "Banana Peel",
    value: 1,
    rarity: "common",
    emoji: "🍌",
    type: "other",
    effectDescription: "Destroys adjacent <thief>. Destroys itself afterwards.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "other");
      const adjacentIndices = getAdjacentIndices(index);
      let destroyThief = false;

      for (const adjIndex of adjacentIndices) {
        const adjacentSymbol = grid[adjIndex];
        if (adjacentSymbol && adjacentSymbol.id === "thief") {
          destroyThief = true;
          break;
        }
      }

      if (destroyThief) {
        return { isDestroyed: true, bonusValue: 1 * multiplier };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "bar_of_soap",
    name: "Bar of Soap",
    value: 1,
    rarity: "uncommon",
    emoji: "🧼",
    counter: 0,
    type: "other",
    effectDescription:
      "Adds <bubble> each spin. Destroys itself after giving Coin 3 times.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const currentCounter = grid[index]?.counter ?? 0;
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "other");
      if (currentCounter >= 3) {
        return { isDestroyed: true, bonusValue: 1 * multiplier };
      }
      // Effect handled in game logic
      return {
        isDestroyed: false,
        bonusValue: 1 * multiplier,
        add: ["bubble"],
      };
    },
  },
  {
    id: "bartender",
    name: "Bartender",
    value: 3,
    rarity: "rare",
    type: "character",
    emoji: "🧑‍🍳",
    effectDescription:
      "Has a 10% chance of adding Chemical Seven, Beer, Wine or Martini.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Has a 10% chance of adding Chemical Seven, Beer, Wine or Martini.
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      const random = Math.random();
      const chooseArray = ["chemical_seven", "beer", "wine", "martini"];
      if (random < 0.1) {
        return {
          isDestroyed: false,
          bonusValue: 3 * multiplier,
          add: [chooseArray[Math.floor(Math.random() * chooseArray.length)]],
        };
      }
      return { isDestroyed: false, bonusValue: 3 * multiplier };
    },
  },
  {
    id: "bear",
    name: "Bear",
    value: 2,
    rarity: "uncommon",
    emoji: "🐻",
    type: "animal_character",
    effectDescription:
      "Destroys adjacent Honey. Gives Coin 40 for each Honey destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const isAdjacent = isAdjacentToSymbols(grid, index, ["honey"]);
      const multiplier = adjacentSymbolMoneyModifier(
        grid,
        index,
        "animal_character"
      );

      if (isAdjacent) {
        // Count how many honey symbols are adjacent
        const adjacentIndices = getAdjacentIndices(index);
        let honeyCount = 0;

        for (const adjIndex of adjacentIndices) {
          const adjSymbol = grid[adjIndex];
          if (adjSymbol && adjSymbol.id === "honey") {
            honeyCount++;
          }
        }

        return { isDestroyed: false, bonusValue: 40 * honeyCount * multiplier };
      }
      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "beastmaster",
    name: "Beastmaster",
    value: 2,
    rarity: "rare",
    type: "character",
    emoji: "🧙‍♂️",
    effectDescription: "Adjacent animal symbols give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "bee",
    name: "Bee",
    value: 1,
    rarity: "common",
    type: "animal_character",
    emoji: "🐝",
    effectDescription:
      "Adjacent Flower, Beehive and Honey give 2x more Coin. Gives Coin 1 more for each adjacent Flower, Beehive or Honey.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentSymbols = getAdjacentSymbols(grid, index);
      const multiplier = adjacentSymbolMoneyModifier(
        grid,
        index,
        "animal_character"
      );
      let bonusValue = 0;

      adjacentSymbols.forEach((adjSymbol) => {
        if (
          adjSymbol &&
          ["flower", "beehive", "honey"].includes(adjSymbol.id)
        ) {
          bonusValue += 1;
        }
      });

      return { isDestroyed: false, bonusValue: bonusValue * multiplier };
    },
  },
  {
    id: "beehive",
    name: "Beehive",
    value: 3,
    rarity: "rare",
    emoji: "🐝",
    type: "object",
    effectDescription: "Has a 10% chance of adding Honey.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      const random = Math.random();
      if (random < 0.1) {
        return {
          isDestroyed: false,
          bonusValue: 3 * multiplier,
          add: ["honey"],
        };
      }
      return { isDestroyed: false, bonusValue: 3 * multiplier };
    },
  },
  {
    id: "beer",
    name: "Beer",
    value: 1,
    rarity: "common",
    emoji: "🍺",
    type: "drink",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "drink");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["pirate", "dwarf"]);
      if (isAdjacent) {
        return { isDestroyed: true, bonusValue: 1 * multiplier };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "big_ore",
    name: "Big Ore",
    value: 2,
    rarity: "uncommon",
    emoji: "🪨",
    type: "object",
    effectDescription:
      "Adds 2 Void Stone, Amethyst, Pearl, Shiny Pebble, Sapphire, Emerald, Ruby or Diamond when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const isAdjacent = isAdjacentToSymbols(grid, index, [
        "miner",
        "geologist",
      ]);
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      if (isAdjacent) {
        const chooseArray = [
          "void_stone",
          "amethyst",
          "pearl",
          "shiny_pebble",
          "sapphire",
          "emerald",
          "ruby",
          "diamond",
        ];
        return {
          isDestroyed: true,
          bonusValue: 2 * multiplier,
          add: [
            chooseArray[Math.floor(Math.random() * chooseArray.length)],
            chooseArray[Math.floor(Math.random() * chooseArray.length)],
          ],
        };
      }
      return { isDestroyed: false, bonusValue: 0 };
    },
  },
  {
    id: "big_urn",
    name: "Big Urn",
    value: 2,
    rarity: "uncommon",
    emoji: "⚱️",
    type: "object",
    effectDescription: "Adds 2 Spirit when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const isAdjacent = isAdjacentToSymbols(grid, index, ["hooligan"]);
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      if (isAdjacent) {
        return {
          isDestroyed: true,
          bonusValue: 2 * multiplier,
          add: ["spirit", "spirit"],
        };
      }

      return { isDestroyed: false, bonusValue: 0 };
    },
  },
  {
    id: "billionaire",
    name: "Billionaire",
    value: 0,
    rarity: "uncommon",
    emoji: "🤵",
    type: "character",
    effectDescription:
      "Adjacent Cheese and Wine give 2x more Coin. Gives Coin 39 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Check if adjacent to Robin Hood
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["robin_hood"]);
      if (isAdjacent) {
        return { isDestroyed: true, bonusValue: 39 * multiplier };
      }

      // Multiplier effect handled in game logic
      return { isDestroyed: false, bonusValue: 0 };
    },
  },
  {
    id: "bounty_hunter",
    name: "Bounty Hunter",
    value: 1,
    rarity: "common",
    emoji: "🕵️",
    type: "character",
    effectDescription:
      "Destroys adjacent Thief. Gives Coin 20 for each Thief destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["thief"]);
      if (isAdjacent) {
        return { isDestroyed: true, bonusValue: 20 * multiplier };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "bubble",
    name: "Bubble",
    value: 2,
    rarity: "common",
    emoji: "🫧",
    type: "other",
    counter: 0,
    effectDescription: "Destroys itself after giving Coin 3 times.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const currentCounter = grid[index]?.counter || 0;
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "other");
      // Check if the bubble has given coins 3 times
      if (currentCounter >= 3) {
        return { isDestroyed: true, bonusValue: 2 * multiplier };
      }

      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "buffing_capsule",
    name: "Buffing Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    type: "object",
    effectDescription: "Destroys itself. Adjacent symbols give 2x more Coin.",
    effect: function (): effectResult {
      // Self-destruction
      return { isDestroyed: true, bonusValue: 0 };
    },
  },
  {
    id: "candy",
    name: "Candy",
    value: 1,
    rarity: "common",
    emoji: "🍬",
    type: "food",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "food");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["toddler"]);
      if (isAdjacent) {
        return { isDestroyed: true, bonusValue: 1 * multiplier };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "card_shark",
    name: "Card Shark",
    value: 3,
    rarity: "rare",
    emoji: "🃏",
    type: "character",
    effectDescription:
      "Adjacent Clubs, Diamonds, Hearts and Spades are Wildcard.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      // Wildcard effect handled in game logic
      return { isDestroyed: false, bonusValue: 3 * multiplier };
    },
  },
  {
    id: "cat",
    name: "Cat",
    value: 1,
    rarity: "common",
    emoji: "🐱",
    type: "animal_character",
    effectDescription:
      "Destroys adjacent Milk. Gives Coin 9 for each Milk destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(
        grid,
        index,
        "animal_character"
      );
      const isAdjacent = isAdjacentToSymbols(grid, index, ["milk"]);
      if (isAdjacent) {
        return { isDestroyed: false, bonusValue: 9 + (1 * multiplier) };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "milk",
    name: "Milk",
    value: 1,
    rarity: "common",
    emoji: "🥛",
    type: "food",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "food");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["cat"]);
      if (isAdjacent) {
        return { isDestroyed: true, bonusValue: 1 * multiplier };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "cheese",
    name: "Cheese",
    value: 1,
    rarity: "common",
    emoji: "🧀",
    type: "food",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "food");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["billionaire"]);
      if (isAdjacent) {
        return { isDestroyed: false, bonusValue: 1 * multiplier * 2 };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "chef",
    name: "Chef",
    value: 2,
    rarity: "rare",
    emoji: "👨‍🍳",
    type: "character",
    effectDescription: "Adjacent food items give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Multiplier effect handled in game logic
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "chemical_seven",
    name: "Chemical Seven",
    value: 0,
    rarity: "uncommon",
    emoji: "🧪",
    type: "object",
    effectDescription:
      "Destroys itself. Gives Coin 7 and adds 1 Lucky Seven item when destroyed.",
    // Self-destruction and effect handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      return {
        isDestroyed: true,
        bonusValue: 7 * multiplier,
        add: ["lucky_seven"],
      };
    },
  },
  {
    id: "cherry",
    name: "Cherry",
    value: 1,
    rarity: "common",
    type: "food",
    emoji: "🍒",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "food");
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "chick",
    name: "Chick",
    value: 1,
    rarity: "uncommon",
    type: "animal",
    emoji: "🐤",
    effectDescription: "Has a 10% chance to grow into Chicken.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      const random = Math.random();
      if (random < 0.1) {
        return {
          isDestroyed: true,
          bonusValue: 1 * multiplier,
          add: ["chicken"],
        };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
    // Growth chance handled in game logic
  },
  {
    id: "chicken",
    name: "Chicken",
    value: 2,
    rarity: "rare",
    emoji: "🐔",
    type: "animal",
    effectDescription:
      "Has a 5% chance of adding Egg. Has a 1% chance of adding Golden Egg.",
    // Random chance handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      const random = Math.random();
      if (random < 0.01) {
        return {
          isDestroyed: true,
          bonusValue: 1 * multiplier,
          add: ["golden_egg"],
        };
      }
      if (random < 0.05) {
        return { isDestroyed: true, bonusValue: 1 * multiplier, add: ["egg"] };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "clubs",
    name: "Clubs",
    value: 1,
    rarity: "uncommon",
    emoji: "♣️",
    type: "card",
    effectDescription:
      "Adjacent Clubs and Spades give Coin 1 more. Gives Coin 1 more if there are at least 3 Clubs, Diamonds, Hearts or Spades.",
    effect: function (grid: (Symbol | null)[]): effectResult {
      // Count card symbols
      let cardCount = 0;
      grid.forEach((symbol) => {
        if (
          symbol &&
          ["clubs", "diamonds", "hearts", "spades"].includes(symbol.id)
        ) {
          cardCount++;
        }
      });

      return { isDestroyed: false, bonusValue: cardCount >= 3 ? 1 : 0 };
    },
  },
  {
    id: "coal",
    name: "Coal",
    value: 0,
    rarity: "common",
    emoji: "⚫",
    counter: 0,
    type: "ore",
    effectDescription: "Transforms into <diamond> after 20 spins.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "ore");
      const counter = grid[index]?.counter || 0;
      if (counter >= 20) {
        return { isDestroyed: true, bonusValue: 0, add: ["diamond"] };
      }
      return { isDestroyed: false, bonusValue: 0 * multiplier };
    },
    // Transformation handled in game logic
  },
  {
    id: "coconut",
    name: "Coconut",
    value: 1,
    rarity: "uncommon",
    emoji: "🥥",
    type: "food",
    effectDescription: "Adds 2 Coconut Half when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "food");
      const isAdjacent = isAdjacentToSymbols(grid, index, [
        "monkey",
        "mrs_fruit",
      ]);
      if (isAdjacent) {
        return {
          isDestroyed: true,
          bonusValue: 2 * multiplier,
          add: ["coconut_half"],
        };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "coconut_half",
    name: "Coconut Half",
    value: 2,
    rarity: "uncommon",
    emoji: "🥥",
    type: "food",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "food");
      const isAdjacent = isAdjacentToSymbols(grid, index, [
        "monkey",
        "mrs_fruit",
      ]);
      if (isAdjacent) {
        return {
          isDestroyed: true,
          bonusValue: 2 * multiplier,
        };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "coin",
    name: "Coin",
    value: 1,
    rarity: "common",
    emoji: "🪙",
    type: "other",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const isAdjacent = isAdjacentToSymbols(grid, index, ["king_midas"]);
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "other");
      if (isAdjacent) {
        return { isDestroyed: false, bonusValue: 3 * multiplier }; // 3x value when adjacent to King Midas
      }

      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "comedian",
    name: "Comedian",
    value: 3,
    rarity: "rare",
    emoji: "🤡",
    type: "character",
    effectDescription:
      "Adjacent Banana, Banana Peel, Dog, Monkey, Toddler and Joker give 3x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Multiplier effect handled in game logic
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      return { isDestroyed: false, bonusValue: 3 * multiplier };
    },
  },
  {
    id: "cow",
    name: "Cow",
    value: 3,
    rarity: "rare",
    type: "animal",
    emoji: "🐄",
    effectDescription: "Has a 15% chance of adding Milk.",
    // Random chance handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      const random = Math.random();
      if (random < 0.15) {
        return {
          isDestroyed: false,
          bonusValue: 1 * multiplier,
          add: ["milk"],
        };
      }
      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "crab",
    name: "Crab",
    value: 1,
    rarity: "common",
    emoji: "🦀",
    type: "animal",
    effectDescription: "Gives Coin 3 more for each other Crab in the same row.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Calculate row bounds
      const rowSize = 5; // Assuming 5x5 grid
      const rowStart = Math.floor(index / rowSize) * rowSize;
      const rowEnd = rowStart + rowSize;

      let crabCount = 0;
      for (let i = rowStart; i < rowEnd; i++) {
        if (i !== index && grid[i] && grid[i]?.id === "crab") {
          crabCount++;
        }
      }

      return { isDestroyed: false, bonusValue: crabCount * 3 };
    },
  },
  {
    id: "crow",
    name: "Crow",
    value: 2,
    rarity: "common",
    type: "animal",
    emoji: "🐦‍⬛",
    effectDescription: "Gives Coin -3 every 4 spins.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      const counter = grid[index]?.counter || 0;

      if (counter % 4 === 3) {
        // Every 4th spin (0-indexed counter)
        return { isDestroyed: false, bonusValue: -3 * multiplier };
      }

      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "cultist",
    name: "Cultist",
    value: 0,
    rarity: "common",
    type: "character",
    emoji: "🧙",
    effectDescription:
      "Gives Coin 1 more for each other Cultist. Gives Coin 1 more if there are at least 3 Cultist.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      let cultistCount = 0;

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "cultist") {
          cultistCount++;
        }
      });

      return {
        isDestroyed: false,
        bonusValue: cultistCount + (cultistCount >= 3 ? 1 : 0),
      };
    },
  },
  {
    id: "diamond",
    name: "Diamond",
    value: 5,
    rarity: "very_rare",
    type: "ore",
    emoji: "💎",
    effectDescription: "Gives Coin 1 more for each other Diamond.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      let diamondCount = 0;

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "diamond") {
          diamondCount++;
        }
      });

      return { isDestroyed: false, bonusValue: diamondCount };
    },
  },
  {
    id: "diamonds",
    name: "Diamonds",
    value: 1,
    rarity: "uncommon",
    emoji: "♦️",
    type: "card",
    effectDescription:
      "Adjacent Diamonds and Hearts give Coin 1 more. Gives Coin 1 more if there are at least 3 Clubs, Diamonds, Hearts or Spades.",
    effect: function (grid: (Symbol | null)[]): effectResult {
      // Count card symbols
      let cardCount = 0;
      grid.forEach((symbol) => {
        if (
          symbol &&
          ["clubs", "diamonds", "hearts", "spades"].includes(symbol.id)
        ) {
          cardCount++;
        }
      });

      return { isDestroyed: false, bonusValue: cardCount >= 3 ? 1 : 0 };
    },
  },
  {
    id: "diver",
    name: "Diver",
    value: 2,
    rarity: "rare",
    emoji: "🤿",
    type: "character",
    effectDescription:
      "Removes adjacent sea creatures and items. Permanently gives Coin 1 for each symbol removed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      // Removal effect handled in game logic
      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "dog",
    name: "Dog",
    value: 1,
    rarity: "common",
    emoji: "🐶",
    type: "animal",
    effectDescription:
      "Gives Coin 2 more if adjacent to human characters. This effect only applies once per spin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentIndices = getAdjacentIndices(index);
      const humanCharacters = [
        "robin_hood",
        "thief",
        "cultist",
        "toddler",
        "bounty_hunter",
        "miner",
        "dwarf",
        "king_midas",
        "gambler",
        "general_zaroff",
        "witch",
        "pirate",
        "ninja",
        "mrs_fruit",
        "hooligan",
        "farmer",
        "diver",
        "dame",
        "chef",
        "card_shark",
        "beastmaster",
        "geologist",
        "joker",
        "comedian",
        "bartender",
      ];

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && humanCharacters.includes(adjSymbol.id)) {
          return { isDestroyed: false, bonusValue: 2 }; // Only applies once
        }
      }

      return { isDestroyed: false, bonusValue: 0 };
    },
  },

  {
    id: "dwarf",
    name: "Dwarf",
    value: 1,
    rarity: "common",
    emoji: "👨‍🦰",
    type: "character",
    effectDescription:
      "Destroys adjacent Beer and Wine. Gives Coin equal to 10x the value of symbols destroyed this way.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentSymbols = getAdjacentSymbols(grid, index)
      
      const destroyedSymbols = adjacentSymbols.filter(
        (symbol) => symbol?.id === "beer" || symbol?.id === "wine"
      );
      const destroyedValue = destroyedSymbols.reduce((acc, symbol) => {
        return acc + symbol.value;
      }, 0);
      return { isDestroyed: false, bonusValue: 10 * destroyedValue };
    },
  },
  {
    id: "egg",
    name: "Egg",
    value: 1,
    rarity: "common",
    emoji: "🥚",
    type: "animal",
    effectDescription: "Has a 10% chance to transform into Chick.",
    // Transformation handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      const random = Math.random();
      if (random < 0.1) {
        return { isDestroyed: true, bonusValue: 0, add: ["chick"] };
      }
      return { isDestroyed: false, bonusValue: 0 * multiplier };
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    value: 3,
    rarity: "rare",
    emoji: "🟢",
    type: "ore",
    effectDescription: "Gives Coin 1 more if there are at least 2 Emerald.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      let emeraldCount = 0;
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "ore");
      grid.forEach((symbol) => {
        if (symbol && symbol.id === "emerald") {
          emeraldCount++;
        }
      });

      return {
        isDestroyed: false,
        bonusValue: emeraldCount >= 2 ? 1 * multiplier : 0,
      };
    },
  },
  {
    id: "farmer",
    name: "Farmer",
    value: 2,
    rarity: "rare",
    emoji: "👨‍🌾",
    type: "character",
    effectDescription:
      "Adjacent food and farm-related symbols give 2x more Coin. Adjacent Seed are 50% more likely to grow.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Multiplier and growth chance handled in game logic
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "five_sided_die",
    name: "Five-Sided Die",
    value: 0, // Variable value
    rarity: "uncommon",
    emoji: "🎲",
    type: "dice",
    effectDescription: "Gives between Coin 1 and Coin 5 randomly.",
    effect: function (): effectResult {
      return {
        isDestroyed: false,
        bonusValue: Math.floor(Math.random() * 5) + 1,
      };
    },
  },
  {
    id: "flower",
    name: "Flower",
    value: 1,
    rarity: "common",
    emoji: "🌸",
    type: "plant",
    effectDescription: "Gives Coin 1 more for each other Flower.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      let flowerCount = 0;
      const isAdjacent = isAdjacentToSymbols(grid, index, ["bee"]);

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "flower") {
          flowerCount++;
        }
      });

      return { isDestroyed: false, bonusValue: flowerCount * (isAdjacent ? 2 : 1) };
    },
  },
  {
    id: "gambler",
    name: "Gambler",
    value: 1,
    rarity: "common",
    emoji: "🎰",
    type: "human_character",
    effectDescription:
      'Gives Coin ? when destroyed. "Coin ?" increases by Coin 2 each spin. Destroys itself when Five-Sided Die or Three-Sided Die rolls 1 or 1.',
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      const counter = grid[index]?.counter || 0;
      const dices = grid.filter(
        (symbol) =>
          symbol?.id === "five_sided_die" || symbol?.id === "three_sided_die"
      );
      const rolled1 = dices.some((symbol) => symbol?.bonusValue === 1);

      if (rolled1) {
        return { isDestroyed: true, bonusValue: 0 };
      }

      return { isDestroyed: false, bonusValue: 2 * multiplier * counter };
    },
  },
  {
    id: "general_zaroff",
    name: "General Zaroff",
    value: 1,
    rarity: "rare",
    emoji: "👨‍✈️",
    type: "character",
    effectDescription:
      "Destroys adjacent human characters. Gives Coin 25 for each symbol destroyed.",
    // Destruction effect handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentSymbols = getAdjacentSymbols(grid, index);
      const destroyedSymbols = adjacentSymbols.filter(
        (symbol) => symbol.id === "human_character"
      );
      return { isDestroyed: false, bonusValue: 25 * destroyedSymbols.length };
    },
  },
  {
    id: "geologist",
    name: "Geologist",
    value: 2,
    rarity: "rare",
    emoji: "👨‍🔬",
    type: "human_character",
    effectDescription:
      "Destroys adjacent Ore, Pearl, Shiny Pebble, Big Ore and Sapphire. Permanently gives Coin 1 for each symbol destroyed.",
    // Destruction effect handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentSymbols = getAdjacentSymbols(grid, index);
      const destroyedSymbols = adjacentSymbols.filter(
        (symbol) =>
          symbol.id === "ore" ||
          symbol.id === "pearl" ||
          symbol.id === "shiny_pebble" ||
          symbol.id === "big_ore" ||
          symbol.id === "sapphire"
      );
      return { isDestroyed: false, bonusValue: destroyedSymbols.length };
    },
  },

  {
    id: "golden_egg",
    name: "Golden Egg",
    value: 4,
    rarity: "rare",
    emoji: "🥚",
    type: "animal",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      return { isDestroyed: false, bonusValue: 4 * multiplier };
    },
  },
  {
    id: "goldfish",
    name: "Goldfish",
    value: 1,
    rarity: "common",
    emoji: "🐠",
    type: "animal",
    effectDescription:
      "Destroys adjacent Bubble. Gives Coin 15 for each Bubble destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      const adjacentIndices = getAdjacentIndices(index);
      let bubbleCount = 0;

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && adjSymbol.id === "bubble") {
          bubbleCount++;
        }
      }

      if (bubbleCount > 0) {
        return {
          isDestroyed: false,
          bonusValue: 15 * bubbleCount * multiplier,
        };
      }

      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "golem",
    name: "Golem",
    value: 0,
    rarity: "uncommon",
    emoji: "🗿",
    type: "object",
    counter: 0,
    effectDescription:
      "Destroys itself after 5 spins. Adds 5 Ore when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      const counter = grid[index]?.counter || 0;

      if (counter >= 5) {
        return {
          isDestroyed: true,
          bonusValue: 0 * multiplier,
          add: ["ore", "ore", "ore", "ore", "ore"],
        };
      }

      return { isDestroyed: false, bonusValue: 0 * multiplier };
    },
  },
  {
    id: "goose",
    name: "Goose",
    value: 1,
    rarity: "common",
    emoji: "🦢",
    type: "animal",
    effectDescription: "Has a 1% chance of adding Golden Egg.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      const random = Math.random();

      if (random < 0.01) {
        return {
          isDestroyed: false,
          bonusValue: 1 * multiplier,
          add: ["golden_egg"],
        };
      }

      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "hearts",
    name: "Hearts",
    value: 1,
    rarity: "uncommon",
    emoji: "♥️",
    type: "card",
    effectDescription:
      "Adjacent Diamonds and Hearts give Coin 1 more. Gives Coin 1 more if there are at least 3 Clubs, Diamonds, Hearts or Spades.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Count card symbols
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "card");
      let cardCount = 0;
      grid.forEach((symbol) => {
        if (
          symbol &&
          ["clubs", "diamonds", "hearts", "spades"].includes(symbol.id)
        ) {
          cardCount++;
        }
      });

      return {
        isDestroyed: false,
        bonusValue: cardCount >= 3 ? 1 * multiplier : 0,
      };
    },
  },

  {
    id: "honey",
    name: "Honey",
    value: 3,
    rarity: "rare",
    emoji: "🍯",
    type: "food",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "food");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["bear"]);

      if (isAdjacent) {
        return { isDestroyed: true, bonusValue: 3 * multiplier };
      }

      return { isDestroyed: false, bonusValue: 3 * multiplier };
    },
  },
  {
    id: "hooligan",
    name: "Hooligan",
    value: 2,
    rarity: "uncommon",
    emoji: "🧔",
    type: "character",
    effectDescription:
      "Destroys adjacent Urn, Big Urn and Tomb. Gives Coin 6 for each Urn, Big Urn and Tomb destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      const adjacentIndices = getAdjacentIndices(index);
      let destroyedCount = 0;

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && ["urn", "big_urn", "tomb"].includes(adjSymbol.id)) {
          destroyedCount++;
        }
      }

      if (destroyedCount > 0) {
        return {
          isDestroyed: false,
          bonusValue: 6 * destroyedCount * multiplier,
        };
      }

      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "hustling_capsule",
    name: "Hustling Capsule",
    value: -7,
    rarity: "uncommon",
    emoji: "💊",
    type: "object",
    effectDescription: "Destroys itself. Adds 1 Pool Ball item when destroyed.",
    effect: function (): effectResult {
      return {
        isDestroyed: true,
        bonusValue: -7,
        add: ["pool_ball"],
      };
    },
  },
  {
    id: "item_capsule",
    name: "Item Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    type: "object",
    effectDescription: "Destroys itself. Adds 1 Common item when destroyed.",
    effect: function (): effectResult {
      // The actual common item will be determined in game logic
      return {
        isDestroyed: true,
        bonusValue: 0,
        add: ["common_item"], // This will be replaced with an actual common item in game logic
      };
    },
  },
  {
    id: "jellyfish",
    name: "Jellyfish",
    value: 2,
    rarity: "uncommon",
    emoji: "🪼",
    type: "animal",
    effectDescription: "Gives Removal Token 1 when removed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      // Token effect handled in game logic
      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "joker",
    name: "Joker",
    value: 3,
    rarity: "rare",
    emoji: "🃏",
    type: "character",
    effectDescription:
      "Adjacent Clubs, Diamonds, Hearts and Spades give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      // Multiplier effect handled in game logic
      return { isDestroyed: false, bonusValue: 3 * multiplier };
    },
  },
  {
    id: "key",
    name: "Key",
    value: 1,
    rarity: "common",
    emoji: "🔑",
    type: "object",
    effectDescription:
      "Destroys adjacent Lockbox, Safe, Treasure Chest and Mega Chest. Destroys itself afterwards.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      const adjacentIndices = getAdjacentIndices(index);
      let destroyedChest = false;

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (
          adjSymbol &&
          ["lockbox", "safe", "treasure_chest", "mega_chest"].includes(
            adjSymbol.id
          )
        ) {
          destroyedChest = true;
          break;
        }
      }

      if (destroyedChest) {
        return { isDestroyed: true, bonusValue: 1 * multiplier };
      }

      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "king_midas",
    name: "King Midas",
    value: 1,
    rarity: "rare",
    emoji: "👑",
    type: "character",
    effectDescription: "Adds Coin each spin. Adjacent Coin give 3x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      // Coin addition handled in game logic
      return {
        isDestroyed: false,
        bonusValue: 1 * multiplier,
        add: ["coin"],
      };
    },
  },
  {
    id: "light_bulb",
    name: "Light Bulb",
    value: 1,
    rarity: "common",
    emoji: "💡",
    type: "object",
    counter: 0,
    effectDescription:
      "Adjacent gems give 2x more Coin. Destroys itself after making other symbols give additional Coin 5 times.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      const counter = grid[index]?.counter || 0;

      if (counter >= 5) {
        return { isDestroyed: true, bonusValue: 1 * (1 + multiplier) };
      }

      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "lockbox",
    name: "Lockbox",
    value: 1,
    rarity: "common",
    emoji: "🔒",
    type: "object",
    effectDescription: "Gives Coin 15 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["key", "magic_key"]);

      if (isAdjacent) {
        return { isDestroyed: true, bonusValue: 15 * (1 + multiplier) };
      }

      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "lucky_capsule",
    name: "Lucky Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    type: "object",
    effectDescription:
      "Destroys itself. At least 1 of the symbols to add after this spin will be Rare or better.",
    effect: function (): effectResult {
      // The rare+ item selection will be handled in game logic
      return {
        isDestroyed: true,
        bonusValue: 0,
        // Special flag for game logic to handle
        add: ["rare_or_better"],
      };
    },
  },
  {
    id: "magic_key",
    name: "Magic Key",
    value: 2,
    rarity: "rare",
    emoji: "🗝️",
    type: "object",
    effectDescription:
      "Destroys adjacent Lockbox, Safe, Treasure Chest and Mega Chest. Symbols destroyed this way give 3x more Coin. Destroys itself afterward.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      const adjacentIndices = getAdjacentIndices(index);
      let totalBonus = 0;
      let destroyedChest = false;

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (
          adjSymbol &&
          ["lockbox", "safe", "treasure_chest", "mega_chest"].includes(
            adjSymbol.id
          )
        ) {
          destroyedChest = true;
          // Calculate bonus based on the chest's normal destruction value
          if (adjSymbol.id === "lockbox") totalBonus += 15 * 3;
          else if (adjSymbol.id === "safe") totalBonus += 30 * 3;
          else if (adjSymbol.id === "treasure_chest") totalBonus += 50 * 3;
          else if (adjSymbol.id === "mega_chest") totalBonus += 100 * 3;
        }
      }

      if (destroyedChest) {
        return { isDestroyed: true, bonusValue: totalBonus * (1 + multiplier) };
      }

      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "matryoshka_doll",
    name: "Matryoshka Doll",
    value: 0,
    rarity: "uncommon",
    emoji: "🪆",
    type: "object",
    counter: 0,
    effectDescription:
      "Destroys itself after 3 spins. Adds Matryoshka Doll 2 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const counter = grid[index]?.counter || 0;

      if (counter >= 3) {
        return {
          isDestroyed: true,
          bonusValue: 0,
          add: ["matryoshka_doll_2"],
        };
      }

      return { isDestroyed: false, bonusValue: 0 };
    },
  },
  {
    id: "thief",
    name: "Thief",
    value: -1,
    rarity: "uncommon",
    emoji: "🦹",
    type: "character",
    counter: 0,
    effectDescription:
      "Gives ? coins when destroyed. Increases by 4 coins each spin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Check if adjacent to Bounty Hunter or Banana Peel
      const adjacentIndices = getAdjacentIndices(index);
      const currentCounter = grid[index]?.counter || 0;

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol) {
          // If adjacent to Bounty Hunter, get destroyed and give coins based on counter
          if (adjSymbol.id === "bounty_hunter") {
            return { isDestroyed: true, bonusValue: currentCounter * 4 };
          }
          // If adjacent to Banana Peel, get destroyed and give coins based on counter
          if (adjSymbol.id === "banana_peel") {
            return { isDestroyed: true, bonusValue: currentCounter * 4 };
          }
        }
      }

      // If not destroyed, return normal state
      return { isDestroyed: false, bonusValue: 0 };
    },
  },
  {
    id: "three_sided_die",
    name: "Three-Sided Die",
    value: 0, // Variable value
    rarity: "common",
    emoji: "🎲",
    type: "dice",
    effectDescription: "Gives between Coin 1 and Coin 3 randomly.",
    effect: function (): effectResult {
      return {
        isDestroyed: false,
        bonusValue: Math.floor(Math.random() * 3) + 1,
      };
    },
  },
  {
    id: "time_capsule",
    name: "Time Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    type: "object",
    effectDescription:
      "Destroys itself. Adds 1 symbol that was destroyed this game when destroyed. Cannot add Time Capsule.",
    effect: function (): effectResult {
      // The actual destroyed symbol selection will be handled in game logic
      return {
        isDestroyed: true,
        bonusValue: 0,
        add: ["destroyed_symbol"], // This will be replaced with an actual destroyed symbol in game logic
      };
    },
  },
  {
    id: "toddler",
    name: "Toddler",
    value: 1,
    rarity: "common",
    emoji: "👶",
    type: "character",
    effectDescription:
      "Destroys adjacent Present, Candy, Piñata and Bubble. Gives Coin 6 for each Present, Candy, Piñata and Bubble destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      const adjacentIndices = getAdjacentIndices(index);
      let destroyedCount = 0;

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (
          adjSymbol &&
          ["present", "candy", "piñata", "bubble"].includes(adjSymbol.id)
        ) {
          destroyedCount++;
        }
      }

      if (destroyedCount > 0) {
        return {
          isDestroyed: false,
          bonusValue: 6 * destroyedCount * (1 + multiplier),
        };
      }

      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "tomb",
    name: "Tomb",
    value: 3,
    rarity: "rare",
    emoji: "🪦",
    type: "object",
    effectDescription:
      "Has a 6% chance of adding Spirit. Adds 4 Spirit when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      const random = Math.random();
      const isAdjacent = isAdjacentToSymbols(grid, index, ["hooligan"]);

      if (isAdjacent) {
        return {
          isDestroyed: true,
          bonusValue: 3 * multiplier,
          add: ["spirit", "spirit", "spirit", "spirit"],
        };
      }

      if (random < 0.06) {
        return {
          isDestroyed: false,
          bonusValue: 3 * multiplier,
          add: ["spirit"],
        };
      }

      return { isDestroyed: false, bonusValue: 3 * multiplier };
    },
  },
  {
    id: "treasure_chest",
    name: "Treasure Chest",
    value: 2,
    rarity: "rare",
    emoji: "🧰",
    type: "object",
    effectDescription: "Gives Coin 50 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["key", "magic_key"]);

      if (isAdjacent) {
        return { isDestroyed: true, bonusValue: 50 * multiplier };
      }

      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "turtle",
    name: "Turtle",
    value: 0,
    rarity: "common",
    emoji: "🐢",
    type: "animal",
    counter: 0,
    effectDescription: "Gives Coin 4 every 3 spins.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      const counter = grid[index]?.counter || 0;

      if (counter % 3 === 2) {
        // Every 3rd spin (0-indexed counter)
        return { isDestroyed: false, bonusValue: 4 * multiplier };
      }

      return { isDestroyed: false, bonusValue: 0 };
    },
  },
  {
    id: "urn",
    name: "Urn",
    value: 1,
    rarity: "common",
    emoji: "⚱️",
    type: "object",
    effectDescription: "Adds Spirit when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "object");
      const isAdjacent = isAdjacentToSymbols(grid, index, ["hooligan"]);

      if (isAdjacent) {
        return {
          isDestroyed: true,
          bonusValue: 1 * multiplier,
          add: ["spirit"],
        };
      }

      return { isDestroyed: false, bonusValue: 1 * multiplier };
    },
  },
  {
    id: "void_creature",
    name: "Void Creature",
    value: 0,
    rarity: "uncommon",
    emoji: "👾",
    type: "void",
    effectDescription:
      "Adjacent Empty give Coin 1 more. Destroys itself if adjacent to 0 Empty. Gives Coin 8 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentIndices = getAdjacentIndices(index);
      let emptyCount = 0;

      adjacentIndices.forEach((adjIndex) => {
        const adjSymbol = grid[adjIndex];
        if (!adjSymbol || adjSymbol.id === "empty") {
          emptyCount++;
        }
      });

      if (emptyCount === 0) {
        return { isDestroyed: true, bonusValue: 8 };
      }

      return { isDestroyed: false, bonusValue: emptyCount };
    },
  },
  {
    id: "void_fruit",
    name: "Void Fruit",
    value: 0,
    rarity: "uncommon",
    emoji: "🍎",
    type: "void",
    effectDescription:
      "Adjacent Empty give Coin 1 more. Destroys itself if adjacent to 0 Empty. Gives Coin 8 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentIndices = getAdjacentIndices(index);
      let emptyCount = 0;

      adjacentIndices.forEach((adjIndex) => {
        const adjSymbol = grid[adjIndex];
        if (!adjSymbol || adjSymbol.id === "empty") {
          emptyCount++;
        }
      });

      if (emptyCount === 0) {
        return { isDestroyed: true, bonusValue: 8 };
      }

      return { isDestroyed: false, bonusValue: emptyCount };
    },
  },
  {
    id: "void_stone",
    name: "Void Stone",
    value: 0,
    rarity: "uncommon",
    emoji: "🌑",
    type: "void",
    effectDescription:
      "Adjacent Empty give Coin 1 more. Destroys itself if adjacent to 0 Empty. Gives Coin 8 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentIndices = getAdjacentIndices(index);
      let emptyCount = 0;

      adjacentIndices.forEach((adjIndex) => {
        const adjSymbol = grid[adjIndex];
        if (!adjSymbol || adjSymbol.id === "empty") {
          emptyCount++;
        }
      });

      if (emptyCount === 0) {
        return { isDestroyed: true, bonusValue: 8 };
      }

      return { isDestroyed: false, bonusValue: emptyCount };
    },
  },
  {
    id: "watermelon",
    name: "Watermelon",
    value: 4,
    rarity: "very_rare",
    type: "fruit",
    emoji: "🍉",
    effectDescription: "Gives Coin 1 more for each other Watermelon.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      let watermelonCount = 0;

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "watermelon") {
          watermelonCount++;
        }
      });

      return { isDestroyed: false, bonusValue: watermelonCount };
    },
  },
  {
    id: "wealthy_capsule",
    name: "Wealthy Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    type: "object",
    effectDescription: "Destroys itself. Gives Coin 10 when destroyed.",
    effect: function (): effectResult {
      return { isDestroyed: true, bonusValue: 10 };
    },
  },
  {
    id: "wildcard",
    name: "Wildcard",
    value: 0, // Variable value
    rarity: "very_rare",
    emoji: "🃏",
    type: "card",
    effectDescription:
      "Gives Coin equal to the highest value among adjacent symbols.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentIndices = getAdjacentIndices(index);
      let highestValue = 0;

      adjacentIndices.forEach((adjIndex) => {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && adjSymbol.value > highestValue) {
          highestValue = adjSymbol.value;
        }
      });

      return { isDestroyed: false, bonusValue: highestValue };
    },
  },
  {
    id: "wine",
    name: "Wine",
    value: 2,
    rarity: "uncommon",
    emoji: "🍷",
    type: "drink",
    effectDescription:
      "Permanently gives Coin 1 more after giving Coin 8 times.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Check if adjacent to Billionaire for 2x multiplier
      const adjacentIndices = getAdjacentIndices(index);

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && adjSymbol.id === "billionaire") {
          return { isDestroyed: false, bonusValue: this.value }; // Double the value
        }
      }

      // Counter effect for permanent bonus handled in game logic
      return { isDestroyed: false, bonusValue: 0 };
    },
  },
  {
    id: "witch",
    name: "Witch",
    value: 2,
    rarity: "rare",
    emoji: "🧙‍♀️",
    type: "character",
    effectDescription:
      "Adjacent Cat, Owl, Crow, Apple, Hex symbols, Eldritch Creature and Spirit give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "character");
      // Multiplier effect handled in game logic
      return { isDestroyed: false, bonusValue: 2 * multiplier };
    },
  },
  {
    id: "wolf",
    name: "Wolf",
    value: 2,
    rarity: "uncommon",
    emoji: "🐺",
    type: "animal",
    effectDescription: "Gives Coin 1 more for each adjacent animal.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = adjacentSymbolMoneyModifier(grid, index, "animal");
      const adjacentSymbols = getAdjacentSymbols(grid, index);
      let animalCount = 0;

      adjacentSymbols.forEach((symbol) => {
        if (
          symbol &&
          (symbol.type === "animal" || symbol.type === "animal_character")
        ) {
          animalCount++;
        }
      });

      return { isDestroyed: false, bonusValue: (2 + animalCount) * multiplier };
    },
  },
];

// Get a random symbol based on rarity and game progression
export function getRandomSymbol(timeRentPaid: number = 0): Symbol {
  // Roll for rarity
  const rarityRoll = Math.random();
  let veryRareChance, rareChance, uncommonChance;

  // Set probability thresholds based on times rent paid
  switch (true) {
    case timeRentPaid === 0:
      veryRareChance = 0.0;
      rareChance = 0.0;
      uncommonChance = 0.0;
      break;
    case timeRentPaid === 1:
      veryRareChance = 0.0;
      rareChance = 0.0;
      uncommonChance = 0.1;
      break;
    case timeRentPaid === 2:
      veryRareChance = 0.0;
      rareChance = 0.01;
      uncommonChance = 0.21; // 0.01 + 0.2
      break;
    case timeRentPaid === 3:
      veryRareChance = 0.0;
      rareChance = 0.01;
      uncommonChance = 0.26; // 0.01 + 0.25
      break;
    case timeRentPaid === 4:
      veryRareChance = 0.005;
      rareChance = 0.02; // 0.005 + 0.015
      uncommonChance = 0.31; // 0.005 + 0.015 + 0.29
      break;
    default: // 5+
      veryRareChance = 0.005;
      rareChance = 0.02; // 0.005 + 0.015
      uncommonChance = 0.32; // 0.005 + 0.015 + 0.3
      break;
  }

  let pool: Symbol[];

  if (rarityRoll < veryRareChance) {
    pool = symbolTypes.filter((s) => s.rarity === "very_rare");
  } else if (rarityRoll < rareChance) {
    pool = symbolTypes.filter((s) => s.rarity === "rare");
  } else if (rarityRoll < uncommonChance) {
    pool = symbolTypes.filter((s) => s.rarity === "uncommon");
  } else {
    pool = symbolTypes.filter((s) => s.rarity === "common");
  }

  // If pool is empty (shouldn't happen with proper setup), fallback to common
  if (pool.length === 0) {
    pool = symbolTypes.filter((s) => s.rarity === "common");
  }

  // Deep clone the symbol to avoid reference issues
  const randomSymbol = pool[Math.floor(Math.random() * pool.length)];
  return JSON.parse(JSON.stringify(randomSymbol));
}

// Get starting symbols for a new game
export function getStartingSymbols(): Symbol[] {
  return [
    {
      ...JSON.parse(JSON.stringify(symbolTypes.find((s) => s.id === "cat"))),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(JSON.stringify(symbolTypes.find((s) => s.id === "cherry"))),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(JSON.stringify(symbolTypes.find((s) => s.id === "coin"))),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "flower"))
      ),
      tempId: crypto.randomUUID(),
    },
  ].filter(Boolean) as Symbol[];
}

// Add a new symbol to the game
export function addSymbolToCollection(
  symbols: Symbol[],
  newSymbol: Symbol
): Symbol[] {
  return [...symbols, JSON.parse(JSON.stringify(newSymbol))];
}

// Get all symbols of a specific rarity
export function getSymbolsByRarity(
  rarity: "common" | "uncommon" | "rare" | "very_rare" | "special"
): Symbol[] {
  return symbolTypes
    .filter((s) => s.rarity === rarity)
    .map((s) => JSON.parse(JSON.stringify(s)));
}

// Get a symbol by ID
export function getSymbolById(id: string): Symbol | undefined {
  const symbol = symbolTypes.find((s) => s.id === id);
  return symbol ? JSON.parse(JSON.stringify(symbol)) : undefined;
}

// Check if a symbol is a fruit
export function isFruit(symbolId: string): boolean {
  return [
    "cherry",
    "banana",
    "apple",
    "orange",
    "grapes",
    "watermelon",
  ].includes(symbolId);
}
