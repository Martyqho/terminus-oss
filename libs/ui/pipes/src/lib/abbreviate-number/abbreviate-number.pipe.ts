import {
  Pipe,
  PipeTransform,
} from '@angular/core';

import { abbreviateNumber } from '@terminus/fe-utilities';


/**
 * The abbreviate number pipe
 *
 * @example
 * {{ 1234 | tsAbbreviateNumber }}
 * {{ 1200 | tsAbbreviateNumber:2 }}
 *
 * <example-url>https://release--5f0ca4e61af3790022cad2fe.chromatic.com/?path=/story/utilities-pipes-number</example-url>
 */
@Pipe({ name: 'tsAbbreviateNumber' })
export class TsAbbreviateNumberPipe implements PipeTransform {
  public transform(value: number | string, decimalPlace = 1): string {
    // Check for null values to avoid issues during data-binding
    if (!value) {
      return '';
    }
    return abbreviateNumber(value, decimalPlace);
  }
}

