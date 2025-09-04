require "test_helper"

class StudySessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @study_session = study_sessions(:one)
  end

  test "should get index" do
    get study_sessions_url
    assert_response :success
  end

  test "should get new" do
    get new_study_session_url
    assert_response :success
  end

  test "should create study_session" do
    assert_difference("StudySession.count") do
      post study_sessions_url, params: { study_session: { description: @study_session.description, duration: @study_session.duration, end_time: @study_session.end_time, rating: @study_session.rating, session_id: @study_session.session_id, start_time: @study_session.start_time, status: @study_session.status, title: @study_session.title, user_id: @study_session.user_id } }
    end

    assert_redirected_to study_session_url(StudySession.last)
  end

  test "should show study_session" do
    get study_session_url(@study_session)
    assert_response :success
  end

  test "should get edit" do
    get edit_study_session_url(@study_session)
    assert_response :success
  end

  test "should update study_session" do
    patch study_session_url(@study_session), params: { study_session: { description: @study_session.description, duration: @study_session.duration, end_time: @study_session.end_time, rating: @study_session.rating, session_id: @study_session.session_id, start_time: @study_session.start_time, status: @study_session.status, title: @study_session.title, user_id: @study_session.user_id } }
    assert_redirected_to study_session_url(@study_session)
  end

  test "should destroy study_session" do
    assert_difference("StudySession.count", -1) do
      delete study_session_url(@study_session)
    end

    assert_redirected_to study_sessions_url
  end
end
