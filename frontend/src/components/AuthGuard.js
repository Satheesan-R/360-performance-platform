'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticatedRequest } from '@/lib/api';
import { clearSession, dashboardFor, getToken } from '@/lib/auth';

export default function AuthGuard({ roles, children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const rolesKey = roles?.join(',') || '';

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    authenticatedRequest('/auth/me', token)
      .then(({ data }) => {
        if (rolesKey && !rolesKey.split(',').includes(data.role)) {
          router.replace(dashboardFor(data.role));
          return;
        }
        setUser(data);
      })
      .catch(() => {
        clearSession();
        router.replace('/auth/login');
      });
  }, [router, rolesKey]);

  if (!user) {
    return <div className="page-loader"><span className="spinner" />Checking your session…</div>;
  }

  return children(user);
}
