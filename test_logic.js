/**
 * Unit & Logic Test Suite for Interview Practice Tracker
 * Validates calculations, validation rules, filtering, and status progression.
 */

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('=============================================');
console.log('🧪 RUNNING PRACTICE TRACKER LOGIC TESTS');
console.log('=============================================\n');

// Sample test dataset
const mockQuestions = [
  { id: '1', title: 'Two Sum', category: 'DSA', difficulty: 'Easy', status: 'Completed', notes: 'Hash map' },
  { id: '2', title: 'Rotate Array', category: 'DSA', difficulty: 'Medium', status: 'In Progress', notes: 'Reversal' },
  { id: '3', title: 'Git Wrong Branch', category: 'Git', difficulty: 'Medium', status: 'Completed', notes: 'Reset or stash' },
  { id: '4', title: 'Git Secret', category: 'Git', difficulty: 'Hard', status: 'Pending', notes: 'filter-repo' },
  { id: '5', title: 'Event Loop', category: 'Technical', difficulty: 'Medium', status: 'Completed', notes: 'Microtasks' },
  { id: '6', title: 'MongoDB Index', category: 'Technical', difficulty: 'Medium', status: 'Pending', notes: 'Error 11000' },
];

// 1. Test Metrics Calculation
console.log('Testing Metrics Calculations:');
{
  const total = mockQuestions.length;
  const completed = mockQuestions.filter(q => q.status === 'Completed').length;
  const percent = Math.round((completed / total) * 100);

  assert(total === 6, 'Total questions count is 6');
  assert(completed === 3, 'Completed count is 3');
  assert(percent === 50, 'Overall percentage is 50%');

  const dsaQuestions = mockQuestions.filter(q => q.category === 'DSA');
  const dsaCompleted = dsaQuestions.filter(q => q.status === 'Completed').length;
  assert(dsaQuestions.length === 2 && dsaCompleted === 1, 'DSA metric: 1/2 completed');

  const interviewQuestions = mockQuestions.filter(q => q.category === 'Git' || q.category === 'Technical');
  const interviewCompleted = interviewQuestions.filter(q => q.status === 'Completed').length;
  assert(interviewQuestions.length === 4 && interviewCompleted === 2, 'Interview metric: 2/4 completed');
}

// 2. Test Filtering Logic
console.log('\nTesting Multi-Parameter Filtering:');
{
  function filterQuestions(list, { category = 'All', status = 'All', difficulty = 'All', search = '' }) {
    return list.filter(q => {
      if (category !== 'All' && q.category !== category) return false;
      if (status !== 'All' && q.status !== status) return false;
      if (difficulty !== 'All' && q.difficulty !== difficulty) return false;
      if (search.trim() !== '') {
        const query = search.toLowerCase();
        const titleMatch = q.title.toLowerCase().includes(query);
        const notesMatch = q.notes ? q.notes.toLowerCase().includes(query) : false;
        if (!titleMatch && !notesMatch) return false;
      }
      return true;
    });
  }

  // Filter by Category
  const dsaOnly = filterQuestions(mockQuestions, { category: 'DSA' });
  assert(dsaOnly.length === 2 && dsaOnly.every(q => q.category === 'DSA'), 'Category filter: DSA returns 2 items');

  // Filter by Status
  const completedOnly = filterQuestions(mockQuestions, { status: 'Completed' });
  assert(completedOnly.length === 3 && completedOnly.every(q => q.status === 'Completed'), 'Status filter: Completed returns 3 items');

  // Filter by Difficulty
  const hardOnly = filterQuestions(mockQuestions, { difficulty: 'Hard' });
  assert(hardOnly.length === 1 && hardOnly[0].title === 'Git Secret', 'Difficulty filter: Hard returns 1 item');

  // Filter by Search Query
  const searchResult = filterQuestions(mockQuestions, { search: 'microtasks' });
  assert(searchResult.length === 1 && searchResult[0].title === 'Event Loop', 'Search in notes works');

  // Combined Filters (DSA + Medium + In Progress)
  const combined = filterQuestions(mockQuestions, { category: 'DSA', difficulty: 'Medium', status: 'In Progress' });
  assert(combined.length === 1 && combined[0].title === 'Rotate Array', 'Combined 3-way filter works');

  // No match
  const noMatch = filterQuestions(mockQuestions, { category: 'DSA', difficulty: 'Hard' });
  assert(noMatch.length === 0, 'Non-existent match returns empty array');
}

// 3. Test Form Validation
console.log('\nTesting Form Validation:');
{
  function validateForm({ title, link }) {
    const errors = {};
    if (!title || !title.trim()) {
      errors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (link && link.trim() !== '') {
      try {
        new URL(link.trim());
      } catch {
        errors.link = 'Invalid URL';
      }
    }
    return errors;
  }

  assert(validateForm({ title: '' }).title === 'Title is required', 'Rejects empty title');
  assert(validateForm({ title: 'ab' }).title === 'Title must be at least 3 characters', 'Rejects title shorter than 3 characters');
  assert(validateForm({ title: 'Valid Title', link: 'not-a-url' }).link === 'Invalid URL', 'Rejects malformed URL');
  assert(Object.keys(validateForm({ title: 'LeetCode 1: Two Sum', link: 'https://leetcode.com/problems/two-sum/' })).length === 0, 'Passes valid title and URL');
}

// 4. Test Status Cycle Progression
console.log('\nTesting Status Cycle Progression:');
{
  function getNextStatus(current) {
    if (current === 'Pending') return 'In Progress';
    if (current === 'In Progress') return 'Completed';
    return 'Pending';
  }

  assert(getNextStatus('Pending') === 'In Progress', 'Pending cycles to In Progress');
  assert(getNextStatus('In Progress') === 'Completed', 'In Progress cycles to Completed');
  assert(getNextStatus('Completed') === 'Pending', 'Completed cycles back to Pending');
}

console.log('\n=============================================');
console.log(`RESULTS: ${passedTests}/${totalTests} tests passed.`);
console.log('=============================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
