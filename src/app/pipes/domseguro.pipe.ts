import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'domseguro',
  standalone: true
})
export class DomseguroPipe implements PipeTransform {

  constructor(private domSanitazer: DomSanitizer) {

  }

  transform(value: string | undefined, ...args: unknown[]): SafeResourceUrl {
    if (value) {
      return this.domSanitazer.bypassSecurityTrustResourceUrl(value);
    } else{
      return "";
    }
  }

}
