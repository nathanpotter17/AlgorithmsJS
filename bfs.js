function breadthFirstSearch(graph, startNode) {
  const visited = new Set(); // Keep track of visited nodes
  const queue = [startNode]; // Use a queue to process nodes level by level

  while (queue.length > 0) {
    const node = queue.shift(); // Remove the first node from the queue

    if (!visited.has(node)) {
      console.log(node); // Visit the node
      visited.add(node); // Mark it as visited

      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor); // Add unvisited neighbors to the queue
        }
      }
    }
  }

  return visited;
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

console.log(breadthFirstSearch(graph, "A"));

// Set(6) { 'A', 'B', 'C', 'D', 'E', 'F' }

/*
Start at A:
Visit A (queue: [B, C]).

Visit B:
Visit B (queue: [C, D, E]).

Visit C:
Visit C (queue: [D, E, F]).

Visit D:
Visit D (queue: [E, F]).

Visit E:
Visit E (queue: [F]).

Visit F:
Visit F (queue: []).
*/
