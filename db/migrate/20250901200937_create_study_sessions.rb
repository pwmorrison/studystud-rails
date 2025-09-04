class CreateStudySessions < ActiveRecord::Migration[8.0]
  def change
    create_table :study_sessions do |t|
      t.string :title
      t.text :description
      t.integer :duration
      t.datetime :start_time
      t.datetime :end_time
      t.string :status
      t.integer :rating
      t.references :user, null: false, foreign_key: true
      t.string :session_id

      t.timestamps
    end
    add_index :study_sessions, :session_id
  end
end
