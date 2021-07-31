export interface PaymentInterface {
  id: string;
  amount: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  wallet_id: string;
}
