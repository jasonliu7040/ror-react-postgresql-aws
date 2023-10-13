class EmbedsController < ApplicationController
  before_filter :current_account, :map_products
  skip_before_filter :verify_authenticity_token

  def new
    booking_form = BookingForm.new(:shop => @account)
    render_template(booking_form)
  end

  def create
    booking_form = BookingForm.new(params)
    if booking_form.save(@account)
      booking_form.posted_successfully = true
    else
      Rails.logger.info "*** booking errors: #{booking_form.errors.size} ***"
      booking_form.errors.each do |e|
        Rails.logger.info "*** booking error: #{e} #{booking_form.errors[e]} ***"
      end
    end
    render_template(booking_form)
  end

  def render_template(booking_form)
    assigns = {'action' => embed_url, 'bta_home' => root_url.chop, 'products' => @products_json, 'form' => booking_form}

    template = @account.template("new_booking")

    html = "#{ template.render(assigns) }"

    if Rails.env.development? # simulate being in a .myshopify page
      script = <<-EOS
<script>
  var Shopify = {
    theme:{"name":"Noddy","id":7984444}
  };
</script>
      EOS

      html = html.gsub(/<\/body>/, "#{ script }</body>")
    end

    response.headers.delete 'X-Frame-Options' # http://jerodsanto.net/2013/12/rails-4-let-specific-actions-be-embedded-as-iframes/
    render :text => html, :status => 200, :content_type => 'text/html'
  end

  def map_products
    products = @account.products.as_json(
        :only => [:id, :product_title, :profile, :product_handle, :external_id], :methods => [:metafield_config],
        :include => {:variants => {
            :only => [:id, :title, :external_id], :methods => [:metafield_config]
        }
      }
    )

    @products_json = products.map { |json|
      {:id => json['id'],
       :handle => json['product_handle'],
       :title => json['product_title'],
       :external_id => json['external_id'],
       :profile => json['profile'],
       :config => json['metafield_config'],
       :variants => json['variants'].map { |json|
         {:id => json['id'], :title => json['title'], :external_id => json['external_id'], :config => "#{json['external_id']}:#{json['metafield_config']}"}
       }}
    }.to_json
  end
end
