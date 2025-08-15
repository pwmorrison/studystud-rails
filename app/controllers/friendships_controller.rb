class FriendshipsController < ApplicationController
  #before_action :authenticate_user!
#  before_action :authenticate

  def create
    # Creates a new friendship request for the current user.
    @friendship = Current.user.friendships.build(friend_id: params[:friend_id])
    if @friendship.save
      flash[:notice] = "Friend request sent."
      redirect_to users_path
    else
      flash[:alert] = "Unable to send friend request."
      redirect_to users_path
    end
  end

  def update
    @friendship = Friendship.find_by(user_id: params[:id], friend_id: Current.user.id)
    if @friendship.update(status: 'accepted')
      flash[:notice] = "Friend request accepted."
      redirect_to user_path(Current.user)
    else
      flash[:alert] = "Unable to accept friend request."
      redirect_to user_path(Current.user)
    end
  end

  def destroy
    @friendship = Friendship.find_by(id: params[:id])

    # Security check: Make sure the person trying to delete the record
    # is either the sender (user) or the receiver (friend).
    if @friendship.user == Current.user || @friendship.friend == Current.user
      @friendship.destroy
      flash[:notice] = "The friend request has been removed."
    else
      flash[:alert] = "You are not authorized to perform this action."
    end

    # Redirect back to the user's own profile page
    redirect_to user_path(Current.user)


    #if @friendship
    #  @friendship.destroy
    #  flash[:notice] = "Friendship removed."
    #else
    #  flash[:alert] = "Friendship not found."
    #end
    #redirect_to user_path(current_user)
  end
end
