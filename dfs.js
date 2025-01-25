function depthFirstSearch(graph, startNode) {
  const visited = new Set(); // Keep track of visited nodes

  function dfs(node) {
    if (visited.has(node)) return; // Skip if already visited

    console.log("Visited", node); // "Visit" the node
    visited.add(node); // Mark it as visited

    for (const neighbor of graph[node]) {
      // Go through each neighbor
      dfs(neighbor); // Drill deeper into neighbors
    }

    // When all neighbors are done, backtrack automatically
  }

  dfs(startNode); // Start the recursion
}

// Example usage
const graph = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: [],
};

depthFirstSearch(graph, "A");

// Set(6) { 'A', 'B', 'D', 'E', 'F', 'C' }

/*
Start at A

Mark A as visited.
Look at A's neighbors: B and C. Go to the first neighbor, B.
Move to B

Mark B as visited.
Look at B's neighbors: D and E. Go to the first neighbor, D.
Move to D

Mark D as visited.
D has no neighbors, so backtrack to B.
Back at B, move to E

Mark E as visited.
Look at E's neighbors: F. Go to F.
Move to F

Mark F as visited.
F has no neighbors, so backtrack to E, then backtrack to B, then backtrack to A.
Back at A, move to C

Mark C as visited.
Look at C's neighbors: F. F is already visited, so skip it.
Done!
All nodes are visited.
*/
