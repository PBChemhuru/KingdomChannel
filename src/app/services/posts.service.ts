import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
private apiUrl ="https://localhost:7209";
constructor(private http:HttpClient) { }

private getAuthHeaders(): HttpHeaders {
  const token = sessionStorage.getItem('jwtToken');
  return new HttpHeaders({
    'Content-Type':'application/json',
    Authorization:`Bearer ${token}`,
  });
}

getPosts():Observable<any> {
  return this.http.get(`${this.apiUrl}/getPosts`,{headers:this.getAuthHeaders(),})
}

}
