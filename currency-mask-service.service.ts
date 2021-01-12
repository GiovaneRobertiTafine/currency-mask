import { Injectable } from '@angular/core';
import { Options } from './currency-mask.directive';

@Injectable({
    providedIn: 'root'
})
export class CurrencyMaskServiceService {

    constructor() { }

    transform(value: string, options?: Options) {
        if (value == undefined || value === '' || value === '0' || +value.replace(/[^0-9]*/g, '') === 0) {
            if (options.nullable) return null;
            value = '0';
        }

        let initalValue = value.replace(/[^0-9]*/g, '');
        let numero = '';

        if (initalValue.length > 1) {
            let arrayVerify = initalValue.split('');
            initalValue = initalValue.substring(arrayVerify.findIndex((v) => v != '0'),);

        }

        if (initalValue.length <= options.precision + 1) {
            if (initalValue.length === options.precision + 1) {
                let decimal = options.decimal + initalValue.substring(initalValue.length - options.precision);
                numero = initalValue.substring(0, initalValue.length - options.precision) + decimal;
            } else {
                const array2: string[] = new Array(options.precision);

                for (let index = 0; index < array2.length; index++) {
                    if (initalValue.substring(initalValue.length - (index + 1), initalValue.length - index)) {
                        array2[array2.length - (index + 1)] = initalValue.substring(initalValue.length - (index + 1), initalValue.length - index);
                    }
                    else {
                        array2[array2.length - (index + 1)] = '0';
                    }

                }

                let decimal = '';
                array2.map((val, index) => {
                    decimal += array2[index];
                });

                decimal = options.decimal + decimal;
                numero = '0' + decimal;
            }
        } else {
            let decimal = options.decimal + initalValue.substring(initalValue.length - options.precision);

            numero = initalValue.substring(0, initalValue.length - options.precision) + decimal;

        }

        if (numero.substring(0, numero.indexOf(options.decimal)).length > 3) {
            let num = numero.substring(0, numero.indexOf(options.decimal));
            let arrayPonto = num.split('').slice(0).reverse();
            let numFormatado = '';

            arrayPonto.map((num) => {
                if ((numFormatado.replace(/[^0-9]*/g, '').length % 3) === 0 && numFormatado.replace(/[^0-9]*/g, '').length !== 0) {
                    numFormatado = num + options.thousands + numFormatado;
                } else {
                    numFormatado = num + numFormatado;
                }
            });

            numero = numero.replace(num, numFormatado);
        }

        if (options.allowNegative) {
            if (value.substring(0, 1) === '-') {
                value.replace('-', '');
                return '-' + options.prefix + numero + options.suffix;
            }

            if (value.substring(0, 1) === '+') {
                value.replace('-', '');
                return options.prefix + numero + options.suffix;
            }

        }

        return options.prefix + numero + options.suffix;
    }

    parse(value: string, options?: Options, keyCode?: number) {
        if (value == undefined || value === '' || value === '0' || +value.replace(/[^0-9]*/g, '') === 0) {
            return options.nullable ? null : '0';
        }

        let initalValue = value.replace(/[^0-9]*/g, '');
        let numero = '';


        if (initalValue.length > 1) {
            let arrayVerify = initalValue.split('');
            initalValue = initalValue.substring(arrayVerify.findIndex((v) => v != '0'),);

        }

        if (options.suffix && keyCode === 8) {
            initalValue = initalValue.substring(0, initalValue.length - 1);
        }

        if (initalValue.length <= options.precision + 1) {
            if (initalValue.length === options.precision + 1) {
                let decimal = '.' + initalValue.substring(initalValue.length - options.precision);
                numero = initalValue.substring(0, initalValue.length - options.precision) + decimal;
            } else {
                const array: string[] = new Array(options.precision);

                for (let index = 0; index < array.length; index++) {
                    if (initalValue.substring(initalValue.length - (index + 1), initalValue.length - index)) {
                        array[array.length - (index + 1)] = initalValue.substring(initalValue.length - (index + 1), initalValue.length - index);
                    }
                    else {
                        array[array.length - (index + 1)] = '0';
                    }

                }

                let decimal = '';
                array.map((val, index) => {
                    decimal += array[index];
                });

                decimal = '.' + decimal;
                numero = '0' + decimal;
            }
        } else {
            let decimal = '.' + initalValue.substring(initalValue.length - options.precision);

            numero = initalValue.substring(0, initalValue.length - options.precision) + decimal;

        }

        if (options.allowNegative) {
            if (value.substring(value.length - 1,) === '-') {
                numero = '-' + numero;
            } else if (value.substring(value.length - 1,) === '+') {
                numero = numero;
            } else if (value.substring(0, 1) === '-') {
                numero = '-' + numero;
            }

        }

        return numero;
    }

}
