import {Component, effect, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ad, AdService} from '../ad.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {toObservable} from '@angular/core/rxjs-interop';
import {LanguageService} from '../language.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit{
@Component({
  selector: 'app-user'
})
  adId = signal<number>(0);

  ad = signal<ad | undefined>(undefined)

  title = signal<string>("")

  language = signal<string>("EN")

  displayText = signal<string>("")

  adding = signal<boolean>(false)

  newly = signal<boolean>(false)

  constructor(private route: ActivatedRoute, private adService: AdService, private langService: LanguageService) {
    toObservable(this.language).subscribe(() => {
      const lang = this.ad()?.translations?.filter(a => a.language === this.language())[0];

      if (lang){
        this.displayText.set(lang.translatedText);
      }
      else if(this.ad() && this.language() === 'EN'){
        this.displayText.set(this.ad()!.textEN);
      }
      else {
        this.displayText.set("");
      }
    });
  }

  async ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id')
    if(param){
      this.adId.set(parseInt(param));

      this.ad.set(await this.adService.getAddById(this.adId()));

      if(this.ad()) {
        this.displayText.set(this.ad()!.textEN!)
        this.title.set(this.ad()!.title);
      }
    }
  }

  async updateText(){
    if(this.newly()){
      this.newly.set(false)
      await this.langService.addTranslation(this.adId(), this.language(), this.displayText())
      this.ad.set(await this.adService.getAddById(this.adId()))
    }
    else {
      await this.adService.updateAdText(this.adId(), this.displayText());

      this.ad.set(await this.adService.getAddById(this.adId()))
    }
  }

  async updateTitle(){
    await this.adService.updateAdTitle(this.adId(), this.title());

    this.ad.set(await this.adService.getAddById(this.adId()))
  }

  async addTranslation(lang?: string) {
    if(this.adding()){
      if(!lang){
        this.adding.set(false);
        throw new Error("Language ID is not defined")
      }
      else if(this.ad()!.translations!.map(a => a.language).includes(lang)){
        this.adding.set(false);
        this.language.set(lang);
        throw new Error("Language ID is already defined")
      }
      else{
        this.language.set(lang)
        this.newly.set(true)
        this.adding.set(false)
      }
    }
    else this.adding.set(true);
  }

  async deleteSelectedLanguage(){
    if(this.language() === 'EN'){
      throw new Error("Cannot remove English ad")
    }
    else{
      const lang = this.language();
      this.language.set('EN')

      await this.langService.removeTranslation(this.adId(), lang);

      this.ad.set(await this.adService.getAddById(this.adId()))
    }
  }

 async generateTranslation() {
    console.log(this.newly())

    if(this.newly() && this.ad()){
      this.displayText.set((await this.langService.translate(this.ad()!.textEN, "EN", this.language())).translation)
      this.newly.set(false);

      await this.langService.addTranslation(this.adId(), this.language(), this.displayText())
      this.ad.set(await this.adService.getAddById(this.adId()))
    }
  }
}
