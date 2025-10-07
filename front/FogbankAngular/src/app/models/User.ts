
export interface User {
  id?: number;
  firstname?: string;
  lastname?: string;
  password?: string;
  email?: string;
  role?: string;
  forgetPassword?: any;
  enabled?: boolean;
  username?: string;
  authorities?: { authority: string }[];
  accountNonLocked?: boolean;
  accountNonExpired?: boolean;
  credentialsNonExpired?: boolean;
  bio?: string;
  photo?: number[];
  address?: string;
  mobilePhone?: string;
  user?: User;
}

