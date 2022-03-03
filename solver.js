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
// each combination is paired with the average happiness
// array is sorted by average happiness (ascending)
function generateArrayOfGroups(minGroupSize, maxGroupSize, people) {
  const arrayOfGroups = []
  for (let groupSize = minGroupSize; groupSize <= maxGroupSize; groupSize++) {
    for (const group of combinations(groupSize, people)) {
      groupHappAndWeights = groupHappiness(group, true)
      arrayOfGroups.push([group, groupHappAndWeights[0], groupHappAndWeights[1]])
    }
  }
  arrayOfGroups.sort((a,b) => a[1] - b[1])
  return arrayOfGroups
}

// searches for optimal combination of groups
class Searcher {
  #bestCombinationSoFar = []
  #bestHappinessSoFar = Infinity
  #possibleGroups = []
  #branchesExhausted = 0
  #branchesPruned = 0
  #newBestSolutionsFound = 0
  #start = 0

  constructor(people, minGroupSize, maxGroupSize) {
    this.minGroupSize = minGroupSize
    this.maxGroupSize = maxGroupSize
    this.people = people
  }

  handleNewCombination(newCombination, newHappiness) {
    if ( (this.#bestHappinessSoFar).toFixed(3) > newHappiness.toFixed(3)) { document.getElementById("resultTableDiv").innerHTML = "" }
    this.#newBestSolutionsFound += 1
    this.#bestCombinationSoFar = newCombination
    this.#bestHappinessSoFar = newHappiness
    document.getElementById("newBestSolutionsFound").innerHTML = this.#newBestSolutionsFound
    genResultsTable(newCombination)
  }

  findCombination(prefix, remainingPeople, minIndex, prefixHappiness) {
    if (minIndex > this.#possibleGroups.length - 1) {
      return
    }
    if (remainingPeople.length === 0) {
      this.handleNewCombination(prefix, prefixHappiness)
    }
    for (let i=minIndex; i < this.#possibleGroups.length; i++) {
      let group = this.#possibleGroups[i][0]
      let groupAvgHappiness = this.#possibleGroups[i][1]
      let bestPossibleHappiness = prefixHappiness + sumOfWeights(remainingPeople) * groupAvgHappiness
      if ((bestPossibleHappiness).toFixed(2) > (this.#bestHappinessSoFar).toFixed(2)) {
        this.#branchesPruned += 1
        return
      }
      if (group.every(person => remainingPeople.includes(person))) {
        let newPrefix = prefix.slice()
        newPrefix.push(group)
        let newRemainingPeople = remainingPeople.filter(person => !(group.includes(person)))
        let newPrefixHappiness = prefixHappiness + this.#possibleGroups[i][2] * groupAvgHappiness
        this.findCombination(newPrefix, newRemainingPeople, i+1, newPrefixHappiness)
      }
    }
  }

  search() {
    this.#start = performance.now()
    this.#possibleGroups = generateArrayOfGroups(this.minGroupSize,
      this.maxGroupSize, this.people)
    document.getElementById("timeElapsedCache").innerHTML = (
      (performance.now() - this.#start) / 1000).toFixed(3)
    this.#start = performance.now()
    this.findCombination([], this.people, 0, 0)
    document.getElementById("timeElapsedSearch").innerHTML = (
      (performance.now() - this.#start) / 1000).toFixed(3)
    document.getElementById("branchesPruned").innerHTML = this.#branchesPruned
    return this.#bestCombinationSoFar
  }

}
