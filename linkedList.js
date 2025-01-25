class ListNode {
  constructor(value) {
    this.value = value; // Value of the node
    this.next = null; // Pointer to the next node
  }
}

// Helper to create a linked list
function createLinkedList(values) {
  const dummyHead = new ListNode(0); // Dummy head node for simplicity
  let current = dummyHead;
  for (const value of values) {
    current.next = new ListNode(value); // Add new node
    current = current.next;
  }
  return dummyHead.next; // Return the actual head of the list
}

function reverseLinkedList(head) {
  let prev = null; // Previous node (starts as null)
  let current = head; // Current node (starts at the head of the list)

  while (current !== null) {
    const nextNode = current.next; // Save the next node
    current.next = prev; // Reverse the pointer to point to the previous node
    prev = current; // Move the prev pointer forward
    current = nextNode; // Move the current pointer forward
  }

  return prev; // New head of the reversed list
}

function detectAndRemoveCycle(head) {
  if (!head || !head.next) return false; // No cycle if the list is empty or has only one node

  let slow = head; // Slow pointer moves one step at a time
  let fast = head; // Fast pointer moves two steps at a time

  // Step 1: Detect Cycle
  while (fast && fast.next) {
    slow = slow.next; // Move slow by one
    fast = fast.next.next; // Move fast by two

    if (slow === fast) {
      // Cycle detected
      break;
    }
  }

  if (slow !== fast) {
    return false; // No cycle
  }

  // Step 2: Find the start of the cycle
  slow = head; // Reset slow pointer to the head
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }

  // Step 3: Remove the cycle
  let cycleStart = slow; // Start of the cycle
  let temp = cycleStart;
  while (temp.next !== cycleStart) {
    temp = temp.next; // Traverse to the last node in the cycle
  }
  temp.next = null; // Break the cycle

  return true; // Cycle was detected and removed
}

// Helper to create a linked list with a cycle
function createCyclicLinkedList(values, cycleIndex) {
  const dummyHead = new ListNode(0);
  let current = dummyHead;
  let cycleNode = null;

  for (let i = 0; i < values.length; i++) {
    current.next = new ListNode(values[i]);
    current = current.next;

    if (i === cycleIndex) {
      cycleNode = current; // Mark the node where the cycle will start
    }
  }

  if (cycleNode) {
    current.next = cycleNode; // Create the cycle
  }

  return dummyHead.next;
}

// Helper to print a linked list
function printLinkedList(head, limit = 10) {
  const values = [];
  while (head !== null && values.length < limit) {
    values.push(head.value);
    head = head.next;
  }
  console.log(values.join(" -> "));
}

// Test Common Linked List Usecases
/*
What’s happening in the code?

Each node in the linked list points to the next node.
To reverse the list, we need to flip the arrows so that each node points backward instead of forward.

Step-by-step process:

    Start with three pointers:
        prev (initially null) — tracks the previous node.
        current — tracks the current node being processed.
        nextNode — temporarily holds the next node.

    For each node:
        Save the nextNode so you don’t lose track of the list.
        Point current.next to prev (reversing the arrow).
        Move prev and current one step forward.

    Continue until current reaches the end (null).

Why does it work?
    By flipping one pointer at a time, you gradually reverse the direction of the entire list.
*/
const values = [1, 2, 3, 4, 5];
const head = createLinkedList(values);

console.log("Original Linked List:");
printLinkedList(head);

const reversedHead = reverseLinkedList(head);

console.log("Reversed Linked List:");
printLinkedList(reversedHead);

/*
2. Detect and Remove Cycles in a Linked List

A cycle in a linked list occurs when a node points back to a previous node, forming a loop. This makes traversing the list infinite unless 
handled correctly.

We’ll use Floyd's Cycle Detection Algorithm (also called the "tortoise and hare" algorithm) to detect the cycle. Once detected, we’ll remove it 
by fixing the pointers.

What’s happening in the code?
    We use two pointers (slow and fast) to detect a cycle.
    If the pointers meet, there’s a cycle. If fast reaches the end (null), there’s no cycle.
    Once a cycle is found, we figure out where it starts and then break it.
    
Step-by-step process:

    Cycle Detection:
        Move slow one step at a time and fast two steps.
        If there’s a cycle, slow and fast will eventually meet.
    Find the Cycle Start:
        Reset slow to the head and move both pointers one step at a time.
        The node where they meet is the start of the cycle.
    Remove the Cycle:
        Traverse from the start of the cycle until the last node (node pointing back to the start).
        Break the cycle by setting the last node’s next pointer to null.

Why does it work?
    The "tortoise and hare" algorithm guarantees that if there’s a cycle, the two pointers will meet.
    By resetting slow and moving both pointers together, they’ll meet again at the start of the cycle.

Cycle-Free Verification:
    After removing the cycle, you can safely print or traverse the list without infinite loops.
*/
const values1 = [1, 2, 3, 4, 5];
const cycleIndex = 2; // Cycle starts at node with value 3
const head1 = createCyclicLinkedList(values1, cycleIndex);

console.log("Cycle Detected and Removed:", detectAndRemoveCycle(head1));
