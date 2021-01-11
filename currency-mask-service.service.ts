import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CurrencyMaskServiceService {

    constructor() { }

    transform(value: string, precision: number, prefix: string, allowNegative: boolean) {
        if (value == undefined || value === '' || value === '0') {
            return null;
        }

        let initalValue = value.replace(/[^0-9]*/g, '');
        let numero = '';

        if (+initalValue === 0) {
            return null;
        }

        if (initalValue.length > 1) {
            let arrayVerify = initalValue.split('');
            initalValue = initalValue.substring(arrayVerify.findIndex((v) => v != '0'),);

        }

        if (initalValue.length <= precision + 1) {
            if (initalValue.length === precision + 1) {
                let decimal = ',' + initalValue.substring(initalValue.length - precision);
                numero = initalValue.substring(0, initalValue.length - precision) + decimal;
            } else {
                const array2: string[] = new Array(precision);

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

                decimal = ',' + decimal;
                numero = '0' + decimal;
            }
        } else {
            let decimal = ',' + initalValue.substring(initalValue.length - precision);

            numero = initalValue.substring(0, initalValue.length - precision) + decimal;

        }

        if (numero.substring(0, numero.indexOf(',')).length > 3) {
            let num = numero.substring(0, numero.indexOf(','));
            let arrayPonto = num.split('').slice(0).reverse();
            let numFormatado = '';

            arrayPonto.map((num) => {
                if ((numFormatado.replace(/[^0-9]*/g, '').length % 3) === 0 && numFormatado.replace(/[^0-9]*/g, '').length !== 0) {
                    numFormatado = num + '.' + numFormatado;
                } else {
                    numFormatado = num + numFormatado;
                }
            });

            numero = numero.replace(num, numFormatado);
        }

        if (allowNegative) {
            if (value.substring(0, 1) === '-') {
                value.replace('-', '');
                return '-' + prefix + ' ' + numero;
            }

            if (value.substring(0, 1) === '+') {
                value.replace('-', '');
                return prefix + ' ' + numero;
            }
        }

        return prefix + ' ' + numero;
    }

    parse(value: string, precision: number, allowNegative: boolean) {
        if (value == undefined || value === '' || value === '0') {
            return null;
        }

        let initalValue = value.replace(/[^0-9]*/g, '');
        let numero = '';

        if (+initalValue === 0) {
            return null;
        }

        if (initalValue.length > 1) {
            let arrayVerify = initalValue.split('');
            initalValue = initalValue.substring(arrayVerify.findIndex((v) => v != '0'),);

        }

        if (initalValue.length <= precision + 1) {
            if (initalValue.length === precision + 1) {
                let decimal = '.' + initalValue.substring(initalValue.length - precision);
                numero = initalValue.substring(0, initalValue.length - precision) + decimal;
            } else {
                const array: string[] = new Array(precision);

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
            let decimal = '.' + initalValue.substring(initalValue.length - precision);

            numero = initalValue.substring(0, initalValue.length - precision) + decimal;

        }

        if (allowNegative) {
            if (value.substring(value.length - 1,) === '-') {
                return '-' + numero;
            }

            if (value.substring(value.length - 1,) === '+') {
                return numero;
            }
        }

        return numero;
    }

}
