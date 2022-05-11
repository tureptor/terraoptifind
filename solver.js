self.importScripts("npcdata.js","npctools.js")

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
  #branchesPruned = 0
  #newBestSolutionsFound = 0
  #start = 0
  constructor(people, minGroupSize, maxGroupSize, minBiomes) {
    this.minGroupSize = minGroupSize
    this.maxGroupSize = maxGroupSize
    this.people = people
    this.minBiomes = minBiomes
  }

  statusUpdate() {
    let timeElapsed = ((performance.now() - this.#start) / 1000).toFixed(3)
    postMessage(["mid", [this.#newBestSolutionsFound, timeElapsed,this.#branchesPruned]])
  }

  handleNewCombination(newCombination, newHappiness) {
    this.statusUpdate()
    if (this.#bestHappinessSoFar.toFixed(3) > newHappiness.toFixed(3)) { this.#bestCombinationsSoFar = [] }
    this.#newBestSolutionsFound += 1
    this.#bestCombinationsSoFar.push(newCombination)
    this.#bestHappinessSoFar = newHappiness
  }

  findCombination(minIndex, prefixPeople, prefixBiomes, prefixHappiness, remainingPeople, remainingBiomes) {
    if (minIndex > this.#possibleGroups.length - 1) { return }
    if (remainingPeople.length  < Math.max(this.minGroupSize, 2) * remainingBiomes.length) {
      prefixBiomes = prefixBiomes.map(subBiomes => {
        subBiomes.filter(subBiome => remainingBiomes.includes(subBiome))
      })
      prefixBiomes = prefixBiomes.filter(x => x.length > 0)
      if (remainingPeople.length  < Math.max(this.minGroupSize, 2) * (remainingBiomes.length - prefixBiomes.length)) {
        return
      }
    }
    if (remainingPeople.length === 0) {
      this.handleNewCombination(prefixPeople, prefixHappiness)
    }
    let bestHappinessSoFarCopy = Infinity
    let neededAvgHappiness = Infinity
    for (let i=minIndex; i < this.#possibleGroups.length; i++) {
      if (bestHappinessSoFarCopy > this.#bestHappinessSoFar) {
        bestHappinessSoFarCopy = this.#bestHappinessSoFar
        neededAvgHappiness = (this.#bestHappinessSoFar - prefixHappiness) / sumOfWeights(remainingPeople)
      }
      let groupAvgHappiness = this.#possibleGroups[i][1]
      if (groupAvgHappiness > neededAvgHappiness) {
        this.#branchesPruned +=1
        if ((this.#branchesPruned & (Math.pow(2,14) - 1)) === 0) { this.statusUpdate() }
        return
      }
      let group = [this.#possibleGroups[i][0], this.#possibleGroups[i][3]]
      let subBiomes = group[1]
      if (group[0].every(person => remainingPeople.includes(person))) {
        let newPrefix = prefixPeople.slice()
        newPrefix.push(group)
        let newRemainingPeople = remainingPeople.filter(person => !(group[0].includes(person)))
        let newPrefixHappiness = prefixHappiness + this.#possibleGroups[i][2] * groupAvgHappiness
        let newPrefixBiomes = prefixBiomes.slice()
        let newRemainingBiomes = []
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
        else {
          newRemainingBiomes = remainingBiomes.slice()
        }
        this.findCombination(i+1, newPrefix, newPrefixBiomes, newPrefixHappiness, newRemainingPeople, newRemainingBiomes)
      }
    }
  }

  search() {
    let cacheStart = performance.now()
    this.#possibleGroups = generateArrayOfGroups(this.minGroupSize, this.maxGroupSize, this.people)
    postMessage(["cache", ((performance.now() - cacheStart) / 1000).toFixed(3)])
    this.#start = performance.now()
    this.findCombination(0, [], [], 0, this.people, this.minBiomes)
    this.statusUpdate()
    return this.#bestCombinationsSoFar
  }

}


onmessage = function(e) {
  npcdict = e["data"][0]
  const searcher = new Searcher(...e["data"][1])
  result = searcher.search()
  postMessage(["result", result])
}
