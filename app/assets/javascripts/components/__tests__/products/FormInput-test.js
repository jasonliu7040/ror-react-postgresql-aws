jest.unmock('../../components/common/form_input');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FormInput from '../../components/common/form_input.js.jsx';

describe('FormInput', function() {

    beforeEach(function() {
        this.changeFunction = jasmine.createSpy('onchange');
        this.formInput = TestUtils.renderIntoDocument(
            <FormInput
                name='foo'
                type='text'
                value='foo'
                onChange={this.changeFunction}
            />
        );
    });

    describe('callbacks', function() {

        it('gets called with correct params when user fills form correctly', function() {
            this.formInput.refs.foo.value = '2';
            TestUtils.Simulate.change( this.formInput.refs.foo);
            expect(this.changeFunction).toHaveBeenCalledWith('2');
        });

    });

    describe('rendering', function() {

        it('renders correct input', function () {
            expect(this.formInput.refs.foo).not.toBeUndefined();
            expect(this.formInput.refs.foo.type).toEqual('text');
            expect(this.formInput.refs.foo.value).toEqual('foo');
        });

    });

})