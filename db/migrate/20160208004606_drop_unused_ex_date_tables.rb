class DropUnusedExDateTables < ActiveRecord::Migration
  def change
    drop_table :ex_dates if ActiveRecord::Base.connection.table_exists? 'ex_dates'
    drop_table :vevents if ActiveRecord::Base.connection.table_exists? 'vevents'
    drop_table :r_rules if ActiveRecord::Base.connection.table_exists? 'r_rules'
  end
end
