import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-error',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})
export class TestErrorComponent {
  bastUrl=environment.apiUrl;
  private http= inject(HttpClient)
  validationErrors?: string[]

  readonly tests = [
    { code: '500', title: 'Server error', text: 'Redirects to the server error page with details.', icon: 'cloud_off', run: () => this.get500Error() },
    { code: '404', title: 'Not found', text: 'Redirects to the not found page.', icon: 'explore_off', run: () => this.get404Error() },
    { code: '400', title: 'Bad request', text: 'Shows an error toast.', icon: 'report', run: () => this.get400Error() },
    { code: '401', title: 'Unauthorized', text: 'Shows an unauthorized toast.', icon: 'lock', run: () => this.get401Error() },
    { code: '400', title: 'Validation error', text: 'Lists the validation messages below.', icon: 'rule', run: () => this.get400ValidationError() },
  ];

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
