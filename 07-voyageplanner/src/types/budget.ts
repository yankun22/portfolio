export type ExpenseCategory =
  | 'Lodging'
  | 'Food'
  | 'Transit'
  | 'Tickets'
  | 'Shopping'
  | 'Activities'
  | 'Emergency'
  | 'Misc';

export interface Companion {
  id: string;
  name: string;
  avatarColor: string;
  email?: string;
  isCurrentUser?: boolean;
}

export interface SplitShare {
  companionId: string;
  share: number; // e.g. 1 for equal parts, or exact amount if custom
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  convertedAmount: number; // in trip's primary currency
  date: string; // YYYY-MM-DD
  payerId: string; // Companion ID who paid
  splitType: 'EQUAL' | 'CUSTOM' | 'EXACT' | 'PERCENTAGE';
  splits: SplitShare[]; // participants involved
  receiptNote?: string;
  dayId?: string;
  createdAt: number;
}

export interface Settlement {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
  currency: string;
}

export interface CompanionBalance {
  companion: Companion;
  totalPaid: number;
  totalOwed: number;
  netBalance: number; // positive = receives money, negative = owes money
}

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateAgainstUSD: number; // rate e.g. USD=1.0, EUR=0.92, JPY=155.0, etc.
}
