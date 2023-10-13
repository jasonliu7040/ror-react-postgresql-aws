class CreateVevents < ActiveRecord::Migration
  def change
    create_table :vevents do |t|
      t.string :title

      t.timestamps
    end
  end
end
