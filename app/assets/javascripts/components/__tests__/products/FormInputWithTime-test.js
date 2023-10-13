jest.unmock('../../components/product/form_input_with_time');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FormInputWithTime from '../../components/product/form_input_with_time.js.jsx';

describe('FormInputWithTime', function() {


    beforeEach(function() {
        this.onChange = jasmine.createSpy('onchange');
        this.element = TestUtils.renderIntoDocument(
            <FormInputWithTime
                name='time'
                value={5}
                onChange={this.onChange} />
        );
    });

    describe('callbacks', function() {

        it('is called with correct param when time changes', function() {
            expect(this.onChange).not.toHaveBeenCalled();

            this.element.refs.time.value = '1';
            this.element.refs.units.value = 'minutes';
            TestUtils.Simulate.change(this.element.refs.time);
            expect(this.onChange).toHaveBeenCalledWith(1);

            this.element.refs.time.value = '1';
            this.element.refs.units.value = 'hours';
            TestUtils.Simulate.change(this.element.refs.time);
            expect(this.onChange).toHaveBeenCalledWith(60);

            this.element.refs.time.value = '1';
            this.element.refs.units.value = 'days';
            TestUtils.Simulate.change(this.element.refs.time);
            expect(this.onChange).toHaveBeenCalledWith(1440);

        });

        it('is called with correct param when time units changes', function() {
            expect(this.onChange).not.toHaveBeenCalled();

            this.element.refs.time.value = '1';
            this.element.refs.units.value = 'minutes';
            TestUtils.Simulate.change(this.element.refs.units);
            expect(this.onChange).toHaveBeenCalledWith(1);

            this.element.refs.time.value = '1';
            this.element.refs.units.value = 'hours';
            TestUtils.Simulate.change(this.element.refs.units);
            expect(this.onChange).toHaveBeenCalledWith(60);

            this.element.refs.time.value = '1';
            this.element.refs.units.value = 'days';
            TestUtils.Simulate.change(this.element.refs.units);
            expect(this.onChange).toHaveBeenCalledWith(1440);

        });

    });

    describe('rendering', function() {

        it('renders correct input', function () {
            expect(this.element.refs.time).toBeDefined();
            expect(this.element.refs.units).toBeDefined();
        });

        it('renders correct input when given time < 60', function () {
            const element = TestUtils.renderIntoDocument(
                <FormInputWithTime
                    name='time'
                    value={5}
                    onChange={this.onChange} />
            );
            expect(element.refs.units.value).toEqual('minutes');
            expect(element.refs.time.value).toEqual('5');
        });

        it('renders correct input when given time > 60 and < 1440', function () {
            const element = TestUtils.renderIntoDocument(
                <FormInputWithTime
                    name='time'
                    value={120}
                    onChange={this.onChange} />
            );
            expect(element.refs.units.value).toEqual('hours');
            expect(element.refs.time.value).toEqual('2');
        });

        it('renders correct input when given time > 1440', function () {
            const element = TestUtils.renderIntoDocument(
                <FormInputWithTime
                    name='time'
                    value={2880}
                    onChange={this.onChange} />
            );
            expect(element.refs.units.value).toEqual('days');
            expect(element.refs.time.value).toEqual('2');
        });

        it('renders time units with three options', function() {
            const opts = this.element.refs.units.children;

            expect(opts.length).toEqual(3);

            expect(opts[0].value).toEqual('minutes');
            expect(opts[0].text).toEqual('Minutes');

            expect(opts[1].value).toEqual('hours');
            expect(opts[1].text).toEqual('Hours');

            expect(opts[2].value).toEqual('days');
            expect(opts[2].text).toEqual('Days');
        });


    });

})