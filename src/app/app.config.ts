import  {  ApplicationConfig, provideZoneChangeDetection  }  from  "@angular/core" ; 
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import  {  provideAnimationsAsync  }  from  "@angular/platform-browser/animations/async" ; 
import  {  provideRouter  }  from  "@angular/router" ;
import  {  SYSTEM_DESIGN_CONFIG  }  from  "dynamic-ds" ;
import  {  routes  }  from  "./app.routes" ;
import { authInterceptor } from './services/auth.interceptor';

export  const  appConfig : ApplicationConfig  =  { 
  providers : [ 
    provideRouter ( routes ) ,
    provideHttpClient ( withInterceptors([authInterceptor]) ) ,
    provideAnimationsAsync ( ) , 
    { 
      provide : SYSTEM_DESIGN_CONFIG , 
      useValue : { 
        brand : "#2740B4" , 
        primary : "#006BDF" , 
        secondary : "#9F5100" , 
        functional : "#006BDF" , 
        utility : "#CF0026" , 
      } , 
    } , 
  ] , 
} ;