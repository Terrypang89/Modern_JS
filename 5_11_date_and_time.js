//CREATION ++++++++++++++++++++++++++++++++++++++++++++++++
let now = new Date();
console.log( now ); // shows current date/time
// Sun Jun 14 2020 14:08:56 GMT+0800 (Singapore Standard Time)

// 0 means 01.01.1970 UTC+0
let Jan01_1970 = new Date(0);
console.log( Jan01_1970 ); //1970 year create timestamp
// Thu Jan 01 1970 07:30:00 GMT+0730 (Singapore Standard Time)

// now add 24 hours, get 02.01.1970 UTC+0
let Jan02_1970 = new Date(24 * 3600 * 1000);
console.log( Jan02_1970 );
// Fri Jan 02 1970 07:30:00 GMT+0730 (Singapore Standard Time)

//new Date(year, month, date, hours, minutes, seconds, ms)
let date = new Date(2011, 0, 1, 2, 3, 4, 567);
console.log( date ); // 1.01.2011, 02:03:04.567
// Sat Jan 01 2011 02:03:04 GMT+0800 (Singapore Standard Time)

//Access date components++++++++++++++++++++++++++++++++++++++++
// current date
let date1 = new Date();
// the hour in your current time zone
console.log(date1.getHours());
// 16
// the hour in UTC+0 time zone (London time without daylight savings)
console.log(date1.getUTCHours());
// 8
console.log(date1.getFullYear());
// 2020
console.log(date1.getMonth());
// 5
console.log(date1.getDate());
// 14
console.log(date1.getTime());
// 1592123376891 as timestamp
console.log(date1.getDay());
// 0 as sunday consider starting of day

// if you are in timezone UTC-1, outputs 60
// if you are in timezone UTC+3, outputs -180
console.log( date1.getTimezoneOffset());
// -480 as difference between UTC and local time zone

//Setting date components+++++++++++++++++++++++++++++++++++++++++++++++
//setFullYear(year, [month], [date])
//setMonth(month, [date])
//setDate(date)
//setHours(hour, [min], [sec], [ms])
//setMinutes(min, [sec], [ms])
//setSeconds(sec, [ms])
//setMilliseconds(ms)
//setTime(milliseconds) (sets the whole date by milliseconds since 01.01.1970 UTC)
let today = new Date();

today.setHours(0);
console.log(today); // still today, but the hour is changed to 0
// Sun Jun 14 2020 00:40:34 GMT+0800 (Singapore Standard Time)
today.setHours(0, 0, 0, 0);
console.log(today); // still today, now 00:00:00 sharp.
// Sun Jun 14 2020 00:00:00 GMT+0800 (Singapore Standard Time)

//Autocorrection+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let date2 = new Date(2013, 0, 32); // 32 Jan 2013 ?!?
console.log(date2); // ...is 1st Feb 2013! which auto-adjust the correct date
//Fri Feb 01 2013 00:00:00 GMT+0800 (Singapore Standard Time)

let date3 = new Date(2016, 1, 28);
date3.setDate(date3.getDate() + 2); // add extra 2 days which result 30/2/2016
console.log( date3 ); // 1 Mar 2016 auto correct fron 30/2/2016
//  Tue Mar 01 2016 00:00:00 GMT+0800 (Singapore Standard Time)

let date4 = new Date();
date4.setSeconds(date4.getSeconds() + 70); // add extra 70 seconds
console.log( date4 ); // shows the correct date
//Sun Jun 14 2020 17:20:56 GMT+0800 (Singapore Standard Time)

let date5 = new Date(2016, 0, 2); // 2 Jan 2016
date5.setDate(1); // set day 1 of month
console.log( date5 );
// Fri Jan 01 2016 00:00:00 GMT+0800 (Singapore Standard Time)
date5.setDate(0); // min day is 1, so the last day of the previous month is assumed
console.log( date5 ); // 31 Dec 2015
// Thu Dec 31 2015 00:00:00 GMT+0800 (Singapore Standard Time)

//Date to number, date diff+++++++++++++++++++++++++++++++++++++++++++++++++
let date6 = new Date();
console.log(+date6); // the number of milliseconds, same as date.getTime()
// 1592126945228 as date obj is converted to number which timestamp same as date.getTime()

let start = new Date(); // start measuring time
// do the job
for (let i = 0; i < 100000; i++) {
  let doSomething = i * i * i;
}
let end = new Date(); // end measuring time
console.log( `The loop took ${end - start} ms` );
// The loop took 3 ms so dates can be subtracted, the result is their difference in ms.

//Date.now()++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let start1 = Date.now(); // return current timestamp
// do the job
for (let j = 0; j < 100000; j++) {
  let doSomething1 = j * j * j;
}
let end1 = Date.now(); // return timestamp after loop
console.log( `The loop took ${end1 - start1} ms` ); // subtract numbers, not dates
// The loop took 2 ms as end1 same as new Date().getTime() without create an intermediate date obj
// this become faster than new Date().getTime() and no pressure on garbage collector

//Benchmarking++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//want a reliable benchmark of CPU-hungry function, we should be careful
// we have date1 and date2, which function faster returns their difference in ms?
function diffSubtract(date11, date12) {
  return date12 - date11;
}
// or
function diffGetTime(date11, date12) {
  return date12.getTime() - date11.getTime();
}// same result as above but uses an explicit date.getTime() to get the date in ms,
function bench(f) {
  let date11 = new Date(0);
  let date12 = new Date();

  let start3 = Date.now();
  for (let i = 0; i < 100000; i++) f(date11, date12);
  return Date.now() - start3;
}
console.log( 'Time of diffSubtract: ' + bench(diffSubtract) + 'ms' );
//Time of diffSubtract: 43ms
console.log( 'Time of diffGetTime: ' + bench(diffGetTime) + 'ms' );
//Time of diffGetTime: 6ms so getTime() is so much faster!
// That’s because there’s no type conversion, it is much easier for engines to optimize.

// due to first benchmark will have less CPU resources than the second. That may lead to wrong results.
// to make rebiabler benchmark, whole pack of benchmarks should be rerun multiple times.
function bench1(f) {
  let date21 = new Date(0);
  let date22 = new Date();

  let start4 = Date.now();
  for (let i = 0; i < 100000; i++) f(date21, date22);
  return Date.now() - start4;
}
let time1 = 0;
let time2 = 0;
// run bench(upperSlice) and bench(upperLoop) each 10 times alternating
for (let i = 0; i < 10; i++) {
  time1 += bench(diffSubtract);
  time2 += bench(diffGetTime);
}
console.log( 'Total time for diffSubtract: ' + time1 );
// Total time for diffSubtract: 191
console.log( 'Total time for diffGetTime: ' + time2 );
// Total time for diffGetTime: 13

//Date.parse from a string+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//YYYY-MM-DDTHH:mm:ss.sssZ
// YYYY-MM-DD – is the date: year-month-day.
// character "T" is used as the delimiter.
// HH:mm:ss.sss – is the time: hours, minutes, seconds and milliseconds.
//The optional 'Z' part denotes the time zone in the format +-hh:mm. A single letter Z that would mean UTC+0.
let ms = Date.parse('2012-01-26T13:51:50.417-07:00');
console.log(ms); // 1327611110417  (timestamp)
// 1327611110417

//create a new Date object from the timestamp:
let date7 = new Date( Date.parse('2012-01-26T13:51:50.417-07:00') );
console.log(date7);
//Fri Jan 27 2012 04:51:50 GMT+0800 (Singapore Standard Time)

//TASKS+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create a Date object for the date: Feb 20, 2012, 3:12am. The time zone is local.
let nowtime = new Date(2012, 1, 20, 3, 12);
console.log(nowtime);

//Write a function getWeekDay(date) to show the weekday in short format: ‘MO’, ‘TU’, ‘WE’, ‘TH’, ‘FR’, ‘SA’, ‘SU’.
let date8 = new Date(2012, 0, 3);  // 3 Jan 2012
function getWeekDay(date8) {
  let days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  return days[date8.getDay()];
}
console.log( getWeekDay(date8) );        // should output "TU"

//European countries have days of week starting with Monday (number 1),
//then Tuesday (number 2) and till Sunday (number 7).
//Write a function getLocalDay(date) that returns the “European” day of week for date.
let date9 = new Date(2012, 0, 3);  // 3 Jan 2012
function getLocalDay(date9){
  let day9 = date9.getDay();

  if (day9 == 0) { // weekday 0 (sunday) is 7 in european
    day9 = 7;
  }
  return day9;
}
console.log( getLocalDay(date9) );       // tuesday, should show 2

//Create a function getDateAgo(date, days) to return the day of month days ago from the date.
// For instance, if today is 20th, then getDateAgo(new Date(), 1) should be 19th and
// getDateAgo(new Date(), 2) should be 18th.
let date10 = new Date(2015, 0, 2);
function getDateAgo(date10, days10) {
  let dateCopy = new Date(date10);

  dateCopy.setDate(date10.getDate() - days10);
  return dateCopy.getDate();
}
console.log( getDateAgo(date10, 1) ); // 1, (1 Jan 2015)
console.log( getDateAgo(date10, 2) ); // 31, (31 Dec 2014)
console.log( getDateAgo(date10, 365) ); // 2, (2 Jan 2014)

//Write a function getLastDayOfMonth(year, month) that returns the last day of month.
//Sometimes it is 30th, 31st or even 28/29th for Feb.
//Parameters:
//year – four-digits year, for instance 2012.
//month – month, from 0 to 11.
//For instance, getLastDayOfMonth(2012, 1) = 29 (leap year, Feb).
function getLastDayOfMonth(year, month) {
  let date13 = new Date(year, month + 1, 0);
  return date13.getDate();
}
console.log( getLastDayOfMonth(2012, 0) ); // 31
console.log( getLastDayOfMonth(2012, 1) ); // 29
console.log( getLastDayOfMonth(2013, 1) ); // 28

//Write a function getSecondsToday() that returns the number of seconds from the beginning of today
// For instance, if now were 10:00 am, and there was no daylight savings shift, then:
function getSecondsToday() {
  let now55 = new Date();
  // create an object using the current day/month/year
  let today55 = new Date(now55.getFullYear(), now55.getMonth(), now55.getDate());
  let diff55 = now55 - today55; // ms difference
  return Math.round(diff55 / 1000); // make seconds
}
console.log( getSecondsToday() );
//getSecondsToday() == 36000 // (3600 * 10)

//Create a function getSecondsToTomorrow() that returns the number of seconds till tomorrow.
//For instance, if now is 23:00, then:
function getSecondsToTomorrow() {
  let now66 = new Date();

  // tomorrow date
  let tomorrow66 = new Date(now66.getFullYear(), now66.getMonth(), now66.getDate()+1);

  let diff66 = tomorrow66 - now66; // difference in ms
  return Math.round(diff66 / 1000); // convert to seconds
}
console.log(getSecondsToTomorrow());

//Format the relative date
//Write a function formatDate(date) that should format date as follows:
//If since date passed less than 1 second, then "right now".
//Otherwise, if since date passed less than 1 minute, then "n sec. ago".
//Otherwise, if less than an hour, then "m min. ago".
//Otherwise, the full date in the format "DD.MM.YY HH:mm". That is: "day.month.year hours:minutes", all in 2-digit format, e.g. 31.12.16 10:00.
function formatDate(date77) {
  let diff77 = new Date() - date77; // the difference in milliseconds
  if (diff77 < 1000) { // less than 1 second
    return 'right now';
  }
  let sec = Math.floor(diff77 / 1000); // convert diff to seconds
  if (sec < 60) {
    return sec + ' sec. ago';
  }
  let min = Math.floor(diff77 / 60000); // convert diff to minutes
  if (min < 60) {
    return min + ' min. ago';
  }
  // format the date
  // add leading zeroes to single-digit day/month/hours/minutes
  let d = date77;
  d = [
    '0' + d.getDate(),
    '0' + (d.getMonth() + 1),
    '' + d.getFullYear(),
    '0' + d.getHours(),
    '0' + d.getMinutes()
  ].map(component => component.slice(-2)); // take last 2 digits of every component
  // join the components into date
  return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':');
}
console.log( formatDate(new Date(new Date - 1)) ); // "right now"
console.log( formatDate(new Date(new Date - 30 * 1000)) ); // "30 sec. ago"
console.log( formatDate(new Date(new Date - 5 * 60 * 1000)) ); // "5 min. ago"
// yesterday's date like 31.12.2016 20:00
console.log( formatDate(new Date(new Date - 86400 * 1000)) );
