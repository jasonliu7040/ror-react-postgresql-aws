jest.unmock('../../components/hours/nav_tabs');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import NavTabs from '../../components/hours/nav_tabs.js.jsx';

describe('NavTabsComponent', function() {
  beforeEach(function() {
    this.seasons = [
      {
        name: 'Test Season 1',
        id: 'test-season-1',
        start: '2016-01-01',
        finish: '2016-12-31',
        days: []
      },
      {
        name: 'Test Season 2',
        id: 'test-season-2',
        start: '2016-08-03',
        finish: '2016-09-12',
        days: []
      },
      {
        name: 'Test Season 3',
        id: 'test-season-3',
        start: '2016-02-02',
        finish: '2016-03-17',
        days: []
      }
    ]

    this.navTabs = TestUtils.renderIntoDocument(
      <NavTabs
        seasons={this.seasons}
        nextSeasonNumber={1}
        activeSeasonIdx={0}
        stringifyDate={function() {}}
        onAddSeason={function() {}}
        onSetActiveSeasonIdx={function() {}}
        onDeleteActiveSeason={function() {}} />
    );
  });

  describe('tabs rendering', function() {
    it('renders a tab for each given season', function() {
      let tabs;

      tabs = TestUtils.scryRenderedDOMComponentsWithClass(this.navTabs, 'season-tab');
      expect(tabs.length).toEqual(3)

      let oneSeason = this.seasons.splice(0, 1);

      let navTabs = TestUtils.renderIntoDocument(
        <NavTabs
        seasons={oneSeason}
        nextSeasonNumber={1}
        activeSeasonIdx={0}
        stringifyDate={function() {}}
        onAddSeason={function() {}}
        onSetActiveSeasonIdx={function() {}}
        onDeleteActiveSeason={function() {}} />
      );

      tabs = TestUtils.scryRenderedDOMComponentsWithClass(navTabs, 'season-tab');
      expect(tabs.length).toEqual(1)
    });

    it ('renders season tabs in given order', function() {
      let tabs = TestUtils.scryRenderedDOMComponentsWithClass(this.navTabs, 'season-tab-link');
      for(let i = 0; i < this.seasons.length; i++) {
        expect(this.seasons[i].name).toEqual(tabs[i].textContent);
      }
    });
  });

  describe('callbacks', function() {

    it('stringifyDate is caled when btn-add is clicked', function() {
      const stringifyDate = jasmine.createSpy('stringifyDate')

      const navTabs = TestUtils.renderIntoDocument(
        <NavTabs
        seasons={this.seasons}
        nextSeasonNumber={1}
        activeSeasonIdx={0}
        stringifyDate={stringifyDate}
        onAddSeason={function() {}}
        onSetActiveSeasonIdx={function() {}}
        onDeleteActiveSeason={function() {}} />
      );

      const addSeasonButton = TestUtils.findRenderedDOMComponentWithClass(navTabs, 'btn-add');

      TestUtils.Simulate.click(addSeasonButton);

      expect(stringifyDate).toHaveBeenCalled();
    });

    it('onAddSeason is called with empty new season when btn-add is clicked', function() {

      const onAddSeason   = jasmine.createSpy('onAddCreateSeason');
      const stringifyDate = jasmine.createSpy('stringifyDate').and.returnValue('stringifiedDate');

      const navTabs = TestUtils.renderIntoDocument(
        <NavTabs
        seasons={this.seasons}
        nextSeasonNumber={6}
        activeSeasonIdx={0}
        stringifyDate={stringifyDate}
        onAddSeason={onAddSeason}
        onSetActiveSeasonIdx={function() {}}
        onDeleteActiveSeason={function() {}} />
      );

      const expectedParamForCallback = {
        name: 'Season 6',
        id: 'season-6',
        start: 'stringifiedDate',
        finish: 'stringifiedDate',
        days: [
          {day: 0, hours: []},
          {day: 1, hours: []},
          {day: 2, hours: []},
          {day: 3, hours: []},
          {day: 4, hours: []},
          {day: 5, hours: []},
          {day: 6, hours: []},
        ]
      }

      const addSeasonButton = TestUtils.findRenderedDOMComponentWithClass(navTabs, 'btn-add');

      TestUtils.Simulate.click(addSeasonButton);

      expect(onAddSeason).toHaveBeenCalledWith(expectedParamForCallback);
    });

    it('onSetActiveSeasonIdx is called with correct season index when tab clicked', function() {
      const onSetActiveSeasonIdx = jasmine.createSpy('onSetActiveSeasonIdx');
      const seasonToClickIdx = 1;

      const navTabs = TestUtils.renderIntoDocument(
        <NavTabs
        seasons={this.seasons}
        nextSeasonNumber={1}
        activeSeasonIdx={0}
        stringifyDate={function() {}}
        onAddSeason={function() {}}
        onSetActiveSeasonIdx={onSetActiveSeasonIdx}
        onDeleteActiveSeason={function() {}} />
      );

      const seasonTwoTabLink = TestUtils.scryRenderedDOMComponentsWithClass(
        navTabs, 'season-tab-link')[seasonToClickIdx];

      TestUtils.Simulate.click(seasonTwoTabLink);

      expect(onSetActiveSeasonIdx).toHaveBeenCalledWith(seasonToClickIdx);
    });

    it('onDeleteActiveSeason when btn-remove-tab is clicked', function() {
      const onDeleteActiveSeason = jasmine.createSpy('onDeleteActiveSeason');

      const navTabs = TestUtils.renderIntoDocument(
        <NavTabs
        seasons={this.seasons}
        nextSeasonNumber={1}
        activeSeasonIdx={0}
        stringifyDate={function() {}}
        onAddSeason={function() {}}
        onSetActiveSeasonIdx={function() {}}
        onDeleteActiveSeason={onDeleteActiveSeason} />
      );

      const removeBtn = TestUtils.findRenderedDOMComponentWithClass(navTabs, 'btn-remove-tab');

      TestUtils.Simulate.click(removeBtn);

      expect(onDeleteActiveSeason).toHaveBeenCalled();
    });
  });

  describe('methods', function() {

    it('isTabActive returns true when given idx is of active tab', function() {
      expect(this.navTabs.isTabActive(0)).toBe(true);
      expect(this.navTabs.isTabActive(2)).toBe(false);

      let navTabs = TestUtils.renderIntoDocument(
        <NavTabs
          seasons={this.seasons}
          nextSeasonNumber={1}
          activeSeasonIdx={2}
          stringifyDate={function() {}}
          onAddSeason={function() {}}
          onSetActiveSeasonIdx={function() {}}
          onDeleteActiveSeason={function() {}} />
      );

      expect(navTabs.isTabActive(0)).toBe(false);
      expect(navTabs.isTabActive(2)).toBe(true);
    });

    describe('_getSeasonIdxFromEvent', function() {

      it('is called when tab is clicked', function() {
        spyOn(this.navTabs, '_getSeasonIdxFromEvent');

        let seasonThreeTabLink = TestUtils.scryRenderedDOMComponentsWithClass(
          this.navTabs, 'season-tab-link')[2];

        TestUtils.Simulate.click(seasonThreeTabLink);

        expect(this.navTabs._getSeasonIdxFromEvent).toHaveBeenCalled();
      });

      it('returns correct value', function() {
        const e = {
          target: {
            getAttribute: function(dataAttr) {
              if (dataAttr === "data-season-array-idx")
                return 101;
              else
                return null;
            }
          }
        }
        expect(this.navTabs._getSeasonIdxFromEvent(e)).toEqual(101);
      });
    });
  });
});
