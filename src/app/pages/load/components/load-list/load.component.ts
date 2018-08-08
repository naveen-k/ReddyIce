import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { LoadService } from '../../load.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute,Router } from '@angular/router';
import { CacheService } from '../../../../shared/cache.service';

@Component({
    templateUrl: './load.component.html',
    styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit {
    filter: any = {};

    loads: any = [];
    maxTripCode: any =0;
    filteredLoads: any = [];
    branches: Array<any> = [];
    allBranches: Array<any> = [];
    drivers: Array<any> = [];
	allDrivers: Array<any> = [];
    logedInUser: any = {};
    todaysDate: any;
    selectedDate: any;
    showSpinner: boolean = false;
    loadFilterOption: any = {
        uId: '0',
        loadDate: this.selectedDate,
        branchId: 0,
        branchName: '',
        isForAll: false,
        TripCode: 1,
        DriverName: '',
        DriverID: ''
    };
    constructor(
	    private service: LoadService, private userService: UserService,
        protected notification: NotificationsService,
        protected activatedRoute: ActivatedRoute,
		protected router: Router,
		private cacheService: CacheService
		) { }

    ngOnInit() {
        this.retainFilters('reset');
        const now = new Date();
        this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.logedInUser = this.userService.getUser();
        this.filter = this.service.getFilter();
		this.filter = JSON.parse(JSON.stringify(this.filter));
        this.filter.tripCode = 0;
		this.filter.userBranch = 0;
        this.allBranches = JSON.parse(JSON.stringify(this.activatedRoute.snapshot.data['branches']));
		this.branches = JSON.parse(JSON.stringify(this.allBranches));
		
		 if ( this.allBranches.length == 2) {
			   this.branches.shift();
                this.filter.userBranch = this.branches[0].value;
				
		}else{
			this.branches.splice(1,1);
		}

		this.getDriver();
		if (this.cacheService.has("loadfilterdata")) {
					this.cacheService.get("loadfilterdata").subscribe((res) => {
					this.filter = JSON.parse(JSON.stringify(res));
					
					 this.branchChangeHandler();
						
					});
	     }
		
        this.dateChangeHandler();
		
    
    }
	
	
	 getDriver() {
        this.service.getAllDriver().subscribe(res => {
           this.allDrivers = JSON.parse(JSON.stringify(res));
		    if (this.allBranches.length == 2) {
			   this.branchChangeHandler();
		   }
		   
		  
        });
    }
	

    branchChangeHandler(byType: any = '') {
		
        this.logedInUser.Role.RoleID != 3 && (this.drivers = []);
        this.filteredLoads = [];
			if (!this.cacheService.has("loadfilterdata")) {
				 this.filter.userDriver = 0;
			}
       
        if (this.filter.userBranch > 1 && (this.allDrivers).length > 0){

			let drivers = JSON.parse(JSON.stringify(this.allDrivers));
		    (drivers).splice(0,2);
			
		    drivers = drivers.filter((ft) => {
				if(ft.data.BranchID !== null){
					return (ft.data.BranchID === this.filter.userBranch)?true:false;
				}else{
					return false;
				}
					
			});
			if(drivers.length > 1){
				(drivers).unshift({"value":0,"label":"Select Driver"});
			}else if(drivers.length === 1){
				this.filter.userDriver = drivers.value;
			}else{
				(drivers).unshift({"value":0,"label":"Driver not found"});
			}
			this.drivers = drivers;
		}
		
		if(this.logedInUser.Role.RoleID === 3){
                this.filter.userDriver = this.logedInUser.UserId;
                this.userChangeHandler();
           }  
    }
    userChangeHandler() {
       this.getBranchName();
        this.getDriverName();
        this.getLoadsFromList(this.filter.userBranch, this.filter.userDriver);
    }
    getBranchName(){
		
		let branchES = JSON.parse(JSON.stringify(this.branches));
	
		if ( this.allBranches.length != 2) {
			    (branchES).shift();
		}
        let b = branchES.filter((b)=>b.data.BranchID === this.filter.userBranch);
        this.filter.userBranchName = b[0].data.BranchCode +' - '+b[0].data.BUName;
		
    }
    getDriverName(){
		let driverES = JSON.parse(JSON.stringify(this.drivers));
		if(this.filter.userDriver > 1){
			driverES.shift();
			 let d = driverES.filter((d) => d.data.UserId === this.filter.userDriver);
			this.filter.userDriverName = d[0].data.UserName;
		}else if (this.filter.userDriver == 1){
			this.filter.userDriverName = "All Drivers";
		}else{
			this.filter.userDriverName = '';
		}
       
		
    }
    getLoadsFromList(branchID, driverID) {

        this.filteredLoads = [];
        let tempLoad = [];
        let fLoad = [];
        this.filter.tripCode = 0;
        if (typeof this.loads === 'object' && this.loads && this.loads.length && this.loads.length > 0) {
            
            this.loads.forEach((load) => {
                if (branchID === load.BranchID && driverID === load.DriverID) {
                    fLoad.push(load);
                }
            });

            this.filter.tripCode = this.getHighestTripCode(fLoad);
        }else{
        
            this.filter.tripCode = 0;
        }
        this.maxTripCode= this.getHighestTripCode(fLoad);
        this.filteredLoads = fLoad.sort((a, b) => Number(b.TripCode) - Number(a.TripCode));
    }
    getHighestTripCode(fLoad) {
        let arr=[];
        fLoad.forEach(function(item){
            arr.push(item.TripCode);
        })
        if(arr.length > 0){
        var max = arr.reduce(function(a, b) {
            return Math.max(a, b);
        });
        } else {
            max = 0;
        }
        return max;
    }
    getLoads() {
        this.service.getLoads(this.service.formatDate(this.filter.selectedDate), null, null, false).subscribe((res) => {
            this.loads = res;
            this.showSpinner = false;
            this.maxTripCode = 0;
            this.filteredLoads = [];
            if (this.filter.userBranch > 0 && this.filter.userDriver > 0){
                this.getLoadsFromList(this.filter.userBranch, this.filter.userDriver);
            }
               
        },
            (error) => {
                this.showSpinner = false;
                if (error) {

                    this.notification.error('', 'Something went wrong while fetching data');
                }
            }
        );
    }

    dateChangeHandler() {
        this.showSpinner = true;
        this.selectedDate = this.service.formatDate(this.filter.selectedDate);
		
        this.getLoads();

    }
    retainFilters(reset:any =''){
        if(reset!==''){
            if(sessionStorage.getItem("LoadFilter")){
                sessionStorage.removeItem("LoadFilter");
            }
            
        } else {
            sessionStorage.setItem("LoadFilter",JSON.stringify(this.filter));
            
        }
       
    }
    
    goToDetails(loadID){ 
        if(loadID!==''){
            this.filter.LoadID = loadID;
            this.retainFilters('');
            this.router.navigate(['/pages/load/detail',loadID]);
        } else{
            this.retainFilters('');
            this.router.navigate(['/pages/load/detail']);
        }
       
       
        
    }

}
