export interface User {
  id?: number;
  fname: string;
  lname: string;
  username: string;
  email: string;
  phone: string;
  availableRoles: string[];
  role: string;
  isActive: boolean;
  availableDistributor: string[];
  distributor?: string;
  availableBranches: string[];
  branch: string;
  isSeasonal: boolean;
  isRiInternal: boolean;
}
