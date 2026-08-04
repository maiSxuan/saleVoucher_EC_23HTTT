import { mockStore } from "../store/mockDataStore";

const BACKEND_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "/api"}`;

/**
 * Fetch voucher categories from backend API
 */
export async function getCategoriesApi() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/vouchers/categories`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.getCategories();
}

/**
 * Fetch list of partners from backend API, with mockStore fallback
 */
export async function getPartnersApi(query = {}) {
  try {
    const params = new URLSearchParams(query).toString();
    const res = await fetch(`${BACKEND_BASE_URL}/partners${params ? `?${params}` : ""}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.getPartners();
}

/**
 * Fetch partner detail by ID
 */
export async function getPartnerByIdApi(partnerId) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/partners/${partnerId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.getPartnerById(partnerId);
}

/**
 * Update partner info
 */
export async function updatePartnerApi(partnerId, payload) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/partners/${partnerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.updatePartner(partnerId, payload);
}

/**
 * Approve partner (Admin action)
 */
export async function approvePartnerApi(partnerId) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/partners/${partnerId}/approve`, {
      method: "POST",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.approvePartner(partnerId);
}

/**
 * Reject partner (Admin action)
 */
export async function rejectPartnerApi(partnerId, reason = "") {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/partners/${partnerId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.rejectPartner(partnerId, reason);
}

/**
 * Lock/Unlock partner
 */
export async function lockPartnerApi(partnerId, isLocked = true) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/partners/${partnerId}/lock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLocked }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.lockPartner(partnerId, isLocked);
}

/**
 * Fetch branches for partner
 */
export async function getBranchesByPartnerApi(partnerId) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/branches/partner/${partnerId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  const partner = mockStore.getPartnerById(partnerId);
  return partner?.branches || [];
}

/**
 * Fetch branch change requests for partner
 */
export async function getBranchRequestsApi(partnerId) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/branches/requests/partner/${partnerId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.getBranchRequests().filter((r) => r.ma_hs === partnerId);
}

/**
 * Create branch change request
 */
export async function createBranchRequestApi(requestData) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/branches/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.createBranchRequest(requestData);
}

/**
 * Fetch list of vouchers
 */
export async function getVouchersApi(query = {}) {
  try {
    const params = new URLSearchParams(query).toString();
    const res = await fetch(`${BACKEND_BASE_URL}/vouchers${params ? `?${params}` : ""}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.getVouchers();
}

/**
 * Fetch vouchers for a specific partner
 */
export async function getVouchersByPartnerApi(partnerId) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/vouchers/partner/${partnerId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.getVouchersByPartner(partnerId);
}

/**
 * Fetch voucher detail by ID
 */
export async function getVoucherByIdApi(voucherId) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/vouchers/${voucherId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.getVoucherById(voucherId);
}

/**
 * Save / Create / Update voucher
 */
export async function saveVoucherApi(voucherData) {
  try {
    const isEdit = !!voucherData.ma_voucher;
    const url = isEdit ? `${BACKEND_BASE_URL}/vouchers/${voucherData.ma_voucher}` : `${BACKEND_BASE_URL}/vouchers`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voucherData),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.saveVoucher(voucherData);
}

/**
 * Approve voucher (Admin action)
 */
export async function approveVoucherApi(voucherId, isHidden = false) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/vouchers/${voucherId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.approveVoucher(voucherId, isHidden);
}

/**
 * Reject voucher (Admin action)
 */
export async function rejectVoucherApi(voucherId, reason = "") {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/vouchers/${voucherId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.rejectPartner(voucherId, reason);
}

/**
 * Staff management APIs
 */
export async function getStaffsByPartnerApi(partnerId) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/staffs/partner/${partnerId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.getStaffsByPartner(partnerId);
}

export async function createStaffApi(staffData) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/staffs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffData),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.createStaff(staffData);
}

export async function updateStaffApi(staffId, staffData) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/staffs/${staffId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffData),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.updateStaff(staffId, staffData);
}

export async function deleteStaffApi(staffId) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/staffs/${staffId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn("Backend API unavailable, using mockStore fallback:", e.message);
  }
  return mockStore.deleteStaff(staffId);
}

export async function getAuditLogsApi() {
  return mockStore.getAuditLogs();
}
