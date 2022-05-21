const people = Object.keys(npcdict)

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
}

function genBiomeTable() {
  let tableHTML = "<table>"
  tableHTML += "<tr> <th>Biome</th> <th>Require pylon here?</th>"
  for (const biome of baseBiomes) {
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
  for (const biome of baseBiomes) {
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
  groups = groups.map(group => [group[0],[...group[1]].map(x=>JSON.parse(x))])
  groups.sort((a,b) => {
    let c = a[1].map(y => y.map(x => baseBiomes.indexOf(x)).toString()).join("")
    let d = b[1].map(y => y.map(x => baseBiomes.indexOf(x)).toString()).join("")
      return c > d ? 1 : d > c ? -1 : 0
    })
  let output = document.getElementById("resultTableDiv");
  let tableHTML = "<table>"
  tableHTML += "<tr> <th>Biome(s) for group</th>"
  tableHTML += "<th>NPCs in this group (and their pricing modifier for each biome)</th></tr>"
  for (const group of groups) {
    biome = group[1]
    biome = biome.filter((b,i) => {
      let copyWithoutB = biome.slice(); copyWithoutB.splice(i,1)
      return copyWithoutB.every(y => y.some(x => !b.includes(x)))
    }) // basically if [[hallow],[hallow,desert]] then reduce this to just [[hallow]]
    tableHTML += "<tr><td>"+biome.map(x=>x.join("")).join(" | ")+"</td><td>"
    for (const person of group[0]) {
      tableHTML += person
      let neighbours = group[0].filter((name,index) => name !== person)
      let personHappiness = biome.map(b => (oneHappiness(person,b,neighbours)/npcdict[person]["weighting"]).toFixed(2))
      tableHTML += "(" + personHappiness.join(",") + "), "
    }
    // remove extra comma and space before ending row
    tableHTML = tableHTML.slice(0, -2) + "</td></tr>"
  }

  output.innerHTML += tableHTML + "</table><br>"
}
function showAllResults(data) {
  let output = document.getElementById("resultTableDiv");
  output.innerHTML = ""

  // sort groups within each solution
  for (var solu of data) {
    solu = solu.sort((a,b) => {
    let c = JSON.stringify(a[0])
    let d = JSON.stringify(b[0])
      return c > d ? 1 : d > c ? -1 : 0
    })
  }
  // sort all solutions
  let sortedData = data.sort((a,b) => {
    let c = JSON.stringify(a.map(group=>group[0])); let d = JSON.stringify(b.map(group=>group[0]))
      return c > d ? 1 : d > c ? -1 : 0
  })
  let prevsolu = sortedData[0]
  let mergedsolu = JSON.parse(JSON.stringify(prevsolu)).map(elem => [elem[0], new Set([JSON.stringify(elem[1])])])
  // only show solution if different from previous
  for (let i=1; i<sortedData.length; i++) {
    let solu = sortedData[i]
    if (JSON.stringify(prevsolu) !== JSON.stringify(solu)) {
      if (prevsolu.every((elem,i) => JSON.stringify(elem[0]) === JSON.stringify(solu[i][0]))) {
        for (let j=0; j< mergedsolu.length; j++) {
          mergedsolu[j][1].add(JSON.stringify(solu[j][1]))
        }
      } else {
        genResultsTable(mergedsolu)
        output.innerHTML += "Above has:<br>"
        output.innerHTML += prevsolu.filter(x => !solu.map(y => JSON.stringify(y[0])).includes(JSON.stringify(x[0])))
                                  .map(x => x[0].join(", ")).join("<br>")+"<br>"
        output.innerHTML += "<br>Below has:<br>"
        output.innerHTML += solu.filter(x => !prevsolu.map(y => JSON.stringify(y[0])).includes(JSON.stringify(x[0])))
                                  .map(x => x[0].join(", ")).join("<br>")+"<br>"
        mergedsolu = JSON.parse(JSON.stringify(solu)).map(elem => [elem[0], new Set([JSON.stringify(elem[1])])])
      }
    }
    prevsolu = solu
  }
  genResultsTable(mergedsolu)
}
function handleWorkerMessage(phase, data) {
  switch (phase) {
    case "mid":
      requestAnimationFrame( () => {
        document.getElementById("newBestSolutionsFound").innerHTML = data[0]
        document.getElementById("timeElapsedSearch").innerHTML = data[1]
        document.getElementById("branchesPruned").innerHTML = data[2]
      })
      break
    
    case "cache":
      requestAnimationFrame( () => {
        document.getElementById("timeElapsedCache").innerHTML = data
      })
      break
  
    case "result":
      requestAnimationFrame(() => showAllResults(data))
      break

    case "done":
      requestAnimationFrame( () => {
        document.getElementById("timeElapsedSearch").innerHTML += " FINISHED"
      })
      break
     
     default:
  }     
}

let myWorker = new Worker("solver.js")
function startSearch() {
  myWorker.terminate()
    requestAnimationFrame( () => {
    document.getElementById("timeElapsedCache").innerHTML = "0.000"
    document.getElementById("newBestSolutionsFound").innerHTML = "0"
    document.getElementById("timeElapsedSearch").innerHTML = "0.000"
    document.getElementById("branchesPruned").innerHTML = "0"
    document.getElementById("resultTableDiv").innerHTML = ""
  })
  
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
  for (const biome of baseBiomes) {
    if (document.getElementById(biome + "Checkbox").checked) {
      minBiomes.push(biome)
    }
  }
  let minGroupSize = document.getElementById("minGroupSize").value
  let maxGroupSize = document.getElementById("maxGroupSize").value

  let biomes = biomes1
  if (document.getElementById("useBiomes2Natural").checked) {
    biomes = biomes.concat(biomes2Natural)
  }
  if (document.getElementById("useBiomes2Easy").checked) {
    biomes = biomes.concat(biomes2Easy)
  }
  if (document.getElementById("useBiomes2Rest").checked) {
    biomes = biomes.concat(biomes2Rest)
  }
  myWorker = new Worker("solver.js")
  myWorker.postMessage([[npcdict,biomes],[peopleWeCanUse, minGroupSize, maxGroupSize, minBiomes]])
  myWorker.onmessage = function(e){handleWorkerMessage(...e["data"])}
}



genBiomeTable()
genNPCtable()
updateNumPossibleGroups()

