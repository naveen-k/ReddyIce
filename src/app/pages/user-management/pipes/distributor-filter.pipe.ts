import { UserService } from '../../../shared/user.service';
import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { Pipe } from '@angular/core';
@Pipe({
    name: 'distributorFilter',
    pure: true,
})
export class DistributorFilter implements PipeTransform {
    user: any;
    constructor(private userService: UserService) {
        this.user = userService.getUser();
    };
    transform(array: any[], args: any) {
        if (!array || !args || this.user.IsDistributor) { return array};
        if (this.user.Role.RoleID === 1 && +args === 2) {
            return array.filter((user) => !user.IsSeasonal);
        } else if (this.user.Role.RoleID === 2 && +args === 3) {
            return array.filter((user) => user.IsSeasonal);
        }
        return array;
    }
}