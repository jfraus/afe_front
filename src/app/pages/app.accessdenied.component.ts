import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accessdenied',
  templateUrl: './app.accessdenied.component.html',
})
export class AppAccessdeniedComponent implements OnInit{
  token= true;
  ngOnInit(): void {
    if(!localStorage.getItem("token")){
      this.token = false;
    }
  }

}
