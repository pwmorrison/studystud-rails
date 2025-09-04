class MakeUserInStudySessionOptional < ActiveRecord::Migration[8.0]
  def change
    change_column_null :study_sessions, :user_id, true
  end
end
