/**
 * Development helper untuk auto-login mock user
 * Hanya untuk testing - akan dihapus di production
 */

import { AuthContextValue, Credentials } from '../contexts/AuthContext';

export const autoLoginMockUser = async (authContext: AuthContextValue) => {
  // Auto-login sebagai Direksi untuk testing
  const mockCredentials: Credentials = {
    email: 'direksi@bri.co.id',
    password: 'password',
  };

  try {
    await authContext.login(mockCredentials);
    console.log('✅ Auto-login berhasil sebagai:', mockCredentials.email);
  } catch (error) {
    console.error('❌ Auto-login gagal:', error);
  }
};
