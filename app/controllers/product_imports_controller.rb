class ProductImportsController < ApplicationController
  before_filter :setup_references

  include SpecificRendering

  def new
    @import = ProductImport.new
  end

  def create
    params = product_import_params
    import = ProductImport.new(params)
    import.shop = current_account
    import.attachment = params[:file]

    respond_to do |format|
      if import.valid? && import.save
        import.start
        format.html { redirect_to(product_imports_path) }
      else
        @import = ProductImport.new
        flash.now[:notice] = import.errors.get(:attachment_content_type).first
        format.html { render action: 'new' }
      end
    end
  end

  def index
    @imports = current_account.product_imports.order("id DESC")
  end

  def destroy
    flash[:notice] = 'Product import deleted.'
    ProductImport.find_by_id(params[:id]).destroy
    redirect_to action: :index
  end

  def setup_references
    @types = ProductProfiles.labels
  end

  def product_import_params
    params.require(:product_import).permit(
        :file,
        :profile,
        :mindate,
        :lead_time,
        :lag_time,
        :range_basis,
        :range_min,
        :range_max,
        :capacity_type,
        :capacity,
        :capacity_options => []
    )
  end
end
