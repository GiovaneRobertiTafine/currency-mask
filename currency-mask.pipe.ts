import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyMaskService } from './currency-mask.service';

export interface Options {
    prefix?: string;
    precision?: number;
    allowNegative?: boolean;
    thousands?: string;
    decimal?: string;
    suffix?: string;
    nullable?: boolean;
    max?: number;
    min?: number;
}

@Pipe({
    name: 'currencyMask'
})
export class CurrencyMaskPipe implements PipeTransform {
    private options?: Options = {};

    constructor(private currencyMaskService: CurrencyMaskService) {

    }

    transform(value: string, args: Options): unknown {
        this.options = { ...args };
        if ((!this.options.precision && this.options.precision != 0) || typeof this.options.precision !== 'number') this.options.precision = 2;
        if (this.options.allowNegative !== false || typeof this.options.allowNegative !== 'boolean') this.options.allowNegative = true;
        if (!this.options.thousands || typeof this.options.thousands !== 'string') this.options.thousands = '.';
        if (!this.options.decimal || typeof this.options.decimal !== 'string') this.options.decimal = ',';
        this.options.prefix = this.options.prefix && typeof this.options.prefix === 'string' ? this.options.prefix + ' ' : '';
        this.options.suffix = this.options.suffix && typeof this.options.suffix === 'string' ? ' ' + this.options.suffix : '';
        if (!this.options.nullable || typeof this.options.nullable !== 'boolean') this.options.nullable = false;
        if (typeof this.options.min !== 'number') this.options.min = null;
        if (typeof this.options.max !== 'number') this.options.max = null;

        return this.currencyMaskService.pipe(value + '', this.options);
    }

}
