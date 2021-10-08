import { Injectable } from '@angular/core';
import { Options } from './currency-mask.directive';

@Injectable({
    providedIn: 'root'
})
export class CurrencyMaskService {

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
                return '-' + options.prefix + numero + options.suffix;
            }

        }

        return options.prefix + numero + options.suffix;
    }

    parse(value: string, options?: Options, keyCode?: number) {
        if (options.suffix && keyCode === 8) {
            let valueSuffix = value.replace(/[^0-9]*/g, '');
            value = valueSuffix.substring(0, valueSuffix.length - 1);
        }

        if (value == undefined || value === '' || value === '0' || +value.replace(/[^0-9]*/g, '') === 0) {
            return options.nullable ? null : '0';
        }

        let initialValue = value.replace(/[^0-9]*/g, '');
        let numero = '';

        if (initialValue.length > 1) {
            let arrayVerify = initialValue.split('');
            initialValue = initialValue.substring(arrayVerify.findIndex((v) => v != '0'),);
        }

        if (initialValue.length <= options.precision + 1) {
            if (initialValue.length === options.precision + 1) {
                let decimal = '.' + initialValue.substring(initialValue.length - options.precision);
                numero = initialValue.substring(0, initialValue.length - options.precision) + decimal;
            } else {
                const array: string[] = new Array(options.precision);

                for (let index = 0; index < array.length; index++) {
                    if (initialValue.substring(initialValue.length - (index + 1), initialValue.length - index)) {
                        array[array.length - (index + 1)] = initialValue.substring(initialValue.length - (index + 1), initialValue.length - index);
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
            let decimal = '.' + initialValue.substring(initialValue.length - options.precision);

            numero = initialValue.substring(0, initialValue.length - options.precision) + decimal;

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

        if (parseFloat(numero) < options.min && options.min) {
            numero = options.min.toFixed(options.precision).toString();
        }

        if (parseFloat(numero) > options.max && options.max) {
            numero = options.max.toFixed(options.precision).toString();
        }

        return numero;
    }

    pipe(value: string, options: Options) {
        if (value == undefined || value === '' || value === '0' || +value.replace(/[^0-9]*/g, '') === 0) {
            if (options.nullable) {
                return null;
            } else {
                options.precision ? value = ('0' + options.decimal).padEnd(options.precision + ('0' + options.decimal).length, '0') : value = '0';
            }
        }

        if (parseFloat(value) < options.min && options.min) {
            value = options.min.toFixed(options.precision).toString();
        }

        if (parseFloat(value) > options.max && options.max) {
            value = options.max.toFixed(options.precision).toString();
        }

        if (value.indexOf('.') != -1 && value.substring(value.indexOf('.') + 1,).length < options.precision) {
            let valueTranform = value.substring(value.indexOf('.') + 1,).padEnd(options.precision, '0');
            value = value.substring(0, value.indexOf('.')) + options.decimal + valueTranform;
        }

        let numero = '';
        numero = value.replace('-', '');

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
                numero = numero.replace('-', '');
                return '-' + options.prefix + numero + options.suffix;
            }
        }

        return options.prefix + numero + options.suffix;
    }

}
