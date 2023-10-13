This is hacked version!
=======================
In DateTimePickerDays.js year is commented out (120) and babelrc file is empty.

react-bootstrap-datetimepicker-noicon
===============================

This project is a fork of https://github.com/quri/react-bootstrap-datetimepicker with a slightly different appearance. The datepicker icon has been removed from the input field and the entire field is now clickable to bring up the datepicker. The location of the datepicker has also been lowered slightly to prevent obstruction of the field while typing.


Usage
===============================

Installation :
```
npm install react-bootstrap-datetimepicker-noicon
```

Then
```javascript
var DateTimeField = require('react-bootstrap-datetimepicker-noicon');

...

render: function() {
  return <DateTimeField />;
}
```
See [Examples](examples/) for more details.

API
===============================

DateTimeField
========

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| **dateTime** | string  | moment().format('x') | Represents the inital dateTime, this string is then parsed by moment.js |
| **format**   | string  | "x"     | Defines the format moment.js should use to parse and output the date to onChange |
| **inputFormat** | string | "MM/DD/YY h:mm A" | Defines the way the date is represented in the HTML input. It must be a format understanable by moment.js |
| **onChange** | function | x => console.log(x) | Callback trigger when the date changes. `x` is the new datetime value. |
| **showToday** | boolean | true | Highlights today's date |
| **size** | string | "md" | Changes the size of the date picker input field. Sizes: "sm", "md", "lg" |
| **daysOfWeekDisabled** | array of integer | [] | Disables clicking on some days. Goes from 0 (Sunday) to 6 (Saturday). |
| **viewMode** | string or number | 'days' | The default view to display when the picker is shown. ('years', 'months', 'days') |
| **inputProps** | object | undefined | Defines additional attributes for the input element of the component. |
| **minDate** | moment | undefined | The earliest date allowed for entry in the calendar view. |
| **maxDate** | moment | undefined | The latest date allowed for entry in the calendar view. |
| **mode** | string | undefined | Allows to selectively display only the time picker ('time') or the date picker ('date') |
| **defaultText** | string | {dateTime} | Sets the initial value. Could be an empty string, or helper text. |

Contributions
===============================
There is still plenty of features missing compared to the original date time picker, hence contributions would be highly appreciated.
