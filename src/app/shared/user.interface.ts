export interface UserDetails {
  UserId: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  Phone: number;
  EmailID: string;
  IsDistributor: boolean;
  IsActive: boolean;
  Role: UserRole;
  RoleList: UserRoles[];
  Distributor?: UserDistributor;
  MenuOptions: UserMenuOptions[];
  IsSeasonal?:boolean;
}

export interface UserDistributor {
  DistributorMasterId: number;
  DistributorName: string;
}
export interface UserRole {
  RoleID: number;
  RoleName: string;
}

export interface UserMenuOptions {
  Key: string;
  DisplayValue: string;
}

export interface UserRoles {
  RoleID: number;
  RoleAuthID: number;
  RoleName: string;
  ShowExternal: boolean;
}
