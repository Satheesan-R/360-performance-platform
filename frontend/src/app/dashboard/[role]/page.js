'use client';

import { useParams } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';

const content = {
  hr: {
    eyebrow: 'HR workspace',
    title: 'Good work starts with great people.',
    description: 'Create employee accounts, guide onboarding, and keep your organization moving forward.',
  },
  admin: {
    eyebrow: 'Administration',
    title: 'Your platform at a glance.',
    description: 'Manage access, people, and performance operations from one secure workspace.',
  },
  manager: {
    eyebrow: 'Manager workspace',
    title: 'Help your team do their best work.',
    description: 'Keep goals visible, feedback timely, and development conversations focused.',
  },
  employee: {
    eyebrow: 'My workspace',
    title: 'Own your growth journey.',
    description: 'Track goals, prepare for reviews, and turn feedback into your next step forward.',
  },
};

export default function DashboardPage() {
  const { role } = useParams();
  const allowedRole = ['employee', 'manager', 'hr', 'admin'].includes(role) ? role : 'employee';
  const copy = content[allowedRole];

  return (
    <AuthGuard roles={[allowedRole]}>
      {(user) => (
        <DashboardShell user={user}>
          <section className="dashboard-content">
            <div className="hero-card">
              <div><span className="eyebrow light">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.description}</p></div>
              {(user.role === 'hr' || user.role === 'admin') && <a className="button button-light" href="/hr/employees/new">Add an employee</a>}
            </div>
            <div className="metric-grid">
              <article><span className="metric-icon coral">↗</span><small>Active goals</small><strong>—</strong><p>Goal data will appear here.</p></article>
              <article><span className="metric-icon teal">◇</span><small>Review progress</small><strong>—</strong><p>No active review cycle yet.</p></article>
              <article><span className="metric-icon gold">✦</span><small>Recent feedback</small><strong>—</strong><p>Your latest feedback will appear here.</p></article>
            </div>
            <section className="empty-panel">
              <div className="state-icon">◎</div><div><h2>Your workspace is ready</h2><p>Performance modules will be connected after authentication is complete.</p></div>
            </section>
          </section>
        </DashboardShell>
      )}
    </AuthGuard>
  );
}
