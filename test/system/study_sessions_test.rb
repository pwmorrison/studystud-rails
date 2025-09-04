require "application_system_test_case"

class StudySessionsTest < ApplicationSystemTestCase
  setup do
    @study_session = study_sessions(:one)
  end

  test "visiting the index" do
    visit study_sessions_url
    assert_selector "h1", text: "Study sessions"
  end

  test "should create study session" do
    visit study_sessions_url
    click_on "New study session"

    fill_in "Description", with: @study_session.description
    fill_in "Duration", with: @study_session.duration
    fill_in "End time", with: @study_session.end_time
    fill_in "Rating", with: @study_session.rating
    fill_in "Session", with: @study_session.session_id
    fill_in "Start time", with: @study_session.start_time
    fill_in "Status", with: @study_session.status
    fill_in "Title", with: @study_session.title
    fill_in "User", with: @study_session.user_id
    click_on "Create Study session"

    assert_text "Study session was successfully created"
    click_on "Back"
  end

  test "should update Study session" do
    visit study_session_url(@study_session)
    click_on "Edit this study session", match: :first

    fill_in "Description", with: @study_session.description
    fill_in "Duration", with: @study_session.duration
    fill_in "End time", with: @study_session.end_time.to_s
    fill_in "Rating", with: @study_session.rating
    fill_in "Session", with: @study_session.session_id
    fill_in "Start time", with: @study_session.start_time.to_s
    fill_in "Status", with: @study_session.status
    fill_in "Title", with: @study_session.title
    fill_in "User", with: @study_session.user_id
    click_on "Update Study session"

    assert_text "Study session was successfully updated"
    click_on "Back"
  end

  test "should destroy Study session" do
    visit study_session_url(@study_session)
    click_on "Destroy this study session", match: :first

    assert_text "Study session was successfully destroyed"
  end
end
