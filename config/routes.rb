class Subdomain
  def self.matches?(request)
    request.subdomain.present? && request.subdomain != 'www'
  end
end

Bookthatapp::Application.routes.draw do
  root :to => 'home#index'

  mount StripeEvent::Engine => '/stripe' # gem 'stripe-event'

  devise_for :users, controllers: {
        sessions: 'users/sessions', registrations: "users/registrations"
      }
  resources :users

  get "locations/index"

  get 'status' => "home#status"
  get 'change_ui' => 'home#change_ui'

  controller :sessions do
    get 'login' => :new
    post 'login' => :create
    get 'auth/shopify/callback' => :show
    delete 'logout' => :destroy
  end

  scope '/hooks' do
    post 'shop/update'         => 'hooks#shop_update'
    post 'app/uninstalled'     => 'hooks#uninstall'
    post 'orders/create'       => 'hooks#order'
    post 'orders/paid'         => 'hooks#paid'
    post 'orders/cancelled'    => 'hooks#cancelled'
    post 'orders/update'       => 'hooks#orders_update'
    post 'products/update'     => 'hooks#update'
    post 'products/delete'     => 'hooks#delete'
    post 'mail'                => 'hooks#mail'
  end

  scope '/apps' do
    get 'bookthatapp(/:action(/:id))', :controller => 'proxy'
  end

  resources :calendar, only: [:index]
  get '/navigate(/:action(/:id))', :controller => 'navigate'

  constraints(Subdomain) do
    resources :events, only: [:index]

    resources :bookings do
      member do
        put 'reminder'
        put 'sms'
      end
      collection do
        post 'send_reminders', as: :send_reminders
      end
    end

    resources :resource_groups, :users, :product_imports, :blackouts, :locations, :accounts

    resources :shops do
      member do
        get 'locations'
      end
    end

    resources :resources do
      resources :schedules
    end


    resources :bookings do
      member do
        get 'ticket'
        get 'email_activity'
        post 'attendance', :constraints => {:format => /(json)/}
      end
    end

    resources :products do
      resources :reservations
      resources :waitlists
      resources :variants do
        post 'reset', :on => :collection
      end

      collection do
        get 'autocomplete'
      end
      resources :terms, except: [:index]
    end

    resource :availabilities, only: [:index], defaults: { format: 'json' } do
      collection do
        get 'capacity'
        get 'preview'
        get 'schedule'
      end
    end

    resources :templates do
      collection do
        get 'new_reminder'
      end
      member do
        get 'site'
        get 'email'
      end
    end

    resource :feedback, only: [:new, :create]
    resource :embed, only: [:new, :create]

    resources :charges do
      collection do
        patch 'approve_install'
        get 'confirm'
        get 'install'
        patch 'subscribe'
        patch 'cancel'
        get 'installation'
      end
    end

    post 'charges/cancelled(/:id)' => 'charges#cancelled', :as => :cancel_installation
    post 'charges/cancel_pending(/:id)' => 'charges#cancel_pending', :as => :cancel_pending_charge

    get '/shop/install' => 'shops#install'

    scope :reports do
      get 'runsheet' => 'reports#runsheet', :as => :runsheet
      get 'enrollments' => 'reports#enrollments', :as => :enrollments
      get 'gantt' => 'reports#gantt'
    end


    resource :javascripts, only: [:index] do
      member do
        get 'bta'
        get 'wizard'
      end
    end

    get 'settings' => 'settings#index'
    resource :settings, only: [:index] do
      member do
        get 'hours'
        post 'update'
        post 'update_hours'
      end
      # resource :hours
    end

    scope :doco do
      get 'install' => 'doco#install'
      get 'product' => 'doco#product'
      get 'cart' => 'doco#cart'
      get 'email' => 'doco#email'
      get 'compatibility' => 'doco#compatibility'
      get 'css' => 'doco#css'
      get 'themes' => 'doco#themes'
    end

    get '/tests/:action', :controller => 'tests'
    resources :reports

    scope '/admin', :as => :admin do
      get 'dashboard', to: 'events#index'
      get 'charges'              => 'charges#index'
      get 'charges/confirm'      => 'charges#confirm'
      get 'charges/install'      => 'charges#install'
      get 'charges/installation' => 'charges#installation'
      post 'charges/cancelled(/:id)'      => 'charges#cancelled', :as => :cancel_installation
      post 'charges/cancel_pending(/:id)' => 'charges#cancel_pending', :as => :cancel_pending_charge

      get 'events/resources' => 'events#resources'

      resources 'events', 'blackouts', 'locations'
      get 'reports/runsheet'      => 'reports#runsheet', :as => :runsheet
      get 'reports/enrollments'   => 'reports#enrollments', :as => :enrollments

      resources :reports

      resources :products do
        resources :reservations
        resources :waitlists
        resources :variants do
          post 'reset', :on => :collection
        end

        collection do
          get 'autocomplete'
        end
        resources :terms, except: [:index]
      end


      resources :product_imports
      resources :resources do
        resources :schedules
      end

      resources :templates do
        get 'new_reminder', :on => :collection
      end

      resources 'doco', only: [:index] do
        collection do
          get 'install'
          get 'cart'
          get 'picker'
          get 'product'
          get 'availability'
          get 'css'
          get 'widgets'
          get 'themes'
          post 'snippet'
          get 'email'
          get 'compatibility'
        end
      end

      resources :settings, only: [:index, :update] do
        post 'update_settings'
        collection do
          post 'update_hours'
          get 'hooks'
          get 'scripts'
          get 'hours'
        end
      end

      resources :bookings do
        member do
          put 'reminder'
          put 'sms'
        end
        collection do
          post 'send_reminders', as: :admin_send_reminders
        end
      end

    end


    match '/:controller(/:action(/:id))', via: [:get, :post, :patch]
  end

  namespace :api do
    namespace :v1 do
      get 'availability' => 'availability#index'
      resources :bookings, only: [:index, :show]
    end
  end

  get 'status' => 'home#status'
  get '/404' => 'errors#error_404'
  get '/422' => 'errors#error_422'
  get '/429' => 'errors#error_429'
  get '/500' => 'errors#error_500'

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  get '/:controller(/:action(/:id))'

  # otherwise show not found
  get ':url' => 'application#not_found', :constraints => { :url => /.*/ }
end
