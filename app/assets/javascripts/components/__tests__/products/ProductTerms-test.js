jest.unmock('../../components/product/product_terms');
jest.unmock('../../components/product/term');
jest.unmock('uncontrollable');

import 'uncontrollable';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ProductTerms from '../../components/product/product_terms.js.jsx';
import Term from '../../components/product/term.js.jsx';


const moment = require('moment');
import BigCalendar from 'react-big-calendar';
let DateTimeField = require('react-bootstrap-datetimepicker-noicon');

describe('ProductTerms', function() {


    beforeEach(function() {

        this.terms_attributes = [
            {
                id: 1,
                finish_date: "2016-04-30 00:00",
                start_date: "2016-04-13 00:00",
                name: 'term1'
            },
            {
                id: 2,
                finish_date: "2016-06-30 00:00",
                start_date: "2016-05-12 00:00",
                name: 'term2'
            }
        ];
        this.term_events = [
            {
                color: '#000',
                events: [
                    {
                        start: "2016-04-30 00:00",
                        end: "2016-04-31 00:00",
                        title: 'example'
                    }
                ]
            }
        ];

        this.onTermAdd = jasmine.createSpy('onTermAdd');
        this.onTermSet = jasmine.createSpy('onTermSet');
        this.onErrorShow = jasmine.createSpy('onErrorShow');
        this.termsForm = TestUtils.renderIntoDocument( <ProductTerms items={this.terms_attributes}
            onTermAdd={this.onTermAdd}
            onTermChange={this.onTermSet}
            onErrorShow={this.onErrorShow}
            termEvents={this.term_events}
        /> )
    });

    describe('callbacks', function() {

        describe('onTermAdd', function() {

            it('doesnt get called when params are incorrect', function() {

                expect(this.onTermAdd).not.toHaveBeenCalled();
                expect(this.termsForm.props.items.length).toEqual(2);
                this.termsForm.refs.name.value = '';
                TestUtils.Simulate.click(this.termsForm.refs.addButton);
                expect(this.onTermAdd).not.toHaveBeenCalled();
            });

            it('gets called with default params', function() {

                expect(this.onTermAdd).not.toHaveBeenCalled();
                expect(this.termsForm.props.items.length).toEqual(2);

                const startDT  = this.termsForm.refs.start_date.getValue();
                const finishDT = this.termsForm.refs.finish_date.getValue();

                TestUtils.Simulate.click(this.termsForm.refs.addButton);
                expect(this.onTermAdd).toHaveBeenCalledWith({
                    name: 'term',
                    start_date: startDT,
                    finish_date: finishDT
                });
                expect(this.termsForm.props.items.length).toEqual(2);
            });

        });


    });

    describe('rendering', function() {

        it('renders correct inputs and calendar', function () {
            expect(this.termsForm.refs.name).toBeDefined();
            expect(this.termsForm.refs.start_date).toBeDefined();
            expect(this.termsForm.refs.finish_date).toBeDefined();
        });

        it('doesnt render deleted terms', function () {
            var terms_attributes = [
                {
                    id: 1,
                    finish_date: "2016-04-30 00:00",
                    start_date: "2016-04-13 00:00",
                    name: 'term1'
                },
                {
                    id: 2,
                    finish_date: "2016-06-30 00:00",
                    start_date: "2016-05-12 00:00",
                    name: 'term2',
                    _destroy: true
                }
            ];

            var termsForm = TestUtils.renderIntoDocument( <ProductTerms items={terms_attributes}
                onTermAdd={function(){}}
                onTermChange={function(){}}
                onErrorShow={function(){}}
                termEvents={[]}
            /> )

            const items = TestUtils.scryRenderedDOMComponentsWithClass(
                termsForm, 'item-row');
            expect(items.length).toEqual(1);
        });

    });

    describe('methods', function() {

        describe('_validateItem', function () {

            it('does not add errors when item is valid', function () {
                const term = {
                    name: 'foo',
                    start_date: "2016-05-29 16:00:00",
                    finish_date: "2016-05-30 16:00:00"
                };

                var errors = this.termsForm._validateTerm(term);

                expect(errors.length).toEqual(0);
            });

            it('adds errors when name is missing', function() {
                const term = {
                    name: '',
                    start_date: "2016-05-29 16:00:00",
                    finish_date: "2016-05-30 16:00:00"
                };
                var errors = this.termsForm._validateTerm(term);

                expect(errors.length).toEqual(1);
                expect(errors[0]).toEqual("Name can't be blank.");
            });

            it('adds errors when start date is bigger than finish', function() {
                const term = {
                    name: 'foo',
                    start_date: "2016-05-31 16:00:00",
                    finish_date: "2016-05-30 16:00:00"
                };
                var errors = this.termsForm._validateTerm(term);

                expect(errors.length).toEqual(1);
                expect(errors[0]).toEqual("Start date should be smaller than Finish date.");
            });

            it('adds errors when start date and name are empty', function() {
                const term = {
                    name: '',
                    start_date: "",
                    finish_date: "2016-05-30 16:00:00"
                };
                var errors = this.termsForm._validateTerm(term);

                expect(errors.length).toEqual(2);
                expect(errors[0]).toEqual("Name can't be blank.");
                expect(errors[1]).toEqual("Start date can't be blank.");
            })
        })
    });

})