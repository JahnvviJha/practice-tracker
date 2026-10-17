export const initialQuestions = [
  {
    id: 'q-dsa-1',
    title: 'LeetCode 1: Two Sum',
    category: 'DSA',
    difficulty: 'Easy',
    status: 'Completed',
    notes: 'Optimal O(N) hash map solution verified with 1-pass complement lookup.',
    link: 'https://leetcode.com/problems/two-sum/',
    createdAt: '2026-10-15T10:00:00.000Z'
  },
  {
    id: 'q-dsa-2',
    title: 'LeetCode 26: Remove Duplicates from Sorted Array',
    category: 'DSA',
    difficulty: 'Easy',
    status: 'Completed',
    notes: 'Two-pointer in-place writeIndex and readIndex technique. Returns k.',
    link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
    createdAt: '2026-10-15T11:30:00.000Z'
  },
  {
    id: 'q-dsa-3',
    title: 'LeetCode 283: Move Zeroes',
    category: 'DSA',
    difficulty: 'Easy',
    status: 'Completed',
    notes: 'Partitioning swap algorithm to preserve relative order of non-zeros.',
    link: 'https://leetcode.com/problems/move-zeroes/',
    createdAt: '2026-10-16T09:15:00.000Z'
  },
  {
    id: 'q-dsa-4',
    title: 'LeetCode 189: Rotate Array',
    category: 'DSA',
    difficulty: 'Medium',
    status: 'In Progress',
    notes: '3-Step array reversal algorithm: reverse all, reverse first k, reverse remaining n-k.',
    link: 'https://leetcode.com/problems/rotate-array/',
    createdAt: '2026-10-16T14:00:00.000Z'
  },
  {
    id: 'q-dsa-5',
    title: 'LeetCode 15: 3Sum',
    category: 'DSA',
    difficulty: 'Medium',
    status: 'In Progress',
    notes: 'Sort array + two pointer search with duplicate skipping on both left and right.',
    link: 'https://leetcode.com/problems/3sum/',
    createdAt: '2026-10-17T08:30:00.000Z'
  },
  {
    id: 'q-git-1',
    title: 'Git Scenario 1: Wrong Branch, Correct Work',
    category: 'Git',
    difficulty: 'Medium',
    status: 'Completed',
    notes: 'Triage uncommitted (git switch -c / stash) vs committed (branch + git reset --hard HEAD~1).',
    link: '',
    createdAt: '2026-10-16T16:00:00.000Z'
  },
  {
    id: 'q-git-2',
    title: 'Git Scenario 2: Merge Conflict Resolution',
    category: 'Git',
    difficulty: 'Medium',
    status: 'Completed',
    notes: 'git fetch origin && git rebase origin/main with safe --force-with-lease push.',
    link: '',
    createdAt: '2026-10-16T17:15:00.000Z'
  },
  {
    id: 'q-git-3',
    title: 'Git Scenario 3: Accidentally Committed Secret',
    category: 'Git',
    difficulty: 'Hard',
    status: 'In Progress',
    notes: 'Immediate provider key rotation, git-filter-repo historical wipe, TruffleHog pre-commit.',
    link: '',
    createdAt: '2026-10-17T11:00:00.000Z'
  },
  {
    id: 'q-tech-1',
    title: 'JS Async Flow, Event Loop & Microtask Priority',
    category: 'Technical',
    difficulty: 'Medium',
    status: 'Completed',
    notes: 'Call Stack -> Microtasks (Promises, nextTick) drained fully -> Macrotasks (setTimeout).',
    link: '',
    createdAt: '2026-10-16T18:00:00.000Z'
  },
  {
    id: 'q-tech-2',
    title: 'React Re-renders, React.memo, useMemo & useCallback',
    category: 'Technical',
    difficulty: 'Medium',
    status: 'Completed',
    notes: 'VDOM diffing vs DOM repaint, shallow prop comparison, referential equality traps.',
    link: '',
    createdAt: '2026-10-17T09:45:00.000Z'
  },
  {
    id: 'q-tech-3',
    title: 'Express Protected Route 401 Debugging',
    category: 'Technical',
    difficulty: 'Medium',
    status: 'In Progress',
    notes: '5-layer triage: Bearer header, dotenv secret presence, TokenExpiredError vs JsonWebTokenError.',
    link: '',
    createdAt: '2026-10-17T13:20:00.000Z'
  },
  {
    id: 'q-tech-4',
    title: 'MongoDB Unique Indexes & Race Conditions',
    category: 'Technical',
    difficulty: 'Medium',
    status: 'Pending',
    notes: 'unique:true is index directive, check-then-act race flaw, catching error code 11000.',
    link: '',
    createdAt: '2026-10-17T14:10:00.000Z'
  },
  {
    id: 'q-tech-5',
    title: 'AuthN vs AuthZ & ImageKit Signed Direct Uploads',
    category: 'Technical',
    difficulty: 'Medium',
    status: 'Pending',
    notes: 'Identity vs permissions, IDOR defense, ephemeral cryptographic signatures without exposing privateKey.',
    link: '',
    createdAt: '2026-10-17T15:00:00.000Z'
  }
];
