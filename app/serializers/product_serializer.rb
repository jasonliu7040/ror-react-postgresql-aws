class ProductSerializer < ActiveModel::Serializer
  attributes :id, :max_duration, :min_duration, :background_color,
             :capacity,
             :product_handle,
             :location_id,
             :lag_time,
             :calendar_display,
             :capacity_type,
             :lead_time,
             :profile,
             :border_color,
             :text_color,
             :product_image_url,
             :product_title,
             :product_id,
             :scheduled,
             :mindate,
             :external_id,
             :resource_constraints_attributes,
             :product_locations_attributes,
             :option_capacities_attributes,
             :variants_attributes,
             :capacity_option1,
             :capacity_option2,
             :capacity_option3,
             :schedule_attributes,
             :shopify_url,
             :terms_attributes,
             :range_count_basis

  def resource_constraints_attributes
    object.resource_constraints.map{ |r| { id: r.id,
                                           resource_id: r.resource_id,
                                           _destroy: false }
    }
  end

  def product_locations_attributes
    object.product_locations.map{ |r| { id: r.id,
                                        location_id: r.location_id,
                                        _destroy: false }
    }
  end

  def variants_attributes
    object.variants.map{ |r| { id: r.id,
                               all_day: r.all_day, duration: r.duration,
                               duration_units: r.duration_units,
                               finish_time: r.finish_time.strftime("%Y-%m-%d %H:%M"),
                               ignore: r.ignore,
                               title: r.title,
                               party_size: r.party_size,
                               start_time: r.start_time.strftime("%Y-%m-%d %H:%M") }
    }
    end

  def option_capacities_attributes
    object.option_capacities.map{ |r| { capacity: r.capacity,
                                        option1: r.option1,
                                        option2: r.option2,
                                        option3: r.option3 }
    }
  end

  def schedule_attributes
    ScheduleSerializer.new(object.schedule, root: false)
  end

  def terms_attributes
    object.terms.map{|r| { id: r.id,
                           start_date: r.start_date.strftime("%Y-%m-%d %H:%M"),
                           finish_date: r.finish_date.strftime("%Y-%m-%d %H:%M"),
                           product_id: r.product_id,
                           name: r.name }
    }
  end
end
