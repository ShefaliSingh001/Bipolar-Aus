const KEY = "ba_volunteer_session";

export function getVolunteerSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function setVolunteerSession(volunteer) {
  localStorage.setItem(KEY, JSON.stringify({ id: volunteer.id, email: volunteer.email_id, name: volunteer.name }));
}

export function clearVolunteerSession() {
  localStorage.removeItem(KEY);
}