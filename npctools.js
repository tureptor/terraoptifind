// take in name of one npc, biome, and neighbours (list of names of npcs)
// return happiness of the one npc (pricing modifier) multiplied by the npc's weight
/**
 * @param {keyof typeof npcdict} name 
 * @param {Biome[]} biome 
 * @param {(keyof typeof npcdict)[]} townNpcs 
 */
function oneHappiness(name, biome, townNpcs) {
  let happ = 1.0;
  let npc = npcdict[name];


  if (name === "Princess") {
    if (townNpcs.length < 2) { return 1.5 * npc.weighting; }
    happ *= Math.pow(0.88, Math.min(3, townNpcs.length));
    return +Math.max(happ, 0.75).toFixed(2) * npc.weighting;
  }


  // crowdedness
  // Since 1.4.3.3, crowded penalties start at 5 and solitude ends at 3
  if (townNpcs.length >= 5) {
    happ *= 1.05 ** (townNpcs.length - 3);
  } else if (townNpcs.length <= 3) {
    happ *= 0.95;
  }

  // right biome
  if (biome.includes(npc.biome_loved)) {
    happ *= 0.88;
  } else if (biome.includes(npc.biome_liked)) {
    happ *= 0.94;
  }
  // wrong biome
  else if (biome.includes(npc.biome_disliked)) {
    happ *= 1.06;
  } else if (biome.includes(npc.biome_hated)) {
    happ *= 1.12;
  }

  // neighbours
  for (const n of townNpcs) {
    if (name == n) {
      continue;
    }
    if (npc.loves.includes(n)) {
      happ *= 0.88;
    } else if (npc.likes.includes(n) || n === "Princess") {
      happ *= 0.94;
    } else if (npc.dislikes.includes(n)) {
      happ *= 1.06;
    } else if (npc.hates.includes(n)) {
      happ *= 1.12;
    }
  }

  // enforce upper/lower bound on happiness
  happ = Math.min(1.5, happ);
  happ = Math.max(0.75, happ);

  // round to 2dp
  // weighting is how much we care about that npc
  return +happ.toFixed(2) * npc.weighting;
}


/** @param {Iterable<(keyof typeof npcdict)>} group */
function sumOfWeights(group) {
  let totalWeight = 0;
  for (const person of group) {
    totalWeight += npcdict[person].weighting;
  }
  return totalWeight;
}

// input group of names of npcs
// return array of the biome(s) which minimise happiness
/**
 * @param {(keyof typeof npcdict)[]} group
 * @returns {Biome[][]} Best biomes
 */
function bestBiomesForGroup(group) {
  let lowestHappinessSoFar = Infinity;
  let bestBiomesSoFar = [];
  for (const biome of biomes) {
    // Skip any biome configuration where the truffle is improperly housed
    // Technically mods (like Fargo's) allow us to misplace the truffle
    // but it doesn't really matter that much
    if (!allowMisplacedTruffle && group.includes("Truffle") && (!biome.includes("Mushroom") || biome.includes("Caverns"))) { continue; }
    let thisBiomeHappiness = 0.0;
    for (const person of group) {
      thisBiomeHappiness += oneHappiness(person, biome, group);
    }
    thisBiomeHappiness = +thisBiomeHappiness.toFixed(8);
    if (thisBiomeHappiness < lowestHappinessSoFar) {
      bestBiomesSoFar = [biome];
      lowestHappinessSoFar = thisBiomeHappiness;
    } else if (thisBiomeHappiness === lowestHappinessSoFar) {
      bestBiomesSoFar.push(biome);
    }
  }
  return bestBiomesSoFar;
}

/** 
 * @param {(keyof typeof npcdict)[]} group
 * @returns {[number, number, Biome[][]]} Average happiness, total group weight, best biomes
 */
function groupHappWeightBiomes(group) {
  let bestBiomes = bestBiomesForGroup(group);
  let thisGroupHappiness = 0.0;

  for (const person of group) {
    thisGroupHappiness += oneHappiness(person, bestBiomes[0], group);
  }

  return [thisGroupHappiness / sumOfWeights(group), sumOfWeights(group), bestBiomes];
}
