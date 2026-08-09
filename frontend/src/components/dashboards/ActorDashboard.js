'use client';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import styles from './ActorDashboard.module.css';

const dashboards = {
  employee: { label: 'My workspace', title: 'Own your growth journey.', text: 'Track goals, prepare for reviews, and turn feedback into your next step forward.', action: 'View my goals', href: '/goals', cards: ['Active goals', 'Review progress', 'Recent feedback'] },
  manager: { label: 'Manager workspace', title: 'Help your team do their best work.', text: 'Keep goals visible, feedback timely, and development conversations focused.', action: 'Manage team goals', href: '/goals', cards: ['Direct reports', 'Goals on track', 'Reviews due'] },
  hr: { label: 'HR workspace', title: 'People operations, all in one place.', text: 'Guide onboarding, support performance cycles, and help your organization thrive.', action: 'Add an employee', href: '/hr/employees/new', cards: ['Total employees', 'Pending activation', 'Review participation'] },
  admin: { label: 'Administration', title: 'Your platform at a glance.', text: 'Monitor access, organization health, and performance operations.', action: 'Platform settings', href: '/settings', cards: ['Active users', 'Administrators', 'Review cycles'] },
};

export default function ActorDashboard({ role, user }) {
  const data = dashboards[role];
  return <DashboardShell user={user}><main className={`${styles.page} ${styles[role]}`}>
    <section className={styles.hero}><div><span>{data.label}</span><h1>{data.title}</h1><p>{data.text}</p></div><a href={data.href}>{data.action}</a></section>
    <section className={styles.metrics}>{data.cards.map((card, index) => <article key={card}><b>{['↗','✓','✦'][index]}</b><small>{card}</small><strong>—</strong><p>Data will appear here.</p></article>)}</section>
    <section className={styles.panel}><div><span>Overview</span><h2>{role === 'manager' ? 'My team' : role === 'employee' ? 'My progress' : 'Recent activity'}</h2></div><div className={styles.empty}><b>◎</b><h3>Your workspace is ready</h3><p>Performance information will appear here when it becomes available.</p></div></section>
  </main></DashboardShell>;
}

export function ProtectedActorDashboard({ role }) {
  return <AuthGuard roles={[role]}>{user => <ActorDashboard role={role} user={user} />}</AuthGuard>;
}
