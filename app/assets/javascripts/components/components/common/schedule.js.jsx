var $ = require('jquery');
require('fuelux');


const Schedule = React.createClass({
    propTypes: {
        onCreate: React.PropTypes.func.isRequired,
        style: React.PropTypes.object
    },
    componentWillUnmount: function() {
        $('#myScheduler').scheduler('destroy');
    },
    componentDidMount: function() {
        var hideDropdown = function() {
            $('.fuelux .dropdown-menu tr').not('restricted').click(function(){
                $('.fuelux .dropdown-menu').hide();
            });
            $('.fuelux .dropdown-menu li').click(function(){
                $('.fuelux .dropdown-menu').hide();
            });
        };
        $('.fuelux .dropdown-toggle').click(function(){
           $(this).parent().find( ".dropdown-menu" ).toggle();
            hideDropdown();
        });

        $('.fuelux .prev').click(function(){
            setTimeout(hideDropdown, 5);
        });

        $('.fuelux .next').click(function(){
            setTimeout(hideDropdown, 5);
        });
    },
    onScheduleCreate: function(){

        let schedule = $('#myScheduler').scheduler('value');
        let start = schedule.startDateTime.replace(/Z/g, "");
        let formattedSchedule = {
            startDateTime: start,
            timeZone: {
                offset: schedule.timeZone.offset
            },
            recurrencePattern: schedule.recurrencePattern
        };
        this.props.onCreate(formattedSchedule);
    },
    onConfigureScheduleOpen: function(value) {
        if (!value) {
            let startDateTime = moment().format();
            value = {
                startDateTime: startDateTime,
                timeZone: {
                    offset: '+00:00'
                },
                recurrencePattern: 'FREQ=DAILY;INTERVAL=1;COUNT=1'
            };
        }

        $('#myScheduler').scheduler('value', value);
        window.$('#schedulerModal').modal({
            keyboard: false,   // don't close modal on ESC
            backdrop: 'static' // don't close modal on click outside of it
        });
    },
    render: function() {

        return (
        <div style={this.props.style}>


            <button type="button" className="btn btn-primary" onClick={() => this.onConfigureScheduleOpen(null)}>
                Add Schedule Item
            </button>
            <div className="modal scheduler-modal fade" id="schedulerModal" ref='schedulerModal' tabIndex="-1" role="dialog" aria-hidden="true">

                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Schedule</h4>
                        </div>
                        <div className="modal-body fuelux">
                            <div className="form-horizontal container-fluid scheduler" data-initialize="scheduler" role="form" id="myScheduler">
                                <div className="form-group start-datetime">
                                    <label className="col-sm-2 control-label scheduler-label">Start Date</label>
                                    <div className="row col-sm-10">
                                        <div className="col-sm-8 form-group">
                                            <div className="datepickers start-date">
                                                <div className="input-group">
                                                    <input className="form-control" id="myStartDate" type="text"/>
                                                    <div className="input-group-btn">
                                                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                            <span className="glyphicon glyphicon-calendar"></span>
                                                            <span className="sr-only">Toggle Calendar</span>
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-right datepicker-calendar-wrapper" role="menu">
                                                            <div className="datepicker-calendar">
                                                                <div className="datepicker-calendar-header">
                                                                    <button type="button" className="prev"><span className="glyphicon glyphicon-chevron-left"></span><span className="sr-only">Previous Month</span></button>
                                                                    <button type="button" className="next"><span className="glyphicon glyphicon-chevron-right"></span><span className="sr-only">Next Month</span></button>
                                                                    <button type="button" className="title">
                                                                        <span className="month">
                                                                            <span data-month="0">January</span>
                                                                            <span data-month="1">February</span>
                                                                            <span data-month="2">March</span>
                                                                            <span data-month="3">April</span>
                                                                            <span data-month="4">May</span>
                                                                            <span data-month="5">June</span>
                                                                            <span data-month="6">July</span>
                                                                            <span data-month="7">August</span>
                                                                            <span data-month="8">September</span>
                                                                            <span data-month="9">October</span>
                                                                            <span data-month="10">November</span>
                                                                            <span data-month="11">December</span>
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                                <table className="datepicker-calendar-days">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Su</th>
                                                                            <th>Mo</th>
                                                                            <th>Tu</th>
                                                                            <th>We</th>
                                                                            <th>Th</th>
                                                                            <th>Fr</th>
                                                                            <th>Sa</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody></tbody>
                                                                </table>
                                                                <div className="datepicker-calendar-footer">
                                                                    <button type="button" className="datepicker-today">Today</button>
                                                                </div>
                                                            </div>
                                                            <div className="datepicker-wheels" aria-hidden="true">
                                                                <div className="datepicker-wheels-month">
                                                                    <h2 className="header">Month</h2>
                                                                    <ul>
                                                                        <li data-month="0"><button type="button">Jan</button></li>
                                                                        <li data-month="1"><button type="button">Feb</button></li>
                                                                        <li data-month="2"><button type="button">Mar</button></li>
                                                                        <li data-month="3"><button type="button">Apr</button></li>
                                                                        <li data-month="4"><button type="button">May</button></li>
                                                                        <li data-month="5"><button type="button">Jun</button></li>
                                                                        <li data-month="6"><button type="button">Jul</button></li>
                                                                        <li data-month="7"><button type="button">Aug</button></li>
                                                                        <li data-month="8"><button type="button">Sep</button></li>
                                                                        <li data-month="9"><button type="button">Oct</button></li>
                                                                        <li data-month="10"><button type="button">Nov</button></li>
                                                                        <li data-month="11"><button type="button">Dec</button></li>
                                                                    </ul>
                                                                </div>
                                                                <div className="datepicker-wheels-year">
                                                                    <h2 className="header">Year</h2>
                                                                    <ul></ul>
                                                                </div>
                                                                <div className="datepicker-wheels-footer clearfix">
                                                                    <button type="button" className="btn datepicker-wheels-back"><span className="glyphicon glyphicon-arrow-left"></span><span className="sr-only">Return to Calendar</span></button>
                                                                    <button type="button" className="btn datepicker-wheels-select">Select <span className="sr-only">Month and Year</span></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
    
                                        <div className="col-sm-4 form-group">
                                            <label className="sr-only">Start Time</label>
                                            <div className="input-group combobox start-time">
                                                <input id="myStartTime" type="text" className="form-control" />
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                        <span className="caret"></span>
                                                        <span className="sr-only">Toggle Dropdown</span>
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                                        <li data-value="12:00 AM"><a href="#">12:00 AM</a></li>
                                                        <li data-value="12:30 AM"><a href="#">12:30 AM</a></li>
                                                        <li data-value="1:00 AM"><a href="#">1:00 AM</a></li>
                                                        <li data-value="1:30 AM"><a href="#">1:30 AM</a></li>
                                                        <li data-value="2:00 AM"><a href="#">2:00 AM</a></li>
                                                        <li data-value="2:30 AM"><a href="#">2:30 AM</a></li>
                                                        <li data-value="3:00 AM"><a href="#">3:00 AM</a></li>
                                                        <li data-value="3:30 AM"><a href="#">3:30 AM</a></li>
                                                        <li data-value="4:00 AM"><a href="#">4:00 AM</a></li>
                                                        <li data-value="4:30 AM"><a href="#">4:30 AM</a></li>
                                                        <li data-value="5:00 AM"><a href="#">5:00 AM</a></li>
                                                        <li data-value="5:30 AM"><a href="#">5:30 AM</a></li>
                                                        <li data-value="6:00 AM"><a href="#">6:00 AM</a></li>
                                                        <li data-value="6:30 AM"><a href="#">6:30 AM</a></li>
                                                        <li data-value="7:00 AM"><a href="#">7:00 AM</a></li>
                                                        <li data-value="7:30 AM"><a href="#">7:30 AM</a></li>
                                                        <li data-value="8:00 AM"><a href="#">8:00 AM</a></li>
                                                        <li data-value="8:30 AM"><a href="#">8:30 AM</a></li>
                                                        <li data-value="9:00 AM"><a href="#">9:00 AM</a></li>
                                                        <li data-value="9:30 AM"><a href="#">9:30 AM</a></li>
                                                        <li data-value="10:00 AM"><a href="#">10:00 AM</a></li>
                                                        <li data-value="10:30 AM"><a href="#">10:30 AM</a></li>
                                                        <li data-value="11:00 AM"><a href="#">11:00 AM</a></li>
                                                        <li data-value="11:30 AM"><a href="#">11:30 AM</a></li>
                                                        <li data-value="12:00 PM"><a href="#">12:00 PM</a></li>
                                                        <li data-value="12:30 PM"><a href="#">12:30 PM</a></li>
                                                        <li data-value="1:00 PM"><a href="#">1:00 PM</a></li>
                                                        <li data-value="1:30 PM"><a href="#">1:30 PM</a></li>
                                                        <li data-value="2:00 PM"><a href="#">2:00 PM</a></li>
                                                        <li data-value="2:30 PM"><a href="#">2:30 PM</a></li>
                                                        <li data-value="3:00 PM"><a href="#">3:00 PM</a></li>
                                                        <li data-value="3:30 PM"><a href="#">3:30 PM</a></li>
                                                        <li data-value="4:00 PM"><a href="#">4:00 PM</a></li>
                                                        <li data-value="4:30 PM"><a href="#">4:30 PM</a></li>
                                                        <li data-value="5:00 PM"><a href="#">5:00 PM</a></li>
                                                        <li data-value="5:30 PM"><a href="#">5:30 PM</a></li>
                                                        <li data-value="6:00 PM"><a href="#">6:00 PM</a></li>
                                                        <li data-value="6:30 PM"><a href="#">6:30 PM</a></li>
                                                        <li data-value="7:00 PM"><a href="#">7:00 PM</a></li>
                                                        <li data-value="7:30 PM"><a href="#">7:30 PM</a></li>
                                                        <li data-value="8:00 PM"><a href="#">8:00 PM</a></li>
                                                        <li data-value="8:30 PM"><a href="#">8:30 PM</a></li>
                                                        <li data-value="9:00 PM"><a href="#">9:00 PM</a></li>
                                                        <li data-value="9:30 PM"><a href="#">9:30 PM</a></li>
                                                        <li data-value="10:00 PM"><a href="#">10:00 PM</a></li>
                                                        <li data-value="10:30 PM"><a href="#">10:30 PM</a></li>
                                                        <li data-value="11:00 PM"><a href="#">11:00 PM</a></li>
                                                        <li data-value="11:30 PM"><a href="#">11:30 PM</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
    
                                    </div>
                                </div>

                                <div className="row form-group timezone-container" style={{display:'none'}}>
                                    <label className="col-sm-2 control-label scheduler-label">Timezone</label>
                                    <div className="col-xs-12 col-sm-10 col-md-10">
                                        <div data-resize="auto" className="btn-group selectlist timezone">
                                            <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                <span className="selected-label" style={{width: "67px"}}>(GMT-06:00) Central Standard Time</span>
                                                <span className="caret"></span>
                                                <span className="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <ul className="dropdown-menu" role="menu">
                                                <li data-name="GMT Standard Time" data-offset="+00:00"><a href="#">(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London *</a></li>
                                            </ul>
                                            <input type="text" aria-hidden="true" readOnly="readonly" name="TimeZoneSelectlist" className="hidden hidden-field"/>
                                        </div>
                                    </div>
                                </div>
    
                                <div className="form-group repeat-container">
                                    <label className="col-sm-2 control-label scheduler-label">Repeat</label>
                                    <div className="col-sm-10">
    
                                        <div className="form-group repeat-interval">
                                            <div data-resize="auto" className="btn-group selectlist pull-left repeat-options">
                                                <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                    <span className="selected-label">None (run once)</span>
                                                    <span className="caret"></span>
                                                </button>
                                                <ul className="dropdown-menu" role="menu">
                                                    <li data-value="none"><a href="#">None (run once)</a></li>
                                                    <li data-value="secondly" data-text="second(s)"><a href="#">Per Second</a></li>
                                                    <li data-value="minutely" data-text="minute(s)"><a href="#">Per Minute</a></li>
                                                    <li data-value="hourly" data-text="hour(s)"><a href="#">Hourly</a></li>
                                                    <li data-value="daily" data-text="day(s)"><a href="#">Daily</a></li>
                                                    <li data-value="weekdays"><a href="#">Weekdays</a></li>
                                                    <li data-value="weekly" data-text="week(s)"><a href="#">Weekly</a></li>
                                                    <li data-value="monthly" data-text="month(s)"><a href="#">Monthly</a></li>
                                                    <li data-value="yearly"><a href="#">Yearly</a></li>
                                                </ul>
                                                <input type="text" aria-hidden="true" readOnly="readonly" name="intervalSelectlist" className="hidden hidden-field"/>
                                            </div>
    
                                            <div className="repeat-panel repeat-every-panel repeat-secondly repeat-minutely repeat-hourly repeat-daily repeat-weekly hidden" aria-hidden="true">
                                                <label id="MySchedulerEveryLabel" className="inline-form-text repeat-every-pretext">every</label>
    
                                                <div className="spinbox digits-3 repeat-every">
                                                    <input type="text" className="form-control input-mini spinbox-input" aria-labelledby="MySchedulerEveryLabel"/>
                                                    <div className="spinbox-buttons btn-group btn-group-vertical">
                                                        <button type="button" className="btn btn-default spinbox-up btn-xs">
                                                            <span className="glyphicon glyphicon-chevron-up"></span><span className="sr-only">Increase</span>
                                                        </button>
                                                        <button type="button" className="btn btn-default spinbox-down btn-xs">
                                                            <span className="glyphicon glyphicon-chevron-down"></span><span className="sr-only">Decrease</span>
                                                        </button>
                                                    </div>
                                                </div>
    
                                                <div className="inline-form-text repeat-every-text"></div>
                                            </div>
                                        </div>
    
                                        <div className="form-group repeat-panel repeat-weekly repeat-days-of-the-week hidden" aria-hidden="true">
                                            <fieldset className="btn-group" data-toggle="buttons">
                                                <label className="btn btn-default">
                                                    <input type="checkbox" data-value="SU"/>Sun
                                                </label>
                                                <label className="btn btn-default">
                                                    <input type="checkbox" data-value="MO"/>Mon
                                                </label>
                                                <label className="btn btn-default">
                                                    <input type="checkbox" data-value="TU"/>Tue
                                                </label>
                                                <label className="btn btn-default">
                                                    <input type="checkbox" data-value="WE"/> Wed
                                                </label>
                                                <label className="btn btn-default">
                                                    <input type="checkbox" data-value="TH"/> Thu
                                                </label>
                                                <label className="btn btn-default">
                                                    <input type="checkbox" data-value="FR"/> Fri
                                                </label>
                                                <label className="btn btn-default">
                                                    <input type="checkbox" data-value="SA"/> Sat
                                                </label>
                                            </fieldset>
                                        </div>
    
    
                                        <div className="repeat-panel repeat-monthly hidden" aria-hidden="true">
                                            <div className="form-group repeat-monthly-date">
                                                <div className="radio pull-left">
                                                    <label className="radio-custom">
                                                        <input className="sr-only" type="radio" defaultChecked="checked" name="repeat-monthly" value="bymonthday"/>
                                                        <span className="radio-label">on day</span>
                                                    </label>
                                                </div>
    
                                                <div data-resize="auto" className="btn-group selectlist pull-left">
                                                    <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                        <span className="selected-label">1</span>
                                                        <span className="caret"></span>
                                                    </button>
                                                    <ul className="dropdown-menu" role="menu" style={{height:"200px", overflow:"auto"}}>
                                                        <li data-value="1"><a href="#">1</a></li>
                                                        <li data-value="2"><a href="#">2</a></li>
                                                        <li data-value="3"><a href="#">3</a></li>
                                                        <li data-value="4"><a href="#">4</a></li>
                                                        <li data-value="5"><a href="#">5</a></li>
                                                        <li data-value="6"><a href="#">6</a></li>
                                                        <li data-value="7"><a href="#">7</a></li>
                                                        <li data-value="8"><a href="#">8</a></li>
                                                        <li data-value="9"><a href="#">9</a></li>
                                                        <li data-value="10"><a href="#">10</a></li>
                                                        <li data-value="11"><a href="#">11</a></li>
                                                        <li data-value="12"><a href="#">12</a></li>
                                                        <li data-value="13"><a href="#">13</a></li>
                                                        <li data-value="14"><a href="#">14</a></li>
                                                        <li data-value="15"><a href="#">15</a></li>
                                                        <li data-value="16"><a href="#">16</a></li>
                                                        <li data-value="17"><a href="#">17</a></li>
                                                        <li data-value="18"><a href="#">18</a></li>
                                                        <li data-value="19"><a href="#">19</a></li>
                                                        <li data-value="20"><a href="#">20</a></li>
                                                        <li data-value="21"><a href="#">21</a></li>
                                                        <li data-value="22"><a href="#">22</a></li>
                                                        <li data-value="23"><a href="#">23</a></li>
                                                        <li data-value="24"><a href="#">24</a></li>
                                                        <li data-value="25"><a href="#">25</a></li>
                                                        <li data-value="26"><a href="#">26</a></li>
                                                        <li data-value="27"><a href="#">27</a></li>
                                                        <li data-value="28"><a href="#">28</a></li>
                                                        <li data-value="29"><a href="#">29</a></li>
                                                        <li data-value="30"><a href="#">30</a></li>
                                                        <li data-value="31"><a href="#">31</a></li>
                                                    </ul>
                                                    <input type="text" aria-hidden="true" readOnly="readonly" name="monthlySelectlist" className="hidden hidden-field"/>
                                                </div>
                                            </div>
    
                                            <div className="repeat-monthly-day form-group">
                                                <div className="radio pull-left">
                                                    <label className="radio-custom">
                                                        <input className="sr-only" type="radio" defaultChecked="checked" name="repeat-monthly" value="bysetpos"/>
                                                        <span className="radio-label">on the</span>
                                                    </label>
                                                </div>
    
                                                <div data-resize="auto" className="btn-group selectlist month-day-pos pull-left">
                                                    <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                        <span className="selected-label">First</span>
                                                        <span className="caret"></span>
                                                    </button>
                                                    <ul className="dropdown-menu" role="menu">
                                                        <li data-value="1"><a href="#">First</a></li>
                                                        <li data-value="2"><a href="#">Second</a></li>
                                                        <li data-value="3"><a href="#">Third</a></li>
                                                        <li data-value="4"><a href="#">Fourth</a></li>
                                                        <li data-value="-1"><a href="#">Last</a></li>
                                                    </ul>
                                                    <input type="text" aria-hidden="true" readOnly="readonly" name="monthlySelectlist" className="hidden hidden-field"/>
                                                </div>
    
                                                <div data-resize="auto" className="btn-group selectlist month-days pull-left">
                                                    <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                        <span className="selected-label">Sunday</span>
                                                        <span className="caret"></span>
                                                    </button>
                                                    <ul className="dropdown-menu" role="menu">
                                                        <li data-value="SU"><a href="#">Sunday</a></li>
                                                        <li data-value="MO"><a href="#">Monday</a></li>
                                                        <li data-value="TU"><a href="#">Tuesday</a></li>
                                                        <li data-value="WE"><a href="#">Wednesday</a></li>
                                                        <li data-value="TH"><a href="#">Thursday</a></li>
                                                        <li data-value="FR"><a href="#">Friday</a></li>
                                                        <li data-value="SA"><a href="#">Saturday</a></li>
                                                        <li data-value="SU,MO,TU,WE,TH,FR,SA"><a href="#">Day</a></li>
                                                        <li data-value="MO,TU,WE,TH,FR"><a href="#">Weekday</a></li>
                                                        <li data-value="SU,SA"><a href="#">Weekend day</a></li>
                                                    </ul>
                                                    <input type="text" aria-hidden="true" readOnly="readonly" name="monthlySelectlist" className="hidden hidden-field"/>
                                                </div>
    
                                            </div>
                                        </div>
    
                                        <div className="repeat-panel repeat-yearly hidden" aria-hidden="true">
    
                                            <div className="form-group repeat-yearly-date">
    
                                                <div className="radio pull-left">
                                                    <label className="radio-custom">
                                                        <input className="sr-only" type="radio" defaultChecked="checked" name="repeat-yearly" value="bymonthday"/>
                                                        <span className="radio-label">on</span>
                                                    </label>
                                                </div>
    
                                                <div data-resize="auto" className="btn-group selectlist year-month pull-left">
                                                    <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                        <span className="selected-label">January</span>
                                                        <span className="caret"></span>
                                                    </button>
                                                    <ul className="dropdown-menu" role="menu">
                                                        <li data-value="1"><a href="#">January</a></li>
                                                        <li data-value="2"><a href="#">February</a></li>
                                                        <li data-value="3"><a href="#">March</a></li>
                                                        <li data-value="4"><a href="#">April</a></li>
                                                        <li data-value="5"><a href="#">May</a></li>
                                                        <li data-value="6"><a href="#">June</a></li>
                                                        <li data-value="7"><a href="#">July</a></li>
                                                        <li data-value="8"><a href="#">August</a></li>
                                                        <li data-value="9"><a href="#">September</a></li>
                                                        <li data-value="10"><a href="#">October</a></li>
                                                        <li data-value="11"><a href="#">November</a></li>
                                                        <li data-value="12"><a href="#">December</a></li>
                                                    </ul>
                                                    <input type="text" aria-hidden="true" readOnly="readonly" name="monthlySelectlist" className="hidden hidden-field"/>
                                                </div>
    
                                                <div data-resize="auto" className="btn-group selectlist year-month-day pull-left">
                                                    <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                        <span className="selected-label">1</span>
                                                        <span className="caret"></span>
                                                    </button>
                                                    <ul className="dropdown-menu" role="menu" style={{height:"200px", overflow:"auto"}}>
                                                        <li data-value="1"><a href="#">1</a></li>
                                                        <li data-value="2"><a href="#">2</a></li>
                                                        <li data-value="3"><a href="#">3</a></li>
                                                        <li data-value="4"><a href="#">4</a></li>
                                                        <li data-value="5"><a href="#">5</a></li>
                                                        <li data-value="6"><a href="#">6</a></li>
                                                        <li data-value="7"><a href="#">7</a></li>
                                                        <li data-value="8"><a href="#">8</a></li>
                                                        <li data-value="9"><a href="#">9</a></li>
                                                        <li data-value="10"><a href="#">10</a></li>
                                                        <li data-value="11"><a href="#">11</a></li>
                                                        <li data-value="12"><a href="#">12</a></li>
                                                        <li data-value="13"><a href="#">13</a></li>
                                                        <li data-value="14"><a href="#">14</a></li>
                                                        <li data-value="15"><a href="#">15</a></li>
                                                        <li data-value="16"><a href="#">16</a></li>
                                                        <li data-value="17"><a href="#">17</a></li>
                                                        <li data-value="18"><a href="#">18</a></li>
                                                        <li data-value="19"><a href="#">19</a></li>
                                                        <li data-value="20"><a href="#">20</a></li>
                                                        <li data-value="21"><a href="#">21</a></li>
                                                        <li data-value="22"><a href="#">22</a></li>
                                                        <li data-value="23"><a href="#">23</a></li>
                                                        <li data-value="24"><a href="#">24</a></li>
                                                        <li data-value="25"><a href="#">25</a></li>
                                                        <li data-value="26"><a href="#">26</a></li>
                                                        <li data-value="27"><a href="#">27</a></li>
                                                        <li data-value="28"><a href="#">28</a></li>
                                                        <li data-value="29"><a href="#">29</a></li>
                                                        <li data-value="30"><a href="#">30</a></li>
                                                        <li data-value="31"><a href="#">31</a></li>
                                                    </ul>
                                                    <input type="text" aria-hidden="true" readOnly="readonly" name="monthlySelectlist" className="hidden hidden-field"/>
                                                </div>
                                            </div>
    
                                            <div className="form-group repeat-yearly-day">
    
                                                <div className="radio pull-left"><label className="radio-custom"><input className="sr-only" type="radio" name="repeat-yearly" value="bysetpos"/> on the</label></div>
    
                                                <div data-resize="auto" className="btn-group selectlist year-month-day-pos pull-left">
                                                    <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                        <span className="selected-label">First</span>
                                                        <span className="caret"></span>
                                                        <span className="sr-only">First</span>
                                                    </button>
                                                    <ul className="dropdown-menu" role="menu">
                                                        <li data-value="1"><a href="#">First</a></li>
                                                        <li data-value="2"><a href="#">Second</a></li>
                                                        <li data-value="3"><a href="#">Third</a></li>
                                                        <li data-value="4"><a href="#">Fourth</a></li>
                                                        <li data-value="-1"><a href="#">Last</a></li>
                                                    </ul>
                                                    <input type="text" aria-hidden="true" readOnly="readonly" name="yearlyDateSelectlist" className="hidden hidden-field"/>
                                                </div>
    
                                                <div data-resize="auto" className="btn-group selectlist year-month-days pull-left">
                                                    <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                        <span className="selected-label">Sunday</span>
                                                        <span className="caret"></span>
                                                        <span className="sr-only">Sunday</span>
                                                    </button>
                                                    <ul className="dropdown-menu" role="menu" style={{height:"200px", overflow:"auto"}}>
                                                        <li data-value="SU"><a href="#">Sunday</a></li>
                                                        <li data-value="MO"><a href="#">Monday</a></li>
                                                        <li data-value="TU"><a href="#">Tuesday</a></li>
                                                        <li data-value="WE"><a href="#">Wednesday</a></li>
                                                        <li data-value="TH"><a href="#">Thursday</a></li>
                                                        <li data-value="FR"><a href="#">Friday</a></li>
                                                        <li data-value="SA"><a href="#">Saturday</a></li>
                                                        <li data-value="SU,MO,TU,WE,TH,FR,SA"><a href="#">Day</a></li>
                                                        <li data-value="MO,TU,WE,TH,FR"><a href="#">Weekday</a></li>
                                                        <li data-value="SU,SA"><a href="#">Weekend day</a></li>
                                                    </ul>
                                                    <input type="text" aria-hidden="true" readOnly="readonly" name="yearlyDaySelectlist" className="hidden hidden-field"/>
                                                </div>
                                                <div className="inline-form-text repeat-yearly-day-text"> of </div>
    
                                                <div data-resize="auto" className="btn-group selectlist year-month pull-left">
                                                    <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                        <span className="selected-label">January</span>
                                                        <span className="caret"></span>
                                                        <span className="sr-only">January</span>
                                                    </button>
                                                    <ul className="dropdown-menu" role="menu" style={{height:"200px", overflow:"auto"}}>
                                                        <li data-value="1"><a href="#">January</a></li>
                                                        <li data-value="2"><a href="#">February</a></li>
                                                        <li data-value="3"><a href="#">March</a></li>
                                                        <li data-value="4"><a href="#">April</a></li>
                                                        <li data-value="5"><a href="#">May</a></li>
                                                        <li data-value="6"><a href="#">June</a></li>
                                                        <li data-value="7"><a href="#">July</a></li>
                                                        <li data-value="8"><a href="#">August</a></li>
                                                        <li data-value="9"><a href="#">September</a></li>
                                                        <li data-value="10"><a href="#">October</a></li>
                                                        <li data-value="11"><a href="#">November</a></li>
                                                        <li data-value="12"><a href="#">December</a></li>
                                                    </ul>
                                                    <input type="text" aria-hidden="true" readOnly="readonly" name="yearlyDaySelectlist" className="hidden hidden-field"/>
                                                </div>
                                            </div>
                                        </div>
    
                                    </div>
                                </div>
    
                                <div className="form-group repeat-end hidden" aria-hidden="true">
                                    <label className="col-sm-2 control-label scheduler-label">End</label>
                                    <div className="col-sm-10 row">
                                        <div className="col-sm-3 form-group">
                                            <div data-resize="auto" className="btn-group selectlist end-options pull-left">
                                                <button data-toggle="dropdown" className="btn btn-default dropdown-toggle" type="button">
                                                    <span className="selected-label">Never</span>
                                                    <span className="caret"></span>
                                                    <span className="sr-only">Never</span>
                                                </button>
                                                <ul className="dropdown-menu" role="menu">
                                                    <li data-value="never"><a href="#">Never</a></li>
                                                    <li data-value="after"><a href="#">After</a></li>
                                                    <li data-value="date"><a href="#">On date</a></li>
                                                </ul>
                                                <input type="text" aria-hidden="true" readOnly="readonly" name="EndSelectlist" className="hidden hidden-field"/>
                                            </div>
                                        </div>
    
                                        <div className="col-sm-6 form-group end-option-panel end-after-panel pull-left hidden" aria-hidden="true">
                                            <div className="spinbox digits-3 end-after">
                                                <label id="MyEndAfter" className="sr-only">End After</label>
                                                <input type="text" className="form-control input-mini spinbox-input" aria-labelledby="MyEndAfter"/>
                                                <div className="spinbox-buttons btn-group btn-group-vertical">
                                                    <button type="button" className="btn btn-default spinbox-up btn-xs">
                                                        <span className="glyphicon glyphicon-chevron-up"></span><span className="sr-only">Increase</span>
                                                    </button>
                                                    <button type="button" className="btn btn-default spinbox-down btn-xs">
                                                        <span className="glyphicon glyphicon-chevron-down"></span><span className="sr-only">Decrease</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="inline-form-text end-after-text">occurrence(s)</div>
                                        </div>
    
                                        <div className="col-sm-8 form-group end-option-panel end-on-date-panel pull-left hidden" aria-hidden="true">
                                            <div className="datepickers input-group end-on-date">
                                                <div className="input-group">
                                                    <input className="form-control" type="text"/>
                                                    <div className="input-group-btn">
                                                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                            <span className="glyphicon glyphicon-calendar"></span>
                                                            <span className="sr-only">Toggle Calendar</span>
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-right datepicker-calendar-wrapper" role="menu">
                                                            <div className="datepicker-calendar">
                                                                <div className="datepicker-calendar-header">
                                                                    <button type="button" className="prev"><span className="glyphicon glyphicon-chevron-left"></span><span className="sr-only">Previous Month</span></button>
                                                                    <button type="button" className="next"><span className="glyphicon glyphicon-chevron-right"></span><span className="sr-only">Next Month</span></button>
                                                                    <button type="button" className="title">
                                                                        <span className="month">
                                                                            <span data-month="0">January</span>
                                                                            <span data-month="1">February</span>
                                                                            <span data-month="2">March</span>
                                                                            <span data-month="3">April</span>
                                                                            <span data-month="4">May</span>
                                                                            <span data-month="5">June</span>
                                                                            <span data-month="6">July</span>
                                                                            <span data-month="7">August</span>
                                                                            <span data-month="8">September</span>
                                                                            <span data-month="9">October</span>
                                                                            <span data-month="10">November</span>
                                                                            <span data-month="11">December</span>
                                                                        </span> <span className="year"></span>
                                                                    </button>
                                                                </div>
                                                                <table className="datepicker-calendar-days">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Su</th>
                                                                            <th>Mo</th>
                                                                            <th>Tu</th>
                                                                            <th>We</th>
                                                                            <th>Th</th>
                                                                            <th>Fr</th>
                                                                            <th>Sa</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody></tbody>
                                                                </table>
                                                                <div className="datepicker-calendar-footer">
                                                                    <button type="button" className="datepicker-today">Today</button>
                                                                </div>
                                                            </div>
                                                            <div className="datepicker-wheels" aria-hidden="true">
                                                                <div className="datepicker-wheels-month">
                                                                    <h2 className="header">Month</h2>
                                                                    <ul>
                                                                        <li data-month="0"><button>Jan</button></li>
                                                                        <li data-month="1"><button>Feb</button></li>
                                                                        <li data-month="2"><button>Mar</button></li>
                                                                        <li data-month="3"><button>Apr</button></li>
                                                                        <li data-month="4"><button>May</button></li>
                                                                        <li data-month="5"><button>Jun</button></li>
                                                                        <li data-month="6"><button>Jul</button></li>
                                                                        <li data-month="7"><button>Aug</button></li>
                                                                        <li data-month="8"><button>Sep</button></li>
                                                                        <li data-month="9"><button>Oct</button></li>
                                                                        <li data-month="10"><button>Nov</button></li>
                                                                        <li data-month="11"><button>Dec</button></li>
                                                                    </ul>
                                                                </div>
                                                                <div className="datepicker-wheels-year">
                                                                    <h2 className="header">Year</h2>
                                                                    <ul></ul>
                                                                </div>
                                                                <div className="datepicker-wheels-footer clearfix">
                                                                    <button type="button" className="btn datepicker-wheels-back"><span className="glyphicon glyphicon-arrow-left"></span><span className="sr-only">Return to Calendar</span></button>
                                                                    <button type="button" className="btn datepicker-wheels-select">Select <span className="sr-only">Month and Year</span></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div className="modal-footer">
                            <button type="button" className="btn btn-white" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.onScheduleCreate}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>





        )
    }
});

export default Schedule;