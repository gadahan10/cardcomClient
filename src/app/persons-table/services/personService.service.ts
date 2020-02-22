import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Person } from 'src/app/models/person.model';
import { Observable } from 'rxjs';
import { HttpStatusResponse } from 'src/app/models/httpStatusResponse.model';

@Injectable({
    providedIn: 'root'
})
export class PersonService {
    
    readonly serverUrl: string = environment.serverUrl;

    constructor(private httpService: HttpClient) {}

    postNewPersonRecord(person: Person): Observable<HttpStatusResponse>{

        return this.httpService.post<HttpStatusResponse>(this.serverUrl + '/Person/AddNewPerson', person, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'                
            })
        });
    }


    DeletePersonRecord(personId: string): Observable<HttpStatusResponse> {

        return this.httpService.delete<HttpStatusResponse>(this.serverUrl + '/Person/DeleteExistPerson/' + personId);
    }


    GetAllPersons(): Observable<Array<Person>> {

        return this.httpService.get<Array<Person>>(this.serverUrl + '/Person/GetAllPersons');
    }


    UpdatePersonRecord(person: Person): Observable<boolean> {

        return this.httpService.put<boolean>(this.serverUrl + '/Person/UpdatePersonRecord', person);
    }

}