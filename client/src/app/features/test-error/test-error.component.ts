import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-error',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})
export class TestErrorComponent {
  bastUrl=environment.apiUrl;
  private http= inject(HttpClient)
  validationErrors?: string[]

  get404Error(){
    this.http.get(this.bastUrl+"buggy/notfound").subscribe({
      next:response=> console.log(response),
      error: error=> console.log(error),
    })
  }

  get400Error(){
    this.http.get(this.bastUrl+"buggy/badrequest").subscribe({
      next:response=> console.log(response),
      error: error=> console.log(error),
    })
  }

  get401Error(){
    this.http.get(this.bastUrl+"buggy/unauthorized").subscribe({
      next:response=> console.log(response),
      error: error=> console.log(error),
    })
  }

  get500Error(){
    this.http.get(this.bastUrl+"buggy/internalerror").subscribe({
      next:response=> console.log(response),
      error: error=> console.log(error),
    })
  }

  get400ValidationError(){
    this.http.post(this.bastUrl+"buggy/validationerror",{}).subscribe({
      next:response=> console.log(response),
      error: error=> this.validationErrors=error,
    })
  }
}
