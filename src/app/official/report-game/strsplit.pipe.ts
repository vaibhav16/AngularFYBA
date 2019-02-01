import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitDelimiter'
  })

export class StringSplit implements PipeTransform {
    transform(value:string, separator, firstOrLastValue):string {
        let splits = value.split(separator);
        if(splits.length > 1) {
            if(firstOrLastValue === "beforeSeparator") {
                return splits.shift();
            }
            if(firstOrLastValue === "afterSeparator"){
                return splits.pop();
            }
        } else {
          return 'Null';
        }
      }
    }