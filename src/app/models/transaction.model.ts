export interface Transaction {
  hash: string;
  method: string;
  block: number;
  timestamp: string;
  from: string;
  direction: 'IN' | 'OUT';
  to: string;
  amount: string;
  txnFee: string;
}

export interface TransactionHistoryData {
  data: Transaction[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TransactionHistoryResponse {
  status: number;
  message: string;
  data: TransactionHistoryData;
}
