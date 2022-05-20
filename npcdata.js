const baseBiomes = ["Forest", "Hallow","Caverns","Desert","Jungle","Ocean","Snow","Mushroom"]
const biomes1 = [["Forest"], ["Hallow"], ["Caverns"], ["Desert"], ["Jungle"], ["Ocean"], ["Snow"], ["Mushroom"]]
const biomes2Natural = [["Forest","Caverns"], ["Forest","Ocean"], ["Hallow","Caverns"], ["Caverns","Desert"],["Caverns","Jungle"],["Caverns","Ocean"],["Caverns","Snow"],["Caverns","Mushroom"]]
const biomes2Easy = [["Hallow","Desert"],["Hallow","Desert","Ocean"], ["Hallow","Jungle"], ["Hallow","Snow"], ["Hallow","Mushroom"]]
const biomes2Rest = [["Hallow","Ocean"], ["Desert","Jungle"], ["Desert","Mushroom"], ["Jungle","Ocean"], ["Jungle","Snow"], ["Jungle","Mushroom"], ["Ocean","Snow"], ["Ocean","Mushroom"], ["Snow","Mushroom"]]
var npcdict = {
    "Guide": {
        "biome_liked": "Forest",
        "biome_disliked": "Ocean",
        "loves": [],
        "likes": [
            "Clothier",
            "Zoologist"
        ],
        "dislikes": [
            "Steampunker"
        ],
        "hates": [
            "Painter"
        ],
        "weighting": 1.0
    },
    "Merchant": {
        "biome_liked": "Forest",
        "biome_disliked": "Desert",
        "loves": [],
        "likes": [
            "Golfer",
            "Nurse"
        ],
        "dislikes": [
            "Tax Collector"
        ],
        "hates": [
            "Angler"
        ],
        "weighting": 1.0
    },
    "Zoologist": {
        "biome_liked": "Forest",
        "biome_disliked": "Desert",
        "loves": [
            "Witch Doctor"
        ],
        "likes": [
            "Golfer"
        ],
        "dislikes": [
            "Angler"
        ],
        "hates": [
            "Arms Dealer"
        ],
        "weighting": 1.0
    },
    "Golfer": {
        "biome_liked": "Forest",
        "biome_disliked": "Caverns",
        "loves": [
            "Angler"
        ],
        "likes": [
            "Painter",
            "Zoologist"
        ],
        "dislikes": [
            "Pirate"
        ],
        "hates": [
            "Merchant"
        ],
        "weighting": 1.0
    },
    "Nurse": {
        "biome_liked": "Hallow",
        "biome_disliked": "Snow",
        "loves": [
            "Arms Dealer"
        ],
        "likes": [
            "Wizard"
        ],
        "dislikes": [
            "Dryad",
            "Party Girl"
        ],
        "hates": [
            "Zoologist"
        ],
        "weighting": 1.0
    },
    "Tavernkeep": {
        "biome_liked": "Hallow",
        "biome_disliked": "Snow",
        "loves": [
            "Demolitionist"
        ],
        "likes": [
            "Goblin Tinkerer"
        ],
        "dislikes": [
            "Guide"
        ],
        "hates": [
            "Dye Trader"
        ],
        "weighting": 1.0
    },
    "Party Girl": {
        "biome_liked": "Hallow",
        "biome_disliked": "Caverns",
        "loves": [
            "Wizard",
            "Zoologist"
        ],
        "likes": [
            "Stylist"
        ],
        "dislikes": [
            "Merchant"
        ],
        "hates": [
            "Tax Collector"
        ],
        "weighting": 1.0
    },
    "Wizard": {
        "biome_liked": "Hallow",
        "biome_disliked": "Ocean",
        "loves": [
            "Golfer"
        ],
        "likes": [
            "Merchant"
        ],
        "dislikes": [
            "Witch Doctor"
        ],
        "hates": [
            "Cyborg"
        ],
        "weighting": 1.0
    },
    "Demolitionist": {
        "biome_liked": "Caverns",
        "biome_disliked": "Ocean",
        "loves": [
            "Tavernkeep"
        ],
        "likes": [
            "Mechanic"
        ],
        "dislikes": [
            "Arms Dealer",
            "Goblin Tinkerer"
        ],
        "hates": [],
        "weighting": 1.0
    },
    "Goblin Tinkerer": {
        "biome_liked": "Caverns",
        "biome_disliked": "Jungle",
        "loves": [
            "Mechanic"
        ],
        "likes": [
            "Dye Trader"
        ],
        "dislikes": [
            "Clothier"
        ],
        "hates": [
            "Stylist"
        ],
        "weighting": 1.0
    },
    "Clothier": {
        "biome_liked": "Caverns",
        "biome_disliked": "Hallow",
        "loves": [
            "Truffle"
        ],
        "likes": [
            "Tax Collector"
        ],
        "dislikes": [
            "Nurse"
        ],
        "hates": [
            "Mechanic"
        ],
        "weighting": 1.0
    },
    "Dye Trader": {
        "biome_liked": "Desert",
        "biome_disliked": "Forest",
        "loves": [],
        "likes": [
            "Arms Dealer",
            "Painter"
        ],
        "dislikes": [
            "Steampunker"
        ],
        "hates": [
            "Pirate"
        ],
        "weighting": 1.0
    },
    "Arms Dealer": {
        "biome_liked": "Desert",
        "biome_disliked": "Snow",
        "loves": [
            "Nurse"
        ],
        "likes": [
            "Steampunker"
        ],
        "dislikes": [
            "Golfer"
        ],
        "hates": [
            "Demolitionist"
        ],
        "weighting": 1.0
    },
    "Steampunker": {
        "biome_liked": "Desert",
        "biome_disliked": "Jungle",
        "loves": [
            "Cyborg"
        ],
        "likes": [
            "Painter"
        ],
        "dislikes": [
            "Dryad",
            "Wizard",
            "Party Girl"
        ],
        "hates": [],
        "weighting": 1.0
    },
    "Dryad": {
        "biome_liked": "Jungle",
        "biome_disliked": "Desert",
        "loves": [],
        "likes": [
            "Witch Doctor",
            "Truffle"
        ],
        "dislikes": [
            "Angler"
        ],
        "hates": [
            "Golfer"
        ],
        "weighting": 1.0
    },
    "Painter": {
        "biome_liked": "Jungle",
        "biome_disliked": "Forest",
        "loves": [
            "Dryad"
        ],
        "likes": [
            "Party Girl"
        ],
        "dislikes": [
            "Truffle",
            "Cyborg"
        ],
        "hates": [],
        "weighting": 1.0
    },
    "Witch Doctor": {
        "biome_liked": "Jungle",
        "biome_disliked": "Hallow",
        "loves": [],
        "likes": [
            "Dryad",
            "Guide"
        ],
        "dislikes": [
            "Nurse"
        ],
        "hates": [
            "Truffle"
        ],
        "weighting": 1.0
    },
    "Stylist": {
        "biome_liked": "Ocean",
        "biome_disliked": "Snow",
        "loves": [
            "Dye Trader"
        ],
        "likes": [
            "Pirate"
        ],
        "dislikes": [
            "Tavernkeep"
        ],
        "hates": [
            "Goblin Tinkerer"
        ],
        "weighting": 1.0
    },
    "Angler": {
        "biome_liked": "Ocean",
        "biome_disliked": "Desert",
        "loves": [],
        "likes": [
            "Demolitionist",
            "Party Girl",
            "Tax Collector"
        ],
        "dislikes": [],
        "hates": [
            "Tavernkeep"
        ],
        "weighting": 1.0
    },
    "Pirate": {
        "biome_liked": "Ocean",
        "biome_disliked": "Caverns",
        "loves": [
            "Angler"
        ],
        "likes": [
            "Tavernkeep"
        ],
        "dislikes": [
            "Stylist"
        ],
        "hates": [
            "Guide"
        ],
        "weighting": 1.0
    },
    "Mechanic": {
        "biome_liked": "Snow",
        "biome_disliked": "Caverns",
        "loves": [
            "Goblin Tinkerer"
        ],
        "likes": [
            "Cyborg"
        ],
        "dislikes": [
            "Arms Dealer"
        ],
        "hates": [
            "Clothier"
        ],
        "weighting": 1.0
    },
    "Tax Collector": {
        "biome_liked": "Snow",
        "biome_disliked": "Hallow",
        "loves": [
            "Merchant"
        ],
        "likes": [
            "Party Girl"
        ],
        "dislikes": [
            "Demolitionist",
            "Mechanic"
        ],
        "hates": [
            "Santa Claus"
        ],
        "weighting": 1.0
    },
    "Cyborg": {
        "biome_liked": "Snow",
        "biome_disliked": "Jungle",
        "loves": [],
        "likes": [
            "Steampunker",
            "Pirate",
            "Stylist"
        ],
        "dislikes": [
            "Zoologist"
        ],
        "hates": [
            "Wizard"
        ],
        "weighting": 1.0
    },
    "Santa Claus": {
        "biome_liked": "Snow",
        "biome_disliked": "Desert",
        "loves": [],
        "likes": [],
        "dislikes": [],
        "hates": [
            "Tax Collector"
        ],
        "weighting": 1.0
    },
    "Truffle": {
        "biome_liked": "Mushroom",
        "biome_disliked": "",
        "loves": [
            "Guide"
        ],
        "likes": [
            "Dryad"
        ],
        "dislikes": [
            "Clothier"
        ],
        "hates": [
            "Witch Doctor"
        ],
        "weighting": 1.0
    },
    "Princess": {
        "biome_liked": "",
        "biome_disliked": "",
        "loves": [],
        "likes": [],
        "dislikes": [],
        "hates": [],
        "weighting": 1.0
    }
}
