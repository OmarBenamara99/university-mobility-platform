import { Message } from "./message";
import { Offre } from "./offre";

export interface DiscussionGroup {
  id?: number;
  name: string;
  description: string;
  createdAt?: Date;
  offre: Offre;
  messages?: Message[];
}