public with sharing class ProjectDragAndDropComponentHandler {
	@AuraEnabled(cacheable=true)
    public static List<Project_Stage__c> getAllProjectStage(){
        Id loggedInUserId = UserInfo.getUserId();
        return [SELECT Id,Owner.Name,Name,Stage_Rank__c from Project_Stage__c WHERE OwnerId = :loggedInUserId  ORDER BY Stage_Rank__c];
    }
    @AuraEnabled(cacheable=true)
    public static List<Project__c> getAllProject(){
        return [SELECT Id,Name,Project_Rank__c,Project_Stage__r.Name from Project__c ORDER BY Project_Rank__c,Project_Stage__c];
    }
    @AuraEnabled
    public static void updateProject(Id projectId, String newStage, Decimal newRank ){
        try {
            Project_Stage__c proStage = [SELECT Id,Name from Project_Stage__c where Name=:newStage LIMIT 1];
            Project__c projectDetail = [SELECT Id,Name,Project_Rank__c,Project_Stage__c from Project__c where id=:projectId];
            projectDetail.Project_Rank__c = newRank;
            projectDetail.Project_Stage__c = proStage.Id;
            Database.update(projectDetail);
        } catch(Exception e) {
            System.debug('An unexpected error has occurred: ' + e.getMessage());
        }
    }
    @AuraEnabled
    public static void updateStageRank(String currentStage, Decimal currentStageRank, String targetStage, Decimal targetStageRank ) {
        List<Project_Stage__c> updatedList = [SELECT Id,Owner.Name,Name,Stage_Rank__c from Project_Stage__c ORDER BY Stage_Rank__c];

        for(Project_Stage__c li : updatedList) {
            if(targetStageRank < currentStageRank){
                if(li.Stage_Rank__c == currentStageRank && li.Name == currentStage) {
                    li.Stage_Rank__c = targetStageRank;
                } else {
                    li.Stage_Rank__c = li.Stage_Rank__c +1;
                }
            } else if(targetStageRank > currentStageRank) {
                if(li.Stage_Rank__c == currentStageRank && li.Name == currentStage) {
                    li.Stage_Rank__c = targetStageRank;
                } else {
                    li.Stage_Rank__c = li.Stage_Rank__c -1;
                }
            }
        }
        update updatedList;
    }
}