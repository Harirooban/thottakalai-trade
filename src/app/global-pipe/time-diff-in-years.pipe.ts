import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeDiffInYears'
})
export class TimeDiffInYearsPipe implements PipeTransform {

  transform(sowing_date: any, args?: any): any {

    var given_date = moment(sowing_date, "YYYY-MM-DD");
    var current_date = moment().startOf('day');

    //Difference in number of days
    var diff_days = moment.duration(current_date.diff(given_date)).asDays();
    if (diff_days === 0) {
      return 'Today';
    } else if (diff_days <= 365) {
      return String(diff_days) + ' Days ago';
    } else {
      //Difference in number of Month
      var diff_duration = moment.duration(current_date.diff(given_date));

      // console.log(diff_duration.years());
      // console.log(diff_duration.months());
      // console.log(diff_duration.days());

      return String(diff_duration.years()) + ' Years ago' + String(diff_duration.months()) + ' Months ago';
    }
  }

}
