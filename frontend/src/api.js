import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const BLOCKED_EMAIL_DOMAINS = new Set([
  'gamil.com', 'gmial.com', 'gnail.com', 'gmal.com', 'gmail.co',
  'yaho.com', 'yahooo.com', 'hotmal.com', 'outlok.com',
  'mailinator.com', 'tempmail.com', 'yopmail.com', '10minutemail.com',
  'guerrillamail.com', 'sharklasers.com', 'trashmail.com',
]);

// Central Email Validator Function
export function isValidEmailAddress(rawValue) {
  const email = String(rawValue || '').trim().toLowerCase();
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) return false;

  const [localPart, domain] = email.split('@');
  if (!localPart || !domain || BLOCKED_EMAIL_DOMAINS.has(domain)) return false;

  // Gmail real rules (6 to 30 chars, no leading/trailing/double dots)
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const baseUser = localPart.split('+')[0];
    if (
      baseUser.length < 6 ||
      baseUser.length > 30 ||
      baseUser.startsWith('.') ||
      baseUser.endsWith('.') ||
      baseUser.includes('..') ||
      !/^[a-z0-9.]+$/.test(baseUser)
    ) {
      return false;
    }
  }
  return true;
}

// Helper: Input box-ku keela exact-aa "Enter a valid mail ID" show/clear pannum
function renderEmailErrorUnderInput(inputEl, message) {
  if (!inputEl) return;
  const anchor = inputEl.parentElement?.classList.contains('relative')
    ? inputEl.parentElement
    : inputEl;

  let errNode = anchor.nextElementSibling;
  const hasErrNode = errNode && errNode.dataset?.emailError === 'true';

  if (!message) {
    inputEl.style.borderColor = '';
    if (hasErrNode) errNode.remove();
    return;
  }

  inputEl.style.borderColor = '#dc2626';
  if (!hasErrNode) {
    errNode = document.createElement('p');
    errNode.dataset.emailError = 'true';
    errNode.className = '!mt-1 text-[11px] font-semibold text-red-600 pl-1';
    anchor.insertAdjacentElement('afterend', errNode);
  }
  errNode.textContent = message;
}

function showEmailErrorByValue(emailValue, message) {
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach((input) => {
    if (input.value.trim().toLowerCase() === String(emailValue || '').trim().toLowerCase()) {
      renderEmailErrorUnderInput(input, message);
    }
  });
}

// Orey Global Listener — App.jsx-la call panna FULL website-la ella email inputs-um cover aagum!
export function attachGlobalEmailValidation() {
  const handleFocusOut = (e) => {
    const target = e.target;
    if (target?.tagName === 'INPUT' && target.type === 'email' && target.value.trim()) {
      renderEmailErrorUnderInput(
        target,
        isValidEmailAddress(target.value) ? '' : 'Enter a valid mail ID'
      );
    }
  };

  const handleInput = (e) => {
    const target = e.target;
    if (target?.tagName === 'INPUT' && target.type === 'email') {
      if (!target.value.trim() || isValidEmailAddress(target.value)) {
        renderEmailErrorUnderInput(target, '');
      }
    }
  };

  document.addEventListener('focusout', handleFocusOut);
  document.addEventListener('input', handleInput);
  return () => {
    document.removeEventListener('focusout', handleFocusOut);
    document.removeEventListener('input', handleInput);
  };
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 55000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = error.config?.url?.includes('/admin/login/');
    if (error.response?.status === 401 && !isLoginCall) {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname !== '/lms-login') {
        window.location.href = '/lms-login';
      }
    }
    return Promise.reject(error);
  }
);

// Public APIs
export const fetchPublicBatches = () => apiClient.get('/batches/');
export const fetchUpcomingBatches = fetchPublicBatches;

export const submitEnquiry = async (payload) => {
  // 1. Frontend Instant Check before hitting server
  if (!isValidEmailAddress(payload?.email)) {
    showEmailErrorByValue(payload?.email, 'Enter a valid mail ID');
    return Promise.reject({
      response: { data: { email: ['Enter a valid mail ID'] } },
    });
  }

  try {
    return await apiClient.post('/enquiries/', payload);
  } catch (err) {
    // 2. Backend MX DNS check fail aanalum email input keela message kaatum!
    const emailErr = err?.response?.data?.email;
    if (emailErr) {
      const msg = Array.isArray(emailErr) ? emailErr[0] : String(emailErr);
      showEmailErrorByValue(payload?.email, msg);
    }
    throw err;
  }
};

// Admin APIs
export const adminLogin = (credentials) => apiClient.post('/admin/login/', credentials);
export const fetchAdminEnquiries = (params = {}) => apiClient.get('/admin/enquiries/', { params });
export const updateAdminEnquiry = (id, data) => apiClient.patch(`/admin/enquiries/${id}/`, data);
export const deleteAdminEnquiry = (id) => apiClient.delete(`/admin/enquiries/${id}/`);
export const downloadEnquiriesCSV = (params = {}) =>
  apiClient.get('/admin/enquiries/export/', { params, responseType: 'blob' });

export default apiClient;
export const sendChatMessage = (payload) => apiClient.post('/chat/', payload);

// Jobs APIs
export const fetchPublicJobs = () => apiClient.get('/jobs/');
export const fetchAdminJobs = () => apiClient.get('/admin/jobs/');
export const createAdminJob = (data) => apiClient.post('/admin/jobs/', data);
export const updateAdminJob = (id, data) => apiClient.patch(`/admin/jobs/${id}/`, data);
export const deleteAdminJob = (id) => apiClient.delete(`/admin/jobs/${id}/`);