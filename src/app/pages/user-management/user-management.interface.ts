import { Branch } from '../../shared/interfaces/interfaces';
export interface User {
  UserId?: number;
  FirstName: string;
  LastName: string;
  UserName: string;
  EmailID: string;
  Phone: string;
  role: string;
  IsActive: boolean;
  RoleID?: string;
  BranchID: string;
  DistributorMasterID?: string;
  distributor?: string;
  IsSeasonal: boolean;
  IsRIInternal?: boolean;
  tmp_branch?: string;
  Branch: Branch;
  Role: any;
}

