import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { IActivity, Activity } from '../models/Activity';
import { ISlot, Slot } from '../models/Slot';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIconRegistry } from '@angular/material';
import { AddActivityDialogComponent } from '../add-activity-dialog/add-activity-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../services/activity.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { EventService } from '../services/event.service';
import { Event } from '../models/Event';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ActivitiesComponent implements OnInit, OnDestroy {
    displayedColumns = ['name', 'activityDate', 'duration', 'numberOfSlots', 'activityActions'];

    dataSource = new MatTableDataSource();

	slotsDisplayedColumns = ['activityName', 'slots'];
	slotsSource = new MatTableDataSource();

    eventId;
	paramsSubscription;
	event: Event = new Event();

	constructor(public dialog: MatDialog,
				private route: ActivatedRoute,
				private router: Router,
				private eventService: EventService,
				private activityService: ActivityService,
				iconRegistry: MatIconRegistry, sanitizer: DomSanitizer
	) {
		iconRegistry.addSvgIcon(
			'delete',
			sanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete.svg'));
    }

    ngOnInit() {
		this.paramsSubscription = this.route.params.subscribe(params => {
			this.eventId = params['eventId'];

			// get event
			this.getEvent();

			// get activities
			this.getActivities();
		});
	}

	ngOnDestroy(): void {
		this.paramsSubscription.unsubscribe();
	}


	isParticipantAvailable(slot: Slot) {
		if (slot.participant) {
			return true;
		} else {
			return false;
		}
	}

	getEvent(): void {
		this.eventService.getEvent(this.eventId)
				.subscribe(e => this.event = e);
	}

	getActivities(): void {
		this.activityService.getActivities(this.eventId)
				.subscribe(activities => {
					this.dataSource.data = activities;
					this.slotsSource.data = activities;
				});
	}

	deleteActivity(activity) {
		const confirmDialog = this.dialog.open(ConfirmModalComponent, {
			width: '300px',
			data: {
				eventId: this.eventId,
				activityId: activity
			},
			disableClose: true
		});

		confirmDialog.afterClosed().subscribe(message => {
			if (message) {
				console.log('Confirmed by user');

				this.activityService.deleteActivity(this.eventId, activity._id)
					.subscribe((a: Activity) => {
						this.getActivities();
					});
			} else {
				console.log('Cancel clicked');
			}
		});
	}

    addActivity(): void {
		const dialogRef = this.dialog.open(AddActivityDialogComponent, {
		  width: '450px',
		  data: {
              eventId: this.eventId
          },
		  disableClose: true
		});
		dialogRef.afterClosed().subscribe(newActivity => {
			if (newActivity) {
				this.getActivities();
				console.log('new activity added');
			} else {
				console.log('Cancel clicked');
			}
		});
	}

	publichEvent(): void {
		this.router.navigate(['publish', this.eventId]);
	}

}


// const ACTIVITIES_DATA: Activity[] = [
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	},
// 	{
// 		name: 'abc',
// 		activityDate: '2017-11-11T21:18:03.092Z',
// 		duration: 3,
// 		numberOfSlots: 3,
// 		slots: []
// 	}
// ];
