'use client';

import { useRouter } from 'next/navigation';
import Brand from './Brand';
import { clearSession } from '@/lib/auth';

export default function DashboardShell({ user, children }) {
  const router = useRouter();

  function logout() {
    clearSession();
    router.replace('/auth/login');
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Brand light />
        <nav>
          <a className="nav-active" href={`/dashboard/${user.role}`}>Overview</a>
          {(user.role === 'hr' || user.role === 'admin') && (
            <a href="/hr/employees/new">Add employee</a>
          )}
        </nav>
        <div className="sidebar-profile">
          <div className="avatar">{user.email[0].toUpperCase()}</div>
          <span><strong>{user.email}</strong><small>{user.role}</small></span>
        </div>
      </aside>
      <main className="dashboard-main">
        <header className="topbar">
          <div><small>Workspace</small><strong>Performance management</strong></div>
          <button className="button button-ghost" onClick={logout}>Sign out</button>
        </header>
        {children}
      </main>
    </div>
  );
}
