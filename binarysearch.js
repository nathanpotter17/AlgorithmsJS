const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/***
 * A function that searches for a target number by using the binary search method.
 * @param {number[]} array A sorted array of integers to search through.
 * @param {number} target A integer to search for.
 * @returns {number} The index of the match found.
 ***/
function binarySearch(array, target) {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    if (array[mid] === target) {
      return `Found ${target} at index ${mid}`; // Target found!
    } else if (array[mid] < target) {
      start = mid + 1; // Target is in the right half
    } else {
      end = mid - 1; // Target is in the left half
    }
  }

  return `${target} not found in the array`; // Target not found
}

console.log(binarySearch(array, 7));
// Found 7 at index 6
console.log(binarySearch(array, 11));
// 11 not found in the array
