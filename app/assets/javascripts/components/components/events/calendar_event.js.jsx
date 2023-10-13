import React from 'react';
import moment from 'moment';
import { renderToString } from 'react-dom/server'

var $ = require('jquery');


const CalendarEvent = React.createClass({
    render: function() {
        var text = '';
        if (this.props.event.status == 3) { // blackout
            text = (<div className='tooltipevent'><h5>Blackout</h5>
                <table>
                    <tbody>
                    <tr>
                        <td>
                        { this.props.event.formattedDateRange }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.props.event.title}
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>);
        } else {
            text = (<div className='tooltipevent'><h5>Booking</h5><table><tbody>
                <tr>
                    <td>
                    { this.props.event.formattedDateRange }
                    </td>
                </tr>
                <tr>
                    <td>
                    {  this.props.event.quantity } x {  this.props.event.title }<br/>
                    { this.props.event.email.length > 0 ? <span>{ this.props.event.name } ({  this.props.event.email })</span> : null }
                    </td>
                </tr>
               { (this.props.event.order_id) ? <tr>
                    <td>
                        Order: {(this.props.event.order_name) ? this.props.event.order_name : this.props.event.order_id }
                    </td>
                </tr> : null }

            </tbody></table></div>);
        }

        return text;
    }
});

export default CalendarEvent;