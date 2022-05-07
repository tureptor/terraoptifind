const people = Object.keys(npcdict)

var estimatedBrowserSpeed = 0.00001
var numOfPeopleinGroups = 58125

function updateNumPossibleGroups() {
  // count number of npcs we can use
  let n = 0
  for (const person of people) {
    if (document.getElementById(person + "Checkbox").checked) {
      n += 1
    }
  }

  let minGroupSize = document.getElementById("minGroupSize").value
  let maxGroupSize = document.getElementById("maxGroupSize").value


  // build pascal's triangle so we can do n choose k
  
  let pascals = [[1]]
  for (let i = 1; i <= n; i++) {
    // add ith row
    let newRow = [1]
    for (let j = 1; j < i; j++) {
      newRow.push(pascals[i-1][j-1] + pascals[i-1][j])
    }
    newRow.push(1)
    pascals.push(newRow)
  }

  numOfPeopleInGroups = 0
  let numOfGroups = 0
  for (let k = minGroupSize; k <= maxGroupSize; k++) {
    // add n choose k for every k
    numOfGroups += pascals[n][k]
    numOfPeopleInGroups += pascals[n][k] * k
  }
  document.getElementById("numPossibleGroups").value = numOfGroups
  document.getElementById("estimatedComputationTime").value = (numOfPeopleInGroups * estimatedBrowserSpeed).toFixed(1)
}

function genBiomeTable() {
  let tableHTML = "<table>"
  tableHTML += "<tr> <th>Biome</th> <th>Require at least one group of size >=2 in this biome?</th>"
  for (const biome of biomes) {
    tableHTML += "<tr>"
    tableHTML += "<td>" + biome + "</td>"
    tableHTML += "<td style=\"text-align:center\"> <input style=\"width:1.5em; height:1.5em\""
    tableHTML += "type=\"checkbox\" id=\"" + biome + "Checkbox\"> </td>"
    tableHTML += "</tr>"
  }
  tableHTML += "</table>"
  document.getElementById('biomeTableDiv').innerHTML = tableHTML
}

function includePylonBiomes() {
  for (const biome of biomes) {
    document.getElementById(biome + "Checkbox").checked = true
  }
}

function genNPCtable() {
  let output = document.getElementById('npcTableDiv')
  let tableHTML = "<table>"
  tableHTML += "<tr> <th>NPC name</th> <th>Include this NPC?</th>"
  tableHTML += "<th>Weighting for this NPC (higher = more important, should be >= 0)</th></tr>"
  for (const person of people) {
    tableHTML += "<tr>"
    // name
    tableHTML += "<td>" + person + "</td>"
    // "should use?" checkbox
    tableHTML += "<td style=\"text-align:center\"> <input style=\"width:1.5em; height:1.5em\""
    tableHTML += "type=\"checkbox\" id=\"" + person + "Checkbox\" onchange=\"updateNumPossibleGroups()\" checked> </td>"
    // weighting
    tableHTML += "<td style=\"text-align:center\"> <input style=\"width:5em\" type=number "
    tableHTML += "id=\"" + person + "Weighting\" min=0 value=1.0> </td>" 

    tableHTML += "</tr>"
  }
  tableHTML += "</table>"
  output.innerHTML += tableHTML
}

function genResultsTable(groups) {
  groups.sort((a,b) => biomes.indexOf(a[1]) -  biomes.indexOf(b[1]))
  let output = document.getElementById("resultTableDiv");
  let tableHTML = "<table>"
  tableHTML += "<tr> <th>Biome(s) for group</th>"
  tableHTML += "<th>NPCs in this group (and their pricing modifier for each biome)</th></tr>"
  for (const group of groups) {
    let biome = group[1]
    tableHTML += "<tr><td>"+biome+"</td><td>"
    for (const person of group[0]) {
      tableHTML += person
      let neighbours = group[0].filter((name,index) => name !== person)
      let personHappiness = (oneHappiness(person,biome,neighbours)/npcdict[person]["weighting"]).toFixed(2)
      tableHTML += "(" + personHappiness + "), "
    }
    // remove extra comma and space before ending row
    tableHTML = tableHTML.slice(0, -2) + "</td></tr>"
  }

  output.innerHTML = tableHTML + "</table><br>" + output.innerHTML
}
  

function startSearch() {
  let peopleWeCanUse = []
  for (const person of people) {
    if (document.getElementById(person + "Checkbox").checked) {
      peopleWeCanUse.push(person)
      // don't allow non-positive values for the weighting
      npcdict[person]["weighting"] = Math.max(Number.EPSILON, 
        document.getElementById(person + "Weighting").value)
    }
  }
  let minBiomes = []
  for (const biome of biomes) {
    if (document.getElementById(biome + "Checkbox").checked) {
      minBiomes.push(biome)
    }
  }
  let minGroupSize = document.getElementById("minGroupSize").value
  let maxGroupSize = document.getElementById("maxGroupSize").value

  document.getElementById("resultTableDiv").innerHTML = ""
  
  const searcher = new Searcher(peopleWeCanUse, minGroupSize, maxGroupSize, minBiomes)
  searcher.search()
  estimatedBrowserSpeed = (+document.getElementById("timeElapsedCache").value + +document.getElementById("timeElapsedSearch").value) / numOfPeopleInGroups
  updateNumPossibleGroups()
}

genBiomeTable()
genNPCtable()
updateNumPossibleGroups()

