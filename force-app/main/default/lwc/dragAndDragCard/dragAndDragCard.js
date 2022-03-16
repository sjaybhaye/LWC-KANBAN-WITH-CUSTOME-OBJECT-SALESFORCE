import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'

export default class DragAndDragCard extends NavigationMixin(LightningElement) {
    @api stg
    @api record
    
    get isSameStage() {
        
        return this.stg == this.record.Project_Stage__r.Name;
       
    }
    
    navigateOppHandler(event){
        event.preventDefault()
        this.navigateOppHandler(event.target.dataset.id, 'Project__c')
    }

    navigateOppHandler(Id, apiName) {
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:Id,
                objectApiName:apiName,
                actionName:'view',
            },
        });
    }

    itemDragStart() {
       const details = { recordId:this.record.Id, rank:this.record.Project_Rank__c }
       const event = new CustomEvent('itemdrag',{
           detail:details
       })
       
       this.dispatchEvent(event)
    }
 
}