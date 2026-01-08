const BASE_URL = "http://127.0.0.1:5555"

// Mentors
export const fetchMentors = () =>
  fetch(`${BASE_URL}/mentors`).then(res => res.json())

// Students
export const fetchStudents = () =>
  fetch(`${BASE_URL}/students`).then(res => res.json())

// Cohorts
export const fetchCohorts = () =>
  fetch(`${BASE_URL}/cohorts`).then(res => res.json())