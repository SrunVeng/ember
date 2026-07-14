export const USER_ROLES = {
  OWNER: "OWNER",
  STAFF: "STAFF",
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.OWNER]: "Owner Admin",
  [USER_ROLES.STAFF]: "Staff Quote Creator",
};

export const OWNER_ONLY_ROLES = [USER_ROLES.OWNER];
export const STAFF_WORKFLOW_ROLES = [USER_ROLES.OWNER, USER_ROLES.STAFF];

export const DEMO_USERS = [
  {
    id: "owner",
    name: "Owner Admin",
    email: "owner@ember.co",
    password: "owner123",
    role: USER_ROLES.OWNER,
  },
  {
    id: "staff",
    name: "Staff Quote Creator",
    email: "staff@ember.co",
    password: "staff123",
    role: USER_ROLES.STAFF,
  },
];

export function authenticateDemoUser(email, password) {
  return DEMO_USERS.find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password,
  );
}
