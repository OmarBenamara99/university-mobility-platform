import { DiscussionGroup } from "./DiscussionGroup";
import { User } from "./User";

export interface Message {
  id?: number;
  content: string;
  timestamp?: Date;
  sender: User;
  
}