import { Symbol } from "@/types/game";
import { getAdjacentIndices } from "./utils";

// Symbol definitions
export const symbolTypes: Symbol[] = [
  {
    id: "empty",
    name: "Empty",
    value: 0,
    rarity: "special",
    emoji: "",
  },
  {
    id: "amethyst",
    name: "Amethyst",
    value: 1,
    rarity: "rare",
    emoji: "🟣",
    effectDescription:
      "Whenever another symbol makes this symbol give additional Coin, this symbol permanently gives Coin 1 more.",
    // Special effect handled in game logic
  },
  {
    id: "anchor",
    name: "Anchor",
    value: 1,
    rarity: "common",
    emoji: "⚓",
    effectDescription: "Gives Coin 4 more when in a corner.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Check if in corner (0, 4, 20, 24 for a 5x5 grid)
      const corners = [0, 4, 20, 24];
      if (corners.includes(index)) {
        return 4;
      }
      return 0;
    },
  },
  {
    id: "apple",
    name: "Apple",
    value: 3,
    rarity: "rare",
    emoji: "🍎",
  },
  {
    id: "banana",
    name: "Banana",
    value: 1,
    rarity: "common",
    emoji: "🍌",
    effectDescription: "Adds Banana Peel when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "banana_peel",
    name: "Banana Peel",
    value: 1,
    rarity: "common",
    emoji: "🍌",
    effectDescription: "Destroys adjacent Thief. Destroys itself afterwards.",
    // Effect handled in game logic
  },
  {
    id: "bar_of_soap",
    name: "Bar of Soap",
    value: 1,
    rarity: "uncommon",
    emoji: "🧼",
    effectDescription:
      "Adds Bubble each spin. Destroys itself after giving Coin 3 times.",
    // Effect handled in game logic
  },
  {
    id: "bartender",
    name: "Bartender",
    value: 3,
    rarity: "rare",
    emoji: "🧑‍🍳",
    effectDescription:
      "Has a 10% chance of adding Chemical Seven, Beer, Wine or Martini.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Random chance handled in game logic
      return 0;
    },
  },
  {
    id: "bear",
    name: "Bear",
    value: 2,
    rarity: "uncommon",
    emoji: "🐻",
    effectDescription:
      "Destroys adjacent Honey. Gives Coin 40 for each Honey destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Destruction effect handled in game logic
      return 0;
    },
  },
  {
    id: "beastmaster",
    name: "Beastmaster",
    value: 2,
    rarity: "rare",
    emoji: "🧙‍♂️",
    effectDescription: "Adjacent animal symbols give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier effect handled in game logic
      return 0;
    },
  },
  {
    id: "bee",
    name: "Bee",
    value: 1,
    rarity: "common",
    emoji: "🐝",
    effectDescription:
      "Adjacent Flower, Beehive and Honey give 2x more Coin. Gives Coin 1 more for each adjacent Flower, Beehive or Honey.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      const adjacentIndices = getAdjacentIndices(index);
      let bonusValue = 0;

      adjacentIndices.forEach((adjIndex) => {
        const adjSymbol = grid[adjIndex];
        if (
          adjSymbol &&
          ["flower", "beehive", "honey"].includes(adjSymbol.id)
        ) {
          bonusValue += 1;
        }
      });

      return bonusValue;
    },
  },
  {
    id: "beehive",
    name: "Beehive",
    value: 3,
    rarity: "rare",
    emoji: "🐝",
    effectDescription: "Has a 10% chance of adding Honey.",
    // Random chance handled in game logic
  },
  {
    id: "beer",
    name: "Beer",
    value: 1,
    rarity: "common",
    emoji: "🍺",
  },
  {
    id: "big_ore",
    name: "Big Ore",
    value: 2,
    rarity: "uncommon",
    emoji: "🪨",
    effectDescription:
      "Adds 2 Void Stone, Amethyst, Pearl, Shiny Pebble, Sapphire, Emerald, Ruby or Diamond when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "big_urn",
    name: "Big Urn",
    value: 2,
    rarity: "uncommon",
    emoji: "⚱️",
    effectDescription: "Adds 2 Spirit when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "billionaire",
    name: "Billionaire",
    value: 0,
    rarity: "uncommon",
    emoji: "🤵",
    effectDescription:
      "Adjacent Cheese and Wine give 2x more Coin. Gives Coin 39 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier effect handled in game logic
      return 0;
    },
  },
  {
    id: "bounty_hunter",
    name: "Bounty Hunter",
    value: 1,
    rarity: "common",
    emoji: "🕵️",
    effectDescription:
      "Destroys adjacent Thief. Gives Coin 20 for each Thief destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Destruction effect handled in game logic
      return 0;
    },
  },
  {
    id: "bronze_arrow",
    name: "Bronze Arrow",
    value: 0,
    rarity: "uncommon",
    emoji: "🏹",
    effectDescription:
      "Points a random direction. Symbols that are pointed to give 2x more Coin. Destroys Target that are pointed to.",
    // Direction and effect handled in game logic
  },
  {
    id: "bubble",
    name: "Bubble",
    value: 2,
    rarity: "common",
    emoji: "🫧",
    effectDescription: "Destroys itself after giving Coin 3 times.",
    // Self-destruction handled in game logic
  },
  {
    id: "buffing_capsule",
    name: "Buffing Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    effectDescription: "Destroys itself. Adjacent symbols give 2x more Coin.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "candy",
    name: "Candy",
    value: 1,
    rarity: "common",
    emoji: "🍬",
  },
  {
    id: "card_shark",
    name: "Card Shark",
    value: 3,
    rarity: "rare",
    emoji: "🃏",
    effectDescription:
      "Adjacent Clubs, Diamonds, Hearts and Spades are Wildcard.",
    // Effect handled in game logic
  },
  {
    id: "cat",
    name: "Cat",
    value: 1,
    rarity: "common",
    emoji: "🐱",
    effectDescription:
      "Destroys adjacent Milk. Gives Coin 9 for each Milk destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Destruction effect handled in game logic
      return 0;
    },
  },
  {
    id: "cheese",
    name: "Cheese",
    value: 1,
    rarity: "common",
    emoji: "🧀",
  },
  {
    id: "chef",
    name: "Chef",
    value: 2,
    rarity: "rare",
    emoji: "👨‍🍳",
    effectDescription: "Adjacent food items give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier effect handled in game logic
      return 0;
    },
  },
  {
    id: "chemical_seven",
    name: "Chemical Seven",
    value: 0,
    rarity: "uncommon",
    emoji: "🧪",
    effectDescription:
      "Destroys itself. Gives Coin 7 and adds 1 Lucky Seven item when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "cherry",
    name: "Cherry",
    value: 1,
    rarity: "common",
    emoji: "🍒",
  },
  {
    id: "chick",
    name: "Chick",
    value: 1,
    rarity: "uncommon",
    emoji: "🐤",
    effectDescription: "Has a 10% chance to grow into Chicken.",
    // Growth chance handled in game logic
  },
  {
    id: "chicken",
    name: "Chicken",
    value: 2,
    rarity: "rare",
    emoji: "🐔",
    effectDescription:
      "Has a 5% chance of adding Egg. Has a 1% chance of adding Golden Egg.",
    // Random chance handled in game logic
  },
  {
    id: "clubs",
    name: "Clubs",
    value: 1,
    rarity: "uncommon",
    emoji: "♣️",
    effectDescription:
      "Adjacent Clubs and Spades give Coin 1 more. Gives Coin 1 more if there are at least 3 Clubs, Diamonds, Hearts or Spades.",
    effect: function (grid: (Symbol | null)[], index: number): number {
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

      return cardCount >= 3 ? 1 : 0;
    },
  },
  {
    id: "coal",
    name: "Coal",
    value: 0,
    rarity: "common",
    emoji: "⚫",
    effectDescription: "Transforms into Diamond after 20 spins.",
    // Transformation handled in game logic
  },
  {
    id: "coconut",
    name: "Coconut",
    value: 1,
    rarity: "uncommon",
    emoji: "🥥",
    effectDescription: "Adds 2 Coconut Half when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "coconut_half",
    name: "Coconut Half",
    value: 2,
    rarity: "uncommon",
    emoji: "🥥",
  },
  {
    id: "coin",
    name: "Coin",
    value: 1,
    rarity: "common",
    emoji: "🪙",
  },
  {
    id: "comedian",
    name: "Comedian",
    value: 3,
    rarity: "rare",
    emoji: "🤡",
    effectDescription:
      "Adjacent Banana, Banana Peel, Dog, Monkey, Toddler and Joker give 3x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier effect handled in game logic
      return 0;
    },
  },
  {
    id: "cow",
    name: "Cow",
    value: 3,
    rarity: "rare",
    emoji: "🐄",
    effectDescription: "Has a 15% chance of adding Milk.",
    // Random chance handled in game logic
  },
  {
    id: "crab",
    name: "Crab",
    value: 1,
    rarity: "common",
    emoji: "🦀",
    effectDescription: "Gives Coin 3 more for each other Crab in the same row.",
    effect: function (grid: (Symbol | null)[], index: number): number {
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

      return crabCount * 3;
    },
  },
  {
    id: "crow",
    name: "Crow",
    value: 2,
    rarity: "common",
    emoji: "🐦‍⬛",
    effectDescription: "Gives Coin -3 every 4 spins.",
    // Periodic effect handled in game logic
  },
  {
    id: "cultist",
    name: "Cultist",
    value: 0,
    rarity: "common",
    emoji: "🧙",
    effectDescription:
      "Gives Coin 1 more for each other Cultist. Gives Coin 1 more if there are at least 3 Cultist.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      let cultistCount = 0;

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "cultist") {
          cultistCount++;
        }
      });

      return cultistCount + (cultistCount >= 3 ? 1 : 0);
    },
  },
  {
    id: "dame",
    name: "Dame",
    value: 2,
    rarity: "rare",
    emoji: "👸",
    effectDescription:
      "Adjacent gems give 2x more Coin. Destroys adjacent Martini. Gives Coin 40 for each Martini destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier and destruction effect handled in game logic
      return 0;
    },
  },
  {
    id: "diamond",
    name: "Diamond",
    value: 5,
    rarity: "very_rare",
    emoji: "💎",
    effectDescription: "Gives Coin 1 more for each other Diamond.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      let diamondCount = 0;

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "diamond") {
          diamondCount++;
        }
      });

      return diamondCount;
    },
  },
  {
    id: "diamonds",
    name: "Diamonds",
    value: 1,
    rarity: "uncommon",
    emoji: "♦️",
    effectDescription:
      "Adjacent Diamonds and Hearts give Coin 1 more. Gives Coin 1 more if there are at least 3 Clubs, Diamonds, Hearts or Spades.",
    effect: function (grid: (Symbol | null)[], index: number): number {
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

      return cardCount >= 3 ? 1 : 0;
    },
  },
  {
    id: "diver",
    name: "Diver",
    value: 2,
    rarity: "rare",
    emoji: "🤿",
    effectDescription:
      "Removes adjacent sea creatures and items. Permanently gives Coin 1 for each symbol removed.",
    // Removal effect handled in game logic
  },
  {
    id: "dog",
    name: "Dog",
    value: 1,
    rarity: "common",
    emoji: "🐶",
    effectDescription:
      "Gives Coin 2 more if adjacent to human characters. This effect only applies once per spin.",
    effect: function (grid: (Symbol | null)[], index: number): number {
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
          return 2; // Only applies once
        }
      }

      return 0;
    },
  },
  {
    id: "dove",
    name: "Dove",
    value: 2,
    rarity: "rare",
    emoji: "🕊️",
    effectDescription:
      "If an adjacent symbol would be destroyed, instead it isn't, and this symbol permanently gives Coin 1 more.",
    // Protection effect handled in game logic
  },
  {
    id: "dud",
    name: "Dud",
    value: 0,
    rarity: "special",
    emoji: "💣",
    effectDescription: "Destroys itself after 33 spins. Cannot be removed.",
    // Self-destruction handled in game logic
  },
  {
    id: "dwarf",
    name: "Dwarf",
    value: 1,
    rarity: "common",
    emoji: "👨‍🦰",
    effectDescription:
      "Destroys adjacent Beer and Wine. Gives Coin equal to 10x the value of symbols destroyed this way.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Destruction effect handled in game logic
      return 0;
    },
  },
  {
    id: "egg",
    name: "Egg",
    value: 1,
    rarity: "common",
    emoji: "🥚",
    effectDescription: "Has a 10% chance to transform into Chick.",
    // Transformation handled in game logic
  },
  {
    id: "eldritch_creature",
    name: "Eldritch Creature",
    value: 4,
    rarity: "very_rare",
    emoji: "👾",
    effectDescription:
      "Destroys Cultist, Witch, and Hex symbols. Gives Coin 1 for each such symbol destroyed or removed this game.",
    // Destruction effect and tracking handled in game logic
  },
  {
    id: "emerald",
    name: "Emerald",
    value: 3,
    rarity: "rare",
    emoji: "🟢",
    effectDescription: "Gives Coin 1 more if there are at least 2 Emerald.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      let emeraldCount = 0;

      grid.forEach((symbol) => {
        if (symbol && symbol.id === "emerald") {
          emeraldCount++;
        }
      });

      return emeraldCount >= 2 ? 1 : 0;
    },
  },
  {
    id: "essence_capsule",
    name: "Essence Capsule",
    value: -12,
    rarity: "uncommon",
    emoji: "💊",
    effectDescription: "Destroys itself. Gives Essence Token 1 when destroyed",
    // Self-destruction and token effect handled in game logic
  },
  {
    id: "farmer",
    name: "Farmer",
    value: 2,
    rarity: "rare",
    emoji: "👨‍🌾",
    effectDescription:
      "Adjacent food and farm-related symbols give 2x more Coin. Adjacent Seed are 50% more likely to grow.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier and growth chance handled in game logic
      return 0;
    },
  },
  {
    id: "five_sided_die",
    name: "Five-Sided Die",
    value: 0, // Variable value
    rarity: "uncommon",
    emoji: "🎲",
    effectDescription: "Gives between Coin 1 and Coin 5 randomly.",
    effect: function (): number {
      return Math.floor(Math.random() * 5) + 1;
    },
  },
  {
    id: "flower",
    name: "Flower",
    value: 1,
    rarity: "common",
    emoji: "🌸",
  },
  {
    id: "frozen_fossil",
    name: "Frozen Fossil",
    value: 0,
    rarity: "rare",
    emoji: "🧊",
    effectDescription:
      "Destroys itself after 20 spins. The amount of spins needed is reduced by 5 for each Cultist, Witch, and Hex destroyed or removed this game. Adds Eldritch Creature when destroyed.",
    // Self-destruction and tracking handled in game logic
  },
  {
    id: "gambler",
    name: "Gambler",
    value: 1,
    rarity: "common",
    emoji: "🎰",
    effectDescription:
      'Gives Coin ? when destroyed. "Coin ?" increases by Coin 2 each spin. Destroys itself when Five-Sided Die or Three-Sided Die rolls 1 or 1.',
    // Self-destruction and variable value handled in game logic
  },
  {
    id: "general_zaroff",
    name: "General Zaroff",
    value: 1,
    rarity: "rare",
    emoji: "👨‍✈️",
    effectDescription:
      "Destroys adjacent human characters. Gives Coin 25 for each symbol destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "geologist",
    name: "Geologist",
    value: 2,
    rarity: "rare",
    emoji: "👨‍🔬",
    effectDescription:
      "Destroys adjacent Ore, Pearl, Shiny Pebble, Big Ore and Sapphire. Permanently gives Coin 1 for each symbol destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "golden_arrow",
    name: "Golden Arrow",
    value: 0,
    rarity: "very_rare",
    emoji: "🏹",
    effectDescription:
      "Points a random direction. Symbols that are pointed to give 4x more Coin. Destroys Target that are pointed to.",
    // Direction and effect handled in game logic
  },
  {
    id: "golden_egg",
    name: "Golden Egg",
    value: 4,
    rarity: "rare",
    emoji: "🥚",
  },
  {
    id: "goldfish",
    name: "Goldfish",
    value: 1,
    rarity: "common",
    emoji: "🐠",
    effectDescription:
      "Destroys adjacent Bubble. Gives Coin 15 for each Bubble destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "golem",
    name: "Golem",
    value: 0,
    rarity: "uncommon",
    emoji: "🗿",
    effectDescription:
      "Destroys itself after 5 spins. Adds 5 Ore when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "goose",
    name: "Goose",
    value: 1,
    rarity: "common",
    emoji: "🦢",
    effectDescription: "Has a 1% chance of adding Golden Egg.",
    // Random chance handled in game logic
  },
  {
    id: "hearts",
    name: "Hearts",
    value: 1,
    rarity: "uncommon",
    emoji: "♥️",
    effectDescription:
      "Adjacent Diamonds and Hearts give Coin 1 more. Gives Coin 1 more if there are at least 3 Clubs, Diamonds, Hearts or Spades.",
    effect: function (grid: (Symbol | null)[], index: number): number {
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

      return cardCount >= 3 ? 1 : 0;
    },
  },
  {
    id: "hex_of_destruction",
    name: "Hex of Destruction",
    value: 3,
    rarity: "uncommon",
    emoji: "🔮",
    effectDescription: "Has a 30% chance to Destroy an adjacent symbol.",
    // Random destruction handled in game logic
  },
  {
    id: "hex_of_draining",
    name: "Hex of Draining",
    value: 3,
    rarity: "uncommon",
    emoji: "🔮",
    effectDescription:
      "Has a 30% chance to make an adjacent symbol give Coin 0.",
    // Effect handled in game logic
  },
  {
    id: "hex_of_emptiness",
    name: "Hex of Emptiness",
    value: 3,
    rarity: "uncommon",
    emoji: "🔮",
    effectDescription:
      "Has a 30% chance of forcing you to skip the symbols you can add after a spin.",
    // Effect handled in game logic
  },
  {
    id: "hex_of_hoarding",
    name: "Hex of Hoarding",
    value: 3,
    rarity: "uncommon",
    emoji: "🔮",
    effectDescription:
      "Has a 30% chance of forcing you to add a symbol after this spin.",
    // Effect handled in game logic
  },
  {
    id: "hex_of_midas",
    name: "Hex of Midas",
    value: 3,
    rarity: "uncommon",
    emoji: "🔮",
    effectDescription: "Has a 30% chance of adding Coin.",
    // Random chance handled in game logic
  },
  {
    id: "hex_of_tedium",
    name: "Hex of Tedium",
    value: 3,
    rarity: "uncommon",
    emoji: "🔮",
    effectDescription:
      "You are 1.3x less likely to find Uncommon, Rare, and Very Rare symbols.",
    // Rarity effect handled in game logic
  },
  {
    id: "hex_of_thievery",
    name: "Hex of Thievery",
    value: 3,
    rarity: "uncommon",
    emoji: "🔮",
    effectDescription: "Has a 30% chance to take Coin 6.",
    // Effect handled in game logic
  },
  {
    id: "highlander",
    name: "Highlander",
    value: 6,
    rarity: "very_rare",
    emoji: "⚔️",
    effectDescription: "There can be only 1 Highlander.",
    // Uniqueness handled in game logic
  },
  {
    id: "honey",
    name: "Honey",
    value: 3,
    rarity: "rare",
    emoji: "🍯",
  },
  {
    id: "hooligan",
    name: "Hooligan",
    value: 2,
    rarity: "uncommon",
    emoji: "🧔",
    effectDescription:
      "Destroys adjacent Urn, Big Urn and Tomb. Gives Coin 6 for each Urn, Big Urn and Tomb destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "hustling_capsule",
    name: "Hustling Capsule",
    value: -7,
    rarity: "uncommon",
    emoji: "💊",
    effectDescription: "Destroys itself. Adds 1 Pool Ball item when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "item_capsule",
    name: "Item Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    effectDescription: "Destroys itself. Adds 1 Common item when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "jellyfish",
    name: "Jellyfish",
    value: 2,
    rarity: "uncommon",
    emoji: "🪼",
    effectDescription: "Gives Removal Token 1 when removed.",
    // Token effect handled in game logic
  },
  {
    id: "joker",
    name: "Joker",
    value: 3,
    rarity: "rare",
    emoji: "🃏",
    effectDescription:
      "Adjacent Clubs, Diamonds, Hearts and Spades give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier effect handled in game logic
      return 0;
    },
  },
  {
    id: "key",
    name: "Key",
    value: 1,
    rarity: "common",
    emoji: "🔑",
    effectDescription:
      "Destroys adjacent Lockbox, Safe, Treasure Chest and Mega Chest. Destroys itself afterwards.",
    // Destruction effect handled in game logic
  },
  {
    id: "king_midas",
    name: "King Midas",
    value: 1,
    rarity: "rare",
    emoji: "👑",
    effectDescription: "Adds Coin each spin. Adjacent Coin give 3x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier effect handled in game logic
      return 0;
    },
  },
  {
    id: "light_bulb",
    name: "Light Bulb",
    value: 1,
    rarity: "common",
    emoji: "💡",
    effectDescription:
      "Adjacent gems give 2x more Coin. Destroys itself after making other symbols give additional Coin 5 times.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier effect and self-destruction handled in game logic
      return 0;
    },
  },
  {
    id: "lockbox",
    name: "Lockbox",
    value: 1,
    rarity: "common",
    emoji: "🔒",
    effectDescription: "Gives Coin 15 when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "lucky_capsule",
    name: "Lucky Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    effectDescription:
      "Destroys itself. At least 1 of the symbols to add after this spin will be Rare or better.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "magic_key",
    name: "Magic Key",
    value: 2,
    rarity: "rare",
    emoji: "🗝️",
    effectDescription:
      "Destroys adjacent Lockbox, Safe, Treasure Chest and Mega Chest. Symbols destroyed this way give 3x more Coin. Destroys itself afterward.",
    // Destruction effect handled in game logic
  },
  {
    id: "magpie",
    name: "Magpie",
    value: -1,
    rarity: "common",
    emoji: "🐦",
    effectDescription: "Gives Coin 9 every 4 spins.",
    // Periodic effect handled in game logic
  },
  {
    id: "martini",
    name: "Martini",
    value: 3,
    rarity: "rare",
    emoji: "🍸",
  },
  {
    id: "matryoshka_doll",
    name: "Matryoshka Doll",
    value: 0,
    rarity: "uncommon",
    emoji: "🪆",
    effectDescription:
      "Destroys itself after 3 spins. Adds Matryoshka Doll 2 when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "matryoshka_doll_2",
    name: "Matryoshka Doll 2",
    value: 1,
    rarity: "special",
    emoji: "🪆",
    effectDescription:
      "Destroys itself after 5 spins. Adds Matryoshka Doll 3 when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "matryoshka_doll_3",
    name: "Matryoshka Doll 3",
    value: 2,
    rarity: "special",
    emoji: "🪆",
    effectDescription:
      "Destroys itself after 7 spins. Adds Matryoshka Doll 4 when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "matryoshka_doll_4",
    name: "Matryoshka Doll 4",
    value: 3,
    rarity: "special",
    emoji: "🪆",
    effectDescription:
      "Destroys itself after 9 spins. Adds Matryoshka Doll 5 when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "matryoshka_doll_5",
    name: "Matryoshka Doll 5",
    value: 4,
    rarity: "special",
    emoji: "🪆",
  },
  {
    id: "mega_chest",
    name: "Mega Chest",
    value: 3,
    rarity: "very_rare",
    emoji: "🧰",
    effectDescription: "Gives Coin 100 when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "midas_bomb",
    name: "Midas Bomb",
    value: 0,
    rarity: "very_rare",
    emoji: "💣",
    effectDescription:
      "Destroys itself and all adjacent symbols. Symbols destroyed this way give Coin equal to 7x their value.",
    // Destruction effect handled in game logic
  },
  {
    id: "milk",
    name: "Milk",
    value: 1,
    rarity: "common",
    emoji: "🥛",
  },
  {
    id: "mine",
    name: "Mine",
    value: 4,
    rarity: "rare",
    emoji: "⛏️",
    effectDescription:
      "Adds Ore each spin. Destroys itself after giving Coin 4 times. Adds 1 Mining Pick item when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "miner",
    name: "Miner",
    value: 1,
    rarity: "common",
    emoji: "👷",
    effectDescription:
      "Destroys adjacent Ore and Big Ore. Gives Coin 20 for each Ore and Big Ore destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Destruction effect handled in game logic
      return 0;
    },
  },
  {
    id: "missing",
    name: "Missing",
    value: 0,
    rarity: "special",
    emoji: "❓",
  },
  {
    id: "monkey",
    name: "Monkey",
    value: 1,
    rarity: "common",
    emoji: "🐒",
    effectDescription:
      "Destroys adjacent Banana, Coconut and Coconut Half. Gives Coin equal to 6x the value of symbols destroyed this way.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Destruction effect handled in game logic
      return 0;
    },
  },
  {
    id: "moon",
    name: "Moon",
    value: 3,
    rarity: "rare",
    emoji: "🌙",
    effectDescription:
      "Adjacent Owl, Rabbit and Wolf give 3x more Coin. Adds 3 Cheese when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier effect handled in game logic
      return 0;
    },
  },
  {
    id: "mouse",
    name: "Mouse",
    value: 1,
    rarity: "common",
    emoji: "🐭",
    effectDescription:
      "Destroys adjacent Cheese. Gives Coin 20 for each Cheese destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Destruction effect handled in game logic
      return 0;
    },
  },
  {
    id: "mrs_fruit",
    name: "Mrs. Fruit",
    value: 2,
    rarity: "rare",
    emoji: "👩‍🌾",
    effectDescription:
      "Destroys adjacent Banana, Cherry, Coconut, Coconut Half, Orange and Peach. Permanently gives Coin 1 for each symbol destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "ninja",
    name: "Ninja",
    value: 2,
    rarity: "uncommon",
    emoji: "🥷",
    effectDescription: "Gives Coin 1 less for each other Ninja.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      let ninjaCount = 0;

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "ninja") {
          ninjaCount++;
        }
      });

      return -ninjaCount;
    },
  },
  {
    id: "omelette",
    name: "Omelette",
    value: 3,
    rarity: "rare",
    emoji: "🍳",
    effectDescription:
      "Gives Coin 2 more if adjacent to Cheese, Egg, Milk, Golden Egg or Omelette. This effect only applies once per spin.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      const adjacentIndices = getAdjacentIndices(index);

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (
          adjSymbol &&
          ["cheese", "egg", "milk", "golden_egg", "omelette"].includes(
            adjSymbol.id
          )
        ) {
          return 2; // Only applies once
        }
      }

      return 0;
    },
  },
  {
    id: "orange",
    name: "Orange",
    value: 2,
    rarity: "uncommon",
    emoji: "🍊",
  },
  {
    id: "ore",
    name: "Ore",
    value: 1,
    rarity: "common",
    emoji: "🪨",
    effectDescription:
      "Adds Void Stone, Amethyst, Pearl, Shiny Pebble, Sapphire, Emerald, Ruby or Diamond when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "owl",
    name: "Owl",
    value: 1,
    rarity: "common",
    emoji: "🦉",
    effectDescription: "Gives Coin 1 every 3 spins.",
    // Periodic effect handled in game logic
  },
  {
    id: "oyster",
    name: "Oyster",
    value: 1,
    rarity: "common",
    emoji: "🦪",
    effectDescription:
      "Has a 20% chance of adding Pearl. Adds Pearl when removed.",
    // Random chance and removal effect handled in game logic
  },
  {
    id: "peach",
    name: "Peach",
    value: 2,
    rarity: "uncommon",
    emoji: "🍑",
    effectDescription: "Adds Seed when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "pear",
    name: "Pear",
    value: 1,
    rarity: "rare",
    emoji: "🍐",
    effectDescription:
      "Whenever another symbol makes this symbol give additional Coin, this symbol permanently gives Coin 1 more.",
    // Special effect handled in game logic
  },
  {
    id: "pearl",
    name: "Pearl",
    value: 1,
    rarity: "common",
    emoji: "🔘",
  },
  {
    id: "pirate",
    name: "Pirate",
    value: 2,
    rarity: "very_rare",
    emoji: "🏴‍☠️",
    effectDescription:
      "Destroys adjacent Anchor, Beer, Coin, Lockbox, Safe, Orange, Treasure Chest and Mega Chest. Permanently gives Coin 1 for each symbol destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "pinata",
    name: "Piñata",
    value: 1,
    rarity: "uncommon",
    emoji: "🪅",
    effectDescription: "Adds 7 Candy when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "present",
    name: "Present",
    value: 0,
    rarity: "common",
    emoji: "🎁",
    effectDescription:
      "Destroys itself after 12 spins. Gives Coin 10 when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "pufferfish",
    name: "Pufferfish",
    value: 2,
    rarity: "uncommon",
    emoji: "🐡",
    effectDescription: "Gives Reroll Token 1 when removed.",
    // Removal effect handled in game logic
  },
  {
    id: "rabbit",
    name: "Rabbit",
    value: 1,
    rarity: "uncommon",
    emoji: "🐰",
    effectDescription:
      "Permanently gives Coin 2 more after giving Coin 10 times.",
    // Counter effect handled in game logic
  },
  {
    id: "rabbit_fluff",
    name: "Rabbit Fluff",
    value: 2,
    rarity: "uncommon",
    emoji: "🧶",
    effectDescription:
      "You are 1.2x more likely to find Uncommon, Rare, and Very Rare symbols.",
    // Rarity effect handled in game logic
  },
  {
    id: "rain",
    name: "Rain",
    value: 2,
    rarity: "uncommon",
    emoji: "🌧️",
    effectDescription:
      "Adjacent Flower give 2x more Coin. Adjacent Seed are 50% more likely to grow.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier and growth chance handled in game logic
      return 0;
    },
  },
  {
    id: "removal_capsule",
    name: "Removal Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    effectDescription: "Destroys itself. Gives Removal Token 1 when destroyed.",
    // Self-destruction and token effect handled in game logic
  },
  {
    id: "reroll_capsule",
    name: "Reroll Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    effectDescription: "Destroys itself. Gives Reroll Token 1 when destroyed.",
    // Self-destruction and token effect handled in game logic
  },
  {
    id: "robin_hood",
    name: "Robin Hood",
    value: -4,
    rarity: "rare",
    emoji: "🏹",
    effectDescription:
      "Gives Coin 25 every 4 spins. Adjacent Thief, Bronze Arrow, Golden Arrow and Silver Arrow give Coin 3 more. Destroys adjacent Billionaire, Target and Apple. Gives Coin 15 for each Billionaire, Target and Apple destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Periodic effect and destruction effect handled in game logic
      return 0;
    },
  },
  {
    id: "ruby",
    name: "Ruby",
    value: 3,
    rarity: "rare",
    emoji: "🔴",
    effectDescription: "Gives Coin 1 more if there are at least 2 Ruby.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      let rubyCount = 0;

      grid.forEach((symbol) => {
        if (symbol && symbol.id === "ruby") {
          rubyCount++;
        }
      });

      return rubyCount >= 2 ? 1 : 0;
    },
  },
  {
    id: "safe",
    name: "Safe",
    value: 1,
    rarity: "uncommon",
    emoji: "🔐",
    effectDescription: "Gives Coin 30 when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "sand_dollar",
    name: "Sand Dollar",
    value: 2,
    rarity: "uncommon",
    emoji: "🪙",
    effectDescription: "Gives Coin 10 when removed.",
    // Removal effect handled in game logic
  },
  {
    id: "sapphire",
    name: "Sapphire",
    value: 2,
    rarity: "uncommon",
    emoji: "🔵",
  },
  {
    id: "seed",
    name: "Seed",
    value: 1,
    rarity: "common",
    emoji: "🌱",
    effectDescription: "Has a 25% chance to grow into a fruit or flower.",
    // Growth chance handled in game logic
  },
  {
    id: "shiny_pebble",
    name: "Shiny Pebble",
    value: 1,
    rarity: "common",
    emoji: "✨",
    effectDescription:
      "You are 1.1x more likely to find Uncommon, Rare, and Very Rare symbols.",
    // Rarity effect handled in game logic
  },
  {
    id: "silver_arrow",
    name: "Silver Arrow",
    value: 0,
    rarity: "rare",
    emoji: "🏹",
    effectDescription:
      "Points a random direction. Symbols that are pointed to give 3x more Coin. Destroys Target that are pointed to.",
    // Direction and effect handled in game logic
  },
  {
    id: "sloth",
    name: "Sloth",
    value: 0,
    rarity: "uncommon",
    emoji: "🦥",
    effectDescription: "Gives Coin 4 every 2 spins.",
    // Periodic effect handled in game logic
  },
  {
    id: "snail",
    name: "Snail",
    value: 0,
    rarity: "common",
    emoji: "🐌",
    effectDescription: "Gives Coin 5 every 4 spins.",
    // Periodic effect handled in game logic
  },
  {
    id: "spades",
    name: "Spades",
    value: 1,
    rarity: "uncommon",
    emoji: "♠️",
    effectDescription:
      "Adjacent Clubs and Spades give Coin 1 more. Gives Coin 1 more if there are at least 3 Clubs, Diamonds, Hearts or Spades.",
    effect: function (grid: (Symbol | null)[], index: number): number {
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

      return cardCount >= 3 ? 1 : 0;
    },
  },
  {
    id: "spirit",
    name: "Spirit",
    value: 6,
    rarity: "rare",
    emoji: "👻",
    effectDescription: "Destroys itself after giving Coin 4 times.",
    // Self-destruction handled in game logic
  },
  {
    id: "strawberry",
    name: "Strawberry",
    value: 3,
    rarity: "rare",
    emoji: "🍓",
    effectDescription: "Gives Coin 1 more if there are at least 2 Strawberry.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      let strawberryCount = 0;

      grid.forEach((symbol) => {
        if (symbol && symbol.id === "strawberry") {
          strawberryCount++;
        }
      });

      return strawberryCount >= 2 ? 1 : 0;
    },
  },
  {
    id: "sun",
    name: "Sun",
    value: 3,
    rarity: "rare",
    emoji: "☀️",
    effectDescription:
      "Adjacent Flower give 5x more Coin. Adjacent Seed are 50% more likely to grow.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier and growth chance handled in game logic
      return 0;
    },
  },
  {
    id: "target",
    name: "Target",
    value: 2,
    rarity: "uncommon",
    emoji: "🎯",
    effectDescription: "Gives Coin 10 when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "tedium_capsule",
    name: "Tedium Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    effectDescription:
      "Destroys itself. Gives Coin 5 when destroyed. At least 1 of the symbols to add after this spin will be Common.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "thief",
    name: "Thief",
    value: -1,
    rarity: "uncommon",
    emoji: "🦹",
    effectDescription:
      'Gives Coin ? when destroyed. "Coin ?" increases by Coin 4 each spin.',
    // Variable value handled in game logic
  },
  {
    id: "three_sided_die",
    name: "Three-Sided Die",
    value: 0, // Variable value
    rarity: "common",
    emoji: "🎲",
    effectDescription: "Gives between Coin 1 and Coin 3 randomly.",
    effect: function (): number {
      return Math.floor(Math.random() * 3) + 1;
    },
  },
  {
    id: "time_capsule",
    name: "Time Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    effectDescription:
      "Destroys itself. Adds 1 symbol that was destroyed this game when destroyed. Cannot add Time Capsule.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "toddler",
    name: "Toddler",
    value: 1,
    rarity: "common",
    emoji: "👶",
    effectDescription:
      "Destroys adjacent Present, Candy, Piñata and Bubble. Gives Coin 6 for each Present, Candy, Piñata and Bubble destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Destruction effect handled in game logic
      return 0;
    },
  },
  {
    id: "tomb",
    name: "Tomb",
    value: 3,
    rarity: "rare",
    emoji: "🪦",
    effectDescription:
      "Has a 6% chance of adding Spirit. Adds 4 Spirit when destroyed.",
    // Random chance and destruction effect handled in game logic
  },
  {
    id: "treasure_chest",
    name: "Treasure Chest",
    value: 2,
    rarity: "rare",
    emoji: "🧰",
    effectDescription: "Gives Coin 50 when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "turtle",
    name: "Turtle",
    value: 0,
    rarity: "common",
    emoji: "🐢",
    effectDescription: "Gives Coin 4 every 3 spins.",
    // Periodic effect handled in game logic
  },
  {
    id: "urn",
    name: "Urn",
    value: 1,
    rarity: "common",
    emoji: "⚱️",
    effectDescription: "Adds Spirit when destroyed.",
    // Destruction effect handled in game logic
  },
  {
    id: "void_creature",
    name: "Void Creature",
    value: 0,
    rarity: "uncommon",
    emoji: "👾",
    effectDescription:
      "Adjacent Empty give Coin 1 more. Destroys itself if adjacent to 0 Empty. Gives Coin 8 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      const adjacentIndices = getAdjacentIndices(index);
      let emptyCount = 0;

      adjacentIndices.forEach((adjIndex) => {
        const adjSymbol = grid[adjIndex];
        if (!adjSymbol || adjSymbol.id === "empty") {
          emptyCount++;
        }
      });

      return emptyCount;
    },
  },
  {
    id: "void_fruit",
    name: "Void Fruit",
    value: 0,
    rarity: "uncommon",
    emoji: "🍎",
    effectDescription:
      "Adjacent Empty give Coin 1 more. Destroys itself if adjacent to 0 Empty. Gives Coin 8 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      const adjacentIndices = getAdjacentIndices(index);
      let emptyCount = 0;

      adjacentIndices.forEach((adjIndex) => {
        const adjSymbol = grid[adjIndex];
        if (!adjSymbol || adjSymbol.id === "empty") {
          emptyCount++;
        }
      });

      return emptyCount;
    },
  },
  {
    id: "void_stone",
    name: "Void Stone",
    value: 0,
    rarity: "uncommon",
    emoji: "🌑",
    effectDescription:
      "Adjacent Empty give Coin 1 more. Destroys itself if adjacent to 0 Empty. Gives Coin 8 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      const adjacentIndices = getAdjacentIndices(index);
      let emptyCount = 0;

      adjacentIndices.forEach((adjIndex) => {
        const adjSymbol = grid[adjIndex];
        if (!adjSymbol || adjSymbol.id === "empty") {
          emptyCount++;
        }
      });

      return emptyCount;
    },
  },
  {
    id: "watermelon",
    name: "Watermelon",
    value: 4,
    rarity: "very_rare",
    emoji: "🍉",
    effectDescription: "Gives Coin 1 more for each other Watermelon.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      let watermelonCount = 0;

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "watermelon") {
          watermelonCount++;
        }
      });

      return watermelonCount;
    },
  },
  {
    id: "wealthy_capsule",
    name: "Wealthy Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    effectDescription: "Destroys itself. Gives Coin 10 when destroyed.",
    // Self-destruction and effect handled in game logic
  },
  {
    id: "wildcard",
    name: "Wildcard",
    value: 0, // Variable value
    rarity: "very_rare",
    emoji: "🃏",
    effectDescription:
      "Gives Coin equal to the highest value among adjacent symbols.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      const adjacentIndices = getAdjacentIndices(index);
      let highestValue = 0;

      adjacentIndices.forEach((adjIndex) => {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && adjSymbol.value > highestValue) {
          highestValue = adjSymbol.value;
        }
      });

      return highestValue;
    },
  },
  {
    id: "wine",
    name: "Wine",
    value: 2,
    rarity: "uncommon",
    emoji: "🍷",
    effectDescription:
      "Permanently gives Coin 1 more after giving Coin 8 times.",
    // Counter effect handled in game logic
  },
  {
    id: "witch",
    name: "Witch",
    value: 2,
    rarity: "rare",
    emoji: "🧙‍♀️",
    effectDescription:
      "Adjacent Cat, Owl, Crow, Apple, Hex symbols, Eldritch Creature and Spirit give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): number {
      // Multiplier effect handled in game logic
      return 0;
    },
  },
  {
    id: "wolf",
    name: "Wolf",
    value: 2,
    rarity: "uncommon",
    emoji: "🐺",
  },
];

// Get a random symbol based on rarity and game progression
export function getRandomSymbol(timeRentPaid: number = 0): Symbol {
  // Rarity probabilities based on times rent paid
  let commonChance, uncommonChance, rareChance, veryRareChance;

  switch (true) {
    case timeRentPaid === 0:
      commonChance = 1.0;
      uncommonChance = 0.0;
      rareChance = 0.0;
      veryRareChance = 0.0;
      break;
    case timeRentPaid === 1:
      commonChance = 0.9;
      uncommonChance = 0.1;
      rareChance = 0.0;
      veryRareChance = 0.0;
      break;
    case timeRentPaid === 2:
      commonChance = 0.79;
      uncommonChance = 0.2;
      rareChance = 0.01;
      veryRareChance = 0.0;
      break;
    case timeRentPaid === 3:
      commonChance = 0.74;
      uncommonChance = 0.25;
      rareChance = 0.01;
      veryRareChance = 0.0;
      break;
    case timeRentPaid === 4:
      commonChance = 0.69;
      uncommonChance = 0.29;
      rareChance = 0.015;
      veryRareChance = 0.005;
      break;
    default: // 5+
      commonChance = 0.68;
      uncommonChance = 0.3;
      rareChance = 0.015;
      veryRareChance = 0.005;
      break;
  }

  // Roll for rarity
  const rarityRoll = Math.random();
  let pool: Symbol[];

  if (rarityRoll < veryRareChance) {
    pool = symbolTypes.filter((s) => s.rarity === "very_rare");
  } else if (rarityRoll < veryRareChance + rareChance) {
    pool = symbolTypes.filter((s) => s.rarity === "rare");
  } else if (rarityRoll < veryRareChance + rareChance + uncommonChance) {
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
    JSON.parse(JSON.stringify(symbolTypes.find((s) => s.id === "cat"))),
    JSON.parse(JSON.stringify(symbolTypes.find((s) => s.id === "cherry"))),
    JSON.parse(JSON.stringify(symbolTypes.find((s) => s.id === "coin"))),
    JSON.parse(JSON.stringify(symbolTypes.find((s) => s.id === "pearl"))),
    JSON.parse(JSON.stringify(symbolTypes.find((s) => s.id === "flower"))),
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
