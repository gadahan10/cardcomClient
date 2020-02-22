import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonsTableComponent } from './persons-table/persons-table.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddPersonPanelComponent } from './persons-table/components/add-person-panel/add-person-panel.component';
import { EditPersonModalComponent } from './persons-table/components/edit-person-modal/edit-person-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonsTableComponent,
    AddPersonPanelComponent,
    EditPersonModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
