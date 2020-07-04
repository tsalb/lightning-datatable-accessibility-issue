import LightningDatatable from 'lightning/datatable';
import deleteRow from './deleteRow.html';

export default class datatableExtension extends LightningDatatable {
    static customTypes = {
        deleteRowButton: {
            template: deleteRow,
            standardCellLayout: true
        }
    };
}
