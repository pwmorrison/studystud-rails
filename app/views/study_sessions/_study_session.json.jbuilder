json.extract! study_session, :id, :title, :description, :duration, :start_time, :end_time, :status, :rating, :user_id, :session_id, :created_at, :updated_at
json.url study_session_url(study_session, format: :json)
