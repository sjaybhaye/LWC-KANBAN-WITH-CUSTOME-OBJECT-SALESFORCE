import { LightningElement, api } from 'lwc';

export default class DragAndDropList extends LightningElement {
    @api stg
    @api project
    
    handleItemDrag(evt){
        const event = new CustomEvent('listitemdrag',{
            detail:evt.detail
        })
        
        this.dispatchEvent(event)
    }
    handleDragOver(evt){
        evt.preventDefault()
    }
    handleDrop(evt){
        let dataIndex = evt.target.dataset.index
        if(dataIndex==0 ){
            dataIndex =1
        }
        const details = { stg:this.stg, idx: dataIndex};
        const event = new CustomEvent('itemdrop',{
            detail:details
        })
        this.dispatchEvent(event)
    }
}