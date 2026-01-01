import type { Problem } from '../types';

// Fallback mock problem if API fails
export const mockProblem: Problem = {
  id: 234,
  title: 'Palindrome Linked List',
  difficulty: 'Easy',
  description:
    'Given the `head` of a singly linked list, return `true` if it is a palindrome or `false` otherwise.',
  examples: [
    {
      input: 'head = [1,2,2,1]',
      output: 'true',
      explanation: 'The linked list is a palindrome.',
    },
  ],
  constraints: ['The number of nodes in the list is in the range [1, 10^5]', '0 <= Node.val <= 9'],
  tags: ['Linked List', 'Two Pointers'],
  starterCode: {
    python: `def isPalindrome(self, head):
    # Your code here
    if not head or not head.next:
        return True
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    # TODO: Reverse second half and compare`,
    cpp: `bool isPalindrome(ListNode* head) {
    // Your code here
    if (!head || !head->next) {
        return true;
    }
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    // TODO: Reverse second half and compare
}`,
  },
  // Добавляем недостающие свойства:
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// This is now a fallback - use problemService.getProblem() instead
export function getMockProblem(_id: number): Promise<Problem> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProblem), 300);
  });
}
