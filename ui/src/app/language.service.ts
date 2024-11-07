import {inject, Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export type DeepLTranslation = {
  translation: string
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  readonly URI = "http://localhost:3000/"

  constructor() { }

  httpClient = inject(HttpClient);

  async addTranslation(id : number, lang : string, text : string){
    const body : {translatedText : string} = {translatedText: text}

    await firstValueFrom(this.httpClient.put(this.URI + "ads/" + id + "/translations/" + lang, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json"
      }
    }))
  }

  async removeTranslation(id: number, lang:string){
    await firstValueFrom(this.httpClient.delete(this.URI + "ads/" + id + "/translations/" + lang))
  }

  async translate(text: string, sourceLang : string, outputLang : string){
    const body: {text: string; source_lang: string; target_lang: string} = {
      text: text,
      source_lang: sourceLang,
      target_lang: outputLang
    }

    return await firstValueFrom<DeepLTranslation>(this.httpClient.post<DeepLTranslation>("http://localhost:3000/deepl/v2/translate", JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json"
      }
    }))
  }

}
