import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { Pipe } from '@angular/core';
@Pipe({
    name: 'manualList',
})
export class ManualListPipe implements PipeTransform {
    transform(value: Array<any>, userType: string, branchid: number, driverid:number,distributorid:number) {
		
        if (!value) { return value; }
	    if (userType === 'Internal' ){
			if(branchid === 1 && driverid === 1) {
				return value;
			}
			return value.filter((trip) => {
            if (branchid === 1 && driverid != 1 && driverid === trip.UserID) {
				
				return true;
            }else if (branchid != 1 && driverid === 1 && branchid === trip.BranchID){
				return true;
			}else if (branchid != 1 && driverid != 1 && branchid === trip.BranchID && driverid === trip.UserID){
				
				return true;
			}
			else {
				
				return false;
			}				
			
			});
		 }else{
			 if(distributorid === -1 && driverid === 1) {
				return value;
			}
			return value.filter((trip) => {
            if (distributorid === -1 && driverid != 1 && driverid === trip.UserID) {
				
				return true;
            }else if (distributorid != -1 && driverid === 1 && distributorid === trip.DistributorCopackerID){
				return true;
			}else if (distributorid != -1 && driverid != 1 && distributorid === trip.DistributorCopackerID && driverid === trip.UserID){
				
				return true;
			}
			else {
				
				return false;
			}				
			
			});
		 }
		
		}
}