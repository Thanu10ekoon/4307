-- RSVP Event Management System Database Schema

-- 1. users
CREATE TABLE users (
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  PRIMARY KEY (email)
);

-- 2. events
CREATE TABLE events (
  id INTEGER NOT NULL AUTO_INCREMENT,
  creator_email VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  event_date DATETIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (creator_email) REFERENCES users(email)
);

-- 3. invitations
CREATE TABLE invitations (
  id INTEGER NOT NULL AUTO_INCREMENT,
  event_id INTEGER NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  response ENUM('Attending', 'Not Attending') DEFAULT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (recipient_email) REFERENCES users(email)
);

-- 4. event_reminders
CREATE TABLE event_reminders (
  id INTEGER NOT NULL AUTO_INCREMENT,
  event_id INTEGER NOT NULL,
  days_before INTEGER NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- 5. event_feedback
CREATE TABLE event_feedback (
  id INTEGER NOT NULL AUTO_INCREMENT,
  event_id INTEGER NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  message VARCHAR(255) NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (user_email) REFERENCES users(email)
);
