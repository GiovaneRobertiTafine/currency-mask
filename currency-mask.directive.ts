import { AfterViewInit, Directive, ElementRef, forwardRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrencyMaskServiceService } from "./currency-mask-service.service";

const noop = () => { };

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CurrencyMaskDirective),
    multi: true
};

export interface Options {
    prefix?: string;
    precision?: number;
    allowNegative?: boolean;
    thousands?: string;
    decimal?: string;
    suffix?: string;
    typeReturn?: 'string' | 'number';
    nullable?: boolean;
    max?: number;
    min?: number;
}

@Directive({
    selector: '[currency-mask]',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CurrencyMaskDirective implements ControlValueAccessor, AfterViewInit {
    @Input() options?: Options = {};

    private el: HTMLInputElement;
    private innerValue: any;
    private keyCode: number;

    constructor(public elementRef: ElementRef, private currencyMaskService: CurrencyMaskServiceService, private renderer: Renderer2) {
        this.el = elementRef.nativeElement;
    }

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (a: any) => void = noop;

    get value(): any {
        return this.innerValue;
    }

    set value(v: any) {
        console.log("setvalue" + v);
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
            this.onTouchedCallback();
        }
    }

    writeValue(value: any) {
        if (!this.options.precision || typeof this.options.precision !== 'number') this.options.precision = 2;
        if (this.options.allowNegative !== false || typeof this.options.allowNegative !== 'boolean') this.options.allowNegative = true;
        if (!this.options.thousands || typeof this.options.thousands !== 'string') this.options.thousands = '.';
        if (!this.options.decimal || typeof this.options.decimal !== 'string') this.options.decimal = ',';
        this.options.prefix = this.options.prefix && typeof this.options.prefix === 'string' ? this.options.prefix + ' ' : '';
        this.options.suffix = this.options.suffix && typeof this.options.suffix === 'string' ? ' ' + this.options.suffix : '';
        if (!this.options.typeReturn || (this.options.typeReturn !== 'string' && this.options.typeReturn !== 'number')) this.options.typeReturn = 'string';
        if (!this.options.nullable || typeof this.options.nullable !== 'boolean') this.options.nullable = false;
        if (typeof this.options.min !== 'number') this.options.min = null;
        if (typeof this.options.max !== 'number') this.options.max = null;
        this.el.style.textAlign = 'right';

        // if (value === '' || value === undefined || value === null) {
        //     return;
        // }
        // if (value !== this.innerValue) {
        //     this.el.value = this.currencyMaskService.transform(value, this.options);
        //     console.log(this.el.value);
        //     if (value) {
        //         this.renderer.setAttribute(this.elementRef.nativeElement, 'value', value);
        //     }
        //     this.innerValue = value;
        // }

        if (this.options.min) {
            this.el.value = this.currencyMaskService.transform(
                this.options.min.toFixed(this.options.precision).toString(),
                this.options
            );
            let valueParse = this.currencyMaskService.parse(this.el.value, this.options, this.keyCode);
            this.innerValue = this.options.typeReturn === 'number' && valueParse ? +valueParse : valueParse;

        } else if (!this.options.nullable) {
            this.el.value = this.currencyMaskService.transform('0', this.options);
            let valueParse = this.currencyMaskService.parse(this.el.value, this.options, this.keyCode);
            this.innerValue = this.options.typeReturn === 'number' && valueParse ? +valueParse : valueParse;
        } else {
            this.innerValue = null;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    ngAfterViewInit() {
        setTimeout(() => this.onChangeCallback(this.innerValue));
    }

    // // On Focus remove all non-digit or decimal separator values
    // @HostListener('focus', ['$event.target.value'])
    // onfocus(value) {
    //     this.el.value = this.currencyMaskService.parse(value, this.allowNegative);
    // }

    // // On Blue remove all symbols except last . and set to currency format
    // @HostListener('blur', ['$event.target.value'])
    // onBlur(value) {
    //     this.onTouchedCallback();
    //     this.el.value = this.currencyMaskService.transform(value, this.allowNegative);
    //     this.innerValue = this.currencyMaskService.parse(this.el.value, this.allowNegative);
    //     this.onChangeCallback(this.innerValue);
    //     if (this.innerValue) {
    //         this.renderer.setAttribute(this.elementRef.nativeElement, 'value', this.innerValue);
    //     }
    // }

    // // On Change remove all symbols except last . and set to currency format
    // @HostListener('change', ['$event.target.value'])
    // onChange(value) {
    //     this.el.value = this.currencyMaskService.transform(value, this.allowNegative);
    //     this.innerValue = this.currencyMaskService.parse(this.el.value, this.allowNegative);
    //     this.onChangeCallback(this.innerValue);
    //     if (this.innerValue) {
    //         this.renderer.setAttribute(this.elementRef.nativeElement, 'value', this.innerValue);
    //     }
    // }


    @HostListener('input', ['$event.target.value'])
    onInput(value) {
        let valueParse = this.currencyMaskService.parse(value, this.options, this.keyCode);
        this.innerValue = this.options.typeReturn === 'number' && valueParse ? +valueParse : valueParse;
        this.el.value = this.currencyMaskService.transform(valueParse, this.options);

        if (this.innerValue) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'value', this.innerValue);
        }
        this.onChangeCallback(this.innerValue);
    }

    // Prevent user to enter anything but digits and decimal separator
    @HostListener('keydown', ['$event'])
    onKeyPress(event) {
        const key = event.which || event.keyCode || 0;
        const keyCode = event.keyCode;
        // if (key === 45 && !this.allowNegative) {
        //     event.preventDefault();
        // } else if (key === 45 && this.allowNegative) {
        //     // allow negative numbers
        // } else if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
        //     event.preventDefault();
        // }
        if (!((keyCode >= 48 && keyCode <= 57) || keyCode === 45 || keyCode === 43 || keyCode === 8 || keyCode === 189 || keyCode === 187)) {
            this.keyCode = null;
            event.preventDefault();
        } else {
            this.keyCode = keyCode;
        }

    }


}