// @ts-check
/** @enum {string} */
const Biome = {
    Space: 'Space',
    Forest: 'Forest',
    Hallow: 'Hallow',
    Caverns: 'Caverns',
    Desert: 'Desert',
    Jungle: 'Jungle',
    Ocean: 'Ocean',
    Snow: 'Snow',
    Mushroom: 'Mushroom',
    None: '',
};

const biomes2Natural = [
    ["Hallow", "Caverns"], ["Caverns", "Desert"], ["Caverns", "Jungle"], ["Caverns", "Ocean"], ["Caverns", "Snow"], ["Caverns", "Mushroom"],
    ['Space', 'Ocean'], ['Space', 'Forest'],
];
const biomes2Easy = [
    ["Hallow", "Desert"], ["Hallow", "Jungle"], ["Hallow", "Snow"], ["Hallow", "Mushroom"],
    ["Hallow", "Space"], ["Space", "Desert"], ["Space", "Jungle"], ["Space", "Snow"], ["Space", "Mushroom"],
];
const biomes2Rest = [
  ["Hallow", "Ocean"], ["Desert", "Jungle"], ["Desert", "Mushroom"], ["Desert", "Snow"], ["Jungle", "Ocean"], ["Jungle", "Snow"],
  ["Jungle", "Mushroom"], ["Ocean", "Snow"], ["Ocean", "Mushroom"], ["Snow", "Mushroom"]
];

const biomes3Easy = [
    ["Hallow", "Caverns", "Desert"], ["Hallow", "Caverns", "Snow"], ["Hallow", "Desert", "Ocean"], ["Caverns", "Jungle", "Mushroom"],
    ["Hallow", "Space", "Desert"], ["Hallow", "Space", "Snow"], ["Space", "Jungle", "Mushroom"],
];
const biomes3Rest = [
  ["Hallow", "Caverns", "Jungle"], ["Hallow", "Desert", "Jungle"], ["Hallow", "Caverns", "Mushroom"], ["Hallow", "Desert", "Snow"],
  ["Hallow", "Desert", "Mushroom"], ["Hallow", "Jungle", "Ocean"], ["Hallow", "Jungle", "Snow"], ["Caverns", "Desert", "Jungle"],
  ["Hallow", "Jungle", "Mushroom"], ["Hallow", "Ocean", "Snow"], ["Caverns", "Desert", "Snow"], ["Caverns", "Desert", "Mushroom"],
  ["Hallow", "Ocean", "Mushroom"], ["Caverns", "Jungle", "Snow"], ["Hallow", "Snow", "Mushroom"], ["Desert", "Jungle", "Snow"],
  ["Caverns", "Snow", "Mushroom"], ["Desert", "Jungle", "Mushroom"], ["Desert", "Snow", "Mushroom"], ["Jungle", "Ocean", "Snow"],
  ["Jungle", "Ocean", "Mushroom"], ["Jungle", "Snow", "Mushroom"], ["Ocean", "Snow", "Mushroom"], ["Hallow", "Caverns", "Ocean"],
  ["Caverns", "Jungle", "Ocean"], ["Caverns", "Ocean", "Snow"], ["Caverns", "Ocean", "Mushroom"]
];

const biomes4Rest = [
  ["Hallow", "Desert", "Ocean", "Snow"], ["Hallow", "Jungle", "Ocean", "Snow"], ["Hallow", "Desert", "Jungle", "Snow"],
  ["Hallow", "Caverns", "Ocean", "Snow"], ["Caverns", "Jungle", "Ocean", "Snow"], ["Hallow", "Caverns", "Desert", "Snow"],
  ["Hallow", "Desert", "Ocean", "Jungle"], ["Caverns", "Desert", "Jungle", "Snow"], ["Hallow", "Caverns", "Jungle", "Snow"],
  ["Hallow", "Ocean", "Snow", "Mushroom"], ["Jungle", "Ocean", "Snow", "Mushroom"], ["Hallow", "Desert", "Snow", "Mushroom"],
  ["Hallow", "Caverns", "Desert", "Ocean"], ["Desert", "Jungle", "Snow", "Mushroom"], ["Hallow", "Jungle", "Snow", "Mushroom"],
  ["Hallow", "Caverns", "Jungle", "Ocean"], ["Caverns", "Ocean", "Snow", "Mushroom"], ["Hallow", "Caverns", "Desert", "Jungle"],
  ["Hallow", "Desert", "Ocean", "Mushroom"], ["Caverns", "Desert", "Snow", "Mushroom"], ["Hallow", "Caverns", "Snow", "Mushroom"],
  ["Hallow", "Jungle", "Ocean", "Mushroom"], ["Caverns", "Jungle", "Snow", "Mushroom"], ["Hallow", "Desert", "Jungle", "Mushroom"],
  ["Hallow", "Caverns", "Ocean", "Mushroom"], ["Caverns", "Jungle", "Ocean", "Mushroom"], ["Hallow", "Caverns", "Desert", "Mushroom"],
  ["Caverns", "Desert", "Jungle", "Mushroom"], ["Hallow", "Caverns", "Jungle", "Mushroom"]
];

const biomes5Rest = [
  ["Hallow", "Desert", "Ocean", "Jungle", "Snow"], ["Hallow", "Caverns", "Desert", "Ocean", "Snow"], ["Hallow", "Caverns", "Jungle", "Ocean", "Snow"],
  ["Hallow", "Caverns", "Desert", "Jungle", "Snow"], ["Hallow", "Desert", "Ocean", "Snow", "Mushroom"],
  ["Hallow", "Jungle", "Ocean", "Snow", "Mushroom"], ["Hallow", "Desert", "Jungle", "Snow", "Mushroom"],
  ["Hallow", "Caverns", "Desert", "Ocean", "Jungle"], ["Hallow", "Caverns", "Ocean", "Snow", "Mushroom"],
  ["Caverns", "Jungle", "Ocean", "Snow", "Mushroom"], ["Hallow", "Caverns", "Desert", "Snow", "Mushroom"],
  ["Hallow", "Desert", "Ocean", "Jungle", "Mushroom"], ["Caverns", "Desert", "Jungle", "Snow", "Mushroom"],
  ["Hallow", "Caverns", "Jungle", "Snow", "Mushroom"], ["Hallow", "Caverns", "Desert", "Ocean", "Mushroom"],
  ["Hallow", "Caverns", "Jungle", "Ocean", "Mushroom"], ["Hallow", "Caverns", "Desert", "Jungle", "Mushroom"]
];

const biomes6Rest = [
  ["Hallow", "Caverns", "Desert", "Ocean", "Jungle", "Snow"], ["Hallow", "Desert", "Ocean", "Jungle", "Snow", "Mushroom"],
  ["Hallow", "Caverns", "Desert", "Ocean", "Snow", "Mushroom"], ["Hallow", "Caverns", "Jungle", "Ocean", "Snow", "Mushroom"],
  ["Hallow", "Caverns", "Desert", "Jungle", "Snow", "Mushroom"], ["Hallow", "Caverns", "Desert", "Ocean", "Jungle", "Mushroom"]
];

const biomes7Rest = [["Hallow", "Caverns", "Desert", "Ocean", "Jungle", "Snow", "Mushroom"]];

/**
 * @typedef {Object} NPCInfo
 * @prop {Biome} biome_loved - NPC's most preferred biome
 * @prop {Biome} biome_liked - NPC's preferred biome
 * @prop {Biome} biome_disliked - NPC's unpreferred biome
 * @prop {Biome} biome_hated - NPC's most unpreferred biome
 * @prop {readonly (keyof typeof npcdict)[]} loves - NPC's loved NPCs
 * @prop {readonly (keyof typeof npcdict)[]} likes - NPC's liked NPCs
 * @prop {readonly (keyof typeof npcdict)[]} dislikes - NPC's disliked NPCs
 * @prop {readonly (keyof typeof npcdict)[]} hates - NPC's hated NPCs
 * @prop {number} weighting - How much we care about this NPC
 * @prop {string} mod - Which mod (or vanilla) this NPC is from
 */


var npcdict = /** @type {const} */ ({
    Guide: {
        biome_loved: Biome.None,
        biome_liked: Biome.Forest,
        biome_disliked: Biome.Ocean,
        biome_hated: Biome.None,
        loves: [],
        likes: [
            "Clothier",
            "Zoologist",
        ],
        dislikes: [
            "Steampunker",
        ],
        hates: [
            "Painter",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Merchant: {
        biome_loved: Biome.None,
        biome_liked: Biome.Forest,
        biome_disliked: Biome.Desert,
        biome_hated: Biome.None,
        loves: [],
        likes: [
            "Golfer",
            "Nurse",
        ],
        dislikes: [
            "Tax Collector",
        ],
        hates: [
            "Angler",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Zoologist: {
        biome_loved: Biome.None,
        biome_liked: Biome.Forest,
        biome_disliked: Biome.Desert,
        biome_hated: Biome.None,
        loves: [
            "Witch Doctor",
        ],
        likes: [
            "Golfer",
        ],
        dislikes: [
            "Angler",
        ],
        hates: [
            "Arms Dealer",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Golfer: {
        biome_loved: Biome.None,
        biome_liked: Biome.Forest,
        biome_disliked: Biome.Caverns,
        biome_hated: Biome.None,
        loves: [
            "Angler",
        ],
        likes: [
            "Painter",
            "Zoologist",
        ],
        dislikes: [
            "Pirate",
        ],
        hates: [
            "Merchant",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Nurse: {
        biome_loved: Biome.None,
        biome_liked: Biome.Hallow,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: [
            "Arms Dealer",
        ],
        likes: [
            "Wizard",
        ],
        dislikes: [
            "Dryad",
            "Party Girl",
        ],
        hates: [
            "Zoologist",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Tavernkeep: {
        biome_loved: Biome.None,
        biome_liked: Biome.Hallow,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: [
            "Demolitionist",
        ],
        likes: [
            "Goblin Tinkerer",
        ],
        dislikes: [
            "Guide",
        ],
        hates: [
            "Dye Trader",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    "Party Girl": {
        biome_loved: Biome.None,
        biome_liked: Biome.Hallow,
        biome_disliked: Biome.Caverns,
        biome_hated: Biome.None,
        loves: [
            "Wizard",
            "Zoologist",
        ],
        likes: [
            "Stylist",
        ],
        dislikes: [
            "Merchant",
        ],
        hates: [
            "Tax Collector",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Wizard: {
        biome_loved: Biome.None,
        biome_liked: Biome.Hallow,
        biome_disliked: Biome.Ocean,
        biome_hated: Biome.None,
        loves: [
            "Golfer",
        ],
        likes: [
            "Merchant",
        ],
        dislikes: [
            "Witch Doctor",
        ],
        hates: [
            "Cyborg",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Demolitionist: {
        biome_loved: Biome.None,
        biome_liked: Biome.Caverns,
        biome_disliked: Biome.Ocean,
        biome_hated: Biome.None,
        loves: [
            "Tavernkeep",
        ],
        likes: [
            "Mechanic",
        ],
        dislikes: [
            "Arms Dealer",
            "Goblin Tinkerer",
        ],
        hates: [],
        weighting: 1.0,
        mod: 'Terraria',
    },
    "Goblin Tinkerer": {
        biome_loved: Biome.None,
        biome_liked: Biome.Caverns,
        biome_disliked: Biome.Jungle,
        biome_hated: Biome.None,
        loves: [
            "Mechanic",
        ],
        likes: [
            "Dye Trader",
        ],
        dislikes: [
            "Clothier",
        ],
        hates: [
            "Stylist",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Clothier: {
        biome_loved: Biome.None,
        biome_liked: Biome.Caverns,
        biome_disliked: Biome.Hallow,
        biome_hated: Biome.None,
        loves: [
            "Truffle",
        ],
        likes: [
            "Tax Collector",
        ],
        dislikes: [
            "Nurse",
        ],
        hates: [
            "Mechanic",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    "Dye Trader": {
        biome_loved: Biome.None,
        biome_liked: Biome.Desert,
        biome_disliked: Biome.Forest,
        biome_hated: Biome.None,
        loves: [],
        likes: [
            "Arms Dealer",
            "Painter",
        ],
        dislikes: [
            "Steampunker",
        ],
        hates: [
            "Pirate",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    "Arms Dealer": {
        biome_loved: Biome.None,
        biome_liked: Biome.Desert,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: [
            "Nurse",
        ],
        likes: [
            "Steampunker",
        ],
        dislikes: [
            "Golfer",
        ],
        hates: [
            "Demolitionist",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Steampunker: {
        biome_loved: Biome.None,
        biome_liked: Biome.Desert,
        biome_disliked: Biome.Jungle,
        biome_hated: Biome.None,
        loves: [
            "Cyborg",
        ],
        likes: [
            "Painter",
        ],
        dislikes: [
            "Dryad",
            "Wizard",
            "Party Girl",
        ],
        hates: [],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Dryad: {
        biome_loved: Biome.None,
        biome_liked: Biome.Jungle,
        biome_disliked: Biome.Desert,
        biome_hated: Biome.None,
        loves: [],
        likes: [
            "Witch Doctor",
            "Truffle",
        ],
        dislikes: [
            "Angler",
        ],
        hates: [
            "Golfer",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Painter: {
        biome_loved: Biome.None,
        biome_liked: Biome.Jungle,
        biome_disliked: Biome.Forest,
        biome_hated: Biome.None,
        loves: [
            "Dryad",
        ],
        likes: [
            "Party Girl",
        ],
        dislikes: [
            "Truffle",
            "Cyborg",
        ],
        hates: [],
        weighting: 1.0,
        mod: 'Terraria',
    },
    "Witch Doctor": {
        biome_loved: Biome.None,
        biome_liked: Biome.Jungle,
        biome_disliked: Biome.Hallow,
        biome_hated: Biome.None,
        loves: [],
        likes: [
            "Dryad",
            "Guide",
        ],
        dislikes: [
            "Nurse",
        ],
        hates: [
            "Truffle",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Stylist: {
        biome_loved: Biome.None,
        biome_liked: Biome.Ocean,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: [
            "Dye Trader",
        ],
        likes: [
            "Pirate",
        ],
        dislikes: [
            "Tavernkeep",
        ],
        hates: [
            "Goblin Tinkerer",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Angler: {
        biome_loved: Biome.None,
        biome_liked: Biome.Ocean,
        biome_disliked: Biome.Desert,
        biome_hated: Biome.None,
        loves: [],
        likes: [
            "Demolitionist",
            "Party Girl",
            "Tax Collector",
        ],
        dislikes: [],
        hates: [
            "Tavernkeep",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Pirate: {
        biome_loved: Biome.None,
        biome_liked: Biome.Ocean,
        biome_disliked: Biome.Caverns,
        biome_hated: Biome.None,
        loves: [
            "Angler",
        ],
        likes: [
            "Tavernkeep",
        ],
        dislikes: [
            "Stylist",
        ],
        hates: [
            "Guide",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Mechanic: {
        biome_loved: Biome.None,
        biome_liked: Biome.Snow,
        biome_disliked: Biome.Caverns,
        biome_hated: Biome.None,
        loves: [
            "Goblin Tinkerer",
        ],
        likes: [
            "Cyborg",
        ],
        dislikes: [
            "Arms Dealer",
        ],
        hates: [
            "Clothier",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    "Tax Collector": {
        biome_loved: Biome.None,
        biome_liked: Biome.Snow,
        biome_disliked: Biome.Hallow,
        biome_hated: Biome.None,
        loves: [
            "Merchant",
        ],
        likes: [
            "Party Girl",
        ],
        dislikes: [
            "Demolitionist",
            "Mechanic",
        ],
        hates: [
            "Santa Claus",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Cyborg: {
        biome_loved: Biome.None,
        biome_liked: Biome.Snow,
        biome_disliked: Biome.Jungle,
        biome_hated: Biome.None,
        loves: [],
        likes: [
            "Steampunker",
            "Pirate",
            "Stylist",
        ],
        dislikes: [
            "Zoologist",
        ],
        hates: [
            "Wizard",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    "Santa Claus": {
        biome_loved: Biome.Snow,
        biome_liked: Biome.None,
        biome_disliked: Biome.None,
        biome_hated: Biome.Desert,
        loves: [],
        likes: [],
        dislikes: [],
        hates: [
            "Tax Collector",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Truffle: {
        biome_loved: Biome.None,
        biome_liked: Biome.Mushroom,
        biome_disliked: Biome.None,
        biome_hated: Biome.None,
        loves: [
            "Guide",
        ],
        likes: [
            "Dryad",
        ],
        dislikes: [
            "Clothier",
        ],
        hates: [
            "Witch Doctor",
        ],
        weighting: 1.0,
        mod: 'Terraria',
    },
    Princess: {
        biome_loved: Biome.None,
        biome_liked: Biome.None,
        biome_disliked: Biome.None,
        biome_hated: Biome.None,
        loves: [],
        likes: [], // hardcoded to everyone
        dislikes: [],
        hates: [],
        weighting: 1.0,
        mod: 'Terraria',
    },
    "Sea King": {
        biome_loved: Biome.None,
        biome_liked: Biome.Ocean,
        biome_disliked: Biome.Desert,
        biome_hated: Biome.None,
        loves: [],
        likes: ['Pirate'],
        dislikes: ['Demolitionist'],
        hates: ['Angler'],
        weighting: 1.0,
        mod: 'Calamity',
    },
    Bandit: {
        biome_loved: Biome.None,
        biome_liked: Biome.Desert,
        biome_disliked: Biome.Jungle,
        biome_hated: Biome.None,
        loves: [],
        likes: ['Goblin Tinkerer'],
        dislikes: ['Dryad'],
        hates: [],
        weighting: 1.0,
        mod: 'Calamity',
    },
    "Drunk Princess": {
        biome_loved: Biome.Hallow,
        biome_liked: Biome.Ocean,
        biome_disliked: Biome.Desert,
        biome_hated: Biome.Caverns,
        loves: ['Stylist', 'Zoologist'],
        likes: ['Party Girl', 'Truffle'],
        dislikes: ['Tavernkeep', 'Tax Collector'],
        hates: ['Angler', 'Goblin Tinkerer'],
        weighting: 1.0,
        mod: 'Calamity',
    },
    Archmage: {
        biome_loved: Biome.None,
        biome_liked: Biome.Snow,
        biome_disliked: Biome.Desert,
        biome_hated: Biome.None,
        loves: [],
        likes: ['Wizard'],
        dislikes: ['Cyborg'],
        hates: [],
        weighting: 1.0,
        mod: 'Calamity',
    },
    "Brimstone Witch": {
        biome_loved: Biome.None,
        biome_liked: Biome.Forest,
        biome_disliked: Biome.None, // Brimstone Crag, but we never suggest that anyway
        biome_hated: Biome.None,
        loves: [],
        likes: ['Clothier'],
        dislikes: ['Party Girl'],
        hates: [],
        weighting: 1.0,
        mod: 'Calamity',
    },
    Cobbler: {
        biome_loved: Biome.None,
        biome_liked: Biome.Forest,
        biome_disliked: Biome.Ocean,
        biome_hated: Biome.None,
        loves: ['Zoologist', 'Golfer'],
        likes: ['Spiritualist'],
        dislikes: ['Druid', 'Dryad', 'Angler'],
        hates: ['Nurse'],
        weighting: 1.0,
        mod: 'Thorium',
    },
    "Desert Acolyte": {
        biome_loved: Biome.None,
        biome_liked: Biome.Desert,
        biome_disliked: Biome.Jungle,
        biome_hated: Biome.None,
        loves: [],
        likes: ['Nurse', 'Spiritualist'],
        dislikes: ['Pirate'],
        hates: ['Goblin Tinkerer', 'Witch Doctor', 'Weapon Master'],
        weighting: 1.0,
        mod: 'Thorium',
    },
    Cook: {
        biome_loved: Biome.None,
        biome_liked: Biome.Mushroom,
        biome_disliked: Biome.Caverns,
        biome_hated: Biome.None,
        loves: ['Santa Claus'],
        likes: ['Truffle'],
        dislikes: ['Angler'],
        hates: ['Cyborg'],
        weighting: 1.0,
        mod: 'Thorium',
    },
    "Confused Zombie": {
        biome_loved: Biome.None,
        biome_liked: Biome.Forest,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: ['Guide'],
        likes: ['Clothier'],
        dislikes: ['Spiritualist'],
        hates: [],
        weighting: 1.0,
        mod: 'Thorium',
    },
    Blacksmith: {
        biome_loved: Biome.None,
        biome_liked: Biome.Caverns,
        biome_disliked: Biome.None,
        biome_hated: Biome.None,
        loves: ['Demolitionist'],
        likes: ['Weapon Master'],
        dislikes: ['Tracker'],
        hates: [],
        weighting: 1.0,
        mod: 'Thorium',
    },
    Tracker: {
        biome_loved: Biome.None,
        biome_liked: Biome.Snow,
        biome_disliked: Biome.Forest,
        biome_hated: Biome.None,
        loves: ['Tavernkeep'],
        likes: ['Guide', 'Stylist'],
        dislikes: ['Dye Trader'],
        hates: ['Desert Acolyte'],
        weighting: 1.0,
        mod: 'Thorium',
    },
    Diverman: {
        biome_loved: Biome.None,
        biome_liked: Biome.Ocean,
        biome_disliked: Biome.Desert,
        biome_hated: Biome.None,
        loves: ['Party Girl'],
        likes: ['Pirate'],
        dislikes: ['Angler'],
        hates: [],
        weighting: 1.0,
        mod: 'Thorium',
    },
    Druid: {
        biome_loved: Biome.None,
        biome_liked: Biome.Jungle,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: [],
        likes: ['Dryad'],
        dislikes: ['Demolitionist'],
        hates: ['Steampunker'],
        weighting: 1.0,
        mod: 'Thorium',
    },
    Spiritualist: {
        biome_loved: Biome.None,
        biome_liked: Biome.Hallow,
        biome_disliked: Biome.Caverns,
        biome_hated: Biome.None,
        loves: ['Stylist'],
        likes: ['Witch Doctor'],
        dislikes: ['Weapon Master'],
        hates: ['Tax Collector'],
        weighting: 1.0,
        mod: 'Thorium',
    },
    "Weapon Master": {
        biome_loved: Biome.None,
        biome_liked: Biome.Caverns,
        biome_disliked: Biome.Hallow,
        biome_hated: Biome.None,
        loves: ['Tax Collector'],
        likes: ['Goblin Tinkerer', 'Witch Doctor'],
        dislikes: ['Confused Zombie', 'Guide'],
        hates: ['Spiritualist'],
        weighting: 1.0,
        mod: 'Thorium',
    },
    Alchemist: {
        biome_loved: Biome.Caverns,
        biome_liked: Biome.Forest,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: ['Young Brewer'],
        likes: ['Mechanic'],
        dislikes: ['Brewer'],
        hates: [],
        weighting: 1.0,
        mod: 'AlchemistNPC',
    },
    Musician: {
        biome_loved: Biome.Hallow,
        biome_liked: Biome.Caverns,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: ['Party Girl'],
        likes: ['Wizard'],
        dislikes: ['Goblin Tinkerer'],
        hates: [],
        weighting: 1.0,
        mod: 'AlchemistNPC',
    },
    Architect: {
        biome_loved: Biome.Jungle,
        biome_liked: Biome.Ocean,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: ['Painter'],
        likes: ['Goblin Tinkerer'],
        dislikes: ['Tax Collector'],
        hates: [],
        weighting: 1.0,
        mod: 'AlchemistNPC',
    },
    Operator: {
        biome_loved: Biome.Snow,
        biome_liked: Biome.Ocean,
        biome_disliked: Biome.Caverns,
        biome_hated: Biome.None,
        loves: ['Cyborg'],
        likes: ['Steampunker'],
        dislikes: ['Clothier'],
        hates: [],
        weighting: 1.0,
        mod: 'AlchemistNPC',
    },
    Brewer: {
        biome_loved: Biome.Forest,
        biome_liked: Biome.Jungle,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: ['Young Brewer'],
        likes: ['Alchemist'],
        dislikes: ['Witch Doctor'],
        hates: [],
        weighting: 1.0,
        mod: 'AlchemistNPC',
    },
    Tinkerer: {
        biome_loved: Biome.Snow,
        biome_liked: Biome.Caverns,
        biome_disliked: Biome.Desert,
        biome_hated: Biome.None,
        loves: ['Steampunker'],
        likes: ['Mechanic'],
        dislikes: ['Dye Trader'],
        hates: [],
        weighting: 1.0,
        mod: 'AlchemistNPC',
    },
    Jeweller: {
        biome_loved: Biome.Forest,
        biome_liked: Biome.Jungle,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: ['Merchant'],
        likes: ['Tax Collector'],
        dislikes: ['Party Girl'],
        hates: [],
        weighting: 1.0,
        mod: 'AlchemistNPC',
    },
    "Young Brewer": {
        biome_loved: Biome.Forest,
        biome_liked: Biome.Desert,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.None,
        loves: ['Brewer'],
        likes: ['Alchemist'],
        dislikes: ['Goblin Tinkerer'],
        hates: [],
        weighting: 1.0,
        mod: 'AlchemistNPC',
    },
    LumberJack: {
        biome_loved: Biome.Forest,
        biome_liked: Biome.None,
        biome_disliked: Biome.None,
        biome_hated: Biome.None,
        loves: [],
        likes: ['Squirrel'],
        dislikes: ['Dryad'],
        hates: ['Demolitionist'],
        weighting: 1.0,
        mod: "Fargo's Mod",
    },
    Deviantt: {
        biome_loved: Biome.Space,
        biome_liked: Biome.Jungle,
        biome_disliked: Biome.Snow,
        biome_hated: Biome.Desert,
        loves: ['Mutant'],
        likes: ['Abominationn'],
        dislikes: ['Zoologist'],
        hates: ['Angler'],
        weighting: 1.0,
        mod: "Fargo's Mod",
    },
    Abominationn: {
        biome_loved: Biome.Space,
        biome_liked: Biome.Ocean,
        biome_disliked: Biome.None, // Dungeon, but we never suggest that anyway
        biome_hated: Biome.None,
        loves: ['Mutant'],
        likes: ['Deviantt'],
        dislikes: [],
        hates: ['Nurse'],
        weighting: 1.0,
        mod: "Fargo's Mod",
    },
    Mutant: {
        biome_loved: Biome.Space,
        biome_liked: Biome.Forest,
        biome_disliked: Biome.Hallow,
        biome_hated: Biome.None,
        loves: ['Abominationn'],
        likes: ['Deviantt'],
        dislikes: ['LumberJack'],
        hates: [],
        weighting: 1.0,
        mod: "Fargo's Mod",
    },
    Squirrel: {
        biome_loved: Biome.Forest,
        biome_liked: Biome.None,
        biome_disliked: Biome.None,
        biome_hated: Biome.Caverns,
        loves: [],
        likes: ['LumberJack'],
        dislikes: [],
        hates: [],
        weighting: 1.0,
        mod: "Fargo's Mod",
    },
});
// HACK: trigger a type violation if there's a typo. Only triggers down here though, unfortunately
/** @satisfies {Record<any, NPCInfo>} */ (npcdict);

/**@type {Record<string, (keyof typeof npcdict)[]>} */
const modNpcs = {};
for (const [npcName, {mod}] of Object.entries(npcdict)) {
    modNpcs[mod] ??= [];
    modNpcs[mod].push(/** @type {keyof typeof npcdict} */(npcName));
}