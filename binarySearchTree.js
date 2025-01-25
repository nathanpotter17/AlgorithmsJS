/*
Binary Search Tree (BST) is a binary tree data structure with the following properties:
The left subtree of a node contains only nodes with keys less than the node's key.
The right subtree of a node contains only nodes with keys greater than the node's key.
Both the left and right subtrees must also be binary search trees.

In this snippet, we'll implement a BST and perform the following operations:
  Insert a node into the BST.

  Check if the BST is valid.

  Perform in-order, pre-order, and post-order traversals.
*/

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function isValidBST(root) {
  return isBSTHelper(root, -Infinity, Infinity);
}

// Helper function that checks if the current node is valid
function isBSTHelper(node, min, max) {
  if (node === null) {
    return true; // Base case: an empty node is valid
  }

  if (node.value <= min || node.value >= max) {
    return false; // The current node's value is out of the valid range
  }

  // Recursively check the left subtree with an updated max range
  // and the right subtree with an updated min range
  return (
    isBSTHelper(node.left, min, node.value) &&
    isBSTHelper(node.right, node.value, max)
  );
}

// In-order traversal (left, root, right)
function inOrderTraversal(root) {
  if (root === null) return;
  inOrderTraversal(root.left); // Traverse left subtree
  console.log(root.value); // Visit root
  inOrderTraversal(root.right); // Traverse right subtree
}

// Pre-order traversal (root, left, right)
function preOrderTraversal(root) {
  if (root === null) return;
  console.log(root.value); // Visit root
  preOrderTraversal(root.left); // Traverse left subtree
  preOrderTraversal(root.right); // Traverse right subtree
}

// Post-order traversal (left, right, root)
function postOrderTraversal(root) {
  if (root === null) return;
  postOrderTraversal(root.left); // Traverse left subtree
  postOrderTraversal(root.right); // Traverse right subtree
  console.log(root.value); // Visit root
}

// Helper function to create a BST
function createBST(values) {
  let root = null;

  for (const value of values) {
    root = insertNode(root, value);
  }

  return root;
}

// Helper function to insert a value into the BST
function insertNode(root, value) {
  if (root === null) {
    return new TreeNode(value);
  }

  if (value < root.value) {
    root.left = insertNode(root.left, value);
  } else {
    root.right = insertNode(root.right, value);
  }

  return root;
}

// Example Usage
const values = [10, 5, 15, 3, 7, 13, 18];
const root = createBST(values);
console.log("Is the tree a valid Binary Search Tree?", isValidBST(root));

console.log("In-order Traversal:");
inOrderTraversal(root);

console.log("Pre-order Traversal:");
preOrderTraversal(root);

console.log("Post-order Traversal:");
postOrderTraversal(root);
