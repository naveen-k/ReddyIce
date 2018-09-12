import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../user-management/user-management.interface';
import { UserService } from '../../../shared/user.service';
import { TrackerService } from '../tracker.service';
import * as GoogleMapsLoader from 'google-maps';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CacheService } from '../../../shared/cache.service';

@Component({
  templateUrl: 'tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
})
export class TrackerComponent implements OnInit {
  searchObj: any = {
    userType: 'Internal'
  }
  filter = {
    sequence: 1,
    trackerType: 1
  }
  todaysDate: any;
  allBranches: any;
  branches: any;
  allTrips: any = {};
  showSpinner: boolean = false;
  trips: any = [];
  selectedDate: any;
  buttonAction:boolean = false;
  trackerTripData:any = [];
  googlemapdivStatus:boolean=true;
  refreshTimestamp:string = "";
  tripFilterOption: any = {
    uId: '0',
    tripDate: this.selectedDate,
    branchId: 0,
    isForAll: false,
    TripCode:0,
    DriverName: '',
    DistributorID: 0,
    DistributorName: '',
    DistributorCopackerID: 0
  };
  refreshMessage:string = 'Please click View Trips button to get latest data';
  showBranchDropdown: boolean = false;
  planned: boolean = true;
  actual: boolean = false;
  both: boolean = false;
  isDistributorExist: boolean;
  userSubTitle: string = '';
  selectedTrip: any;
  tripStartDate: any;
  marker: any = [];
  driverSpecTrips: any = [];
  userId = localStorage.getItem('userId');

  user: User;

  // variables for drawing route
  map: any;
  infowindow: any;
  bounds: any;
  pinColor: any;
  pinImage: any;

  ///
  pinImage1: any;
  pinImage2: any;
  ///

  isDistributor: any;

  constructor(
    private _elementRef: ElementRef,
    private service: TrackerService,
    private userService: UserService,
    private notification: NotificationsService,
    private router: Router,
	private cacheService: CacheService,
  ) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '';
    if (this.router.url === '/opentracker') {
      this.user = {} as User;
      this.isDistributor = false;
    } else {
      this.user = this.userService.getUser();

      if ((this.user.Role.RoleID === 3 || this.user.Role.RoleID === 2) && this.user.IsSeasonal) {
        this.user.IsRIInternal = true;
        this.user.IsDistributor = false;
      }
      // get the user type: isDistributor or internal
      this.isDistributor = this.user.IsDistributor;
      if ((this.user.Role.RoleID === 3 || this.user.Role.RoleID === 2) && this.user.IsSeasonal) {
        this.searchObj.userType = 'External';
      }
    }
    this.isDistributorExist = this.user.IsDistributor;
    this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + this.user.Distributor.DistributorName : '';

    const now = new Date();
    this.tripFilterOption['tripDate'] = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.selectedDate = this.service.formatDate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
    this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
	this.service.getBranches(this.user.UserId).subscribe((res) => {
			 this.allBranches = JSON.parse(JSON.stringify(res));
			 this.branches = JSON.parse(JSON.stringify(this.allBranches));
			  if(this.allBranches[1].value === 1){
				this.branches.splice(1,1);
			}
			 if (this.allBranches.length == 2) {
				let AllBranches = JSON.parse(JSON.stringify(this.allBranches));
				AllBranches.shift();
				this.branches = AllBranches;
                this.tripFilterOption.branchId = AllBranches[0].value;
				this.branchChangeHandler();
			}else{
				this.tripFilterOption.branchId = 0;
			}
			
			
			 
			 
		 
	});
	
	this.tripFilterOption.isForAll = true;
	 
    if (this.isDistributor) {
      this.searchObj.userType = 'External';
      this.filter.sequence = 2;
      this.tripFilterOption.isForAll = false;
      this.tripFilterOption.DistributorMasterID = this.user.Distributor.DistributorMasterId;
    }
	
	if (this.user.IsDistributor && this.user.Distributor.DistributorMasterId && this.tripFilterOption.DistributorMasterID <= 1) {
            this.tripFilterOption.DistributorMasterID = this.user.Distributor.DistributorMasterId;
	}
		
	this.service.getDistributerAndCopacker().subscribe((res) => {
		 this.distributors = res;
		 
	});
	if (this.isDistributor) {
		this.typeChangeHandler();
		
	}
	
	this.gettracketcacheData();
	
  }
gettracketcacheData(){
	if (this.cacheService.has("fetcehdtripID") ){
		
		this.refreshMessage = 'Data is loading...';
	}
	if (this.cacheService.has("searchObj") ) {
			
		this.cacheService.get("searchObj").subscribe((res) => {
		this.searchObj = JSON.parse(JSON.stringify(res));
				
		});
		
	}
	if (this.cacheService.has("filter") ) {
			
		this.cacheService.get("filter").subscribe((res) => {
		this.filter = JSON.parse(JSON.stringify(res));
		});
	}
	if (this.cacheService.has("tripFilterOption") ) {
			
		this.cacheService.get("tripFilterOption").subscribe((res) => {
		this.tripFilterOption = JSON.parse(JSON.stringify(res));
		
		this.selectedDate = this.service.formatDate(this.tripFilterOption.tripDate);
		this.branchChangeHandler('yes');
		});
		 
	}
	
}
	
	validateData(){
		if((this.tripFilterOption.branchId || this.tripFilterOption.DistributorMasterID) && (this.tripFilterOption.TripCode != 'No trip found' && this.tripFilterOption.DriverName != 'No driver found')) 
		{
			
			this.buttonAction = true;
		}else{
			
			this.buttonAction = false;
			return false;
		}
		return true;

	}
	refreshDataHandler(byType: any = '')
	{
		if( byType ==='branchChange' ){
			this.branchChangeHandler();
		}else if( byType ==='dateChange' ){
			this.dateChangeHandler();
		}else if( byType === 'typeChange' ){
			this.typeChangeHandler();
		}else if( byType === 'driverChange' ){
			this.driverChangeHandler();
		}
		
		
		this.validateData();
		/*if (this.cacheService.has("fetcehdtripID") ){
			
		}*/
		 this.cacheService.deleteCache("fetcehdtripID");
		 this.selectedTrip = [];
			this.googlemapdivStatus = true;
			this.refreshMessage = "Please click View Trips button to get latest data";
		this.cacheService.set("filter", this.filter);
		this.cacheService.set("tripFilterOption", this.tripFilterOption);
		this.cacheService.set("searchObj", this.searchObj);
		
	}

  sliceTime(str) {
    if (str) {
      return str.slice(11, 16);
    }
  }

  // Filter TicketDetails based on the Trip selected
  IsUnplanned: boolean; // check if a trip is planned or unplanned
  fetchTicketDetailsByTrip(tripId) {
	  this.googlemapdivStatus = true;
	  this.cacheService.set("fetcehdtripID", tripId);
    this.showSpinner = true;
    this.selectedTrip = [];
    let tripApiName = this.filter.trackerType == 1 ? 'getTripTicketsByTripID' : 'getTripTicketsByTripIDFES';
    this.service[tripApiName](tripId).subscribe(res => {
		
		if (this.filter.trackerType == 2) {
			res.Trips[0].TripTicketList = res.TripTicketList;
		}
      
      this.IsUnplanned = res.Trips[0].IsUnplanned;
      if (this.filter.trackerType == 2) {
        this.filter.sequence = 3;
      } else if (this.IsUnplanned || this.searchObj.userType == 'External') { // if unplanned trip, map according 'Actual' scenario
        this.filter.sequence = 2;
      } else {
        this.filter.sequence = 1;
      }
      this.selectedTrip = res.Trips[0].TripTicketList; // creating array based on driver and tripcode selected
	 
      this.tripStartDate = res.Trips[0].TripStartDate;
      

	   this.showSpinner = false;
	   this.refreshMessage = '';
	  
	   if (this.selectedTrip.length != 0) {
		   this.getTimeStamp();
		   this.googlemapdivStatus = false;
        this.selectedTrip.map(item => {
          item['createdDate'] = this.sliceTime(item.Created);
        })
       
        if (this.searchObj.userType != 'External' && !this.IsUnplanned) {
          this.selectedTrip.sort(this.comparator); // sorting planned sequence
        }
		//this.sequenceChangeHandler();
		this.drawMapPath();
      }
	   	
    });
	
  }

	getTimeStamp(){
		let now = new Date();
		var dd = (now.getDate() < 10 ? '0' : '') + now.getDate();
		var MM = ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1);
		var hh = ( now.getHours() < 10 ? '0' : '') + now.getHours();
		var mm = ( now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
		this.refreshTimestamp = MM + '/' + dd +" " +hh + ":" + mm +  " " + (( now.getHours() >= 12) ? 'PM' : 'AM');
		this.cacheService.set("trackerRefreshtime", this.refreshTimestamp);
		return true;
		
	}
  
  
  // Fetch selected Date
  dateChangeHandler() {
    this.selectedDate = this.service.formatDate(this.tripFilterOption.tripDate);
	this.typeChangeHandler();
  }
  driverOnBranch = [];
  routeNo;
  // Fetch selected Branch
  branchChangeHandler(checkcalltype:string = null) {

  this.driverSpecTrips = [];
  this.driverOnBranch = [];
 this.driverOndistributor = [];
  
    if ( (this.tripFilterOption.branchId || this.tripFilterOption.DistributorMasterID ) && this.filter.trackerType != 2) {
	 let ISRI = (this.searchObj.userType === 'Internal' )?true:false;
	 let trackerTYPE:number;
		
		this.routeNo = '';
		let selectedID = (this.searchObj.userType === 'Internal' )?this.tripFilterOption.branchId:this.tripFilterOption.DistributorMasterID;
		
		this.service.getTripsForTracker(this.selectedDate, selectedID, ISRI).subscribe((res) => {
		this.trackerTripData = res.AllTrip;
		if(this.trackerTripData.length > 0){
				for (var i = 0; i < this.trackerTripData.length; i++) {
					if (this.filter.trackerType == 1 && (this.trackerTripData[i].Trip.toString().indexOf("999") == -1)) {
						this.routeNo = this.trackerTripData[i].RouteNumber;
					} else if (this.filter.trackerType == 1) {
						this.routeNo = 'Unplanned';
					}

					let driversDetailsObj = {
						DriverName: this.trackerTripData[i].Driver,
						TripCode: this.trackerTripData[i].TripCode,
						TripID: this.trackerTripData[i].TripID,
						RouteNumber: this.filter.trackerType == 1 ? this.routeNo : 'undefined'
					}
					if (this.searchObj.userType == 'Internal') {
						this.driverOnBranch.push(driversDetailsObj);
					}else{
						this.driverOndistributor.push(driversDetailsObj);
					}
			
				}
		}else{
			let driversDetailsObj = {
				DriverName: 'No driver found',
				TripCode: 'No trip found',
				TripID: 0,
				RouteNumber: ''
			}
			if (this.searchObj.userType == 'Internal') {
				this.driverOnBranch.push(driversDetailsObj);
			}else{
				this.driverOndistributor.push(driversDetailsObj);
			}
	
		}
		
		if (this.driverOnBranch && this.driverOnBranch.length > 0 && checkcalltype === null) {
			this.tripFilterOption.DriverName = this.driverOnBranch[0].DriverName;    // assigning in model

		}
		if (this.driverOndistributor && this.driverOndistributor.length > 0 && checkcalltype === null) {
			this.tripFilterOption.DriverName = this.driverOndistributor[0].DriverName;    // assigning in model
		}
		  
		  this.driverChangeHandler(checkcalltype);
	
		  this.validateData();
	});
	}else if (this.tripFilterOption.branchId && this.filter.trackerType == 2) {
		
		this.getFestTechRouts(checkcalltype);
		
	}else {
		this.typeChangeHandler();
    }
	//this.cacheService.set("tripFilterOption", this.tripFilterOption);
  }
getFestTechRouts(checkcalltype:string = null){
	
	this.service.getTripsForFesTracker(this.selectedDate, this.tripFilterOption.branchId).subscribe((res) => {
		
		let festrackerTripData = res.FESTechRoute;
	
		if(festrackerTripData.length > 0){
			for (var i = 0; i < festrackerTripData.length; i++) {
			
				let driversDetailsObj = {
				  DriverName: festrackerTripData[i].DriverName,
				  TripCode: festrackerTripData[i].TripCode,
				  TripID: festrackerTripData[i].TripID,
				  RouteNumber: festrackerTripData[i].RouteNumber
				}
				this.driverOnBranch.push(driversDetailsObj);
			
			}
		}else{
			let driversDetailsObj = {
				DriverName: 'No driver found',
				TripCode: 'No trip found',
				TripID: 0,
				RouteNumber: ''
			}
				this.driverOnBranch.push(driversDetailsObj);
		}
		
		  if (this.driverOnBranch && this.driverOnBranch.length > 0) {
			 
			this.tripFilterOption.DriverName = this.driverOnBranch[0].DriverName;    // assigning in model
		  }
		
		  this.driverChangeHandler();
		   this.validateData();
	});
	
}
  // Fetch selected Trip
  tripChangeHandler() {
    const tripId = this.driverSpecTrips.filter(t => t.TripCode === +this.tripFilterOption.TripCode)[0].TripID;
	
    this.fetchTicketDetailsByTrip(tripId);
  }

  isSeasonal: boolean = false;
  // Fetch selected Driver
  driverChangeHandler(checkcalltype:string = null) {
    this.driverSpecTrips = [];
    if (this.searchObj.userType == 'Internal') {
		
      for (var i = 0; i < this.driverOnBranch.length; i++) {
        if (this.tripFilterOption.DriverName === this.driverOnBranch[i]['DriverName']) {
          let driverSpecObj = {
            TripCode: this.driverOnBranch[i].TripCode,
            TripID: this.driverOnBranch[i].TripID,
            RouteNumber: this.filter.trackerType == 1 ? this.driverOnBranch[i].RouteNumber : undefined
          };
          this.driverSpecTrips.push(driverSpecObj);
        }
      }
    } else if (this.searchObj.userType == 'External') {
      for (var i = 0; i < this.driverOndistributor.length; i++) {
        if (this.tripFilterOption.DriverName == this.driverOndistributor[i]['DriverName']) {
          if (!this.routeNo) {
			 
            if (this.driverOndistributor[i].RouteNumber != '' && this.driverOndistributor[i].RouteNumber.toString().indexOf("999") == -1) {
              this.routeNo = this.driverOndistributor[i].RouteNumber;
            } else if(this.driverOndistributor[i].RouteNumber === '') {
				this.routeNo = '';
              
            }
			 else {
				 this.routeNo = 'Unplanned';
            }
          }
          if (this.driverOndistributor[i].IsSeasonal) {
            this.isSeasonal = true;
          } else {
            this.isSeasonal = false;
          }
          //
          this.driverSpecTrips.push(
            {
              TripCode: this.driverOndistributor[i].TripCode,
              TripID: this.driverOndistributor[i].TripID,
              RouteNumber: this.routeNo
            }
          );
        }
      }
    }
    if (this.driverSpecTrips.length) {
      this.selectedTrip = [];
	  if(checkcalltype === null){
		  this.tripFilterOption.TripCode = this.driverSpecTrips[0].TripCode;
	  }
      
    }
	this.cacheService.set("tripFilterOption", this.tripFilterOption);
	if (this.cacheService.has("fetcehdtripID") && checkcalltype === 'yes' ) {
			
		this.cacheService.get("fetcehdtripID").subscribe((res) => {
		let tripId = JSON.parse(JSON.stringify(res));
		this.fetchTicketDetailsByTrip(tripId);
				
		});
		
	}
  }

  
  // Filter Markers in the Google Map based on Sequence Radio Button selection
  sequenceChangeHandler() {
    this.drawMapPath();
  }

  drawMapPath() {
    let el = this._elementRef.nativeElement.querySelector('.google-maps');
    GoogleMapsLoader.load((google) => {
      this.map = new google.maps.Map(el, {
        center: new google.maps.LatLng(32.736259, -96.864586),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      this.infowindow = new google.maps.InfoWindow();
      this.bounds = new google.maps.LatLngBounds();
      this.pinColor = "0000ff";
      this.pinImage = new google.maps.MarkerImage(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

      ///
      this.pinImage1 = new google.maps.MarkerImage(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

      this.pinImage2 = new google.maps.MarkerImage(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));
      ///

      //const selectedTrip = [{ PlannedLatitude: '32.736259', PlannedLongitude: '-96.864586' }, { PlannedLatitude: '32.7498', PlannedLongitude: '-96.8720' }, { PlannedLatitude: '32.7905', PlannedLongitude: '-96.8104' }, { PlannedLatitude: '32.8481', PlannedLongitude: '-96.8512' }]

      // If Planned Sequence Radio button is selected
      if (+this.filter.sequence === 1) {
        // this.drawPolyline(google, 1);
        // this.drawRoute(google, 1, this.selectedTrip);
        this.drawRoutesOnMap(google, 1, this.selectedTrip);
      } else if (+this.filter.sequence === 3) { // both planned and unplanned sequence together
        //this.drawPolyline(google, 2);
        // this.drawRoute(google, 1, this.selectedTrip);
        // this.drawRoute(google, 2, this.selectedTrip);
        this.drawRoutesOnMap(google, 1, this.selectedTrip);
        this.drawRoutesOnMap(google, 2, this.selectedTrip);
      } else {
        //this.drawPolyline(google, 3);
        // this.drawRoute(google, 2, this.selectedTrip);
        this.drawRoutesOnMap(google, 2, this.selectedTrip);
      }
    });
  }

  // function to sort the selectedTrip array by PlannedSequence
  comparator(a, b) {
    return a["PlannedSequence"] - b["PlannedSequence"];
  }

  pinTextColor = '';
  start: any = null;
  /**
   * Draw routes on map based on trip list
   * @param google 
   * @param sequence 
   * @param trips 
   */
  private drawRoutesOnMap(google: any, sequence: number, trips: any[]) {
    if (!trips || !trips.length) { return false };
    trips = trips.slice(0);
    // adding pushpin marker logic here
    let positionObj = {
      lat: null,
      long: null,
      startPt: null,
      endPt: null
    }
    let end = null;
    this.start = null;
    for (let i = 0; i < trips.length; i++) {
      // this.setMarkerAndTableColor(sequence, trips, i);
      // this.customiseMarkerIcon(google, sequence, trips, i);
      // positionObj = this.getMarkerPosition(google, sequence, trips, i);
      // this.plotMarkers(google, sequence, trips, i, positionObj);
      this.loadMarkers(google, sequence, trips, i, positionObj);
    }
  }

  private loadMarkers(google, sequence, trips, i, positionObj) {
    this.setMarkerAndTableColor(sequence, trips, i);
    this.customiseMarkerIcon(google, sequence, trips, i);
    positionObj = this.getMarkerPosition(google, sequence, trips, i);
    this.plotMarkers(google, sequence, trips, i, positionObj);
  }

  /**
   * used to set the color of the markers on the map and the left side table based of
   * various conditions
   * @param sequence 
   * @param trips 
   * @param i 
   */
  private setMarkerAndTableColor(sequence: number, trips: any[], i: number) {
    if (sequence == 2) {
      // changing color of the marker icon based on condition
      if (trips[i].TicketTypeID === 29) {
        this.pinColor = 'ffff00';   // yellow color for Did Not Service stops
        this.pinTextColor = '000';
        this.selectedTrip[i].pinColor = '#' + this.pinColor;
        this.selectedTrip[i].pinTextColor = '#' + this.pinTextColor;
      } else if (trips[i].OrderID == null) {
        this.pinColor = '0000ff';   // blue color for Unplanned Service
        this.pinTextColor = 'fff';
        this.selectedTrip[i].pinColor = '#' + this.pinColor;
        this.selectedTrip[i].pinTextColor = '#' + this.pinTextColor;
      } else if (trips[i].OrderID != null && trips[i].TicketNumber !== null) {
        this.pinColor = '90EE90';   // lightgreen color for Planned Service
        this.pinTextColor = '000';
        this.selectedTrip[i].pinColor = '#' + this.pinColor;
        this.selectedTrip[i].pinTextColor = '#' + this.pinTextColor;
      } else if (trips[i].OrderID != null && trips[i].TicketNumber == null) {
        this.pinColor = 'ff0000';   // red color for Skipped stops
        this.pinTextColor = 'fff';
        this.selectedTrip[i].pinColor = '#' + this.pinColor;
        this.selectedTrip[i].pinTextColor = '#' + this.pinTextColor;
      }
    }
    if (sequence === 1) {
      this.pinColor = '999900';   // red color for Skipped stops
      this.pinTextColor = 'fff';
      this.selectedTrip[i].pinColor = '#' + this.pinColor;
      this.selectedTrip[i].pinTextColor = '#' + this.pinTextColor;
    }
  }

  /**
   * used to customise marker icon based on the passed parameters
   * @param google 
   * @param sequence 
   * @param trips 
   * @param i 
   */
  private customiseMarkerIcon(google, sequence, trips, i) {
    // customising the marker icon here
    if (sequence === 2) {
      this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (trips[i].ActualSequence ? trips[i].ActualSequence : 0).toString() + "|" + this.pinColor + "|" + this.pinTextColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));
    } else if (sequence === 1) {
      if (trips[i].PlannedSequence != null) {
        this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (trips[i].PlannedSequence ? trips[i].PlannedSequence : 0).toString() + "|" + this.pinColor + "|" + this.pinTextColor,
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34));
      }
    }
  }

  /**
   * used to get the marker position based on lat and long
   * @param google
   * @param sequence 
   * @param trips 
   * @param i 
   */
  private getMarkerPosition(google, sequence, trips, i) {
    let positionObj = {
      lat: null,
      long: null,
      startPt: null,
      endPt: null
    }

    // start point of straight line

    if (sequence === 1) {
      if (trips[i].PlannedLatitude &&
        trips[i].PlannedLongitude &&
        +trips[i].PlannedLatitude != 0 &&
        +trips[i].PlannedLongitude != 0) {
        positionObj.lat = trips[i].PlannedLatitude;
        positionObj.long = trips[i].PlannedLongitude;
        if (!this.start) {
          var startPt = new google.maps.LatLng(trips[i].PlannedLatitude, trips[i].PlannedLongitude);
          positionObj.startPt = startPt;
          this.start = startPt;
        } else {
          var endPt = new google.maps.LatLng(trips[i].PlannedLatitude, trips[i].PlannedLongitude);
          positionObj.endPt = endPt;
          positionObj.startPt = this.start;
          this.start = endPt;
        }
      }
    }

    if (sequence === 2) {
      if (trips[i].ActualLatitude &&
        trips[i].ActualLongitude &&
        +trips[i].ActualLatitude != 0 &&
        +trips[i].ActualLongitude != 0) {
        positionObj.lat = trips[i].ActualLatitude;
        positionObj.long = trips[i].ActualLongitude;
        if (!this.start) {
          var startPt = new google.maps.LatLng(trips[i].ActualLatitude, trips[i].ActualLongitude);
          positionObj.startPt = startPt;
          this.start = startPt;
        } else {
          var endPt = new google.maps.LatLng(trips[i].ActualLatitude, trips[i].ActualLongitude);
          positionObj.endPt = endPt;
          positionObj.startPt = this.start;
          this.start = endPt;
        }
      }
    }

    return positionObj;
  }

  /**
   * used to plot markers on the map
   * @param google
   * @param sequence 
   * @param trips 
   * @param i 
   * @param position 
   */
  private plotMarkers(google, sequence, trips, i, position) {
    var strokeColour = '';
    if (sequence == 2) {
      strokeColour = 'brown'
    } else {
      strokeColour = '#999900'
    }
    if (position.startPt && position.endPt) {
      var polyline = new google.maps.Polyline({
        path: [position.startPt, position.endPt],
        strokeColor: strokeColour,
        strokeWeight: 2,
        strokeOpacity: 1
      });
      polyline.setMap(this.map);
      this.bounds.extend(position.startPt);
      this.bounds.extend(position.endPt);
    } else if (position.startPt && !position.endPt) {
      // polyline.setMap(this.map);
      this.bounds.extend(position.startPt);
    } else if (!position.startPt && position.endPt) {
      // polyline.setMap(this.map);
      this.bounds.extend(position.endPt);
    }

    if (position.lat && position.long) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.lat, position.long),
        map: this.map,
        icon: this.pinImage
      });

      google.maps.event.addListener(marker, 'click', ((marker, i) => {
        let infowindowContent = '';
        if (trips[i].CustomerName) {
          infowindowContent += 'Customer Name : ' + trips[i].CustomerName + '<br>';
        } else {
          infowindowContent += 'Customer Name : ' + '-' + '<br>';
        }
        if (trips[i].TotalSale != null || trips[i].TotalSale != undefined
          || trips[i].TaxAmount != null || trips[i].TaxAmount != undefined) {
          var totalInvoice = trips[i].TotalSale.fpArithmetic("+", trips[i].TaxAmount || 0);
          if (typeof totalInvoice === "number" && isFinite(totalInvoice) && Math.floor(totalInvoice) === totalInvoice) {
            totalInvoice = totalInvoice + ".00";
          }
          this.filter.trackerType == 1 && (infowindowContent += 'Total Invoice : $' + totalInvoice + '<br>');
        } else {
          this.filter.trackerType == 1 && (infowindowContent += 'Total Invoice : $' + '0.00' + '<br>');
        }

        if (this.filter.trackerType == 2 && trips[i].AssetName != null) {
          infowindowContent += 'Asset Name : ' + trips[i].AssetName + '<br>';
        }

        if (this.filter.trackerType == 2 && trips[i].BarCode != null) {
          infowindowContent += 'Bar Code : ' + trips[i].BarCode + '<br>';
        }

        if (trips[i].CashAmount != null || trips[i].CashAmount != undefined
          || trips[i].CheckAmount != null || trips[i].CheckAmount != undefined) {
          var receivedAmt = trips[i].CashAmount + trips[i].CheckAmount;
          if (typeof receivedAmt === "number" && isFinite(receivedAmt) && Math.floor(receivedAmt) === receivedAmt) {
            receivedAmt = receivedAmt + ".00";
          }
          this.filter.trackerType == 1 && (infowindowContent += 'Total Received Amount : $' + receivedAmt + '<br>');
        } else {
          this.filter.trackerType == 1 && (infowindowContent += 'Total Received Amount : $' + '0.00' + '<br>');
        }
        return () => {
          this.infowindow.setContent(infowindowContent);
          this.infowindow.open(this.map, marker);
        }
      })(marker, i));
    }
    this.map.fitBounds(this.bounds);      // auto-zoom
    this.map.panToBounds(this.bounds);    // auto-center
  }

 
  viewTicket(ticketID) {
    if (ticketID) {
      const reportUrl = this.filter.trackerType ?
        this.filter.trackerType == 1 ?
          environment.reportEndpoint + "?Rtype=TK&TicketID=" + ticketID :
          environment.reportEndpoint + "?Rtype=WONS&WOID=" + ticketID + "&LoggedInUserID=" + this.user.UserId : '';
      window.open(reportUrl, "Ticket", "width=900,height=600,resizable=yes,scrollbars=1");
    } else {
      this.notification.error("Ticket preview unavailable!!");
    }
  }


  distributors: any = [];
  typeChangeHandler() {
    if (this.filter.trackerType == 2) {
		this.searchObj.userType = 'Internal';
      this.filter.sequence = 3;
    }/* else if (this.searchObj.userType == 'External') {
      this.filter.sequence = 2;
    } */else if(this.filter.trackerType == 1) {
      this.filter.sequence = 1;
    }
	
	 if (this.allBranches.length == 2 && this.searchObj.userType == 'Internal') {
				let AllBranches = JSON.parse(JSON.stringify(this.allBranches));
				AllBranches.shift();
				this.branches = AllBranches;
                this.tripFilterOption.branchId = AllBranches[0].value;
				this.branchChangeHandler();
	}else{
		 this.tripFilterOption.branchId = 0;
	}
   
	if (!this.isDistributor) {
		 this.tripFilterOption.DistributorMasterID = 0;
	}
   
	this.driverOnBranch = [];
	this.driverOndistributor = [];
	this.driverSpecTrips = [];
	this.buttonAction = false;
	 this.selectedTrip = [];
	 this.googlemapdivStatus = true;
	
	if (this.isDistributor) {
		 this.branchChangeHandler();
		
	}
   
  }

  DistributorCopackerID = 0;
  DistributorTrips = [];
  driverOndistributor = [];
  distributorChangeHandler() {
    this.driverOndistributor = [];
	this.routeNo = '';
    if (this.driverOndistributor.length > 0 && this.tripFilterOption.DistributorMasterID > 0) {
      this.tripFilterOption.DriverName = this.driverOndistributor[0].DriverName;    // assigning in model
      this.tripFilterOption.TripCode = this.driverOndistributor[0].TripCode;        // assigning in model
    }
   // this.driverChangeHandler();
  }
}
