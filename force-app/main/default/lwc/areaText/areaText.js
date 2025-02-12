import { LightningElement,api,track } from 'lwc';

export default class AreaText extends LightningElement {
    @track isViewMode = true; // Determines whether the component is in view or edit mode
    @track value = 'Initial text'; // The value to display or edit

    // Switch from view mode to edit mode when the div is clicked
    toggleEdit() {
        this.isViewMode = false;
    }

    // Update the value as the user types in the textarea
    handleChange(event) {
        this.value = event.target.value;
    }

    // Save the edited value and switch back to view mode when the textarea loses focus
    saveEdit(event) {
        console.log(event.target.value);
        // (Optional) You can add additional logic here to persist the change
        this.isViewMode = true;
    }
}