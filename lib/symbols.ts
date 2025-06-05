import { getRandomSymbol } from "./gameLogic";
import {
  getModifier,
  getAdjacentIndices,
  getAdjacentSymbols,
  isAdjacentToSymbols,
  getIsDestroyed,
  calculateBonusValue,
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
    type: ["void"],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier: 0 };
    },
  },
  {
    id: "anchor",
    name: "Anchor",
    value: 1,
    rarity: "common",
    emoji: "⚓",
    type: ["piratelikes", "poslikes"],
    effectDescription: "+4 coins when in a corner.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      const corners = [0, 3, 12, 15];
      return {
        isDestroyed,
        bonusValue: corners.includes(index) ? 4 : 0,
        multiplier,
      };
    },
  },
  {
    id: "apple",
    name: "Apple",
    value: 3,
    rarity: "rare",
    emoji: "🍎",
    type: ["food", "fruit", "plant", "witchlikes", "robinhates", "farmerlikes"],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "banana",
    name: "Banana",
    value: 1,
    rarity: "common",
    emoji: "🍌",
    type: [
      "food",
      "fruit",
      "plant",
      "monkeylikes",
      "farmerlikes",
      "funny",
      "fruitlikes",
    ],
    effectDescription: "Adds [<banana_peel>] when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return {
        isDestroyed,
        bonusValue: 0,
        multiplier,
        add: isDestroyed ? ["banana_peel"] : [],
      };
    },
  },
  {
    id: "banana_peel",
    name: "Banana Peel",
    value: 1,
    rarity: "common",
    emoji: "🍌",
    type: ["funny"],
    effectDescription: "Destroys: [<thief>] Destroys itself afterwards.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "bar_of_soap",
    name: "Bar of Soap",
    value: 1,
    rarity: "uncommon",
    emoji: "🧼",
    counter: 0,
    type: [],
    effectDescription:
      "Adds <bubble> each spin. Destroys itself after giving Coin 3 times.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const currentCounter = grid[index]?.counter ?? 0;
      const multiplier = getModifier(grid, index);
      const isDestroyed = currentCounter >= 3 || getIsDestroyed(grid, index);
      if (isDestroyed) {
        return { isDestroyed, bonusValue: 0, multiplier };
      }
      // Effect handled in game logic
      return {
        isDestroyed,
        bonusValue: 0,
        multiplier,
        add: ["bubble"],
      };
    },
  },
  {
    id: "dame",
    name: "Dame",
    value: 2,
    rarity: "rare",
    emoji: "👸",
    type: ["human", "organism", "gem"],
    effectDescription:
      "Destroys adjacent [<martini>] Gives 40 coins for each destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      const adjacentIndices = getAdjacentIndices(index);
      let martiniCount = 0;

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && adjSymbol.id === "martini") {
          martiniCount++;
        }
      }

      return {
        isDestroyed,
        bonusValue: martiniCount * 40,
        multiplier,
      };
    },
  },
  {
    id: "martini",
    name: "Martini",
    value: 7,
    rarity: "rare",
    emoji: "🍸",
    type: ["food", "booze"],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);

      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "bartender",
    name: "Bartender",
    value: 3,
    rarity: "rare",
    type: ["human", "organism", "spawner0", "darkhumor"],
    emoji: "🧑‍🍳",
    effectDescription:
      "Has a 10% chance of adding [<chemical_seven><beer><wine><martini>]",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Has a 10% chance of adding Chemical Seven, Beer, Wine or Martini.
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      const random = Math.random();
      const chooseArray = ["beer", "wine", "martini"];
      if (random < 0.1) {
        return {
          isDestroyed,
          bonusValue: 0,
          multiplier,
          add: [chooseArray[Math.floor(Math.random() * chooseArray.length)]],
        };
      }
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "bear",
    name: "Bear",
    value: 2,
    rarity: "uncommon",
    emoji: "🐻",
    type: ["animal", "organism"],
    effectDescription: "Destroys [<honey>] Gives Coin 40 for each destroyed",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      const adjacentIndices = getAdjacentIndices(index);
      let honeyCount = 0;

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && adjSymbol.id === "honey") {
          honeyCount++;
        }
      }
      return { isDestroyed, bonusValue: 40 * honeyCount, multiplier };
    },
  },
  {
    id: "beastmaster",
    name: "Beastmaster",
    value: 2,
    rarity: "rare",
    type: ["human", "organism", "doglikes"],
    emoji: "🧙‍♂️",
    effectDescription:
      "Adjacent [<chick><chicken><cow><crab><crow><dog><egg><golden_egg><goldfish><goose><turtle><wolf>] give 2x more coins.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "bee",
    name: "Bee",
    value: 1,
    rarity: "common",
    type: ["animal", "organism"],
    emoji: "🐝",
    effectDescription:
      "2x multiplier for: [<flower> <beehive> <honey>] 1 extra coin for each adjacent: [<flower> <beehive> <honey>] ",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentSymbols = getAdjacentSymbols(grid, index);
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      let bonusValue = 0;

      adjacentSymbols.forEach((adjSymbol) => {
        if (
          adjSymbol &&
          ["flower", "beehive", "honey"].includes(adjSymbol.id)
        ) {
          bonusValue += 1;
        }
      });

      return {
        isDestroyed,
        bonusValue,
        multiplier,
      };
    },
  },
  {
    id: "beehive",
    name: "Beehive",
    value: 3,
    rarity: "rare",
    emoji: "🐝",
    type: ["beelikes", "spawner0", "triggerchance"],
    effectDescription: "Has a 10% chance of adding [<honey>]",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      const random = Math.random();
      if (random < 0.1) {
        return {
          isDestroyed,
          bonusValue: 0,
          multiplier,
          add: ["honey"],
        };
      }
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "beer",
    name: "Beer",
    value: 1,
    rarity: "common",
    emoji: "🍺",
    type: [
      "food",
      "booze",
      "anvillikes",
      "dwarflikes",
      "darkhumor",
      "piratelikes",
    ],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "big_ore",
    name: "Big Ore",
    value: 2,
    rarity: "uncommon",
    emoji: "🪨",
    type: ["ore", "anvillikes", "archlikes", "minerlikes", "kyle"],
    effectDescription:
      "Adds 2 [<void_stone><amethyst><pearl><shiny_pebble><sapphire><emerald><ruby><diamond>] when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      if (isDestroyed) {
        const chooseArray = ["void_stone", "emerald", "ruby"];
        return {
          isDestroyed,
          bonusValue: 0,
          multiplier,
          add: [
            chooseArray[Math.floor(Math.random() * chooseArray.length)],
            chooseArray[Math.floor(Math.random() * chooseArray.length)],
          ],
        };
      }
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "big_urn",
    name: "Big Urn",
    value: 2,
    rarity: "uncommon",
    emoji: "⚱️",
    type: ["spiritbox", "darkhumor"],
    effectDescription: "Adds 2 [<spirit>] when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      if (isDestroyed) {
        return {
          isDestroyed,
          bonusValue: 0,
          multiplier,
          add: ["spirit", "spirit"],
        };
      }

      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "billionaire",
    name: "Billionaire",
    value: 0,
    rarity: "uncommon",
    emoji: "🤵",
    type: ["human", "organism", "box", "robinhates"],
    effectDescription:
      "Adjacent [<cheese><wine>] give 2x more Coin. Gives 39 coins when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Check if adjacent to Robin Hood
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      if (isDestroyed) {
        return { isDestroyed, bonusValue: 39, multiplier };
      }

      // Multiplier effect handled in game logic
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "bounty_hunter",
    name: "Bounty Hunter",
    value: 1,
    rarity: "common",
    emoji: "🕵️",
    type: ["human", "organism", "doglikes"],
    effectDescription:
      "Destroys [<thief>] Gives Coin 20 for each Thief destroyed",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return {
        isDestroyed,
        bonusValue: isDestroyed ? 20 : 0,
        multiplier,
      };
    },
  },
  {
    id: "bubble",
    name: "Bubble",
    value: 2,
    rarity: "common",
    emoji: "🫧",
    type: ["toddlerlikes"],
    counter: 0,
    effectDescription: "Destroys itself after giving Coin 3 times.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const currentCounter = grid[index]?.counter || 0;
      const multiplier = getModifier(grid, index);
      const isDestroyed = currentCounter >= 3 || getIsDestroyed(grid, index);
      // Check if the bubble has given coins 3 times
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "buffing_capsule",
    name: "Buffing Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    type: ["capsule"],
    effectDescription: "Destroys itself. Adjacent symbols give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      return { isDestroyed: true, bonusValue: 0, multiplier: 0 };
    },
  },
  {
    id: "candy",
    name: "Candy",
    value: 1,
    rarity: "common",
    emoji: "🍬",
    type: ["food", "counted", "toddlerlikes", "halloween"],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "cat",
    name: "Cat",
    value: 1,
    rarity: "common",
    emoji: "🐱",
    type: ["animal", "organism", "witchlikes", "raritymod"],
    effectDescription:
      "Destroys [<milk>] Gives Coin 9 for each [<milk>] destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return {
        isDestroyed,
        bonusValue: isDestroyed ? 9 : 0,
        multiplier,
      };
    },
  },
  {
    id: "milk",
    name: "Milk",
    value: 1,
    rarity: "common",
    emoji: "🥛",
    type: ["food", "farmerlikes", "omelettestuff"],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "cheese",
    name: "Cheese",
    value: 1,
    rarity: "common",
    emoji: "🧀",
    type: ["food", "farmerlikes", "richlikes", "omelettestuff"],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "chef",
    name: "Chef",
    value: 2,
    rarity: "rare",
    emoji: "👨‍🍳",
    type: ["human", "organism", "doglikes"],
    effectDescription:
      "Adjacent [<apple><banana><candy><cheese><cherry><coconut><coconut_half><honey><milk>] give 2x more coins.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Multiplier effect handled in game logic
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "cherry",
    name: "Cherry",
    value: 1,
    rarity: "common",
    type: ["food", "fruit", "plant", "farmerlikes", "fruitlikes"],
    emoji: "🍒",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "chick",
    name: "Chick",
    value: 1,
    rarity: "uncommon",
    type: [
      "animal",
      "organism",
      "bird",
      "chickenstuff",
      "farmerlikes",
      "triggerchance",
    ],
    emoji: "🐤",
    effectDescription: "Has a 10% chance to grow into [<chicken>]",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      const random = Math.random();
      if (random < 0.1) {
        return {
          isDestroyed: true,
          bonusValue: 0,
          multiplier,
          add: ["chicken"],
        };
      }
      return { isDestroyed, bonusValue: 0, multiplier };
    },
    // Growth chance handled in game logic
  },
  {
    id: "chicken",
    name: "Chicken",
    value: 2,
    rarity: "rare",
    emoji: "🐔",
    type: [
      "animal",
      "organism",
      "bird",
      "chickenstuff",
      "farmerlikes",
      "spawner0",
      "spawner1",
      "triggerchance",
    ],
    effectDescription:
      "Has a 5% chance of adding [<egg>] Has a 1% chance of adding [<golden_egg>]",
    // Random chance handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      const random = Math.random();
      if (random < 0.01) {
        return {
          isDestroyed: true,
          bonusValue: 0,
          multiplier,
          add: ["golden_egg"],
        };
      }
      if (random < 0.05) {
        return {
          isDestroyed: true,
          bonusValue: 0,
          multiplier,
          add: ["egg"],
        };
      }
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "spades",
    name: "Spades",
    value: 1,
    rarity: "uncommon",
    emoji: "♠️",
    type: ["suit", "counted"],
    effectDescription:
      "Adjacent [<clubs><spades>] give +1 coin. +1 coin extra if there are at least 3 [<clubs><spades><diamonds><hearts>]",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Count card symbols
      const isDestroyed = getIsDestroyed(grid, index);
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
        isDestroyed,
        bonusValue: cardCount >= 3 ? 1 : 0,
        multiplier: getModifier(grid, index),
      };
    },
  },
  {
    id: "clubs",
    name: "Clubs",
    value: 1,
    rarity: "uncommon",
    emoji: "♣️",
    type: ["suit", "counted"],
    effectDescription:
      "Adjacent [<clubs><spades>] give +1 coin. +1 coin extra if there are at least 3 [<clubs><spades><diamonds><hearts>]",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Count card symbols
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      let cardCount = 0;
      grid.forEach((symbol) => {
        if (
          symbol &&
          ["clubs", "diamonds", "hearts", "spades"].includes(symbol.id)
        ) {
          cardCount++;
        }
      });

      const bonusValue = cardCount >= 3 ? 1 : 0;

      return {
        isDestroyed,
        bonusValue,
        multiplier,
      };
    },
  },
  {
    id: "coal",
    name: "Coal",
    value: 0,
    rarity: "common",
    emoji: "⚫",
    counter: 0,
    type: ["ore", "time_machine"],
    effectDescription: "Transforms into [<diamond>] after 20 spins.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const counter = grid[index]?.counter || 0;
      const isDestroyed = counter >= 20 || getIsDestroyed(grid, index);
      if (isDestroyed) {
        return {
          isDestroyed,
          bonusValue: 0,
          multiplier,
          add: ["diamond"],
        };
      }
      return { isDestroyed, bonusValue: 0, multiplier };
    },
    // Transformation handled in game logic
  },
  {
    id: "coconut",
    name: "Coconut",
    value: 1,
    rarity: "uncommon",
    emoji: "🥥",
    type: [
      "food",
      "fruit",
      "plant",
      "farmerlikes",
      "monkeylikes",
      "fruitlikes",
    ],
    effectDescription: "Adds 2 [<coconut_half>] when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return {
        isDestroyed,
        bonusValue: 0,
        multiplier,
        add: isDestroyed ? ["coconut_half"] : [],
      };
    },
  },
  {
    id: "coconut_half",
    name: "Coconut Half",
    value: 2,
    rarity: "uncommon",
    emoji: "🥥",
    type: ["food", "fruit", "fruitlikes", "monkeylikes"],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return {
        isDestroyed,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "coin",
    name: "Coin",
    value: 1,
    rarity: "common",
    emoji: "🪙",
    type: ["piratelikes"],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "comedian",
    name: "Comedian",
    value: 3,
    rarity: "rare",
    emoji: "🤡",
    type: ["human", "organism", "doglikes"],
    effectDescription:
      "Adjacent [<banana><banana_peel><dog><monkey><toddler><joker>] give 3x more coins.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Multiplier effect handled in game logic
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "cow",
    name: "Cow",
    value: 3,
    rarity: "rare",
    type: ["animal", "organism", "farmerlikes", "spawner0", "triggerchance"],
    emoji: "🐄",
    effectDescription: "Has a 15% chance of adding [<milk>]",
    // Random chance handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const random = Math.random();
      const isDestroyed = getIsDestroyed(grid, index);
      if (random < 0.15) {
        return {
          isDestroyed: false,
          bonusValue: 0,
          multiplier,
          add: ["milk"],
        };
      }
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "crab",
    name: "Crab",
    value: 1,
    rarity: "common",
    emoji: "🦀",
    type: ["animal", "organism", "poslikes"],
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

      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier: getModifier(grid, index),
      };
    },
  },
  {
    id: "crow",
    name: "Crow",
    value: 2,
    rarity: "common",
    type: ["animal", "organism", "bird", "witchlikes"],
    emoji: "🐦‍⬛",
    effectDescription: "Gives -3 coins every 4 spins.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const counter = grid[index]?.counter || 0;
      const isDestroyed = getIsDestroyed(grid, index);

      if (counter % 4 === 3) {
        // Every 4th spin (0-indexed counter)
        return { isDestroyed, bonusValue: -3, multiplier };
      }

      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "cultist",
    name: "Cultist",
    value: 0,
    rarity: "common",
    type: [
      "human",
      "organism",
      "doglikes",
      "counted",
      "eachother",
      "fossillikes",
    ],
    emoji: "🧙",
    effectDescription:
      "Gives 1 coin for each other [<cultist>] Gives 1 extra coin if there are at least 3 [<cultist>]",
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
        multiplier: getModifier(grid, index),
      };
    },
  },
  {
    id: "diamond",
    name: "Diamond",
    value: 5,
    rarity: "very_rare",
    type: ["ore", "gem", "counted", "eachother"],
    emoji: "💎",
    effectDescription: "Gives Coin 1 more for each other Diamond.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      let diamondCount = 0;
      const multiplier = getModifier(grid, index);

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "diamond") {
          diamondCount++;
        }
      });

      return {
        isDestroyed: false,
        bonusValue: 5 + diamondCount,
        multiplier,
      };
    },
  },
  {
    id: "diamonds",
    name: "Diamonds",
    value: 1,
    rarity: "uncommon",
    emoji: "♦️",
    type: ["suit", "counted"],
    effectDescription:
      "Adjacent [<diamonds><hearts>] give +1 coin. +1 coin extra if there are at least 3 [<diamonds><hearts><clubs><spades>]",
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

      return {
        isDestroyed: false,
        bonusValue: cardCount >= 3 ? 1 : 0,
        multiplier: getModifier(grid, 0),
      };
    },
  },
  {
    id: "diver",
    name: "Diver",
    value: 2,
    rarity: "rare",
    emoji: "🤿",
    type: ["human", "organism", "doglikes", "scaler"],
    effectDescription:
      "Removes adjacent sea creatures and items. Permanently gives Coin 1 for each symbol removed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      // Removal effect handled in game logic
      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "dog",
    name: "Dog",
    value: 1,
    rarity: "common",
    emoji: "🐶",
    type: ["animal", "organism", "funny"],
    effectDescription: "Gives 2 coins more if adjacent to human characters. ",
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

      const isDestroyed = getIsDestroyed(grid, index);
      let bonusValue = 0;

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && humanCharacters.includes(adjSymbol.id)) {
          bonusValue = 2;
        }
      }

      return {
        isDestroyed,
        bonusValue,
        multiplier: getModifier(grid, index),
      };
    },
  },
  {
    id: "dwarf",
    name: "Dwarf",
    value: 1,
    rarity: "common",
    emoji: "👨‍🦰",
    type: ["human", "organism", "doglikes"],
    effectDescription:
      "Destroys [<beer><wine>] Gives 10x the value of symbols destroyed this way",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentSymbols = getAdjacentSymbols(grid, index);
      const destroyedSymbols = adjacentSymbols.filter(
        (symbol) => symbol?.id === "beer" || symbol?.id === "wine"
      );
      const destroyedValue = destroyedSymbols.reduce((acc, symbol) => {
        return acc + symbol.value;
      }, 0);
      return {
        isDestroyed: false,
        bonusValue: 10 * destroyedValue,
        multiplier: getModifier(grid, index),
      };
    },
  },
  {
    id: "egg",
    name: "Egg",
    value: 1,
    rarity: "common",
    emoji: "🥚",
    type: [
      "animal",
      "chickenstuff",
      "farmerlikes",
      "omelettestuff",
      "triggerchance",
    ],
    effectDescription: "Has a 10% chance to transform into [<chick>]",
    // Transformation handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const random = Math.random();
      const isDestroyed = random < 0.1 || getIsDestroyed(grid, index);
      if (isDestroyed) {
        return { isDestroyed: true, bonusValue: 0, multiplier };
      }
      return { isDestroyed: false, bonusValue: 0, multiplier };
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    value: 3,
    rarity: "rare",
    emoji: "",
    type: ["ore", "gem", "counted"],
    effectDescription: "Gives +1 coin if there are at least 2 [<emerald>]",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      let emeraldCount = 0;
      const multiplier = getModifier(grid, index);
      grid.forEach((symbol) => {
        if (symbol && symbol.id === "emerald") {
          emeraldCount++;
        }
      });

      return {
        isDestroyed: false,
        bonusValue: emeraldCount >= 2 ? 1 : 0,
        multiplier,
      };
    },
  },
  {
    id: "farmer",
    name: "Farmer",
    value: 2,
    rarity: "rare",
    emoji: "👨‍🌾",
    type: ["human", "organism", "doglikes"],
    effectDescription:
      "Adjacent food and farm-related symbols give 2x more Coin. Adjacent Seed are 50% more likely to grow.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Multiplier and growth chance handled in game logic
      const multiplier = getModifier(grid, index);
      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "five_sided_die",
    name: "Five-Sided Die",
    value: 0, // Variable value
    rarity: "uncommon",
    emoji: "🎲",
    type: [],
    effectDescription: "Gives between 1 and 5 coins randomly.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const randomValue = Math.floor(Math.random() * 5) + 1;
      return {
        isDestroyed: false,
        bonusValue: randomValue, // This is the entire value, not a bonus
        multiplier: 0, // No multiplier for random values
      };
    },
  },
  {
    id: "flower",
    name: "Flower",
    value: 1,
    rarity: "common",
    emoji: "🌸",
    type: ["plant", "beelikes", "farmerlikes"],
    effectDescription: "Gives 1 coin for each other [<flower>]",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      let flowerCount = 0;
      const multiplier = getModifier(grid, index);

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "flower") {
          flowerCount++;
        }
      });

      return {
        isDestroyed: false,
        bonusValue: flowerCount,
        multiplier,
      };
    },
  },
  {
    id: "gambler",
    name: "Gambler",
    value: 1,
    rarity: "common",
    emoji: "🎰",
    type: ["human", "organism", "doglikes", "box"],
    effectDescription:
      "Counter +2 coins per spin. Destroys itself when any [<five_sided_die><three_sided_die>] rolls 1",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const counter = grid[index]?.counter || 0;
      const dices = grid.filter(
        (symbol) =>
          symbol?.id === "five_sided_die" || symbol?.id === "three_sided_die"
      );
      const rolled1 = dices.some((symbol) => symbol?.value === 1);

      if (rolled1) {
        return { isDestroyed: true, bonusValue: 0, multiplier };
      }

      return {
        isDestroyed: false,
        bonusValue: 2 * counter,
        multiplier,
      };
    },
  },
  {
    id: "general_zaroff",
    name: "General Zaroff",
    value: 1,
    rarity: "rare",
    emoji: "👨‍✈️",
    type: ["human", "organism", "doglikes"],
    effectDescription:
      "Destroys adjacent human characters. Gives Coin 25 for each symbol destroyed.",
    // Destruction effect handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const adjacentSymbols = getAdjacentSymbols(grid, index);
      const destroyedSymbols = adjacentSymbols.filter(
        (symbol) => symbol.id === "human_character"
      );
      return {
        isDestroyed: false,
        bonusValue: 25 * destroyedSymbols.length,
        multiplier: getModifier(grid, index),
      };
    },
  },
  {
    id: "geologist",
    name: "Geologist",
    value: 2,
    rarity: "rare",
    emoji: "👨‍🔬",
    type: ["human", "organism", "doglikes", "scaler"],
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
      return {
        isDestroyed: false,
        bonusValue: destroyedSymbols.length,
        multiplier: getModifier(grid, index),
      };
    },
  },
  {
    id: "golden_egg",
    name: "Golden Egg",
    value: 4,
    rarity: "rare",
    emoji: "🥚",
    type: ["animal", "chickenstuff", "farmerlikes", "omelettestuff"],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "goldfish",
    name: "Goldfish",
    value: 1,
    rarity: "common",
    emoji: "🐠",
    type: ["animal", "organism", "poslikes"],
    effectDescription: "Destroys [<bubble>] Gives 15 coins for each destroyed",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
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
          bonusValue: 15 * bubbleCount,
          multiplier,
        };
      }

      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "golem",
    name: "Golem",
    value: 0,
    rarity: "uncommon",
    emoji: "🗿",
    type: ["organism", "time_machine", "destroyable_matryoshka"],
    counter: 0,
    effectDescription:
      "Destroys itself after 5 spins. Adds 5 [<ore>] when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const counter = grid[index]?.counter || 0;

      if (counter >= 5) {
        return {
          isDestroyed: true,
          bonusValue: 0,
          multiplier,
          add: ["ore", "ore", "ore", "ore", "ore"],
        };
      }

      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "ore",
    name: "Ore",
    value: 1,
    rarity: "common",
    emoji: "🪨",
    type: ["ore", "anvillikes", "archlikes", "minerlikes", "kyle", "gem"],
    effectDescription:
      "Adds [<void_stone><amethyst><pearl><shiny_pebble><sapphire><emerald><ruby><diamond>] when destroyed.",
    // Destruction effect handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);

      if (isDestroyed) {
        const chooseArray = ["void_stone", "emerald", "ruby"];
        return {
          isDestroyed,
          bonusValue: 0,
          multiplier,
          add: [
            chooseArray[Math.floor(Math.random() * chooseArray.length)],
            chooseArray[Math.floor(Math.random() * chooseArray.length)],
          ],
        };
      }

      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "goose",
    name: "Goose",
    value: 1,
    rarity: "common",
    emoji: "🦢",
    type: ["animal", "organism", "bird", "spawner0", "triggerchance"],
    effectDescription: "Has a 1% chance of adding [<golden_egg>]",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const random = Math.random();

      if (random < 0.01) {
        return {
          isDestroyed: false,
          bonusValue: 0,
          multiplier,
          add: ["golden_egg"],
        };
      }

      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "hearts",
    name: "Hearts",
    value: 1,
    rarity: "uncommon",
    emoji: "♥️",
    type: ["suit", "counted"],
    effectDescription:
      "Adjacent [<diamonds><hearts>] give +1 coin. <br> +1 coin if there are at least 3 [<diamonds><hearts><clubs><spades>]",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Count card symbols
      const multiplier = getModifier(grid, index);
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
        bonusValue: cardCount >= 3 ? 1 : 0,
        multiplier,
      };
    },
  },
  {
    id: "honey",
    name: "Honey",
    value: 3,
    rarity: "rare",
    emoji: "🍯",
    type: ["food", "beelikes"],
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed, bonusValue: 0, multiplier };
    },
  },
  {
    id: "hooligan",
    name: "Hooligan",
    value: 2,
    rarity: "uncommon",
    emoji: "🧔",
    type: ["human", "organism", "doglikes"],
    effectDescription:
      "Destroys [<urn><big_urn><tomb>] Gives 6 coins for each destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
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
          bonusValue: 6 * destroyedCount,
          multiplier,
        };
      }

      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "item_capsule",
    name: "Item Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    type: ["capsule"],
    effectDescription:
      "Destroys itself. <br><br> Adds 1 common item when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const isDestroyed = getIsDestroyed(grid, index);
      const commonItem = getRandomSymbol(0, "common");
      return {
        isDestroyed: true,
        bonusValue: 0,
        multiplier: 0,
        add: [commonItem.id],
      };
    },
  },
  {
    id: "joker",
    name: "Joker",
    value: 3,
    rarity: "rare",
    emoji: "🃏",
    type: ["human", "organism", "doglikes", "funny"],
    effectDescription:
      "Adjacent Clubs, Diamonds, Hearts and Spades give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      // Multiplier effect handled in game logic
      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "key",
    name: "Key",
    value: 1,
    rarity: "common",
    emoji: "🔑",
    type: [],
    effectDescription:
      "Destroys [<lockbox><safe><treasure_chest><mega_chest>] Destroys itself afterwards.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
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
        return {
          isDestroyed: true,
          bonusValue: 0,
          multiplier,
        };
      }

      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "king_midas",
    name: "King Midas",
    value: 1,
    rarity: "rare",
    emoji: "👑",
    type: ["human", "organism", "doglikes"],
    effectDescription: "Adds Coin each spin. Adjacent Coin give 3x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      // Coin addition handled in game logic
      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
        add: ["coin"],
      };
    },
  },
  {
    id: "lockbox",
    name: "Lockbox",
    value: 1,
    rarity: "common",
    emoji: "🔒",
    type: ["chest", "box", "piratelikes"],
    effectDescription: "Gives Coin 15 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return {
        isDestroyed,
        bonusValue: isDestroyed ? 15 : 0,
        multiplier,
      };
    },
  },
  {
    id: "magic_key",
    name: "Magic Key",
    value: 2,
    rarity: "rare",
    emoji: "🗝️",
    type: [],
    effectDescription:
      "Destroys adjacent Lockbox, Safe, Treasure Chest and Mega Chest. Symbols destroyed this way give 3x more Coin. Destroys itself afterward.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
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
        return {
          isDestroyed: true,
          bonusValue: totalBonus,
          multiplier,
        };
      }

      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "matryoshka_doll",
    name: "Matryoshka Doll",
    value: 0,
    rarity: "uncommon",
    emoji: "🪆",
    type: ["time_machine", "destroyable_matryoshka"],
    counter: 0,
    effectDescription:
      "Destroys itself after 3 spins. <br><br> Adds 2 [<matryoshka_doll>]  when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const counter = grid[index]?.counter || 0;

      if (counter >= 3) {
        return {
          isDestroyed: true,
          bonusValue: 0,
          multiplier: 0,
          add: ["matryoshka_doll", "matryoshka_doll"],
        };
      }

      return { isDestroyed: false, bonusValue: 0, multiplier: 0 };
    },
  },
  {
    id: "thief",
    name: "Thief",
    value: -1,
    rarity: "uncommon",
    emoji: "🦹",
    type: ["human", "organism", "doglikes", "box", "robinlikes"],
    counter: 0,
    effectDescription:
      "Counter store +4 coins per spin.<br><br> Gives all stored coins when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      // Check if adjacent to Bounty Hunter or Banana Peel
      const adjacentIndices = getAdjacentIndices(index);
      const currentCounter = grid[index]?.counter || 0;

      for (const adjIndex of adjacentIndices) {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol) {
          // If adjacent to Bounty Hunter, get destroyed and give coins based on counter
          if (adjSymbol.id === "bounty_hunter") {
            return {
              isDestroyed: true,
              bonusValue: currentCounter * 4,
              multiplier: 0,
            };
          }
          // If adjacent to Banana Peel, get destroyed and give coins based on counter
          if (adjSymbol.id === "banana_peel") {
            return {
              isDestroyed: true,
              bonusValue: currentCounter * 4,
              multiplier: 0,
            };
          }
        }
      }

      // If not destroyed, return normal state
      return { isDestroyed: false, bonusValue: 0, multiplier: 0 };
    },
  },
  {
    id: "three_sided_die",
    name: "Three-Sided Die",
    value: 0, // Variable value
    rarity: "common",
    emoji: "🎲",
    type: [],
    effectDescription: "Gives between Coin 1 and Coin 3 randomly.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      return {
        isDestroyed: false,
        bonusValue: calculateBonusValue(
          Math.floor(Math.random() * 3) + 1,
          getModifier(grid, index)
        ),
        multiplier: 0,
      };
    },
  },
  {
    id: "toddler",
    name: "Toddler",
    value: 1,
    rarity: "common",
    emoji: "👶",
    type: ["human", "organism", "doglikes", "funny", "halloween"],
    effectDescription:
      "Destroys adjacent [<present><candy><piñata><bubble>] Gives 6 coins for each destroyed",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
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
          bonusValue: 6 * destroyedCount,
          multiplier,
        };
      }

      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "tomb",
    name: "Tomb",
    value: 3,
    rarity: "rare",
    emoji: "🪦",
    type: ["spiritbox", "darkhumor", "spawner0", "triggerchance"],
    effectDescription:
      "Has a 6% chance of adding Spirit. Adds 4 Spirit when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const random = Math.random();
      const isDestroyed = getIsDestroyed(grid, index);

      if (isDestroyed) {
        return {
          isDestroyed,
          bonusValue: 4,
          multiplier,
          add: ["spirit", "spirit", "spirit", "spirit"],
        };
      }

      if (random < 0.06) {
        return {
          isDestroyed: false,
          bonusValue: 3,
          multiplier,
          add: ["spirit"],
        };
      }

      return {
        isDestroyed: false,
        bonusValue: 3,
        multiplier,
      };
    },
  },
  {
    id: "treasure_chest",
    name: "Treasure Chest",
    value: 2,
    rarity: "rare",
    emoji: "🧰",
    type: ["chest", "box", "piratelikes"],
    effectDescription: "Gives Coin 50 when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);

      return {
        isDestroyed,
        multiplier,
        bonusValue: 50,
      };
    },
  },
  {
    id: "turtle",
    name: "Turtle",
    value: 0,
    rarity: "common",
    emoji: "🐢",
    type: ["animal", "organism", "slow", "poslikes"],
    counter: 0,
    effectDescription: "Counter +4 coins every 3 spins.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const counter = grid[index]?.counter || 0;

      if (counter % 3 === 2) {
        // Every 3rd spin (0-indexed counter)
        return {
          isDestroyed: false,
          bonusValue: 4,
          multiplier,
        };
      }

      return { isDestroyed: false, bonusValue: 0, multiplier };
    },
  },
  {
    id: "urn",
    name: "Urn",
    value: 1,
    rarity: "common",
    emoji: "⚱️",
    type: ["spiritbox", "darkhumor"],
    effectDescription: "Adds [<spirit>] when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const isDestroyed = getIsDestroyed(grid, index);
      return {
        isDestroyed,
        bonusValue: 0,
        multiplier,
        add: isDestroyed ? ["spirit"] : [],
      };
    },
  },
  {
    id: "spirit",
    name: "Spirit",
    value: 6,
    rarity: "rare",
    emoji: "👻",
    type: ["witchlikes", "counted"],
    effectDescription: "Destroys itself after giving Coin 4 times.",
    // Self-destruction handled in game logic
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const counter = grid[index]?.counter || 0;

      if (counter >= 4) {
        return {
          isDestroyed: true,
          bonusValue: 6,
          multiplier,
        };
      }

      return { isDestroyed: false, bonusValue: 0, multiplier };
    },
  },
  {
    id: "void_creature",
    name: "Void Creature",
    value: 0,
    rarity: "uncommon",
    emoji: "👾",
    type: ["void", "organism", "animal", "box"],
    effectDescription:
      "Adjacent empty cells give 1 coin. <br><br> Destroys itself if NO adjacent empty cells. <br><br>Gives 8 coins when destroyed.",
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
        return { isDestroyed: true, bonusValue: 8, multiplier: 0 };
      }

      return { isDestroyed: false, bonusValue: emptyCount, multiplier: 0 };
    },
  },
  {
    id: "void_fruit",
    name: "Void Fruit",
    value: 0,
    rarity: "uncommon",
    emoji: "🍎",
    type: ["fruit", "void", "food", "plant", "farmerlikes", "box"],
    effectDescription:
      "Adjacent empty cells give 1 coin. <br><br> Destroys itself if NO adjacent empty cells. <br><br>Gives 8 coins when destroyed.",
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
        return { isDestroyed: true, bonusValue: 8, multiplier: 0 };
      }

      return { isDestroyed: false, bonusValue: emptyCount, multiplier: 0 };
    },
  },
  {
    id: "void_stone",
    name: "Void Stone",
    value: 0,
    rarity: "uncommon",
    emoji: "🌑",
    type: ["ore", "void", "gem", "box"],
    effectDescription:
      "Adjacent empty cells give 1 coin. <br><br> Destroys itself if NO adjacent empty cells. <br><br>Gives 8 coins when destroyed.",
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
        return { isDestroyed: true, bonusValue: 8, multiplier: 0 };
      }

      return { isDestroyed: false, bonusValue: emptyCount, multiplier: 0 };
    },
  },
  {
    id: "watermelon",
    name: "Watermelon",
    value: 4,
    rarity: "very_rare",
    type: ["fruit", "food", "plant", "farmerlikes", "counted", "eachother"],
    emoji: "🍉",
    effectDescription: "Gives Coin 1 more for each other Watermelon.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      let watermelonCount = 0;

      grid.forEach((symbol, i) => {
        if (i !== index && symbol && symbol.id === "watermelon") {
          watermelonCount++;
        }
      });

      return {
        isDestroyed: false,
        bonusValue: watermelonCount,
        multiplier: getModifier(grid, index),
      };
    },
  },
  {
    id: "wealthy_capsule",
    name: "Wealthy Capsule",
    value: 0,
    rarity: "uncommon",
    emoji: "💊",
    type: ["capsule", "box"],
    effectDescription:
      "Destroys itself. <br><br>Gives 10 coins when destroyed.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const isDestroyed = getIsDestroyed(grid, index);
      return { isDestroyed: true, bonusValue: 10, multiplier: 0 };
    },
  },
  {
    id: "wildcard",
    name: "Wildcard",
    value: 0, // Variable value
    rarity: "very_rare",
    emoji: "🃏",
    type: [],
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

      return {
        isDestroyed: false,
        bonusValue: highestValue,
        multiplier: getModifier(grid, index),
      };
    },
  },
  {
    id: "wine",
    name: "Wine",
    value: 2,
    rarity: "uncommon",
    emoji: "🍷",
    type: [
      "food",
      "booze",
      "anvillikes",
      "dwarflikes",
      "darkhumor",
      "richlikes",
    ],
    counter: 0,
    effectDescription: "Counter +1 coin permanently after 8 spins.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const counter = grid[index]?.counter || 0;
      return {
        isDestroyed:  getIsDestroyed(grid, index),
        bonusValue: counter % 8,
        multiplier,
      };
    },
  },
  {
    id: "witch",
    name: "Witch",
    value: 2,
    rarity: "rare",
    emoji: "🧙‍♀️",
    type: ["human", "organism", "doglikes", "fossillikes"],
    effectDescription:
      "Adjacent Cat, Owl, Crow, Apple, Hex symbols, Eldritch Creature and Spirit give 2x more Coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      // Multiplier effect handled in game logic
      return {
        isDestroyed: false,
        bonusValue: 0,
        multiplier,
      };
    },
  },
  {
    id: "wolf",
    name: "Wolf",
    value: 2,
    rarity: "uncommon",
    emoji: "🐺",
    type: ["animal", "organism", "night"],
    effectDescription: "Adjacent animals give 1 coin.",
    effect: function (grid: (Symbol | null)[], index: number): effectResult {
      const multiplier = getModifier(grid, index);
      const adjacentSymbols = getAdjacentSymbols(grid, index);
      let animalCount = 0;

      adjacentSymbols.forEach((symbol) => {
        if (symbol && symbol.type.includes("animal")) {
          animalCount++;
        }
      });

      return {
        isDestroyed: false,
        bonusValue: 2 + animalCount,
        multiplier,
      };
    },
  },
];
