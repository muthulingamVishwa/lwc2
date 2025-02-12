import { LightningElement,wire,track} from "lwc";
import  getAccounts  from "@salesforce/apex/getAccounttoDataTable.getAccounttoData";
import { refreshApex } from '@salesforce/apex';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import  OBJECT_ACCOUNT from "@salesforce/schema/Account";
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import STATUS_FIELD from "@salesforce/schema/Account.Status__c";
import COUNTRY_FIELD from "@salesforce/schema/Account.Country__c";

const column=[{ label: 'Name', fieldName: 'Contactlink',type:'url', 
    typeAttributes: {
        label:{
            fieldName:"Name"
        },
        target:"_blank"
      } 
    },
    { label: 'Country', fieldName: 'Country__c', type: 'picklistColumn', editable: true,
        typeAttributes:{
            placeholder: 'Choose Country',
            options:{fieldName:"countrypicks"},
            value:{fieldName:'Country__c'},
            context:{fieldName:'Id'}
        } },
    { label: 'Status', fieldName: 'Status__c', type: 'picklisticon', editable: true ,
        typeAttributes:{
            placeholder: 'Choose Status',
            options:{fieldName:"Statuspicks"},
            value:{fieldName:'Status__c'},
            context:{fieldName:'Id'}
        }
    },
    { label: 'Account Activation Date', fieldName: 'Account_Activation_Date__c', type: 'date-local', editable: true },
    { 
        label: 'Comments', 
        fieldName: 'Comments__c', 
        type: 'Comment', 
        editable: true,
        typeAttributes: {
            placeholder: 'Enter Comments',
            value: { fieldName: 'Comments__c' } || '',  // Ensure a default value
            context: { fieldName: 'Id' }
        } 
    }
    

];
export default class AccountDataTable extends LightningElement {
  
    columns=column;
    Accountdata=[];
    wiredAccountResult;
    StatusPicklistValue;
    countrypicklistValue;
     
 
    @wire(getObjectInfo,{objectApiName:OBJECT_ACCOUNT})
    objectInfo;


    @wire(getPicklistValues,{
        recordTypeId:"$objectInfo.data.defaultRecordTypeId",
        fieldApiName: STATUS_FIELD
    })
    stPicklistValue({data,error}){
            if(data){
                console.log(data);
                this.StatusPicklistValue=data.values;
          
            }else{
                console.log('dataq');
                console.log(JSON.stringify(error));
            }
        }
        
    @wire(getPicklistValues,{
            recordTypeId:"$objectInfo.data.defaultRecordTypeId",
            fieldApiName:COUNTRY_FIELD})ctPicklistValue({data,error}){
                if(data){
                    this.countrypicklistValue=data.values;
                    console.log('2');
                } else if (error) {
                    console.error('Error fetching picklist values', error);
                }
            }

    @wire(getAccounts,{pickList: '$countrypicklistValue'}) wireReocrd(result){  
        this.wiredAccountResult=result;
        if(result.data){
            this.Accountdata=result.data.map((record)=>{
                let Contactlink="/"+record.Id;
                let Statuspicks=this.StatusPicklistValue;
                let countrypicks=this.countrypicklistValue;
                return{...record,Contactlink: Contactlink,Statuspicks:Statuspicks,countrypicks:countrypicks} 
            })
        }else if(result.errer){
            console.log(result.errer);
        }
    }

 handleSave(event) {
        let records = event.detail.draftValues;
        let updatesrecord = records.map(curr => ({ fields: { ...curr } }));
    
         Promise.all(updatesrecord.map(curr => updateRecord(curr))).then((result)=>{
           
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: result.length+'record update successfully',
                    variant: 'success'
                })
            );
            this.draftValues=[];
           return refreshApex(this.wiredAccountResult);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating records',
                    message: error.body ? error.body.message : error.message,
                    variant: 'error'
                })
            );
            this.draftValues=[];
           refreshApex(this.wiredAccountResult);
        });

      

    }

    datachange(event){
        console.log('sfsa');
        console.log(JSON.stringify(event));
    }
}