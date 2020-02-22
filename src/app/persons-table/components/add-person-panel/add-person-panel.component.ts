import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Person } from 'src/app/models/person.model';
import { AppSettings } from 'src/appSettings.model';

@Component({
  selector: 'add-person-panel',
  templateUrl: './add-person-panel.component.html',
  styleUrls: ['./add-person-panel.component.css']
})
export class AddPersonPanelComponent implements OnInit {

  newPersonRecordForm: FormGroup;
  @Output() addPersonEvent = new EventEmitter<Person>();
  personRecord: Person;

  constructor() { }

  ngOnInit() {

        // Initialize the newPersonRecordForm
        this.newPersonRecordForm = new FormGroup({
          'personId': new FormControl(null, [Validators.required, Validators.pattern(AppSettings.NUMERIC_REGEX), Validators.minLength(5)]),
          'personName': new FormControl(null, [Validators.required,Validators.pattern(AppSettings.LETTERS_WITH_SPACES_REGEX), Validators.minLength(5)]),
          'personEmail': new FormControl(null, [Validators.required, Validators.pattern(AppSettings.EMAIL_REGEX)]),
          'personDateOfBirth': new FormControl(null, Validators.required),
          'personGender': new FormControl(null),
          'personPhoneNumber': new FormControl(null, [Validators.required, Validators.pattern(AppSettings.NUMERIC_REGEX), Validators.minLength(7)]) 
        })
  }

  // Add a new person record to the table
  addNewPerson(): void{

    // Get form input values
    var inputValues = this.newPersonRecordForm.value;

    var newPersonRecord = new Person();
    newPersonRecord.id = inputValues.personId;
    newPersonRecord.name = inputValues.personName;
    newPersonRecord.email = inputValues.personEmail;
    newPersonRecord.dateOfBirth = inputValues.personDateOfBirth;
    newPersonRecord.gender = inputValues.personGender;
    newPersonRecord.phone = inputValues.personPhoneNumber;

    this.personRecord = newPersonRecord;

    this.addPersonEvent.emit(this.personRecord);

    // Reset the form
    this.newPersonRecordForm.reset();
    
  }

  onSubmit(){

    var buttonName = document.activeElement.getAttribute("Name");

    if (buttonName == "add"){
      this.addNewPerson();
    }

    if (buttonName == "clear"){
      this.newPersonRecordForm.reset();
    }
    
  }

}
