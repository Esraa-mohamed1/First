export interface WithdrawalRequest {
  id: number;
  user_payment_info_id: number;
  amount: string;
  status: 'pending' | 'completed' | 'rejected' | string;
  created_at: string;
  updated_at: string;
}

export interface CreateWithdrawalPayload {
  user_payment_info_id: number;
  amount: string | number;
}

import { ReceiverAccount } from './api';

export interface UserPaymentInfo {
  id: number;
  name: string;
  accountValue: string;
  account_value?: string;
  currency: string;
  logo?: string;
  receiver_account_id?: number;
  receiver_account?: ReceiverAccount;
}

export interface WalletData {
  id: number;
  user_id: number;
  balance: string | number;
  available_balance: string | number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ConfigureReceiverAccountPayload {
  receiver_account_id: number;
  type: 'email' | 'phone';
  value: string;
}

export interface StudentPurchaseRequest {
  id: number;
  user_id: number;
  course_id: number;
  starts_at: string;
  transaction_id: string;
  receipt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'penidng' | string;
  created_by: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  course?: {
    id: number;
    title: string;
  };
}
