import LightningDatatable from 'lightning/datatable';
import icon from './icon.html';
import picklistEditable from './CustomEditPicklist.html';
import picklistNotEditable from './picklistvalue.html';
import displaytext from './displaytext.html';
import areatext from './editarea.html';
export default class CustomTypeData extends LightningDatatable  {
static customTypes={
    picklistColumn: {
        template: picklistNotEditable,
        editTemplate: picklistEditable,
        standardCellLayout: true,
        typeAttributes : ['label', 'placeholder', 'options', 'value', 'context', 'variant','name']
    },
    picklisticon: {
        template: icon,
        editTemplate: picklistEditable,
        standardCellLayout: true,
        typeAttributes : ['label', 'placeholder', 'options', 'value', 'context', 'variant','name']
    },
    Comment: {
        template: displaytext,
        editTemplate: areatext,
        standardCellLayout: true,
        typeAttributes: ['label', 'placeholder', 'value', 'context', 'variant', 'name']
    }
};
}