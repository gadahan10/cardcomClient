import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from 'src/app/models/person.model';
import { PersonService } from '../../services/personService.service';
import { HttpStatusResponse } from 'src/app/models/httpStatusResponse.model';
import { ModalEvent } from 'src/app/models/modalEvent.model';

@Component({
  selector: 'edit-person-modal',
  templateUrl: './edit-person-modal.component.html',
  styleUrls: ['./edit-person-modal.component.css']
})
export class EditPersonModalComponent implements OnInit {

  @Input() personToEdit: Person;  
  localPerson: Person;
  @Output() modalEmitter = new EventEmitter<ModalEvent>();
  modalEvent:ModalEvent = new ModalEvent();

  constructor(private personService: PersonService) { }

  ngOnInit() {
    // Since we are about the edit the object, we will make a clone of it
    // in order to avoid direct effect on the table
    this.localPerson = Object.assign({}, this.personToEdit);
    
  }

  closeEditModal(): void {

    // Emit false to parent in order to close the popup
    let modalEvent = new ModalEvent();
    modalEvent.data = null;
    modalEvent.isOpened = false;
    this.modalEmitter.emit(modalEvent);
  }

  onSaveChangesClick(): void {

    // Update the database record
    this.personService.UpdatePersonRecord(this.localPerson)
      .subscribe((result: boolean) => {

        this.modalEvent.data = this.localPerson;
        this.modalEvent.isOpened = false;

        if (result == true){
          this.modalEmitter.emit(this.modalEvent);
        }
        
      })
    }
}
