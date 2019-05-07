

class DateForm {
    //funkcja zwraca datę
    static getCurrentDate() {
        let date = new Date();
        return this.format(date);

    }

    //funkcja zwraca datę równą dacie obecnej + ilosci dni do przodu
    static getDateAfterDay(date, day) {
        let sdate = this.transformToStandardDate(date);
        sdate.setDate(sdate.getDate() + day);

        return this.format(sdate);
    }

    //funkcja transformuje datę do normalnego typu DATE w JavaScript
    static transformToStandardDate(date) {
        let dateChunk = date.split('.');
        return new Date(dateChunk[2] + '-' + dateChunk[1] + '-' + dateChunk[0]);
    }

    //funkcja transformuje datę na bardziej czytelną
    static format(d) {
        let date = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
        let dateChunk = date.split('.');

        if (dateChunk[0] < 10) {
            dateChunk[0] = '0' + dateChunk[0]
        }
        if (dateChunk[1] < 10) {
            dateChunk[1] = '0' + dateChunk[1]
        }
        return dateChunk.join('.')
    }
}


module.exports = DateForm;