import { Directive, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Authority } from './authority.model';

@Directive({
    selector: '[can-use]'
  })
  export class CanUse{
      
    @Input() typeAction: string;

  constructor(private element: ElementRef, 
              private router: Router) {}
              
  ngOnInit() {
    let url= this.router.url.split('/')[1];
    if(!this.can(url, this.typeAction)){
     // console.log("Entra aquí ");
      this.element.nativeElement.style.display = 'none';
    }
  }

  getAuthorities(): Authority[]{
    let authorities = localStorage.getItem('authorities');
    if(authorities === null) {
      return null;
    }
    return JSON.parse(authorities);
  }

  can(view: string, action: string): boolean {    
    let authorities: Authority[] = this.getAuthorities();    
    if(authorities === null){
      return false;
    }
    let viewAuth = authorities.find(a => 
      a.authority === view
    );
    return viewAuth !== undefined ? viewAuth.can[0].indexOf(action) > -1 : false; 
  }
  
}
