import { Component, PropTypes } from 'react';
import Calendar from './calendar.js.jsx';
import EventsChart from './events_chart.js.jsx';

export default class Events extends Component {
    getBookingCountForLastMonth() {
        var startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
        return this.props.bookingCountByMonth[startOfMonth];
    }
    onBookingCreateClick() {
        window.location.href = '/admin/bookings/new';
    }
    onBlackoutCreateClick() {
        window.location.href = '/admin/blackouts/new';
    }
    getBookingEditUrl(booking) {
        return '/admin/bookings/' + booking.id + '/edit';
    }
    render () {
        var self = this;

        return (
            <div className="row">
                <div className="col-lg-4">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="ibox float-e-margins">
                                <div className="ibox-title">
                                    <span className="label label-success pull-right">Total</span>
                                    <h5>Products</h5>
                                </div>
                                <div className="ibox-content">
                                    <h1 className="no-margins">{this.props.products.length}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="ibox float-e-margins">
                                <div className="ibox-title">
                                    <span className="label label-info pull-right">Total</span>
                                    <h5>Bookings</h5>
                                </div>
                                <div className="ibox-content">
                                    <h1 className="no-margins">{this.props.bookingCount}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="ibox float-e-margins">
                                <div className="ibox-title">
                                    <span className="label label-info pull-right">Total</span>
                                    <h5>Revenue</h5>
                                </div>
                                <div className="ibox-content">
                                    <h1 className="no-margins">{this.props.revenue}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <EventsChart bookingCountByMonth={this.props.bookingCountByMonth}/>
                </div>
                <div className="col-lg-12 m-b">
                    <button className="btn btn-primary m-r" type="button" onClick={this.onBookingCreateClick}><i className="fa fa-calendar"/> Create Booking</button>
                    <button className="btn btn-primary" type="button" onClick={this.onBlackoutCreateClick}><i className="fa fa-flag"/> Create Blackout</button>
                </div>

                <div className="col-lg-6">
                    <div className="ibox float-e-margins">
                        <div className="ibox-title">
                            <h5>Recent Bookings</h5>
                        </div>
                        <div className="ibox-content">
                        {(this.props.latestBookings.length) ?
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th style={{width: '75px'}}>Date</th>
                                        <th>Booking</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.props.latestBookings.map(function (item, i) {
                                        return <tr key={'lb' + i}>
                                            <td>
                                                {(item.order_name) ?  <i className="fa fa-shopping-cart m-r-xs"/> :  <i className="fa fa-user m-r-xs"/>}
                                                {item.created_at}
                                            </td>
                                            <td>
                                                <a href={self.getBookingEditUrl(item)}>{item.product_title} for {item.name}
                                                    {(item.start) ?
                                                        <span> on {item.start}</span> : null
                                                        }
                                                </a>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                            :
                                <p>No recent bookings at this time.</p>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="ibox float-e-margins">
                        <div className="ibox-title">
                            <h5>Upcoming Bookings</h5>
                        </div>
                        <div className="ibox-content">
                            {(this.props.nextBookings.length) ?
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th style={{width: '75px'}}>Date</th>
                                            <th>Booking</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { this.props.nextBookings.map(function (item, i) {
                                        return <tr key={'nb' + i}>
                                            <td>
                                                {(item.status == 2) ?  <i className="fa fa-calendar m-r-xs"/> :  <i className="fa fa-clock-o m-r-xs"/>}
                                                {item.start}
                                            </td>
                                            <td>
                                                <a href="{self.getBookingEditUrl(item)}">{item.product_title} for {item.name}</a>
                                            </td>
                                        </tr>
                                    })}
                                    </tbody>
                                </table>
                                :
                                <p>No upcoming bookings at this time.</p>
                                }
                        </div>
                    </div>
                </div>
                {(this.props.products.length == 0) ?
                <div className="col-lg-12">
                    <div className="alert alert-info alert-dismissible" role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        You currently have no products defined in BookThatApp. <a href="/admin/products">Configure some products</a> to
                        get started.
                    </div>
                </div> : null }
                <div className="col-lg-12">
                    <div className="ibox float-e-margins">

                        <div className="ibox-title">
                            <h5>Calendar</h5>
                        </div>
                        <div className="ibox-content">
                            <Calendar
                                products={this.props.products}
                                filter={this.props.filter}
                                actions={this.props.actions}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}