import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'booleanYesNo' })
export class BooleanYesNoPipe implements PipeTransform {
    public transform(value: boolean): string {
        return value ? 'Yes' : 'No';
    }
}
