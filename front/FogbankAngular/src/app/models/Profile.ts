import {User} from "./User";

export interface Profile {
  id?: number;
  bio?: string;
  photo?: number[];
  address?: string;
  mobilePhone?: string;
  user?: User;
}
