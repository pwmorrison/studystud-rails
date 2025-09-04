class StudyController < ApplicationController
  before_action :set_study_session, only: %i[ show ]#edit update destroy ] 
  allow_unauthenticated_access

  # GET /study_sessions/new
  def new
    @study_session = StudySession.new
  end

  # POST /study_sessions or /study_sessions.json
  def create
    @study_session = StudySession.new(study_session_params)

    # TODO: Redirect to the page where the user can start the session.
    # Probably still show the study session details though, similar to this "show" page.
    respond_to do |format|
      if @study_session.save
        redirect_to action: :show, id: @study_session.id
        return
        #format.html { redirect_to @study_session, notice: "Study session was successfully created." }
        #format.json { render :show, status: :created, location: @study_session }
      else
        format.html { render :new, status: :unprocessable_entity }
        #format.json { render json: @study_session.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET /study_sessions/1 or /study_sessions/1.json
  def show
    puts "SHOWING STUDY SESSION"
  end

private
    # Use callbacks to share common setup or constraints between actions.
    def set_study_session
      @study_session = StudySession.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def study_session_params
      params.expect(study_session: [ :title, :description, :duration, :start_time, :end_time, :status, :rating, :user_id, :session_id ])
    end
end
