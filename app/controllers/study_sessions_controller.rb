class StudySessionsController < ApplicationController
  before_action :set_study_session, only: %i[ show edit update destroy ]
  allow_unauthenticated_access

  # GET /study_sessions or /study_sessions.json
  def index
    @study_sessions = StudySession.all
  end

  # GET /study_sessions/1 or /study_sessions/1.json
  def show
  end

  # GET /study_sessions/new
  def new
    @study_session = StudySession.new
  end

  # GET /study_sessions/1/edit
  def edit
  end

  # POST /study_sessions or /study_sessions.json
  def create
    @study_session = StudySession.new(study_session_params)

    respond_to do |format|
      if @study_session.save
        format.html { redirect_to @study_session, notice: "Study session was successfully created." }
        format.json { render :show, status: :created, location: @study_session }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @study_session.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /study_sessions/1 or /study_sessions/1.json
  def update
    respond_to do |format|
      if @study_session.update(study_session_params)
        format.html { redirect_to @study_session, notice: "Study session was successfully updated." }
        format.json { render :show, status: :ok, location: @study_session }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @study_session.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /study_sessions/1 or /study_sessions/1.json
  def destroy
    @study_session.destroy!

    respond_to do |format|
      format.html { redirect_to study_sessions_path, status: :see_other, notice: "Study session was successfully destroyed." }
      format.json { head :no_content }
    end
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
