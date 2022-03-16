import { LightningElement, wire, api } from 'lwc';
import projectStage from '@salesforce/apex/ProjectDragAndDropComponentHandler.getAllProjectStage';
import projects from '@salesforce/apex/ProjectDragAndDropComponentHandler.getAllProject';
import updateProject from '@salesforce/apex/ProjectDragAndDropComponentHandler.updateProject';
import updateStageRank from '@salesforce/apex/ProjectDragAndDropComponentHandler.updateStageRank';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class DragAndDropProjectLwc extends LightningElement {
    stageList
    projectList
    recordId
    currentStage
    currentStageRank
    @wire(projectStage)stageList;
    /*wiredListView({error, data}){
        if(data){
            console.log(data)
            //ooutput => {Id: 'a0M5j000001qTEHEA2', OwnerId: '0055j000002HKVTAA4', Name: 'Initiation', Stage_Rank__c: 1, Owner: {…}}
        }
        if(error){
            console.error(error)
        }       
        
    }*/
    @wire(projects)projectList;

    handleListItemDrag(event){
        //this.recordId = event.detail
        this.recordId = event.detail.recordId;
        this.cardMaxRank = event.detail.rank;
    }
    
    handleItemDrop(event){
        let stage = event.detail.stg;
        let rank = event.detail.idx;
        if(rank == undefined) {
            rank=this.cardMaxRank;
        }
        this.updateHandler(stage,rank);
    }
    updateHandler(stage,rank){

        updateProject({projectId:this.recordId,newStage:stage,newRank:rank})
        .then(()=>{
            //this.showToast();  
            return refreshApex(this.projectList);  
        }).catch(error=>{
            console.error(error)
        })
        
    }
    /*** Re-Ordering code::start ***/
    cancel(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    handleDragComplete(event) {
        const detail = { name:event.target.dataset.stage, id:event.target.dataset.id }
        if( event.target.dataset.stage != undefined || event.target.dataset.id != undefined ) {
            
            // console.log(this.currentStageRank+' => '+this.currentStage);console.log(event.target.dataset.stage)console.log(event.target.dataset.id)
            updateStageRank({currentStage:this.currentStage,currentStageRank:this.currentStageRank,targetStage:event.target.dataset.stage,targetStageRank:event.target.dataset.id})
            .then(()=>{
                return refreshApex(this.stageList);  
            }).catch(error=>{
                console.error(error)
            })
        }
        this.dispatchEvent(
            new CustomEvent(
                'endmove',
                {detail}
            )
        )
    }

    handleDragStart(event) {
        const detail = { name:event.target.dataset.stage, id:event.target.dataset.id }
        this.currentStage = event.currentTarget.dataset.stage;
        this.currentStageRank = event.currentTarget.dataset.id;
       
        this.dispatchEvent(
            new CustomEvent(
                'startmove',
                {detail}
            )
        )
    }

    /*** Re-Ordering code::End ***/
    showToast() {
        this.dispatchEvent(
            new ShowToastEvent({
                title:'Success',
                message:'Stage updated Successfully',
                variant:'success'
            })
        )
    }
    
}