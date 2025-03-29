import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any[], searchValue: string, prop: string): any[] {
    if (!searchValue) return value

    if (Array.isArray(value)) {
      const regExp = new RegExp(searchValue, 'i')
      return value.filter((itm) => {
        if (itm[prop] && typeof itm[prop] === 'string') {
          return regExp.test(itm[prop])
        } else {
          console.log(`'${itm[prop]}' не строка`);
          return false
        }
      })
    } else {
      console.log(`'${value}' не массив`);
      return []
    }

  }

}
