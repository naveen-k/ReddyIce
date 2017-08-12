export interface User {
  id?: number;
  FirstName: string;
  LastName: string;
  UserName: string;
  EmailID: string;
  Phone: string;
  availableRoles: string[];
  role: string;
  IsActive: boolean;
  availableDistributor: string[];
  distributor?: string;
  availableBranches: string[];
  branch: string;
  isSeasonal: boolean;
  isRiInternal: boolean;
}
