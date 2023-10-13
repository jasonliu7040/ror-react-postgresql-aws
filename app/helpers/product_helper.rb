module ProductHelper
  def pretty_schedule(schedule)
    begin
      schedule.to_s
    rescue Exception => e
      logger.error "Error pretty printing schedule: #{e.message}"
      ""
    end
  end

  def datetime(time)
    time.strftime("%Y-%m-%d %H:%M") if time
  end
  def add_colors_and_types
    @colors = get_colors
    @types = product_profiles_for_select
    @resources = @account.resources.count if only_admin
    @configuration_options = configuration_options
    @option_options = load_options
  end
  def get_colors
    [
        ['black',       '#000000'],
        ['white',       '#FFFFFF'],
        ['green',       '#7bd148'],
        ['bold_blue',   '#5484ed'],
        ['blue',        '#a4bdfc'],
        ['turquoise',   '#46d6db'],
        ['light_green', '#7ae7bf'],
        ['bold_green',  '#51b749'],
        ['yellow',      '#fbd75b'],
        ['orange',      '#ffb878'],
        ['red',         '#ff887c'],
        ['bold_red',    '#dc2127'],
        ['purple',      '#dbadff'],
        ['gray',        '#e1e1e1']
    ]
  end

  def get_types(is_edit)
    types = Product::PROFILES
    types = types + [['General', '']] if is_edit.present?
    types
  end

  def product_profiles_for_select
    is_edit = request.fullpath =~ /edit/
    types = ProductProfiles.labels
    if !$flipper[:courses].enabled?(current_account)
      types.delete_if { |val, key| key ==  ProductProfiles::COURSE}
    end
    types = types + [['General', '']] if is_edit.present?
    types
  end

  def configuration_options
    [@product.capacity_option1, @product.capacity_option2, @product.capacity_option3]
  end

  def load_options
    @shopify_product_variants.inject({:options1 => [], :options2 => [], :options3 => []}) do |result, variant|
      result[:options1] << variant.option1 unless result[:options1].include?(variant.option1)
      result[:options2] << variant.option2 unless result[:options2].include?(variant.option2)
      result[:options3] << variant.option3 unless result[:options3].include?(variant.option3)
      result
    end
  end

  def shopify_inventory_management
    @shopify_product_variants.any? {|v| v.inventory_management == 'shopify'}
  end

  def locations_for_select
    current_account.locations.order(:name).collect {|r| [r.name, r.id]}
  end

  def resources_for_select
    current_account.resources.order(:name).collect {|r| [r.name, r.id]}
  end

  def duration_units_for_select
    [['Minutes', '0'], ['Hours', '1'], ['Days', '2'], ['Weeks', '3']]
  end

  def range_count_basis_for_select
    [['Nights', '0'], ['Days', '1']]
  end

  def capacities_for_select
    [['Product', '0'], ['Variant Options', '1']]
  end

  def variant_option_names_for_select
    return [] if @variant_options.blank?
    @variant_options.map do |option|
      option.name
    end
  end

end
