import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../http.service';
import { GlobalService } from '../global.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private httpService: HttpService, public global: GlobalService, private events: Events, private ref: ChangeDetectorRef) {
    this.events.subscribe('un_read_count_changed', () => {
      this.ref.detectChanges();
    });
  }

}
