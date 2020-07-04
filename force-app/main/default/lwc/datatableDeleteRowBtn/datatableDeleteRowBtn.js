import { LightningElement, api } from 'lwc';
import { baseNavigation } from 'lightning/datatableKeyboardMixins';
import template from './datatableDeleteRowBtn.html';

export default class DatatableDeleteRowBtn extends baseNavigation(LightningElement) {
    @api rowId;

    // Required for mixins
    render() {
        return template;
    }

    fireDeleteRow() {
        const event = CustomEvent('deleterow', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                rowId: this.rowId
            }
        });
        this.dispatchEvent(event);
    }
}
