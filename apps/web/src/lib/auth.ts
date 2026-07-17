import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './api';
import { clearAccessToken, getAccessToken, setAccessToken } from './auth-token';
import type { UserProfile } from './types';

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
};

export async function loginUser(input: LoginInput) {
  const response = await apiFetch<{ accessToken: string }>('auth/login', {
    method: 'POST',
    body: input,
  });

  setAccessToken(response.accessToken);
  return response;
}

export async function registerUser(input: RegisterInput) {
  const response = await apiFetch<{ accessToken: string }>('auth/register', {
    method: 'POST',
    body: input,
  });

  setAccessToken(response.accessToken);
  return response;
}

export async function refreshSession() {
  return apiFetch<{ accessToken?: string; ok?: boolean }>('auth/refresh', {
    method: 'POST',
  }).catch(() => ({ ok: false }));
}

export async function fetchProfile() {
  return apiFetch<UserProfile>('users/me');
}

export async function logoutUser() {
  await apiFetch<{ ok: boolean }>('auth/logout', {
    method: 'POST',
  });
  clearAccessToken();
}

export async function getSession(): Promise<UserProfile | null> {
  const token = getAccessToken();

  if (token) {
    try {
      return await fetchProfile();
    } catch {
      // Try refresh if the stored token is invalid.
    }
  }

  const refreshResult = await refreshSession();

  if (refreshResult?.accessToken) {
    setAccessToken(refreshResult.accessToken);
    return fetchProfile();
  }

  clearAccessToken();
  return null;
}

export function useSession() {
  return useQuery<UserProfile | null, Error>(['session'], getSession, {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}
