import { Component, OnInit } from '@angular/core';
import { Campaign } from 'src/app/models/Campaign';
import { RestCampaignsService } from 'src/app/services/rest/rest-campaigns.service';
import { RestDonationsService } from 'src/app/services/rest/rest-donations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Donation } from 'src/app/models/Donation';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent implements OnInit {
  campaign: Campaign;
  donations: Donation[];
  showDetails = false;
  totalDonated: number;

  constructor(
    public service: RestCampaignsService,
    public service2: RestDonationsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.serviceGetCampaign();
  }

  /**
   *
   * @param id
   */
  activateCampaign(id: string) {
    if (this.campaign.status === 'disabled') {
      this.campaign.status = 'active';
      this.serviceUpdateCampaign(id);
    } else {
      console.log(
        'Cant deactivate this campaign, because it isn´t deactivated. '
      );
    }
  }

  /**
   *
   * @param id
   */
  deactivateCampaign(id: string) {
    if (this.donations !== undefined) {
      this.campaign.status = 'disabled';
      this.serviceUpdateCampaign(id);
    } else {
      console.log(
        'Cant deactivate this campaign, because it has no donations. '
      );
    }
  }

  /**
   *
   */
  serviceGetCampaign() {
    this.service
      .getCampaign(this.route.snapshot.params['id'])
      .subscribe((data: Campaign) => {
        this.campaign = data;
        this.serviceGetDonations();
      });
  }

  /**
   *
   */
  serviceGetDonations() {
    this.service2
      .getCampaignDonations(this.route.snapshot.params['id'])
      .subscribe((data: Donation[]) => {
        if (data.length !== 0) {
          this.donations = data;
          this.getCampaignsCurrentAmount(this.campaign);
        }
      });
  }

  /**
   *
   * @param campaign
   */
  getCampaignsCurrentAmount(campaign) {
    let amount = 0;
    for (let i = 0; i < this.donations.length; i++) {
      amount += this.donations[i].amount;
    }
    if (campaign.currentAmount < amount) {
      campaign.currentAmount = amount;
    }
  }
  /**
   *
   * @param id
   */
  serviceUpdateCampaign(id: string) {
    this.service.updateCampaign(id, this.campaign).subscribe(
      res => {
        console.log(res);
        this.router.navigate(['/campaign-details/' + res._id]);
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   *
   * @param id
   */
  serviceDeleteCampaign(id: string) {
    this.service.deleteCampaign(id).subscribe(
      res => {
        this.router.navigate(['/campaigns']);
      },
      err => {
        console.log(err);
      }
    );
  }
}
