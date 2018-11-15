import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sort"
})
export class ArraySortPipe implements PipeTransform {
    transform(array: Array<string>, key: string): Array<string> {

        console.log("Entered in pipe*******  "+ key);
        //console.log(array);


        if(key === undefined || key == '' ){
            return array;
        }

        var arr = key.split("-");
        var keyString = arr[0];   // string or column name to sort(name or age or date)
        var sortOrder = arr[1];   // asc or desc order
        var byVal = 1;


        array.sort((a: any, b: any) => {

            if(keyString === 'date' ){

                let left    = Number(new Date(a[keyString]));
                let right   = Number(new Date(b[keyString]));

                return (sortOrder === "asc") ? right - left : left - right;
            }
            else if(keyString === 'name'){

                if(a[keyString] < b[keyString]) {
                    return (sortOrder === "asc" ) ? -1*byVal : 1*byVal;
                } else if (a[keyString] > b[keyString]) {
                    return (sortOrder === "asc" ) ? 1*byVal : -1*byVal;
                } else {
                    return 0;
                }  
            }
            else if(keyString === 'age'){
                return (sortOrder === "asc") ? a[keyString] - b[keyString] : b[keyString] - a[keyString];
            }

        });

        return array;

  }
}