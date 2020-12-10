import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'pipeStringDate'})
export class pipeStringDate implements PipeTransform {
    transform(value: string, befor: string, after: string): string {
        let newStr = `${value.substring(0,19)}`;
        return newStr;

    }
    
}