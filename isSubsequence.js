/*
Given two strings s and t, return true if s is a subsequence of t, or false otherwise.

A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the 
characters without disturbing the relative positions of the remaining characters. (i.e., "ace" is a subsequence of "abcde" while "aec" is not).

Example 1:

Input: s = "abc", t = "ahbgdc"
Output: true
*/

/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function (s, t) {
  let s1 = Array.from(s);
  let t1 = Array.from(t);
  let j = 0;

  for (let i = 0; i < t1.length; i++) {
    if (j < s1.length && t1[i] === s1[j]) {
      j += 1;
    }
  }

  return j === s.length;
};
