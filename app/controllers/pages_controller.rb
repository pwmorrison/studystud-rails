class PagesController < ApplicationController
  allow_unauthenticated_access only: :home

  def home
    redirect_to dashboard_path if authenticated?
  end

  def dashboard
    @users = User.where.not(id: Current.user) # Show all users except the current one
    redirect_to new_session_path unless authenticated?
  end

  def game
    redirect_to new_session_path unless authenticated?
  end

end
