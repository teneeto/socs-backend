import { ServiceType } from './transaction';

export const enum RequestStatus {
  ACCEPT = 'accept',
  ONGOING = 'ongoing',
  DECLINE = 'decline',
  COMPLETE = 'complete'
}

export interface RequestInterface {
  id: string;
  amount: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  agent_id?: string;
  status: RequestStatus;
  decline_reason?: string;
  service_type: ServiceType;
}
