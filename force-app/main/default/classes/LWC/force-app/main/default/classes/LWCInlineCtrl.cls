public  class LWCInlineCtrl {
    @AuraEnabled
    public static List<Contact> getContacts() {
        return [SELECT Id, Name, FirstName, LastName, GenderIdentity, DoNotCall FROM Contact];
    }
}