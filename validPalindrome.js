/*
A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, 
it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.
*/

/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
  s = s.match(/[a-zA-Z\d]/g)?.join("") || "";
  s = s.toLowerCase();
  let s2 = s.split("").reverse().join("");
  return s === s2;
};
