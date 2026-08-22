const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res) {
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(json?.message || "Có lỗi xảy ra");
    err.details = json?.details;
    throw err;
  }
  return json.data;
}

export async function registerCustomerApi({
  loginInfo,
  password,
  confirmPassword,
}) {
  const res = await fetch(`${BASE_URL}/customer/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginInfo, password, confirmPassword }),
  });
  return handleResponse(res);
}

export async function verifyRegisterOtpApi({ loginInfo, otp }) {
  const res = await fetch(`${BASE_URL}/customer/register/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginInfo, otp }),
  });
  return handleResponse(res);
}

export async function resendRegisterOtpApi({ loginInfo }) {
  const res = await fetch(`${BASE_URL}/customer/register/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginInfo }),
  });
  return handleResponse(res);
}

export async function fetchProfile() {
  const res = await fetch(`${BASE_URL}/customer/profile`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function updateProfile(data) {
  const res = await fetch(`${BASE_URL}/customer/profile`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function changePassword(data) {
  const res = await fetch(`${BASE_URL}/customer/profile/password`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
