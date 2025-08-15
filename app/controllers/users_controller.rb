class UsersController < ApplicationController
  #before_action :authenticate_user! # Ensures a user is logged in

#  allow_unauthenticated_access only: :home


  def index
    @users = User.where.not(id: Current.user) # Show all users except the current one
  end

  def show
    @user = User.find(params[:id])
  end
end
