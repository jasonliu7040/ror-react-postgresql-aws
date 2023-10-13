class DocoController < ApplicationController
  include SpecificRendering

  def index
    render :action => :cart
  end

  def install
  end

  def cart
  end

  def picker
  end

  def product
  end

  def availability
  end

  def css
  end

  def widgets
  end

  def themes

  end

  def snippet
    if (params.has_key?(:source) && params.has_key?(:snippet))
      @account.external do
        snippet = ShopifyAPI::Asset.new(:key => "snippets/#{params['snippet']}.liquid")
        snippet.value = File.read("#{Rails.root}/db/snippets/#{params['source']}.liquid")
        snippet.save
      end
      render :nothing => true, :status => 200
    else
      render :text => "Required parameters missing: 'source', 'snippet'", :status => 403
    end
  end



end
