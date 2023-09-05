self.importScripts("npcdata.js", "npctools.js");
let biomes = [];
/** @type {Record<string, boolean>} */
let coverageCache = {};
let timeSpen = 0;
let allowMisplacedTruffle = false;

// used to generate all possible npc groups/combinations
// same as itertools.combinations from python
/**
 * @param {number} k 
 * @param {T[]} someArray 
 * @param {number} fromThisIndex 
 * @returns {IterableIterator<[T[], BigInt]>} Group and bitmask
 */
function* combinations(k, someArray, fromThisIndex = 0) {
  if (k === 0) {
    yield [[], 0n];
    return;
  }
  for (let i = fromThisIndex; i < someArray.length - k + 1; i++) {
    for (const [result, mask] of combinations(k - 1, someArray, i + 1)) {
      result.unshift(someArray[i]);
      yield [result, mask | (1n << BigInt(i))];
    }
  }
}

/**
 * @param {number} minGroupSize 
 * @param {number} maxGroupSize 
 * @param {(keyof typeof npcdict)[]} people 
 * @returns {number} Number of entries in the cache table
 */
function cacheSize(minGroupSize, maxGroupSize, people) {
  let n = people.length;
  if (n == 0) {
    return 0;
  }

  // build pascal's triangle so we can do n choose k
  let pascals = [[1]];
  for (let i = 1; i <= n; i++) {
    // add ith row
    let newRow = [1];
    for (let j = 1; j < i; j++) {
      newRow.push(pascals[i - 1][j - 1] + pascals[i - 1][j]);
    }
    newRow.push(1);
    pascals.push(newRow);
  }

  let numOfGroups = 0;
  for (let k = minGroupSize; k <= maxGroupSize; k++) {
    // add n choose k for every k
    numOfGroups += pascals[n][k];
  }
  return numOfGroups;
}

// generates array of all combinations of people such that
// minGroupSize <= combination.length <= maxGroupSize
// each combination is paired with the average happiness, the total weight, and its biome
// array is sorted by average happiness (ascending)
/**
 * @param {number} minGroupSize 
 * @param {number} maxGroupSize 
 * @param {(keyof typeof npcdict)[]} people 
 * @returns {[(keyof typeof npcdict)[], BigInt, number, number, Biome[][]][]} Town NPCs, mask, average happiness, total weight, biomes
 */
function generateArrayOfGroups(minGroupSize, maxGroupSize, people, cacheStart) {
  let totalSize = cacheSize(minGroupSize, maxGroupSize, people);
  const stepSize = Math.trunc(totalSize / 10000);
  /** @type {[(keyof typeof npcdict)[], BigInt, number, number, Biome[][]][]} */
  const arrayOfGroups = [];
  let n = 0;
  for (let groupSize = minGroupSize; groupSize <= maxGroupSize; groupSize++) {
    for (const [group, mask] of combinations(groupSize, people)) {
      let groupInfo = groupHappWeightBiomes(group);
      arrayOfGroups.push([group, mask, ...groupInfo]);
      n++;
      if (n % stepSize === 0) {
        postMessage(["cacheGen", [n / totalSize, ((performance.now() - cacheStart) / 1000).toFixed(3)]]);
      }
    }
  }
  arrayOfGroups.sort((a, b) => a[2] - b[2]);
  console.log(arrayOfGroups);
  return arrayOfGroups;
}

/**
 * @param {BigInt} n 
 * @returns {number}
 */
function countOnes(n) {
  let c = 0;
  while (n > 0n) {
    n &= n - 1n;
    c++;
  }
  return c;
}

// searches for optimal combination of groups
class Searcher {
  #bestCombinationsSoFar = [];
  #bestHappinessSoFar = Infinity;
  /** @type {[(keyof typeof npcdict)[], BigInt, number, number, Biome[][]][]} */
  #possibleGroups = [];
  #prevBranchesPruned = 0;
  #branchesPruned = 0;
  #newBestSolutionsFound = 0;
  #foundEqualSolutions = true;
  #start = 0;
  constructor(people, minGroupSize, maxGroupSize, minBiomes) {
    /** @type {number} */
    this.minGroupSize = minGroupSize;
    /** @type {number} */
    this.maxGroupSize = maxGroupSize;
    /** @type {(keyof typeof npcdict)[]} */
    this.people = people;
    /** @type {Biome[]} */
    this.minBiomes = minBiomes;
  }

  statusUpdate() {
    this.#branchesPruned += 1;
    if ((this.#branchesPruned & ((2 << 11) - 1)) === 0) {
      let timeElapsed = ((performance.now() - this.#start) / 1000).toFixed(3);
      postMessage(["mid", [this.#newBestSolutionsFound, timeElapsed, this.#branchesPruned]]);
    }
    if (this.#foundEqualSolutions && this.#branchesPruned - (2 << 18) > this.#prevBranchesPruned) {
      this.#prevBranchesPruned = this.#branchesPruned;
      this.#foundEqualSolutions = false;
      postMessage(["result", this.#bestCombinationsSoFar]);
    }
  }

  handleNewCombination(newCombination, newHappiness) {
    this.statusUpdate();
    if (+(this.#bestHappinessSoFar).toFixed(10) > +(newHappiness).toFixed(10)) {
      this.#bestCombinationsSoFar = [];
      this.#newBestSolutionsFound += 1;
      postMessage(["result", [newCombination]]);
    }
    this.#bestCombinationsSoFar.push(newCombination);
    this.#bestHappinessSoFar = newHappiness;


  }

  /**
   * 
   * @param {Biome[][]} biomeGroupsToUse
   * @param {Biome[]} biomesToCover
   * @returns {boolean}
   */
  biomeCoverExists(biomeGroupsToUse, biomesToCover) {
    if (biomesToCover.length == 0) { return true; }
    biomeGroupsToUse = biomeGroupsToUse.map(group => group.filter(biome => biomesToCover.includes(biome)));
    biomeGroupsToUse = biomeGroupsToUse.filter(group => group.length > 0);
    if (biomeGroupsToUse.length == 0) { return false; }
    let key = biomeGroupsToUse.join("|") + " " + biomesToCover.join("|");
    if (key in coverageCache) { return coverageCache[key]; }
    let coverFound = false;
    let i = 0;
    while (i < biomeGroupsToUse[0].length && !coverFound) {
      coverFound = this.biomeCoverExists(
        biomeGroupsToUse.slice(1),
        biomesToCover.filter(x => x != biomeGroupsToUse[0][i]),
      );
      i += 1;
    }
    coverageCache[key] = coverFound;
    return coverFound;
  }

  /**
   * @param {number} minIndex 
   * @ param {(keyof typeof npcdict)[]} prefixPeople 
   * @param {[(keyof typeof npcdict)[], Biome[][]][]} prefixPeople 
   * @param {number} prefixHappiness 
   * @param {Set<keyof typeof npcdict>} remainingPeople 
   * @param {BigInt} remainingMask 
   * @returns 
   */
  findCombination(minIndex, prefixPeople, prefixHappiness, remainingPeople, remainingMask) {
    if (remainingMask === 0n) {
      if (this.minBiomes.length == 0) {
        this.handleNewCombination(prefixPeople, prefixHappiness);
      } else {
        //check if cover exists
        this.statusUpdate();
        let biomesGroups = [];
        for (const group of prefixPeople) {
          if (group[0].length > 1) {
            let tempBiomes = new Set();
            group[1].forEach(biomes => biomes.forEach(biome => tempBiomes.add(biome)));
            biomesGroups.push([...tempBiomes]);
          }
        }
        if (this.biomeCoverExists(biomesGroups, this.minBiomes)) {
          this.handleNewCombination(prefixPeople, prefixHappiness);
        }
      }
    }
    let possibleGroups = this.#possibleGroups;
    if (minIndex > possibleGroups.length - 1) { return this.statusUpdate(); }
    if (this.minGroupSize > countOnes(remainingMask)) { return this.statusUpdate(); }
    let bestHappinessSoFarCopy = Infinity;
    let neededAvgHappiness = Infinity;
    for (let i = minIndex; i < possibleGroups.length; i++) {
      if (bestHappinessSoFarCopy > this.#bestHappinessSoFar) {
        bestHappinessSoFarCopy = this.#bestHappinessSoFar;
        neededAvgHappiness = (this.#bestHappinessSoFar - prefixHappiness) / sumOfWeights(remainingPeople);
      }
      let groupAvgHappiness = possibleGroups[i][2];
      if (groupAvgHappiness > neededAvgHappiness
        && +(groupAvgHappiness).toFixed(10) > +(neededAvgHappiness).toFixed(10)) {
        return this.statusUpdate();
      }
      /** @type {[(keyof typeof npcdict)[], Biome[][]]} */
      let group = [possibleGroups[i][0], possibleGroups[i][4]];
      let mask = possibleGroups[i][1];
      if ((mask & remainingMask) === mask) {
        let newPrefix = prefixPeople.slice();
        newPrefix.push(group);
        for (const person of group[0]) { remainingPeople.delete(person); }
        let newPrefixHappiness = prefixHappiness + groupAvgHappiness;
        this.findCombination(i + 1, newPrefix, newPrefixHappiness, remainingPeople, remainingMask & ~mask);
        for (const person of group[0]) { remainingPeople.add(person); }
      }
    }
    return this.statusUpdate();
  }

  search() {
    let cacheStart = performance.now();
    this.#possibleGroups = generateArrayOfGroups(this.minGroupSize, this.maxGroupSize, this.people, cacheStart);
    postMessage(["cache", ((performance.now() - cacheStart) / 1000).toFixed(3)]);
    this.#start = performance.now();
    this.findCombination(0, [], 0,
      new Set(this.people),
      (1n << BigInt(this.people.length)) - 1n,
    );
    let timeElapsed = ((performance.now() - this.#start) / 1000).toFixed(3);
    postMessage(["mid", [this.#newBestSolutionsFound, timeElapsed, this.#branchesPruned]]);
    postMessage(["result", this.#bestCombinationsSoFar]);
    postMessage(["done", 0]);
    return this.#bestCombinationsSoFar;
  }

}


onmessage = function (e) {
  npcdict = e["data"][0][0];
  biomes = e["data"][0][1];
  allowMisplacedTruffle = e["data"][0][2];
  const searcher = new Searcher(...e["data"][1]);
  searcher.search();
};
