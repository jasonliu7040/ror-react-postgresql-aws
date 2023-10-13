jest.unmock('../../components/bookings/basic_contact_info');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import BasicContactInfo from '../../components/bookings/basic_contact_info.js.jsx';

describe('BasicContactInfo', function() {
  beforeEach(function() {
    this.basicInfo = TestUtils.renderIntoDocument(
      <BasicContactInfo
        name=''
        email=''
        phone=''
        hotel=''
        onSetName={function() {}}
        onSetEmail={function() {}}
        onSetPhone={function() {}}
        onSetHotel={function() {}} />
    );
  });

  describe('rendering', function() {
    
    it('renders 4 form inputs', function() {
      const inputs = TestUtils.scryRenderedDOMComponentsWithClass(
        this.basicInfo, 'form-control');
      expect(inputs.length).toEqual(4);
    });

    it('renders correct input fields', function() {
      expect(this.basicInfo.refs.bookingContactName).not.toBeUndefined();
      expect(this.basicInfo.refs.bookingContactName.type).toEqual('text');

      expect(this.basicInfo.refs.bookingContactEmail).not.toBeUndefined();
      expect(this.basicInfo.refs.bookingContactEmail.type).toEqual('email');

      expect(this.basicInfo.refs.bookingContactPhone).not.toBeUndefined();
      expect(this.basicInfo.refs.bookingContactPhone.type).toEqual('tel');

      expect(this.basicInfo.refs.bookingContactHotel).not.toBeUndefined();
      expect(this.basicInfo.refs.bookingContactHotel.type).toEqual('text');
    });

    it('renders given name', function() {
      const basicInfo = TestUtils.renderIntoDocument(
        <BasicContactInfo
          name='test name'
          email=''
          phone=''
          hotel=''
          onSetName={function() {}}
          onSetEmail={function() {}}
          onSetPhone={function() {}}
          onSetHotel={function() {}} />
      );

      expect(basicInfo.refs.bookingContactName.value).toEqual('test name');
    });

    it('renders given email', function() {
      const basicInfo = TestUtils.renderIntoDocument(
        <BasicContactInfo
          name=''
          email='test email'
          phone=''
          hotel=''
          onSetName={function() {}}
          onSetEmail={function() {}}
          onSetPhone={function() {}}
          onSetHotel={function() {}} />
      );

      expect(basicInfo.refs.bookingContactEmail.value).toEqual('test email');
    });

    it('renders given phone', function() {
      const basicInfo = TestUtils.renderIntoDocument(
        <BasicContactInfo
          name=''
          email=''
          phone='123-1234'
          hotel=''
          onSetName={function() {}}
          onSetEmail={function() {}}
          onSetPhone={function() {}}
          onSetHotel={function() {}} />
      );

      expect(basicInfo.refs.bookingContactPhone.value).toEqual('123-1234');
    });

    it('renders given hotel', function() {
      const basicInfo = TestUtils.renderIntoDocument(
        <BasicContactInfo
          name=''
          email=''
          phone=''
          hotel='test hotel'
          onSetName={function() {}}
          onSetEmail={function() {}}
          onSetPhone={function() {}}
          onSetHotel={function() {}} />
      );

      expect(basicInfo.refs.bookingContactHotel.value).toEqual('test hotel');
    });
  });

  describe('callbacks', function() {

    describe('onSetName', function() {
      it('is called with proper param when name input changes', function() {
        const onSetName = jasmine.createSpy('onSetName');
        const basicInfo = TestUtils.renderIntoDocument(
          <BasicContactInfo
            name=''
            email=''
            phone=''
            hotel=''
            onSetName={onSetName}
            onSetEmail={function() {}}
            onSetPhone={function() {}}
            onSetHotel={function() {}} />
        );

        expect(onSetName).not.toHaveBeenCalled();

        basicInfo.refs.bookingContactName.value = 'new name';
        TestUtils.Simulate.change(basicInfo.refs.bookingContactName);

        expect(onSetName).toHaveBeenCalledWith('new name');
      });
    });

    describe('onSetEmail', function() {
      it('is called with proper param when email changes', function() {
        const onSetEmail = jasmine.createSpy('onSetEmail');
        const basicInfo = TestUtils.renderIntoDocument(
          <BasicContactInfo
          name=''
          email=''
          phone=''
          hotel=''
          onSetName={function() {}}
          onSetEmail={onSetEmail}
          onSetPhone={function() {}}
          onSetHotel={function() {}} />
        );

        expect(onSetEmail).not.toHaveBeenCalled();

        basicInfo.refs.bookingContactEmail.value = 'new email';
        TestUtils.Simulate.change(basicInfo.refs.bookingContactEmail);

        expect(onSetEmail).toHaveBeenCalledWith('new email');
      });
    });

    describe('onSetPhone', function() {
      it('is called with proper param when phone changes', function() {
        const onSetPhone = jasmine.createSpy('onSetPhone');
        const basicInfo = TestUtils.renderIntoDocument(
          <BasicContactInfo
          name=''
          email=''
          phone=''
          hotel=''
          onSetName={function() {}}
          onSetEmail={function() {}}
          onSetPhone={onSetPhone}
          onSetHotel={function() {}} />
        );

        expect(onSetPhone).not.toHaveBeenCalled();

        basicInfo.refs.bookingContactPhone.value = '123-1234';
        TestUtils.Simulate.change(basicInfo.refs.bookingContactPhone);

        expect(onSetPhone).toHaveBeenCalledWith('123-1234');
      });
    });

    describe('onSetHotel', function() {
      it('is called with proper param when hotel changes', function() {
        const onSetHotel = jasmine.createSpy('onSetHotel');
        const basicInfo = TestUtils.renderIntoDocument(
          <BasicContactInfo
          name=''
          email=''
          phone=''
          hotel=''
          onSetName={function() {}}
          onSetEmail={function() {}}
          onSetPhone={function() {}}
          onSetHotel={onSetHotel} />
        );

        expect(onSetHotel).not.toHaveBeenCalled();

        basicInfo.refs.bookingContactHotel.value = 'new hotel';
        TestUtils.Simulate.change(basicInfo.refs.bookingContactHotel);

        expect(onSetHotel).toHaveBeenCalledWith('new hotel');
      });
    });
  });
});
