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
      for (const biome of groupInfo[2]) {
        arrayOfGroups.push([group, groupInfo[0], groupInfo[1], biome])
      }
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
  #minGroups = []
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
    if (this.#bestHappinessSoFar.toFixed(3) > newHappiness.toFixed(3)) {
      this.#bestCombinationsSoFar = []
      this.#newBestSolutionsFound += 1
      postMessage(["result", [newCombination]])
    }
    this.#bestCombinationsSoFar.push(newCombination)
    this.#bestHappinessSoFar = newHappiness
    
    
  }

  maxBiomesCovered(subBiomes, remainingBiomes) {
    if (remainingBiomes.length == 0 || subBiomes.length == 0) {return remainingBiomes.length}
    let key = subBiomes.join("|")+" "+remainingBiomes.toString()
    if (key in covers) { return covers[key] }
    let bestCoverageYet = remainingBiomes.length
    for (const biome of subBiomes[0]) {
      bestCoverageYet = Math.min(bestCoverageYet,
        this.maxBiomesCovered(subBiomes.slice(1), remainingBiomes.filter(x => x!=biome)))
    }
    covers[key] = bestCoverageYet ;return bestCoverageYet
  }
  
  findCombination(minIndex, prefixPeople, prefixBiomes, prefixHappiness, remainingPeople, remainingBiomes, remainingPeopleCount) {
    
    if (remainingPeopleCount === 0) {
      if (remainingBiomes.length == 0) {
        this.handleNewCombination(prefixPeople, prefixHappiness)
      } else {
        this.statusUpdate()
        prefixBiomes = prefixBiomes.map(subBiomes => {
          return subBiomes.filter(subBiome => remainingBiomes.includes(subBiome))
        })
        let remainderBiomes = []
        for (const subBiomes of prefixBiomes) {
          if (subBiomes.length == 1) {
            remainingBiomes = remainingBiomes.filter( someBiome => someBiome != subBiomes[0] )
          } else if (subBiomes.length > 1) {remainderBiomes.push(subBiomes)}
        }
        if (this.maxBiomesCovered(remainderBiomes, remainingBiomes) == 0) {
          this.handleNewCombination(prefixPeople, prefixHappiness)
        }
      }
    }
    let possibleGroups = this.#possibleGroups
    if (minIndex > possibleGroups.length - 1) { return this.statusUpdate() }

    if (this.minGroupSize > remainingPeopleCount) { return this.statusUpdate() }
    if (this.minGroupSize == remainingPeopleCount) { possibleGroups = this.#minGroups; minIndex = 0 }
    if (remainingPeopleCount  < Math.max(this.minGroupSize, 2) * remainingBiomes.length) {
      if (remainingPeopleCount  < Math.max(this.minGroupSize, 2) * (remainingBiomes.length - prefixBiomes.length)) {
        return this.statusUpdate()
      }
    }
    let bestHappinessSoFarCopy = Infinity
    let neededAvgHappiness = Infinity
    for (let i=minIndex; i < possibleGroups.length; i++) {
      if (bestHappinessSoFarCopy > this.#bestHappinessSoFar) {
        bestHappinessSoFarCopy = this.#bestHappinessSoFar
        neededAvgHappiness = (this.#bestHappinessSoFar - prefixHappiness) / sumOfWeights(Object.keys(remainingPeople).filter(k => remainingPeople[k]))
      }
      let groupAvgHappiness = possibleGroups[i][1]
      if (groupAvgHappiness > neededAvgHappiness) {
        return this.statusUpdate()
      }
      let group = [possibleGroups[i][0], possibleGroups[i][3]]
      let subBiomes = group[1]
      if (group[0].every(person => remainingPeople[person])) {
        let newPrefix = prefixPeople.slice()
        newPrefix.push(group)
        for (const person of group[0]) { remainingPeople[person] = false }
        let newPrefixHappiness = prefixHappiness + possibleGroups[i][2] * groupAvgHappiness
        let newPrefixBiomes = prefixBiomes.slice()
        let newRemainingBiomes = remainingBiomes.slice()
        if (group[0].length > 1) {
          let applicableSubBiomes = subBiomes.filter(subBiome => remainingBiomes.includes(subBiome))
          if (applicableSubBiomes.length === 1) {
            let subBiome = applicableSubBiomes[0]
            newRemainingBiomes = remainingBiomes.filter(biome => subBiome !== biome)
          }
          else if (applicableSubBiomes.length > 1) {
            newPrefixBiomes.push(applicableSubBiomes)
          }
        }
        this.findCombination(i+1, newPrefix, newPrefixBiomes, newPrefixHappiness, remainingPeople, newRemainingBiomes, remainingPeopleCount - group[0].length)
        for (const person of group[0]) { remainingPeople[person] = true }
      }
    }
    return this.statusUpdate()
  }

  search() {
    let cacheStart = performance.now()
    this.#minGroups = generateArrayOfGroups(this.minGroupSize, this.minGroupSize, this.people)
    this.#possibleGroups = generateArrayOfGroups(this.minGroupSize, this.maxGroupSize, this.people)
    postMessage(["cache", ((performance.now() - cacheStart) / 1000).toFixed(3)])
    this.#start = performance.now()
    this.findCombination(0, [], [], 0, Object.assign({}, ...this.people.map(num => ({[num]: true}))), this.minBiomes, this.people.length)
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
