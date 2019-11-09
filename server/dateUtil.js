const fecha = require("fecha");

fecha.i18n = {
  dayNamesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  dayNames: ["Sonntag", "µontag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  monthNamesShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
  monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  amPm: ["am", "pm"],
  // D is the day of the month, function returns something like...  3rd or 11th
  DoFn: D => `${D}.`
};

module.exports = {
  toLocaleDate: date => {
    return fecha.format(date, "Do MMM YYYY");
  }
};
