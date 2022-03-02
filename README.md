# terraoptifind

Finds optimal NPC housing combinations for Terraria. Can optionally exclude certain NPCs or give them different weights.

Uses the rules from 1.4.3.3 (see the oneHappiness function in npctools.js to see my implementation of the rules).

Branch and bound algorithm is used, with most greedy branches chosen first.
