const USERS_KEY = 'mindcare_users';
const SESSION_KEY = 'mindcare_current_user';
const DEMO_USER_KEY = 'team10user';
const DEMO_USER = {
  id: 'team10user',
  name: 'Team 10 User',
  email: 'team10user',
  password: '123'
};

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeIdentifier = (identifier) => (identifier || '').trim().toLowerCase();

export const getStoredUsers = () => {
  const users = safeParse(localStorage.getItem(USERS_KEY), {});

  if (!users[DEMO_USER_KEY]) {
    users[DEMO_USER_KEY] = DEMO_USER;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  return users;
};

const setStoredUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getHistoryKey = (userId) => `mindcare_history_${userId}`;

export const registerUser = ({ name, email, password }) => {
  const normalizedEmail = normalizeIdentifier(email);
  const users = getStoredUsers();

  if (!normalizedEmail || !password || !name?.trim()) {
    return { ok: false, message: 'Please complete all required fields.' };
  }

  if (users[normalizedEmail]) {
    return { ok: false, message: 'An account already exists with this email.' };
  }

  const user = {
    id: normalizedEmail.replace(/[^a-z0-9]/g, '_'),
    name: name.trim(),
    email: normalizedEmail,
    password
  };

  users[normalizedEmail] = user;
  setStoredUsers(users);

  return {
    ok: true,
    user: { id: user.id, name: user.name, email: user.email }
  };
};

export const authenticateUser = ({ email, password }) => {
  const normalizedEmail = normalizeIdentifier(email);
  const users = getStoredUsers();
  const user = users[normalizedEmail];

  if (!user || user.password !== password) {
    return { ok: false, message: 'Invalid email or password.' };
  }

  return {
    ok: true,
    user: { id: user.id, name: user.name, email: user.email }
  };
};

export const setCurrentUser = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getCurrentUser = () => safeParse(localStorage.getItem(SESSION_KEY), null);

export const clearCurrentUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getUserHistory = (userId) => {
  if (!userId) return [];
  return safeParse(localStorage.getItem(getHistoryKey(userId)), []);
};

export const addUserHistoryEntry = (userId, entry) => {
  if (!userId || !entry) return [];

  const current = getUserHistory(userId);
  const updated = [entry, ...current].slice(0, 30);
  localStorage.setItem(getHistoryKey(userId), JSON.stringify(updated));
  return updated;
};
