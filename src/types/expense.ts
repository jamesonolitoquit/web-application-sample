/**
 * Represents an expense entry in the tracker.
 * @interface Expense
 */
export interface Expense {
  /**
   * Unique identifier for the expense.
   * @type {string}
   */
  id: string;

  /**
   * The monetary amount of the expense.
   * @type {number}
   */
  amount: number;

  /**
   * A description of the expense.
   * @type {string}
   */
  description: string;

  /**
   * The date when the expense occurred, in ISO string format.
   * @type {string}
   */
  date: string;

  /**
   * Optional category for the expense, for future filtering and organization.
   * @type {string | undefined}
   */
  category?: string;
}