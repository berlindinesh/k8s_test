/**
 * Returns the Authorization header with JWT token
 * @returns {Object} Headers object with Authorization
 */
export default function authHeader() {
    const token = localStorage.getItem('token');
    const companyCode = localStorage.getItem('companyCode');
    
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (companyCode) {
      headers['x-company-code'] = companyCode;
    }
    
    return headers;
  }
  