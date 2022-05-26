self.importScripts("npcdata.js","npctools.js")
let biomes = []
let covers = {}
let timeSpen = 0

// used to generate all possible npc groups/combinations
// same as itertools.combinations from python
function * combinations(k, someArray, fromThisIndex=0) {
  if ( k === 0) {
    yield []
    return
  }
  for (let i=fromThisIndex; i < someArray.length - k + 1; i++) {
    for (const result of combinations(k-1, someArray, i+1)) {
      result.unshift(someArray[i])
      yield result
    }
  }
}

// generates array of all combinations of people such that
// minGroupSize <= combination.length <= maxGroupSize
// each combination is paired with the average happiness, the total weight, and its biome
// array is sorted by average happiness (ascending)
function generateArrayOfGroups(minGroupSize, maxGroupSize, people) {
  const arrayOfGroups = []
  for (let groupSize = minGroupSize; groupSize <= maxGroupSize; groupSize++) {
    for (const group of combinations(groupSize, people)) {
      let groupInfo = groupHappWeightBiomes(group)
      arrayOfGroups.push([group, ...groupInfo])
    }
  }
  arrayOfGroups.sort((a,b) => a[1] - b[1])
  return arrayOfGroups
}

// searches for optimal combination of groups
class Searcher {
  #bestCombinationsSoFar = []
  #bestHappinessSoFar = Infinity
  #possibleGroups = []
  #prevBranchesPruned = 0
  #branchesPruned = 0
  #newBestSolutionsFound = 0
  #foundEqualSolutions = true
  #start = 0
  constructor(people, minGroupSize, maxGroupSize, minBiomes) {
    this.minGroupSize = minGroupSize
    this.maxGroupSize = maxGroupSize
    this.people = people
    this.minBiomes = minBiomes
  }

  statusUpdate() {
    this.#branchesPruned +=1
    if ((this.#branchesPruned & ((2 << 11) - 1)) === 0) { 
    let timeElapsed = ((performance.now() - this.#start) / 1000).toFixed(3)
    postMessage(["mid", [this.#newBestSolutionsFound, timeElapsed,this.#branchesPruned]])}
    if (this.#foundEqualSolutions && this.#branchesPruned - (2 << 18) > this.#prevBranchesPruned){
      this.#prevBranchesPruned = this.#branchesPruned
      this.#foundEqualSolutions = false
      postMessage(["result", this.#bestCombinationsSoFar])
    }
  }

  handleNewCombination(newCombination, newHappiness) {
    this.statusUpdate()
    if (+(this.#bestHappinessSoFar).toFixed(10) > +(newHappiness).toFixed(10)) {
      this.#bestCombinationsSoFar = []
      this.#newBestSolutionsFound += 1
      postMessage(["result", [newCombination]])
    }
    this.#bestCombinationsSoFar.push(newCombination)
    this.#bestHappinessSoFar = newHappiness
    
    
  }

  biomeCoverExists(biomeGroupsToUse, biomesToCover) {
    if (biomesToCover.length == 0) { return true }
    biomeGroupsToUse = biomeGroupsToUse.map(group => group.filter(biome => biomesToCover.includes(biome)))
    biomeGroupsToUse = biomeGroupsToUse.filter(group => group.length > 0)
    if (biomeGroupsToUse.length == 0) { return false }
    let key = biomeGroupsToUse.join("|")+" "+biomesToCover.join("|")
    if (key in covers) { return covers[key] }
    let coverFound = false
    let i = 0
    while (i < biomeGroupsToUse[0].length && !coverFound) {
      coverFound = this.biomeCoverExists(biomeGroupsToUse.slice(1), biomesToCover.filter(x => x != biomeGroupsToUse[0][i]))
      i += 1
    }
    covers[key] = coverFound
    return coverFound
  }
  
  findCombination(minIndex, prefixPeople, prefixHappiness, remainingPeople, remainingPeopleCount) {
    if (remainingPeopleCount === 0) {
      if (this.minBiomes.length == 0) {
        this.handleNewCombination(prefixPeople, prefixHappiness)
      } else {
        //check if cover exists
        this.statusUpdate()
        let biomesGroups = []
        for (const group of prefixPeople) {
          if (group[0].length > 1) {
            let tempBiomes = new Set()
            group[1].map(biomes => biomes.map(biome => tempBiomes.add(biome)))
            biomesGroups.push([...tempBiomes])
          }
        }
        if (this.biomeCoverExists(biomesGroups, this.minBiomes)) {
          this.handleNewCombination(prefixPeople, prefixHappiness)
        }
      }
    }
    let possibleGroups = this.#possibleGroups
    if (minIndex > possibleGroups.length - 1) { return this.statusUpdate() }
    if (this.minGroupSize > remainingPeopleCount) { return this.statusUpdate() }
    let bestHappinessSoFarCopy = Infinity
    let neededAvgHappiness = Infinity
    for (let i=minIndex; i < possibleGroups.length; i++) {
      if (bestHappinessSoFarCopy > this.#bestHappinessSoFar) {
        bestHappinessSoFarCopy = this.#bestHappinessSoFar
        neededAvgHappiness = (this.#bestHappinessSoFar - prefixHappiness) / sumOfWeights(Object.keys(remainingPeople).filter(k => remainingPeople[k]))
      }
      let groupAvgHappiness = possibleGroups[i][1]
      if (groupAvgHappiness > neededAvgHappiness 
        && +(groupAvgHappiness).toFixed(10) > +(neededAvgHappiness).toFixed(10)) {
        return this.statusUpdate()
      }
      let group = [possibleGroups[i][0], possibleGroups[i][3]]
      if (group[0].every(person => remainingPeople[person])) {
        let newPrefix = prefixPeople.slice()
        newPrefix.push(group)
        for (const person of group[0]) { remainingPeople[person] = false }
        let newPrefixHappiness = prefixHappiness + possibleGroups[i][2] * groupAvgHappiness
        this.findCombination(i+1, newPrefix, newPrefixHappiness, remainingPeople, remainingPeopleCount - group[0].length)
        for (const person of group[0]) { remainingPeople[person] = true }
      }
    }
    return this.statusUpdate()
  }

  search() {
    let cacheStart = performance.now()
    this.#possibleGroups = generateArrayOfGroups(this.minGroupSize, this.maxGroupSize, this.people)
    postMessage(["cache", ((performance.now() - cacheStart) / 1000).toFixed(3)])
    this.#start = performance.now()
    this.findCombination(0, [], 0, Object.assign({}, ...this.people.map(num => ({[num]: true}))), this.people.length)
    let timeElapsed = ((performance.now() - this.#start) / 1000).toFixed(3)
    postMessage(["mid", [this.#newBestSolutionsFound, timeElapsed,this.#branchesPruned]])
    postMessage(["result", this.#bestCombinationsSoFar])
    postMessage(["done", 0])
    return this.#bestCombinationsSoFar
  }

}


onmessage = function(e) {
  npcdict = e["data"][0][0]
  biomes = e["data"][0][1]
  const searcher = new Searcher(...e["data"][1])
  searcher.search()
}
