
export interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_id: string;
  receiver_id: string;
  ad_id?: string;
}

export interface AdInfo {
  id: string;
  title: string;
  user_id: string;
}

export interface UserInfo {
  id: string;
  name: string;
}
