import { Component, OnInit } from '@angular/core';
import { RestDonationsService } from '../../../services/rest/rest-donations.service';
import { Donation } from 'src/app/models/Donation';
import { RestCampaignsService } from 'src/app/services/rest/rest-campaigns.service';
import { Campaign } from 'src/app/models/Campaign';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-donations-list',
  templateUrl: './donations-list.component.html',
  styleUrls: ['./donations-list.component.css']
})
export class DonationsListComponent implements OnInit {
  title: string;
  showStatus: boolean;
  showMap: boolean;

  donations: Donation[];
  campaignsName: string[];

  constructor(
    public service: RestDonationsService,
    public service2: RestCampaignsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      switch (params['status']) {
        case 'all':
          this.getAllDonations();
          break;
        case 'processed':
          this.getProcessedDonations();
          break;
        case 'in-processing':
          this.getInProcessingDonations();
          break;
        case 'canceled':
          this.getCanceledDonations();
          break;
      }
    });
  }

  /**
   *
   */
  getAllDonations() {
    this.service.getDonations().subscribe((data: Donation[]) => {
      this.donations = [];
      this.donations = data;
      this.title = 'All donations';
      this.getCampaignNameOfDonations();
      this.showStatus = true;
    });
  }

  /**
   *
   */
  getProcessedDonations() {
    this.service.getProcessedDonations().subscribe((data: Donation[]) => {
      this.donations = [];
      this.donations = data;
      this.title = 'Processed Donations';
      this.getCampaignNameOfDonations();
      this.showStatus = false;
    });
  }

  /**
   *
   */
  getInProcessingDonations() {
    this.service.getInProcessingDonations().subscribe((data: Donation[]) => {
      this.donations = [];
      this.donations = data;
      this.title = 'In-Processing Donations';
      this.getCampaignNameOfDonations();
      this.showStatus = false;
    });
  }

  /**
   *
   */
  getCanceledDonations() {
    this.service.getCanceledDonations().subscribe((data: Donation[]) => {
      this.donations = [];
      this.donations = data;
      this.title = 'Canceled Donations';
      this.getCampaignNameOfDonations();
      this.showStatus = false;
    });
  }

  /**
   *
   */
  getCampaignNameOfDonations() {
    this.campaignsName = [];
    for (let i = 0; i < this.donations.length; i++) {
      this.service2
        .getCampaign(this.donations[i].campaign)
        .subscribe((data: Campaign) => {
          this.campaignsName[i] = data.name;
        });
    }
  }

  toggleMap() {
    if (this.showMap === true) {
      this.showMap = false;
    } else {
      this.showMap = true;
    }
  }
}
