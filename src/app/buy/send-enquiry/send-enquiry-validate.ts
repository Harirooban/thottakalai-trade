import { FormControl } from '@angular/forms';
export class SendEnquiryValidator {
    static checkEnquiryNote(control: FormControl): any {
        if (control.hasOwnProperty('_parent')) {
            if (control.value !== null && control.value !== '') {
                let enquiry_note_temp = control.value;
                enquiry_note_temp = enquiry_note_temp.trim();
                console.log(enquiry_note_temp);
                if (enquiry_note_temp === '') {
                    return { 'error': 'Please provide valid enquiry' };
                }
            }
        }
    }
    static checkProductValue(control: FormControl): any {
        if (control.hasOwnProperty('_parent')) {
            if (control.value !== null && control.value !== '') {
                let product_value = control.value;
                product_value = product_value.trim();
                console.log(product_value);
                if (product_value === '') {
                    return { 'error': '' };
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
