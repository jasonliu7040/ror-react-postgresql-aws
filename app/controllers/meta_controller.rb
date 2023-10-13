class MetaController < ApplicationController


  # http://legros-parker-and-harris6290.bookthatapp.dev:3005/meta/order?id=55662382
  def order
    @account.external do
      @order = ShopifyAPI::Order.find(params[:id].to_i)
      @attributes = @order.note_attributes.sort_by {|a| [ a.name ]} unless @order.blank?
    end
    render :layout => false
  end

  def update
    id = params[:id].split(':')
    value = params[:value]

    @account.external do
      o = ShopifyAPI::Order.find(id[0])
      o.note_attributes.each do |attribute|
        if attribute.name == id[1]
          attribute.value = value
        end
      end
      o.save
    end

    render :text => value
  end
end
