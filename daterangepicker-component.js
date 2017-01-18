"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var daterangepicker_options_1 = require('./daterangepicker-options');
var moment = require('moment');
var DaterangepickerComponent = (function () {
    function DaterangepickerComponent(elem) {
        this.elem = elem;
        //outputs
        this.rangeSelected = new core_1.EventEmitter();
        this.range = "";
    }
    //handle outside/inside click to show rangepicker
    DaterangepickerComponent.prototype.handleOutsideClick = function (event) {
        var current = event.target;
        var host = this.elem.nativeElement;
        if (host.compareDocumentPosition) {
            if (host.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                this.showCalendars = true;
                return;
            }
        }
        else if (host.contains) {
            if (host.contains(current)) {
                this.showCalendars = true;
                return;
            }
        }
        else {
            do {
                if (current === host) {
                    this.showCalendars = true;
                    return;
                }
                current = current.parentNode;
            } while (current);
        }
        this.showCalendars = false;
        if (!this.fromDate || !this.toDate) {
            this.restoreOldDates();
        }
        this.updateCalendar();
    };
    DaterangepickerComponent.prototype.updateCalendar = function () {
        //get month and year to show calendar
        var tDate = moment(this.fromDate, this.format);
        this.fromMonth = tDate.get('month');
        this.fromYear = tDate.get('year');
        tDate = moment(this.fromDate, this.format).add(1, 'months');
        this.toMonth = tDate.get('month');
        this.toYear = tDate.get('year');
        this.setRange();
    };
    DaterangepickerComponent.prototype.ngOnInit = function () {
        //get default options provided by user
        this.setFormat();
        this.validateMinMaxDates();
        this.setFromDate(this.options.startDate);
        this.setToDate(this.options.endDate);
        //update calendar grid
        this.updateCalendar();
    };
    DaterangepickerComponent.prototype.setFormat = function () {
        if (this.options) {
            this.format = this.options.format || "YYYY-MM-DD";
        }
        else {
            this.format = "YYYY-MM-DD";
        }
    };
    DaterangepickerComponent.prototype.validateMinMaxDates = function () {
        if (this.options) {
            //only mindate is suppplied
            if (this.options.minDate && !this.options.maxDate) {
                this.options.minDate = this.getMoment(this.options.minDate);
            }
            //only maxdate is supplied
            if (!this.options.minDate && this.options.maxDate) {
                this.options.maxDate = this.getMoment(this.options.maxDate);
            }
            //both min and max dates are supplied
            if (this.options.minDate && this.options.maxDate) {
                this.options.minDate = this.getMoment(this.options.minDate);
                this.options.maxDate = this.getMoment(this.options.maxDate);
                if (this.options.maxDate.isBefore(this.options.minDate)) {
                    this.options.minDate = "";
                    this.options.maxDate = "";
                    console.warn("supplied minDate is after maxDate. Discarding options for minDate and maxDate");
                }
            }
        }
    };
    DaterangepickerComponent.prototype.setFromDate = function (value) {
        this.fromDate = moment();
        this.fromDate = this.getValidateMoment(value);
        if (!this.fromDate) {
            console.warn("supplied startDate option is not in " + this.options.format + " format falling back to default startDate");
            this.fromDate = moment();
        }
        if (this.options && this.options.minDate) {
            if (this.fromDate.isBefore(this.options.minDate)) {
                this.fromDate = this.options.minDate.clone();
            }
        }
        if (this.options && this.options.maxDate) {
            if (this.fromDate.isAfter(this.options.maxDate)) {
                this.fromDate = this.options.maxDate.clone();
            }
        }
    };
    DaterangepickerComponent.prototype.setToDate = function (value) {
        this.toDate = moment();
        this.toDate = this.getValidateMoment(value);
        if (!this.toDate) {
            console.warn("supplied endDate option is not in " + this.options.format + " format falling back to default endDate");
            this.toDate = moment();
        }
        if (this.options && this.options.maxDate) {
            if (this.toDate.isAfter(this.options.maxDate)) {
                this.toDate = this.options.maxDate.clone();
            }
        }
        if (this.toDate.isBefore(this.fromDate)) {
            this.toDate = this.fromDate.clone();
        }
    };
    DaterangepickerComponent.prototype.dateChanged = function (value) {
        if ((this.fromDate && this.toDate) || !(this.fromDate || this.toDate)) {
            //if both dates are empty
            this.storeOldDates();
            this.setFromDate(value.format(this.format));
            this.toDate = void (0);
        }
        else if (value.isBefore(this.fromDate)) {
            //if current selected date is before previously selected date
            this.setFromDate(value.format(this.format));
        }
        else if (this.fromDate && !this.toDate) {
            //if fromdate is selected and todate is not
            this.setToDate(value.format(this.format));
            this.showCalendars = false;
            this.setRange();
            this.emitRangeSelected();
        }
    };
    DaterangepickerComponent.prototype.storeOldDates = function () {
        this.oldFromDate = this.fromDate;
        this.oldToDate = this.toDate;
    };
    DaterangepickerComponent.prototype.restoreOldDates = function () {
        this.fromDate = this.oldFromDate;
        this.toDate = this.oldToDate;
    };
    DaterangepickerComponent.prototype.emitRangeSelected = function () {
        this.rangeSelected.emit({
            start: this.getMoment(this.fromDate),
            end: this.getMoment(this.toDate)
        });
    };
    DaterangepickerComponent.prototype.monthChanged = function (value) {
        var temp;
        temp = moment([this.fromYear, this.fromMonth]).add(value, 'months');
        this.fromMonth = temp.get('month');
        this.fromYear = temp.get('year');
        temp = moment([this.toYear, this.toMonth]).add(value, 'months');
        this.toMonth = temp.get('month');
        this.toYear = temp.get('year');
    };
    DaterangepickerComponent.prototype.getMoment = function (value) {
        return moment(value, this.format);
    };
    DaterangepickerComponent.prototype.getValidateMoment = function (value) {
        var momentValue = null;
        if (moment(value, this.format, true).isValid()) {
            momentValue = moment(value, this.format, true);
        }
        return momentValue;
    };
    DaterangepickerComponent.prototype.setRange = function () {
        this.range = this.fromDate.format(this.format) + " - " + this.toDate.format(this.format);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', daterangepicker_options_1.Options)
    ], DaterangepickerComponent.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DaterangepickerComponent.prototype, "class", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DaterangepickerComponent.prototype, "rangeSelected", void 0);
    __decorate([
        core_1.HostListener('document:mousedown', ['$event']),
        core_1.HostListener('document:mouseup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], DaterangepickerComponent.prototype, "handleOutsideClick", null);
    DaterangepickerComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'date-range-picker',
            templateUrl: './daterangepicker-component.html'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], DaterangepickerComponent);
    return DaterangepickerComponent;
}());
exports.DaterangepickerComponent = DaterangepickerComponent;
