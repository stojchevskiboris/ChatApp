import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7078/api'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/Users/Authenticate`, { username, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token); // Save the token in localStorage
        })
      );
  }

  logout() {
    localStorage.removeItem('token'); // Clear the token
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}