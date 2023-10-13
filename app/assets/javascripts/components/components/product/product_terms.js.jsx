import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Term from './term.js.jsx';
let DateTimeField = require('react-bootstrap-datetimepicker-noicon');

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);


const ProductTerms = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired,
        onTermAdd: React.PropTypes.func.isRequired,
        onTermChange: React.PropTypes.func.isRequired,
        termEvents: React.PropTypes.array.isRequired,
        onErrorShow: React.PropTypes.func.isRequired
    },
    events: [],
    componentDidMount: function() {
        let self = this;
        this.props.termEvents.forEach(function(term,index) {
            self.events = self.events.concat(term.events);
        });
    },
    componentWillUnmount: function() {
      this.events = [];
    },
    _validateTerm: function(item) {
        let errors = [];
        if (!item.name) {
            errors.push("Name can't be blank.");
        }
        if(!item.finish_date) {
            errors.push("Finish date can't be blank.");
        }
        if(!item.start_date) {
            errors.push("Start date can't be blank.");
        }
        if(!!item.start_date && !!item.finish_date && moment(item.start_date) > moment(item.finish_date)) {
            errors.push("Start date should be smaller than Finish date.");
        }
        return errors;
    },
    onTermChange: function(i, item) {
        this.props.onTermChange(i, item);
    },
    onTermAdd: function() {
        var item = {
            start_date: this.refs.start_date.getValue(),
            finish_date: this.refs.finish_date.getValue(),
            name: this.refs.name.value
        };

        var errors = this._validateTerm(item);
        if(errors.length == 0) {
            this.props.onTermAdd(item);
        } else {
            this.props.onErrorShow(errors);
        }
    },
    stringifyDate: function(dateObject) {
        return moment(dateObject).format("YYYY-MM-DD HH:mm");
    },
    nonDeletedItems: function() {
        return this.props.items.filter(function(item){
            return item._destroy !== true;
        });
    },
    render: function() {
        let self = this;
        return (
            <div className="row">
                <div className="col-xs-12">
                    <table id="variants" className="table table-striped">
                        <thead><tr>
                            <th>Name</th>
                            <th>Start</th>
                            <th>Finish</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type='text'
                                        className='form-control required'
                                        name='name'
                                        defaultValue='term'
                                        ref='name'
                                        required="true"/>
                                </td>
                                <td>
                                    <DateTimeField
                                        format="YYYY-MM-DD HH:mm"
                                        dateTime={this.stringifyDate(moment())}
                                        inputFormat="YYYY-MM-DD HH:mm"
                                        direction="onTop"
                                        ref='start_date'
                                        required={true} />
                                </td>
                                <td>
                                    <DateTimeField
                                        format="YYYY-MM-DD HH:mm"
                                        dateTime={this.stringifyDate(moment())}
                                        inputFormat="YYYY-MM-DD HH:mm"
                                        direction="onTop"
                                        ref='finish_date'
                                        required={true} />
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={this.onTermAdd}
                                        ref='addButton'
                                        className="btn btn-xs btn-info pull-right ">
                                        Add Term
                                    </button>
                                </td>
                            </tr>
                        { this.nonDeletedItems().map(function(item, i){
                            return <Term onChange={self.onTermChange.bind(null, i)}
                                stringifyDate={self.stringifyDate}
                                key={'term'+i}
                                item={item}
                            />;
                        })}
                        </tbody>
                    </table>
                </div>

                <div className="col-xs-12">
                    <BigCalendar
                        style={{height: "500px"}}
                        views={['month']}
                        events={this.events}
                    />
                </div>
            </div>
        );
    }
});

export default ProductTerms;