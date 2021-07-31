export const enum TransactionType {
  CARD = 'card_transfer',
  BANK_TRANSFER = 'bank_transfer'
}

export const enum ServiceType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery'
}

//am not sure what type location should be so I have left it as string
export interface TransactionInterface {
  id: string;
  amount: number;
  location: string;
  updated_at: Date;
  created_at: Date;
  request_id: string;
  user_fullname: string;
  agent_fullname: string;
  service_type: ServiceType;
  transaction_type: TransactionType;
}
