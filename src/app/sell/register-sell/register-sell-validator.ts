import { FormControl } from '@angular/forms';
export class RegisterSellValidators {
    static checkExpiryDate(control: FormControl): any {
        if (control.hasOwnProperty('_parent')) {
            if (control.value !== null) {
                let start_date = control['_parent']['controls']['availability_date']['value']
                if (start_date != null) {
                    if (control.value <= start_date) {
                        return { 'error': 'Expiry date should greater than availability date' };
                    }
                } else {
                    return { 'error': 'You cannot enter expiry date without availability date' };
                }
            }
        }
    }

    static checkTermsAndConditions(control: FormControl): any {
        if (control.hasOwnProperty('_parent')) {
            if (control.value !== null) {
                if (!control.value) {
                    return { 'error': '' };
                }
            }
        }
    }
}
