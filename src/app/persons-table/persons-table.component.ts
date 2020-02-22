import { Component, OnInit } from '@angular/core';
import { Person } from '../models/person.model';
import { PersonService } from './services/personService.service';
import { HttpStatusResponse } from '../models/httpStatusResponse.model';
import { ModalEvent } from '../models/modalEvent.model';


@Component({
  selector: 'persons-table',
  templateUrl: './persons-table.component.html',
  styleUrls: ['./persons-table.component.css']
})
export class PersonsTableComponent implements OnInit {

  // Table properties
  tableHeaders: string[] = ["Id", "Full Name", "Email", "Date of Birth", "Gender", "Phone Number", "Edit / Delete"];
  personsArray: Person[] = [];
  filteredArray: Person[] = [];
  showErrorMessage: boolean = false;
  showSuccessAlert: boolean = false;

  // Edit person properties
  isEditModalOpened: boolean = false;
  personSelected: Person;
  personSelectedIndex: number;

  // Filter properties
  isFilterOpened: boolean = false;
  resultsPerPage: number;
  currentPage: number = 1;

  constructor(private personService: PersonService) { }

  ngOnInit() {

    this.resultsPerPage = 20;

    // Get all table records from DB
    this.loadPersonRecords();
  }

  loadPersonRecords(): void {

    this.personService.GetAllPersons()
      .subscribe((records:Array<Person>) => {

        records.forEach(record => {
          this.personsArray.push(record);
        });

        this.updateFilteredArray();        
        this.showResultsByRange(0, this.resultsPerPage);
      },
      error => {
        this.showSuccessAlert = false;
        this.showErrorMessage = true;
      })
        
  }

  // Recieve new user record
  addPersonRecordToTable($event): void{
   
    // Post the new person record in DB
    this.personService.postNewPersonRecord($event)
      .subscribe((res:HttpStatusResponse) => {
       
        if (res.status == true){
          this.personsArray.push($event);
          this.updateFilteredArray();
          this.showSuccessAlert = true;
          this.showErrorMessage = false;
        }
        else {
          this.showSuccessAlert = false;
          this.showErrorMessage = true;
        }
      },
      error => {
        this.showSuccessAlert = false;
        this.showErrorMessage = true;
      });
   
  }
  // Edit person record
  onEditPerson(person: Person, index: number): void {

    this.personSelected = person;    
    this.isEditModalOpened = true;
    this.personSelectedIndex = index;
  }

  onModalEmitEvent($event: ModalEvent): void {    
   
    if ($event.data != null){
      this.personsArray[this.personSelectedIndex] = $event.data;
      this.updateFilteredArray();
      this.showSuccessAlert = true;
      this.showErrorMessage = false;
    }
    
    this.isEditModalOpened = $event.isOpened;
  } 

  // Delete person record
  onDeletePerson(person: Person,index: number): void {    

    // Remove the given index record from the table
    this.personService.DeletePersonRecord(person.id)
      .subscribe((res: HttpStatusResponse) => {

        if (res.status == true){
          this.personsArray.splice(index, 1);
          this.updateFilteredArray();
          this.showSuccessAlert = true;
          this.showErrorMessage = false;
        }
        else {
          this.showSuccessAlert = false;
          this.showErrorMessage = true;
        }
      },
      error => {
        this.showSuccessAlert = false;
        this.showErrorMessage = true;
      });    
  }

  // Open/close filter panel
  toggleFilterPanel(): void{
    this.isFilterOpened = !this.isFilterOpened;
  }

  updateFilteredArray(): void {
    this.filteredArray = this.personsArray;
  }

  // Filtering
  filterOnSearch(value: string): void{
    
    if (value.length == 0){
      this.filteredArray = this.personsArray;
    }

    if (value.length > 1){
      // Set the array to it's initial state in order to get accurate filter on deletion
      this.filteredArray = this.personsArray;

      this.filteredArray = this.filteredArray.filter(searchTerm => searchTerm.name.includes(value) || 
                                                   searchTerm.id.includes(value) || 
                                                   searchTerm.email.includes(value) ||
                                                   searchTerm.gender.includes(value) ||
                                                   searchTerm.phone.includes(value));
    }    
  }

  updateResultsPerPage(resultsAmount: number): void {

    console.log(resultsAmount);
    // Update results per page property
    this.resultsPerPage = resultsAmount;

    // Update table
    this.showResultsByRange(((this.currentPage - 1) * this.resultsPerPage), (this.currentPage * this.resultsPerPage))
  }

  showResultsByRange(from: number, to: number): void {

    if (from >= 0 && to > 0){

      this.updateFilteredArray();

      this.filteredArray = this.filteredArray.slice(from, (to - 1));
    }    
  }

  
  onNextClick(): void {    

    // Filter the array with next page results
    this.showResultsByRange((this.currentPage * this.resultsPerPage), (++this.currentPage * this.resultsPerPage));
  }

  onPrevClick(): void {

    --this.currentPage;
    // Filter the array with prev page results
    this.showResultsByRange(((this.currentPage - 1) * this.resultsPerPage), (this.currentPage * this.resultsPerPage));
  }

  sortTableBy(sortBy: string): void {
    
    this.filteredArray = this.personsArray;

    switch(sortBy){

      case "Name":
        this.filteredArray.sort(this.compareByName);
        break;
      
      case "Gender":
        this.filteredArray.sort(this.compareByGender);
        break;

      case "Birthday":
        this.filteredArray.sort(this.compareByBirthDate);
        break;

      default:
        break;  
    }
    
  }

  private compareByName(personA: Person, personB: Person): number{
    
    if ( personA.name < personB.name ){
      return -1;
    }
    if ( personA.name > personB.name ){
      return 1;
    }
    return 0;
  }

  private compareByGender(personA: Person, personB: Person): number{
    
    if ( personA.gender < personB.gender ){
      return -1;
    }
    if ( personA.gender > personB.gender ){
      return 1;
    }
    return 0;
  }

  private compareByBirthDate(personA: Person, personB: Person): number{
    
    if ( personA.dateOfBirth < personB.dateOfBirth ){
      return -1;
    }
    if ( personA.dateOfBirth > personB.dateOfBirth ){
      return 1;
    }
    return 0;
  }
}
