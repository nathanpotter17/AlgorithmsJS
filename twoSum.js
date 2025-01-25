/*
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.
*/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  let book = {},
    sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum = target - nums[i];
    if (sum in book) {
      return [book[sum], i];
    }
    book[nums[i]] = i;
  }
};
