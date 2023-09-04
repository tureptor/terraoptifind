/** @enum {string} */
const Biome = {
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

const baseBiomes = ["Forest", "Hallow", "Caverns", "Desert", "Jungle", "Ocean", "Snow", "Mushroom"];
const biomes1 = [["Forest"], ["Hallow"], ["Caverns"], ["Desert"], ["Jungle"], ["Ocean"], ["Snow"], ["Mushroom"]];

const biomes2Natural = [["Hallow", "Caverns"], ["Caverns", "Desert"], ["Caverns", "Jungle"], ["Caverns", "Ocean"], ["Caverns", "Snow"], ["Caverns", "Mushroom"]];
const biomes2Easy = [["Hallow", "Desert"], ["Hallow", "Jungle"], ["Hallow", "Snow"], ["Hallow", "Mushroom"]];
const biomes2Rest = [["Hallow", "Ocean"], ["Desert", "Jungle"], ["Desert", "Mushroom"], ["Desert", "Snow"], ["Desert", "Mushroom"], ["Jungle", "Ocean"], ["Jungle", "Snow"], ["Jungle", "Mushroom"], ["Ocean", "Snow"], ["Ocean", "Mushroom"], ["Snow", "Mushroom"]];

const biomes3Easy = [["Hallow", "Caverns", "Desert"], ["Hallow", "Caverns", "Snow"], ["Hallow", "Desert", "Ocean"], ["Caverns", "Jungle", "Mushroom"]];

const biomes3Rest = [["Hallow", "Caverns", "Jungle"], ["Hallow", "Desert", "Jungle"], ["Hallow", "Caverns", "Mushroom"], ["Hallow", "Desert", "Snow"], ["Hallow", "Desert", "Mushroom"], ["Hallow", "Jungle", "Ocean"], ["Hallow", "Jungle", "Snow"], ["Caverns", "Desert", "Jungle"], ["Hallow", "Jungle", "Mushroom"], ["Hallow", "Ocean", "Snow"], ["Caverns", "Desert", "Snow"], ["Caverns", "Desert", "Mushroom"], ["Hallow", "Ocean", "Mushroom"], ["Caverns", "Jungle", "Snow"], ["Hallow", "Snow", "Mushroom"], ["Desert", "Jungle", "Snow"], ["Caverns", "Snow", "Mushroom"], ["Desert", "Jungle", "Mushroom"], ["Desert", "Snow", "Mushroom"], ["Jungle", "Ocean", "Snow"], ["Jungle", "Ocean", "Mushroom"], ["Jungle", "Snow", "Mushroom"], ["Ocean", "Snow", "Mushroom"]];

/**
 * @typedef {Object} NPCInfo
 * @prop {Biome} biome_loved - NPC's most preferred biome
 * @prop {Biome} biome_liked - NPC's preferred biome
 * @prop {Biome} biome_disliked - NPC's unpreferred biome
 * @prop {Biome} biome_hated - NPC's most unpreferred biome
 * @prop {(keyof npcdict)[]} loves - NPC's loved NPCs
 * @prop {(keyof npcdict)[]} likes - NPC's liked NPCs
 * @prop {(keyof npcdict)[]} dislikes - NPC's disliked NPCs
 * @prop {(keyof npcdict)[]} hates - NPC's hated NPCs
 * @prop {number} weighting - How much we care about this NPC
 * @prop {string} mod - Which mod (or vanilla) this NPC is from
 */

/** @type {Record<string, NPCInfo>} */
var npcdict = {
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
        likes: [],
        dislikes: [],
        hates: [],
        weighting: 1.0,
        mod: 'Terraria',
    }
};
