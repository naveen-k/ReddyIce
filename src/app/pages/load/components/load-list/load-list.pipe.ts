import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'load'
})
export class LoadPipe implements PipeTransform {
    transform(value: Array<any>, userType: string, branchOrDist: number) {
        if (!value) { return value; }
        return value.filter((trip) => {
            if (userType === 'internal' && branchOrDist === 1) {
                return !trip.isDistributor;
            } else if (userType === 'internal') {
                return !trip.isDistributor && trip.BranchID == branchOrDist;
            } else if (userType === 'distributor' && branchOrDist === 1) {
                return trip.isDistributor;
            } else if (userType === 'distributor') {
                return trip.isDistributor && trip.DistributorMasterID == branchOrDist;
            }
        })
    }
}