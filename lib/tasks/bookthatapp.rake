include ActionView::Helpers::DateHelper

def humanize(secs)
  [[60, :seconds], [60, :minutes], [24, :hours], [1000, :days]].map{ |count, name|
    if secs > 0
      secs, n = secs.divmod(count)
      "#{n.to_i} #{name}"
    end
  }.compact.reverse.join(' ')
end



namespace :bookthatapp do
  desc 'Email booking reminders'
  task :send_reminders => :environment do
    Delayed::Job.enqueue SendRemindersJob.new(Time.now), :priority => 50
  end

  desc 'Gather business stats'
  task :pulse => :environment do
    return unless Rails.env.production?

    mrr = 0.0
    paying_shops = 0
    errors = {}
    Shop.where('charge_id > 0').each do |s|
      s.external do
        begin
          shop = ShopifyAPI::Shop.current # generates a 404 response if shop doesn't exist anymore
          charge = ShopifyAPI::RecurringApplicationCharge.current
          if charge
            unless charge.test
              mrr += ShopifyAPI::RecurringApplicationCharge.current.price.to_f
              paying_shops += 1
            end
          else
            # no active charge
            s.update_attribute(:charge_id, 0)
          end
        rescue => e
          if (e.respond_to? :response) && (!e.response.code.nil?)
            case e.response.code
              when 403 # not authorized
                puts "#{s.subdomain}: app not authorized"
              # s.uninstall
              when 404 # not found
                puts "#{s.subdomain}: store not found"
              else
                puts "#{s.subdomain}: #{e.message} (#{e.response.code})"
            end

            if errors.has_key?(e.response.code)
              errors[e.response.code] += 1
            else
              errors[e.response.code] = 1
            end
          else
            puts "#{e.message}"
            puts "\n\n#{e.class} (#{e.message}):\n    " + e.backtrace.join("\n    ") + "\n\n"
          end
        end
      end
    end

    top_10_shops = Shop.joins(:booking_items).select('subdomain, count(booking_items.id) as count').group('booking_items.shop_id').where('booking_items.created_at > ?', 7.days.ago).order('count desc').limit(10)

    Notifier.pulse_email(
        {:mrr => mrr.round(2),
         :paying_shops => paying_shops,
         :last_week_signups => Shop.where('created_at >= ?', 7.days.ago).count,
         :last_week_signups_paying => Shop.where('charge_id > 0 AND created_at >= ?', 7.days.ago).count,
         :last_week_active => Shop.joins(:booking_items).select('distinct subdomain').where('booking_items.created_at > ?', 7.days.ago).count,
         :top_10_shops => top_10_shops,
        }).deliver

    # puts "Errors: #{errors.inspect}"
  end

  desc 'Reinstall'
  task :reinstall => :environment do
    BookThatApp.reinstall
  end

  desc 'Migrate booking to booking + booking items'
  task :migrate_booking_items => :environment do
    batch = 1
    start_record = 246518
    query = Booking.includes(:booking_items).where('(status != 5)').where(:booking_items => {:booking_id => nil})
    query.find_in_batches(batch_size: 500, start: start_record) do |group|
      puts "*******"
      puts "==> batch #{batch}"
      puts "*******"
      ActiveRecord::Base.transaction do
        group.each do |booking|
          unless booking.variant.nil?
            item = booking.convert_booking_item
            puts "#{item.inspect}"
          end
        end
      end
      batch += 1
    end
  end

  desc 'Change MySql encoding'
  task :change_to_utf => :environment do
    tables = ActiveRecord::Base.connection.tables
    collation = "utf8_unicode_ci"
    char_set = "utf8"
    db = "bookthatapp_production"

    shop = Shop.first

#     puts "USE #{db};"
    shop.connection.execute("ALTER DATABASE #{db} CHARACTER SET #{char_set} COLLATE #{collation};")

    tables.each do |t|
      shop.connection.execute("ALTER TABLE #{t} CHARACTER SET #{char_set} COLLATE #{collation};") # changes for new records
      shop.connection.execute("ALTER TABLE #{t} CONVERT TO CHARACTER SET #{char_set} COLLATE #{collation};") # migrates old records
    end
  end

  desc 'Fix migration lag'
  task :fix_migration_lag => :environment do
#    shops = Product.where('lag_time > 0').pluck(:shop_id).uniq

    shop = Shop.find_by_subdomain 'the-borrowed-collection'
    shops = [shop.id]
    shops.each do |shop|
      bookings = Booking.where(:shop_id => shop).where('order_id is not null and created_at < ?', Date.new(2015,4,4)).where('finish > ?', DateTime.now)
      bookings.limit(5).each do |booking|
        items = booking.booking_items
        items.each do |item|
          product = item.product
          variant = item.variant
          if product.lag_time > 0
            sorder = booking.external_order
            line_item = sorder.line_items.select{|li| li.product_id == item.external_product_id && li.variant_id == item.external_variant_id}.first
            if line_item
              start_prop = line_item.properties.select{|p| p.name == 'booking-start'}.first
              finish_prop = line_item.properties.select{|p| p.name == 'booking-finish'}.first
              lag = product.lag_time
              duration = variant.duration_minutes
              expected_finish = item.start.advance(:minutes => duration + lag)
              delta = distance_of_time_in_words(item.finish, expected_finish)

              if start_prop
                puts "========================"
                puts "[order #{sorder.id} - #{sorder.name}] start: #{start_prop.value}"
                puts "[booking item #{item.id}] start: #{item.start} finish: #{item.finish}"
                puts "[product #{product.id}] lag: #{humanize(lag * 60)} [variant #{variant.id}] duration: #{humanize(duration * 60)}"
                puts "expected finish => #{expected_finish} <= delta: #{delta}"
                puts "========================"
              end
            end
          end
        end
      end
    end
  end
end
