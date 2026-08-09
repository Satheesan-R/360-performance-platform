'use client';

import { usePathname, useRouter } from 'next/navigation';
import Brand from './Brand';
import { clearSession } from '@/lib/auth';

const navigationByRole = {
  employee: [
    { label: 'Overview', href: '/dashboard/employee' },
    { label: 'My Performance', href: '/performance' },
    { label: 'My Goals', href: '/goals' },
    { label: 'Learning & Training', href: '/training' },
    { label: 'My Reports', href: '/reports' },
    { label: 'Profile Settings', href: '/settings' },
  ],
  manager: [
    { label: 'Overview', href: '/dashboard/manager' },
    { label: 'My Team', href: '/performance' },
    { label: 'Team Goals', href: '/goals' },
    { label: 'Performance Reviews', href: '/performance' },
    { label: 'Team Development', href: '/training' },
    { label: 'Team Reports', href: '/reports' },
  ],
  hr: [
    { label: 'HR Overview', href: '/dashboard/hr' },
    { label: 'Employee Directory', href: '/performance' },
    { label: 'Employee Onboarding', href: '/hr/employees/new' },
    { label: 'Review Cycles', href: '/performance' },
    { label: 'Goals & Development', href: '/goals' },
    { label: 'HR Reports', href: '/reports' },
  ],
  admin: [
    { label: 'Platform Overview', href: '/dashboard/admin' },
    { label: 'User Management', href: '/performance' },
    { label: 'Add Employee', href: '/hr/employees/new' },
    { label: 'Performance Setup', href: '/performance' },
    { label: 'System Reports', href: '/reports' },
    { label: 'Platform Settings', href: '/settings' },
  ],
};

export default function DashboardShell({ user, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const navigation = navigationByRole[user.role] || navigationByRole.employee;
  const activeIndex = navigation.findIndex((item, index) =>
    pathname === item.href || (index === 0 && pathname.startsWith(`/dashboard/${user.role}`))
  );

  function logout() {
    clearSession();
    router.replace('/auth/login');
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Brand />
        <div className="sidebar-role-label">{user.role} workspace</div>
        <nav aria-label={`${user.role} navigation`}>
          {navigation.map((item, index) => {
            const active = index === activeIndex;
            return <a className={active ? 'nav-active' : undefined} href={item.href} key={`${item.label}-${index}`}>{item.label}</a>;
          })}
        </nav>
        <div className="sidebar-profile">
          <div className="avatar">{user.email[0].toUpperCase()}</div>
          <span><strong>{user.email}</strong><small>{user.role}</small></span>
        </div>
      </aside>
      <main className="dashboard-main">
        <header className="topbar">
          <div><small>{user.role} workspace</small><strong>Performance management</strong></div>
          <button className="button button-ghost" onClick={logout}>Sign out</button>
        </header>
        {children}
      </main>
    </div>
  );
}


