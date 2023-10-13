class AddOptionsToVariants < ActiveRecord::Migration

  def self.up
    # # Uncomment this section below if DB setup fails again
    # change_table "variants" do |t|
    #   t.remove :option1
    #   t.remove :option2
    #   t.remove :option3
    # end


    change_table "variants" do |t|
      t.datetime :deleted_at
      t.string :option1
      t.string :option2
      t.string :option3
    end

    Variant.all.each do |variant|
      unless variant.options_yaml.nil?
        yaml = YAML::load(variant.options_yaml)
        variant.option1 = yaml.option1
        variant.option2 = yaml.option2
        variant.option3 = yaml.option3
        variant.save!
      end
    end
  end

  def self.down
    change_table "variants" do |t|
      t.remove :option1
      t.remove :option2
      t.remove :option3
    end
  end
end
