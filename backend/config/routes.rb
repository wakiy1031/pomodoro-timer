Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :timer_sessions, only: [ :show, :create ]
    end
  end
end
