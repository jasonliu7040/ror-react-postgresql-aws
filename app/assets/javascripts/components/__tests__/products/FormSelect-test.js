jest.unmock('../../components/common/form_select');
jest.unmock('../../components/common/select_option');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FormSelect from '../../components/common/form_select.js.jsx';
import SelectOption from '../../components/common/select_option.js.jsx';

describe('FormSelect', function() {


    beforeEach(function() {
        this.changeFunction = jasmine.createSpy('onchange');
        this.formSelect = TestUtils.renderIntoDocument(
            <FormSelect
                name='foo'
                value='1'
                options={[['Minutes', '0'], ['Hours', '1'] ]}
                onChange={this.changeFunction}
            />
        );
    });

    describe('callbacks', function() {

        it('is called with correct param when status changes', function() {
            expect(this.changeFunction).not.toHaveBeenCalled();

            this.formSelect.refs.select.value = '1';
            TestUtils.Simulate.change(this.formSelect.refs.select);

            expect(this.changeFunction).toHaveBeenCalledWith('1');
        });

    });

    describe('rendering', function() {

        it('renders correct input', function () {
            expect(this.formSelect.refs.select).toBeDefined();
        });

        it('renders select with two options', function() {
            const opts = this.formSelect.refs.select.children;

            expect(opts.length).toEqual(2);

            expect(opts[0].value).toEqual('0');
            expect(opts[0].text).toEqual('Minutes');

            expect(opts[1].value).toEqual('1');
            expect(opts[1].text).toEqual('Hours');
        });

        it('renders select with one blank option and two normall', function() {
            const formSelect = TestUtils.renderIntoDocument(
                <FormSelect
                    name='foo'
                    value='1'
                    options={[['Minutes', '0'], ['Hours', '1'] ]}
                    onChange={this.changeFunction}
                    includeBlank={true}
                />
            );

            const opts = formSelect.refs.select.children;

            expect(opts.length).toEqual(3);

            expect(opts[0].value).toEqual('');
            expect(opts[0].text).toEqual('');

            expect(opts[1].value).toEqual('0');
            expect(opts[1].text).toEqual('Minutes');

            expect(opts[2].value).toEqual('1');
            expect(opts[2].text).toEqual('Hours');
        });


    });

})