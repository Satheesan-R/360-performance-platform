'use client';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import s from './employee.module.css';

function Employee({ user }) {
  const name = user.name?.split(' ')[0] || user.email.split('@')[0];
  return <DashboardShell user={user}><div className={s.page}>
    <section className={s.hero}><div><span>My workspace</span><h1>Welcome back, {name}.</h1><p>Stay focused on your goals, feedback, and professional growth.</p></div><a href="/goals">View my goals</a></section>
    <section className={s.metrics}><article><b>↗</b><small>Active goals</small><strong>—</strong><p>Your current goals will appear here.</p></article><article><b>✓</b><small>Review progress</small><strong>—</strong><p>No active review cycle yet.</p></article><article><b>✦</b><small>Recent feedback</small><strong>—</strong><p>Your latest feedback will appear here.</p></article></section>
    <section className={s.grid}><article className={s.panel}><header><div><span>Personal progress</span><h2>My goals</h2></div><a href="/goals">See all</a></header><div className={s.empty}><b>◎</b><h3>Ready when you are</h3><p>Create or receive a goal to start tracking progress.</p></div></article><aside><span>Next step</span><h2>Build your growth plan</h2><p>Use feedback and review outcomes to choose your next development focus.</p><a href="/training">Explore training →</a></aside></section>
  </div></DashboardShell>;
}
export default function Page() { return <AuthGuard roles={['employee']}>{user => <Employee user={user} />}</AuthGuard>; }
