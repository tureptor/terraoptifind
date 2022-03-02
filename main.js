const people = Object.keys(npcdict)

function genNPCtable() {
  let output = document.getElementById('npcTableDiv');
  let tableHTML = "<table>"
  tableHTML += "<tr> <th>NPC name</th> <th>Include this NPC?</th>"
  tableHTML += "<th>Weighting for this NPC (higher = more important, should be >= 0)</th></tr>"
  for (const person of people) {
    tableHTML += "<tr>"
    // name
    tableHTML += "<td>" + person + "</td>"
    // "should use?" checkbox
    tableHTML += "<td style=\"text-align:center\"> <input style=\"width:1.5em; height:1.5em\""
    tableHTML += "type=\"checkbox\" id=\"" + person + "Checkbox\" checked> </td>"
    // weighting
    tableHTML += "<td style=\"text-align:center\"> <input style=\"width:5em\" type=number "
    tableHTML += "id=\"" + person + "Weighting\" min=0 value=1.0> </td>" 

    tableHTML += "</tr>"
  }
  tableHTML += "</table>";
  output.innerHTML = tableHTML;
}
genNPCtable()

function genResultsTable(groups) {
  let output = document.getElementById("resultTableDiv");
  let tableHTML = "<table>"
  tableHTML += "<tr> <th>Biome(s) for group</th>"
  tableHTML += "<th>NPCs in this group (and their pricing modifier for each biome)</th></tr>"
  for (const group of groups) {
    let biomes = bestBiomesForGroup(group)
    tableHTML += "<tr><td>"+biomes.join(", ")+"</td><td>"
    for (const person of group) {
      tableHTML += person
      let neighbours = group.filter((name,index) => name !== person)
      tableHTML += "(" + biomes.map(biome => (oneHappiness(person,biome,neighbours)/npcdict[person]["weighting"]).toFixed(2)).join(", ") + "), "
    }
    // remove extra comma and space before ending row
    tableHTML = tableHTML.slice(0, -2) + "</td></tr>"
  }
  output.innerHTML = tableHTML
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
  let minGroupSize = document.getElementById("minGroupSize").value
  let maxGroupSize = document.getElementById("maxGroupSize").value
  const searcher = new Searcher(peopleWeCanUse, minGroupSize, maxGroupSize)
  let groups = searcher.search()
  genResultsTable(groups)
}



