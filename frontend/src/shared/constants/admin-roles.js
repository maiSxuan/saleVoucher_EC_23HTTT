export const ADMIN_ROLES = {
  SYSTEM: "ADMIN_SYSTEM",
  MODERATION: "ADMIN_MODERATION",
  OPERATION: "ADMIN_OPERATION",
};

export const ADMIN_PORTAL_ROLES = [
  ADMIN_ROLES.SYSTEM,
  ADMIN_ROLES.MODERATION,
  ADMIN_ROLES.OPERATION,
];

export const ADMIN_ROLE_CONFIG = {
  [ADMIN_ROLES.SYSTEM]: {
    label: "Quản trị hệ thống",
    defaultPath: "/admin/overview",
  },
  [ADMIN_ROLES.MODERATION]: {
    label: "Quản trị kiểm duyệt",
    defaultPath: "/admin/overview",
  },
  [ADMIN_ROLES.OPERATION]: {
    label: "Quản trị vận hành",
    defaultPath: "/admin/overview",
  },
};

const DB_ADMIN_ROLE_TO_PORTAL_ROLE = {
  "Admin he thong": ADMIN_ROLES.SYSTEM,
  "Admin kiem duyet": ADMIN_ROLES.MODERATION,
  "Admin van hang": ADMIN_ROLES.OPERATION,
  "Admin van hanh": ADMIN_ROLES.OPERATION,
};

export function getAdminRole(user) {
  const roles = [user?.role, user?.vai_tro_he_thong, user?.vai_tro].filter(Boolean);
  for (const role of roles) {
    if (ADMIN_PORTAL_ROLES.includes(role)) return role;
    if (DB_ADMIN_ROLE_TO_PORTAL_ROLE[role]) return DB_ADMIN_ROLE_TO_PORTAL_ROLE[role];
  }
  return roles[0];
}

export function getAdminRoleConfig(user) {
  return ADMIN_ROLE_CONFIG[getAdminRole(user)] || null;
}

export function getAdminDefaultPath(user) {
  return getAdminRoleConfig(user)?.defaultPath || "/forbidden";
}
