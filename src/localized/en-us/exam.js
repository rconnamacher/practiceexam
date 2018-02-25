
export const exam = {};

exam.title = num => `Sample Test: ${num} Questions`;
exam.grade_test_button = "Grade Test";
exam.test_results = (num, max, percentage) => `${num} correct out of ${max} (${percentage}%)`;