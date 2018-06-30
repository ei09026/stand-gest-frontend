import moment from 'moment'

const UX_DATE_FORMAT = 'DD-MM-YYYY'
const UX_HOUR_FORMAT = 'HH:mm:ss'
const UX_DATE_HOUR_FORMAT = 'DD-MM-YYYY - HH:mm'

const UX_PICKER_DATE_FORMAT = 'dd-mm-yyyy'
const UX_PICKER_TIME_FORMAT = 'hh:ii'

const SERVER_DATE_FORMAT = 'YYYY-MM-DD'
const SERVER_HOUR_FORMAT = 'HH:mm:ss'
const SERVER_DATE_HOUR_FORMAT = 'HH:mm:ss - YYYY-MM-DD'

const format = {
    server: {
        date: SERVER_DATE_FORMAT,
        time: SERVER_HOUR_FORMAT,
        dateTime: SERVER_DATE_HOUR_FORMAT
    },
    ux: {
        date: UX_DATE_FORMAT,
        time: UX_HOUR_FORMAT,
        dateTime: UX_DATE_HOUR_FORMAT
    },
    picker: {
        date: UX_PICKER_DATE_FORMAT,
        dateTime: UX_PICKER_TIME_FORMAT
    }
}

let dateTimeService = {
    format,

    areDatesEqual (dateA, dateB) {
        // Both empty
        if (!dateA && !dateB) {
            return true
        }

        // Only one is empty
        if (!dateA || !dateB) {
            return false
        }

        // At least one of them is not a Date
        if (!(dateA instanceof Date) || !(dateB instanceof Date)) {
            return false
        }

        // Compare
        return dateA.getTime() === dateB.getTime()
    },

    // Convert from working local date (object or string) to server UTC in JSON format
    fromLocalToServer (date, type = 'date') {
        let momentDate = moment(date)

        if (type === 'dateTime' || type === 'time') {
            momentDate = momentDate.utc()
        }

        if (type === 'dateTime') {
            return momentDate.toJSON()
        }

        return momentDate.format(format.server[type])
    },

    fromServerToLocalString (date, type = 'date', dateFormat = null) {
        if (!date || isNaN(new Date(date).getTime())) {
            return
        }
        return moment.utc(date).local().format(dateFormat || format.ux[type])
    },

    fromServerToLocalDate (date, type = 'date') {
        return moment.utc(date).local().toDate()
    },

    // DateTimePicker format
    momentDateFromPicker (date, type = 'date') {
        return moment(date, format.picker[type])
    },

    dateFromPicker (date, type = 'date') {
        return this.momentDateFromPicker(date, type).toDate()
    },

    dateToPicker (date, type = 'date') {
        return moment(date).format(format.picker[type])
    }
}

export default dateTimeService
