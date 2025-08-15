class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :friendships
  has_many :friends, -> { where(friendships: { status: 'accepted' }) }, through: :friendships

  has_many :pending_friendships, -> { where(status: 'pending') }, class_name: 'Friendship', foreign_key: 'friend_id'
  has_many :pending_friends, through: :pending_friendships, source: :user

  has_many :requested_friendships, -> { where(status: 'pending') }, class_name: 'Friendship', foreign_key: 'user_id'
  has_many :requested_friends, through: :requested_friendships, source: :friend

  normalizes :email_address, with: ->(e) { e.strip.downcase }

  def friends_with?(user)
    friendships.where(friend_id: user.id, status: 'accepted').exists? ||
    user.friendships.where(friend_id: id, status: 'accepted').exists?
  end
end
