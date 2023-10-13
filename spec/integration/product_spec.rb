describe 'create booking page' do
  before do
    #Capybara.app_host = "http://legros-parker-and-harris6290bookthatapp.dev:3002"
    visit new_booking_url(:subdomain => 'legros-parker-and-harris6290', :host => 'bookthatapp.dev', :port => 3002)
  end

  #before(:each) do
  #  request.host = "legros-parker-and-harris6290bookthatapp.dev:3002"
  #end

  it 'lets the user create a booking' do
    #visit "/bookings/new?start=2013-03-16&finish=2013-03-16"
    save_and_open_page
    fill_in 'booking_name', :with => 'J. Random Hacker'
    click_on 'Save'
    page.should have_content('has been submitted')
  end
end