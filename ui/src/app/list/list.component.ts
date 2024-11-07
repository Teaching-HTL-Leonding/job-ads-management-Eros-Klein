import {Component, inject, signal, OnInit} from '@angular/core';
import {ad, AdService} from '../ad.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  adService = inject(AdService);

  ads = signal<ad[]>([]);

  constructor() {

  }

  async delete(ad : ad){
    await this.adService.deleteAd(ad.id);
    this.ads.set(await this.adService.getAllAds());
  }

  async ngOnInit(){
    this.ads.set(await this.adService.getAllAds());
  }
}
