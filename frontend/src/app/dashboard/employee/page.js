'use client';

import { useRouter } from 'next/navigation';
import {
  FiMenu,
  FiBell,
  FiHelpCircle,
  FiShield,
  FiZap,
  FiCheckCircle,
  FiClock,
  FiBookOpen,
  FiStar,
  FiLogOut,
} from 'react-icons/fi';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import { clearSession } from '@/lib/auth';
import styles from './employee.module.css';

const stats = [
  { icon: FiShield, value: '12', label: 'Active Certs', note: '+1 new' },
  { icon: FiZap, value: '8', label: 'Skills Endorsed', note: '+3 recently' },
  { icon: FiCheckCircle, value: '95%', label: 'Goal Progress', note: 'On track' },
  { icon: FiClock, value: '4.2', label: 'Avg Years/Role', note: 'Stable' },
];

const updates = [
  { icon: FiCheckCircle, tone: 'green', title: 'Project “Nexus” Completed', description: 'You successfully delivered the phase 2 migration on schedule.', meta: '2 days ago', action: 'Read feedback' },
  { icon: FiBookOpen, tone: 'blue', title: 'New Course Assigned', description: 'Compliance 2024: Data Security Fundamentals is now available.', meta: 'Last week', action: 'Start learning' },
  { icon: FiStar, tone: 'rose', title: 'Skill Endorsement Received', description: 'Sarah Mitchell endorsed you for “Strategic Planning”.', meta: 'Oct 12', action: 'Say thanks' },
];

const checklist = [
  { label: 'Profile Photo', done: true },
  { label: 'Professional Bio', done: true },
  { label: '3 Skills added', done: false },
  { label: 'Certification uploaded', done: false },
];

function ProfileStrengthRing({ percent = 85 }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width="176" height="176" viewBox="0 0 176 176" className={styles.strengthRing} aria-label={`Profile strength ${percent}%`}>
      <circle cx="88" cy="88" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle cx="88" cy="88" r={radius} fill="none" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 88 88)" />
      <text x="88" y="82" textAnchor="middle" className={styles.ringPercent}>{percent}%</text>
      <text x="88" y="104" textAnchor="middle" className={styles.ringLevel}>INTERMEDIATE</text>
    </svg>
  );
}

function EmployeeDashboard({ user }) {
  const router = useRouter();
  const displayName = user.name || user.fullName || user.email.split('@')[0];
  const firstName = displayName.split(' ')[0];
  const initials = displayName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

  function logout() {
    clearSession();
    router.replace('/auth/login');
  }

  return (
    <div className={styles.shellOverride}>
      <DashboardShell user={user}>
        <div className={styles.dashboard}>
          <header className={styles.topbar}>
            <button type="button" aria-label="Toggle menu" className={styles.iconButton}><FiMenu /></button>
            <div className={styles.topbarActions}>
              <button type="button" aria-label="Notifications" className={styles.iconButton}><FiBell /></button>
              <button type="button" aria-label="Help" className={styles.iconButton}><FiHelpCircle /></button>
              <div className={styles.userSummary}><div><strong>{displayName}</strong><small>EMPLOYEE</small></div><span className={styles.profileAvatar}>{initials}</span></div>
              <button type="button" aria-label="Sign out" title="Sign out" className={styles.iconButton} onClick={logout}><FiLogOut /></button>
            </div>
          </header>

          <main className={styles.content}>
            <section className={styles.welcome}>
              <div><h1>Good morning, {firstName}</h1><p>Your profile is 85% complete. Review your goals for the upcoming cycle.</p></div>
              <div className={styles.welcomeActions}><a href="/goals" className={styles.lightButton}>View Goals</a><button type="button" className={styles.dismissButton}>Dismiss</button></div>
            </section>

            <div className={styles.dashboardGrid}>
              <div className={styles.mainColumn}>
                <section><h2 className={styles.sectionTitle}>My Statistics</h2><div className={styles.statsGrid}>{stats.map(({ icon: Icon, value, label, note }) => <article className={styles.statCard} key={label}><Icon /><strong>{value}</strong><span>{label}</span><small>{note}</small></article>)}</div></section>

                <section className={styles.updatesCard}>
                  <header><h2>Recent Performance Updates</h2><a href="/performance">View All</a></header>
                  <div>{updates.map(({ icon: Icon, tone, title, description, meta, action }) => <article className={styles.update} key={title}><span className={`${styles.updateIcon} ${styles[tone]}`}><Icon /></span><div><h3>{title}</h3><p>{description}</p><footer><span>{meta}</span><a href="/performance">{action}</a></footer></div></article>)}</div>
                </section>
              </div>

              <aside className={styles.profileCard}>
                <h2>Profile Strength</h2><ProfileStrengthRing percent={85} />
                <ul>{checklist.map(({ label, done }) => <li key={label}><span className={`${styles.checkBox} ${done ? styles.checked : ''}`}>{done && <FiCheckCircle />}</span><span className={done ? styles.completed : ''}>{label}</span></li>)}</ul>
                <a href="/settings" className={styles.profileButton}>Improve My Profile</a>
              </aside>
            </div>
          </main>
        </div>
      </DashboardShell>
    </div>
  );
}

export default function EmployeeDashboardPage() {
  return <AuthGuard roles={['employee']}>{user => <EmployeeDashboard user={user} />}</AuthGuard>;
}
