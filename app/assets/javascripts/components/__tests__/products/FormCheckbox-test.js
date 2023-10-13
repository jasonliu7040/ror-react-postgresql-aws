jest.unmock('../../components/common/form_checkbox');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FormCheckbox from '../../components/common/form_checkbox.js.jsx';

describe('FormInput', function() {

    beforeEach(function() {
        this.onChange = jasmine.createSpy('onchange');
        this.formInput = TestUtils.renderIntoDocument(
            <FormCheckbox
                name='foo'
                value={true}
                onChange={this.onChange}
            />
        );
    });

    describe('callbacks', function() {

        it('gets called with correct params when user fills form correctly', function() {
            this.formInput.refs.checkbox.checked = false;
            TestUtils.Simulate.change( this.formInput.refs.checkbox);
            expect(this.onChange).toHaveBeenCalledWith(false);

            this.formInput.refs.checkbox.checked = true;
            TestUtils.Simulate.change( this.formInput.refs.checkbox);
            expect(this.onChange).toHaveBeenCalledWith(true);

            this.formInput.refs.checkbox.checked = 'false';
            TestUtils.Simulate.change( this.formInput.refs.checkbox);
            expect(this.onChange).toHaveBeenCalledWith(false);
        });

    });

    describe('rendering', function() {

        it('renders correct input', function () {
            expect(this.formInput.refs.checkbox).toBeDefined();
            expect(this.formInput.refs.checkbox.type).toEqual('checkbox');
            expect(this.formInput.refs.checkbox.checked).toEqual(true);
        });
    });


    describe('getValue', function() {
        it('should return valid values for given string', function () {
            var checkbox = TestUtils.renderIntoDocument(
                <FormCheckbox
                    name='foo'
                    value='1'
                    onChange={function(){}}
                />
            );
            expect(checkbox.getValue()).toEqual(true);

            checkbox = TestUtils.renderIntoDocument(
                <FormCheckbox
                    name='foo'
                    value='0'
                    onChange={function(){}}
                />
            );
            expect(checkbox.getValue()).toEqual(false);
        });

        it('should return valid values for given boolean', function () {
            var checkbox = TestUtils.renderIntoDocument(
                <FormCheckbox
                    name='foo'
                    value={true}
                    onChange={function(){}}
                />
            );
            expect(checkbox.getValue()).toEqual(true);

            checkbox = TestUtils.renderIntoDocument(
                <FormCheckbox
                    name='foo'
                    value={false}
                    onChange={function(){}}
                />
            );
            expect(checkbox.getValue()).toEqual(false);
        });

        it('should return valid values for given number', function () {
            var checkbox = TestUtils.renderIntoDocument(
                <FormCheckbox
                    name='foo'
                    value={1}
                    onChange={function(){}}
                />
            );
            expect(checkbox.getValue()).toEqual(true);

            checkbox = TestUtils.renderIntoDocument(
                <FormCheckbox
                    name='foo'
                    value={0}
                    onChange={function(){}}
                />
            );
            expect(checkbox.getValue()).toEqual(false);
        });
    })

})