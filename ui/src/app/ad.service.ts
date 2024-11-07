import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

export type ad = {
  title: string;
  textEN: string;
  id: number;
  translations?: translation[]
}

export type translation = {
  language: string;
  translatedText: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdService {
  readonly URI = "http://localhost:3000/"

  constructor() { }

  httpClient = inject(HttpClient);

  async getAllAds(): Promise<ad[]>{
    return await firstValueFrom<ad[]>(this.httpClient.get<ad[]>(this.URI + "ads"))
  }

  async deleteAd(id:number): Promise<void>{
    await firstValueFrom(this.httpClient.delete(this.URI + "ads/" + id));
  }

  async getAddById(id:number): Promise<ad>{
    return await firstValueFrom<ad>(this.httpClient.get<ad>(this.URI + "ads/" +id))
  }

  async updateAdText(id: number, text : string){
    const body: {textEN: string} = {textEN: text}
    await firstValueFrom(this.httpClient.patch(this.URI + "ads/" +id, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json"
      }
    }))
  }
  async updateAdTitle(id: number, title: string){
    const body: {title: string} = {title: title}
    await firstValueFrom(this.httpClient.patch(this.URI + "ads/" +id, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json"
      }
    }))
  }


}
