/* common.js - LocalStorage based ticket management and utilities */

// Utility function to generate unique ID (simple random string)
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Utility function to get current timestamp string
function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Utility function to check booking time limit (3:30 AM to 9:30 PM)
function isBookingAllowed() {
  const now = new Date();
  const start = new Date();
  start.setHours(3, 30, 0, 0);
  const end = new Date();
  end.setHours(21, 30, 0, 0);
  return now >= start && now <= end;
}

// Voice guidance function using SpeechSynthesis API
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}

// Utility function to get logged in username from sessionStorage
function getLoggedInUsername() {
  const loggedInUser = sessionStorage.getItem('loggedInUser');
  if (!loggedInUser) return null;
  try {
    return JSON.parse(loggedInUser).username;
  } catch {
    return null;
  }
}

// LocalStorage key prefix for tickets
const TICKETS_KEY_PREFIX = 'devoteeBusTickets_';

// Get all tickets for current user from localStorage
function getAllTickets() {
  const username = getLoggedInUsername();
  if (!username) return [];
  const ticketsJson = localStorage.getItem(TICKETS_KEY_PREFIX + username);
  return ticketsJson ? JSON.parse(ticketsJson) : [];
}

// Save all tickets for current user to localStorage
function saveAllTickets(tickets) {
  const username = getLoggedInUsername();
  if (!username) return;
  localStorage.setItem(TICKETS_KEY_PREFIX + username, JSON.stringify(tickets));
}

// Add a new ticket for current user, returns the ticket id
function addTicket(ticket) {
  const tickets = getAllTickets();
  const id = generateId();
  ticket.id = id;
  tickets.push(ticket);
  saveAllTickets(tickets);
  return id;
}

// Get ticket by id for current user
function getTicketById(id) {
  const tickets = getAllTickets();
  return tickets.find(t => t.id === id);
}

// Update ticket scansUsed by id for current user
function updateTicketScansUsed(id, newScansUsed) {
  const tickets = getAllTickets();
  const index = tickets.findIndex(t => t.id === id);
  if (index !== -1) {
    tickets[index].scansUsed = newScansUsed;
    saveAllTickets(tickets);
    return true;
  }
  return false;
}

// Update ticket scansUsed by id across all users
function updateTicketScansUsedForAllUsers(id, newScansUsed) {
  // Find which user owns this ticket
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(TICKETS_KEY_PREFIX)) {
      const ticketsJson = localStorage.getItem(key);
      if (ticketsJson) {
        try {
          const tickets = JSON.parse(ticketsJson);
          const index = tickets.findIndex(t => t.id === id);
          if (index !== -1) {
            tickets[index].scansUsed = newScansUsed;
            localStorage.setItem(key, JSON.stringify(tickets));
            return true;
          }
        } catch (e) {
          console.error('Error updating ticket scans:', e);
        }
      }
    }
  }
  return false;
}

// Reset all scansUsed to 0 for current user
function resetAllScans() {
  const tickets = getAllTickets();
  tickets.forEach(t => {
    t.scansUsed = 0;
  });
  saveAllTickets(tickets);
}

// Reset all tickets by clearing the tickets array for current user
function resetAllTickets() {
  const username = getLoggedInUsername();
  if (!username) return;
  localStorage.setItem(TICKETS_KEY_PREFIX + username, JSON.stringify([]));
}

// Reset all tickets for all users by clearing tickets in localStorage for all keys with prefix
function resetAllTicketsForAllUsers() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(TICKETS_KEY_PREFIX)) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  }
}

// Get all tickets for all users from localStorage
function getAllTicketsForAllUsers() {
  const tickets = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(TICKETS_KEY_PREFIX)) {
      const userTicketsJson = localStorage.getItem(key);
      if (userTicketsJson) {
        try {
          const userTickets = JSON.parse(userTicketsJson);
          if (Array.isArray(userTickets)) {
            tickets.push(...userTickets);
          }
        } catch (e) {
          console.error('Error parsing tickets for key:', key, e);
        }
      }
    }
  }
  return tickets;
}