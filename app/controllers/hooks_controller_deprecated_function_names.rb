module DeprecatedHookNames
  def uninstall
    app_uninstalled
  end

  def order
    orders_create
  end

  def paid
    orders_paid
  end

  def cancelled
    orders_cancelled
  end

  def update
    products_update
  end

  def delete
    products_delete
  end
end