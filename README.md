# lightning/datatableKeyboardMixins error

Fresh scratch org, spring 20 (also tried on summer 20 and same issue).

Seems to be a platform aura gack when copy pasting straight from the `lightning-datatable` docs.

Removing lines of code related to `lightning/datatableKeyboardMixins` allows the custom data type to be used.

For simplicity, references to custom data types passing of typeAttributes data has been omitted.

## Repro steps

1. Clone this repo to a desired directory.

```
git clone https://github.com/tsalb/lightning-datatable-accessibility-issue
```

2. Create Default Scratch Org

3. Push

4. Open Default Scratch Org

5. App Launcher => Datatable Error (App)
    - I've forced standard app visibility to hidden in the profile, there should only be one app in the app launcher

## Unable to repro in Playground

Interestingly enough, this is not reproducible in the Playground:

https://developer.salesforce.com/docs/component-library/tools/playground/I93mYl8MU/19/edit

## Error on load

![aura-error](/readme-images/aura-error.png?raw=true)

```
afterRender threw an error in 'c:datatableExample' [Access denied: {"from":{"namespace":"system"},"to":{"namespace":"c"}}]
```

## Stack Trace

```
le()@https://static.lightning.force.com/cs68/auraFW/javascript/ozbOZt5SYUotl8he3imvcA/aura_prod.js:29:2516
On()@https://static.lightning.force.com/cs68/auraFW/javascript/ozbOZt5SYUotl8he3imvcA/aura_prod.js:29:34982
Hn.getPrototypeOf()@https://static.lightning.force.com/cs68/auraFW/javascript/ozbOZt5SYUotl8he3imvcA/aura_prod.js:29:36342
cr()@https://static.lightning.force.com/cs68/auraFW/javascript/ozbOZt5SYUotl8he3imvcA/aura_prod.js:4:30845
ir()@https://static.lightning.force.com/cs68/auraFW/javascript/ozbOZt5SYUotl8he3imvcA/aura_prod.js:4:30907
{anonymous}()@https://static.lightning.force.com/cs68/auraFW/javascript/ozbOZt5SYUotl8he3imvcA/aura_prod.js:4:18366
Object.create()@https://static.lightning.force.com/cs68/auraFW/javascript/ozbOZt5SYUotl8he3imvcA/aura_prod.js:4:18454
sn()@https://static.lightning.force.com/cs68/auraFW/javascript/ozbOZt5SYUotl8he3imvcA/aura_prod.js:4:14668
fn()@https://static.lightning.force.com/cs68/auraFW/javascript/ozbOZt5SYUotl8he3imvcA/aura_prod.js:4:15518
```

#### datatableExtension LWC

```js
// datatableExtension.js
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
```

```html
<!-- datatableExtension/deleteRow.html -->
<template>
    <c-datatable-delete-row-btn data-navigation="enable" row-id="{value}"></c-datatable-delete-row-btn>
</template>
```

#### datatableDeleteRowBtn LWC

```html
<!-- datatableDeleteRowBtn.html -->
<template>
    <div style="text-align: center;">
        <lightning-button-icon icon-name="utility:delete" onclick="{fireDeleteRow}"> </lightning-button-icon>
    </div>
</template>
```

```js
// datatableDeleteRowBtn.js
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
```

#### datatableExample LWC

```html
<!-- datatableExample.html -->
<template>
    <div style="text-align: center;">
        <lightning-button-icon icon-name="utility:delete" onclick="{fireDeleteRow}"> </lightning-button-icon>
    </div>
</template>
```

```js
// datatableExample.js
import { LightningElement } from 'lwc';

const COLUMNS = [
    { label: 'Opportunity name', fieldName: 'opportunityName', type: 'text' },
    {
        label: 'Confidence',
        fieldName: 'confidence',
        type: 'percent',
        cellAttributes: { iconName: { fieldName: 'trendIcon' }, iconPosition: 'right' }
    },
    { label: 'Amount', fieldName: 'amount', type: 'currency', typeAttributes: { currencyCode: 'EUR' } },
    { label: 'Contact Email', fieldName: 'contact', type: 'email' },
    { label: 'Contact Phone', fieldName: 'phone', type: 'phone' },
    {
        label: '',
        type: 'deleteRowButton',
        fieldName: 'id',
        fixedWidth: 70
    }
];

const DATA = [
    {
        id: 'a',
        opportunityName: 'Cloudhub',
        confidence: 0.2,
        amount: 25000,
        contact: 'jrogers@cloudhub.com',
        phone: '2352235235',
        trendIcon: 'utility:down'
    },
    {
        id: 'b',
        opportunityName: 'Quip',
        confidence: 0.78,
        amount: 740000,
        contact: 'quipy@quip.com',
        phone: '2352235235',
        trendIcon: 'utility:up'
    }
];

export default class DatatableExample extends LightningElement {
    data = DATA;
    columns = COLUMNS;
}
```

## Working example with extension commented out on datatableDeleteRowBtn

```js
// datatableDeleteRowBtn.js WORKING
import { LightningElement, api } from 'lwc';
import { baseNavigation } from 'lightning/datatableKeyboardMixins'; // not used
import template from './datatableDeleteRowBtn.html'; // not used

export default class DatatableDeleteRowBtn extends LightningElement {
    @api rowId;

    // Required for mixins
    // render() {
    //     return template;
    // }

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
```
