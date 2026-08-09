'use client';

import { useRouter } from 'next/navigation';
import { FiSearch, FiBell, FiHelpCircle, FiUsers, FiRefreshCw, FiAlertCircle, FiBriefcase, FiHeart, FiCalendar, FiDownload, FiMoreVertical, FiUserPlus, FiClipboard, FiEdit3, FiTrendingUp, FiCheckCircle, FiSettings, FiLogOut } from 'react-icons/fi';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import { clearSession } from '@/lib/auth';
import styles from './hr.module.css';

const navLinks = ['Review Cycles', 'Monitoring', 'Reports & Finalization'];
const stats = [
  { icon: FiUsers, tone: 'blue', label: 'Total Employees', value: '245', note: '+12 this month', positive: true },
  { icon: FiRefreshCw, tone: 'amber', label: 'Active Cycles', value: '2', note: 'Q3 Review & 360 Feedback' },
  { icon: FiAlertCircle, tone: 'red', label: 'Pending Requests', value: '18', note: '5 urgent', urgent: true },
  { icon: FiBriefcase, tone: 'violet', label: 'Open Positions', value: '12', note: 'Across 3 depts' },
  { icon: FiHeart, tone: 'green', label: 'Retention', value: '98%', note: '+2% YoY', positive: true },
];
const requests = [
  { initial: 'J', tone: 'blue', name: 'Jonty Rhodes', type: 'Skill Update: Python', date: 'Oct 12, 2027', status: 'Pending', statusTone: 'pending' },
  { initial: 'A', tone: 'green', name: 'Alex Mercer', type: 'Info Correction: Title', date: 'Oct 11, 2027', status: 'Under Review', statusTone: 'review' },
  { initial: 'S', tone: 'violet', name: 'Sarah Connor', type: 'Leave Request: Personal', date: 'Oct 10, 2027', status: 'Pending', statusTone: 'pending' },
];
const actions = [
  { icon: FiUserPlus, label: 'Add Employee', href: '/hr/employees/new' },
  { icon: FiClipboard, label: 'Create Cycle', href: '/performance' },
  { icon: FiEdit3, label: 'Manage Requests', href: '/performance' },
  { icon: FiTrendingUp, label: 'View Analytics', href: '/reports' },
];
const milestones = [
  { tone: 'red', meta: 'Today, 5:00 PM', title: 'Self-Evaluations Due', text: '78 employees remaining.' },
  { tone: 'blue', meta: 'Tomorrow, 10:00 AM', title: 'Manager Review Kickoff', text: 'Briefing with department heads.' },
  { tone: 'slate', meta: 'Friday, Oct 15', title: 'New Hire Orientation', text: '12 new engineers starting.' },
];
const departments = [
  { name: 'Software Engineering', count: 120, percent: 49, tone: 'blue' },
  { name: 'QA & Testing', count: 45, percent: 18, tone: 'violet' },
  { name: 'Finance', count: 30, percent: 12, tone: 'green' },
  { name: 'Human Resources', count: 15, percent: 6, tone: 'amber' },
];
const activity = [
  { icon: FiUserPlus, tone: 'blue', title: 'New Employee Added: Michael Chang (Engineering)', meta: '10 minutes ago by Admin' },
  { icon: FiCheckCircle, tone: 'green', title: 'Request Approved: PTO for Sarah Connor', meta: '45 minutes ago by S. Johnson' },
  { icon: FiEdit3, tone: 'violet', title: 'Review Submitted: Jonty Rhodes (Self-Eval)', meta: '2 hours ago by System' },
  { icon: FiSettings, tone: 'slate', title: 'System Update: OKR Module v2.1 deployed', meta: '' },
];

function HrDashboard({ user }) {
  const router = useRouter();
  const displayName = user.name || user.fullName || user.email.split('@')[0];
  const firstName = displayName.split(' ')[0];
  const initials = displayName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  function logout() { clearSession(); router.replace('/auth/login'); }

  return <div className={styles.shellOverride}><DashboardShell user={user}><div className={styles.dashboard}>
    <header className={styles.topbar}>
      <nav>{navLinks.map((link, index) => <a className={index === 0 ? styles.activeNav : ''} href={index === 2 ? '/reports' : '/performance'} key={link}>{link}</a>)}</nav>
      <div className={styles.topActions}><label className={styles.search}><FiSearch/><input type="search" placeholder="Search employees, reviews..."/></label><button className={`${styles.iconButton} ${styles.notification}`} aria-label="Notifications"><FiBell/><span/></button><button className={styles.iconButton} aria-label="Help"><FiHelpCircle/></button><span className={styles.avatar}>{initials}</span><button className={styles.iconButton} aria-label="Sign out" title="Sign out" onClick={logout}><FiLogOut/></button></div>
    </header>
    <main className={styles.content}>
      <section className={styles.pageHeading}><div><h1>Good Morning, {firstName}</h1><p>Here is your HR command center for today.</p></div><div><button><FiCalendar/>This Month</button><button className={styles.primary}><FiDownload/>Export Report</button></div></section>
      <section className={styles.stats}>{stats.map(({icon:Icon,tone,label,value,note,positive,urgent}) => <article key={label}><header><span>{label}</span><b className={styles[tone]}><Icon/></b></header><strong>{value}</strong><small className={positive ? styles.positive : urgent ? styles.urgent : ''}>{note}</small></article>)}</section>
      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <section className={styles.card}><header className={styles.cardHeader}><h2>Performance Cycle Pulse</h2><a href="/performance">View Full Dashboard</a></header><div className={styles.cycle}><header><div><strong>Annual Performance Review 2027</strong><span>Self-evaluations &amp; Manager Reviews</span></div><b>68%</b></header><div className={styles.progress}><span style={{width:'68%'}}/></div><footer><span>167 Submitted</span><span>78 Pending</span></footer></div></section>
          <section className={styles.card}><header className={styles.cardHeader}><h2>Recent Requests</h2><a href="/performance">View All (18)</a></header><div className={styles.tableWrap}><table><thead><tr><th>Employee</th><th>Request Type</th><th>Date Submitted</th><th>Status</th><th>Action</th></tr></thead><tbody>{requests.map(request => <tr key={request.name}><td><span className={`${styles.personAvatar} ${styles[request.tone]}`}>{request.initial}</span><strong>{request.name}</strong></td><td>{request.type}</td><td>{request.date}</td><td><span className={`${styles.status} ${styles[request.statusTone]}`}><i/>{request.status}</span></td><td><button className={styles.more} aria-label={`Actions for ${request.name}`}><FiMoreVertical/></button></td></tr>)}</tbody></table></div></section>
          <div className={styles.bottomGrid}>
            <section className={styles.card}><h2>Department Distribution</h2><div className={styles.departments}>{departments.map(item => <div key={item.name}><p><strong>{item.name}</strong><span>{item.count} ({item.percent}%)</span></p><div><span className={styles[item.tone]} style={{width:`${item.percent}%`}}/></div></div>)}</div></section>
            <section className={styles.card}><h2>Recent Activity Log</h2><div className={styles.activity}>{activity.map(({icon:Icon,tone,title,meta}) => <article key={title}><b className={styles[tone]}><Icon/></b><div><strong>{title}</strong>{meta && <span>{meta}</span>}</div></article>)}</div></section>
          </div>
        </div>
        <aside className={styles.sideColumn}>
          <section className={styles.card}><h2>Quick Actions</h2><div className={styles.quickActions}>{actions.map(({icon:Icon,label,href}) => <a href={href} key={label}><b><Icon/></b><span>{label}</span></a>)}</div></section>
          <section className={styles.card}><h2>Upcoming Milestones</h2><div className={styles.milestones}>{milestones.map(item => <article key={item.title}><i className={styles[item.tone]}/><div><span className={styles[item.tone]}>{item.meta}</span><strong>{item.title}</strong><p>{item.text}</p></div></article>)}</div></section>
        </aside>
      </div>
    </main>
  </div></DashboardShell></div>;
}

export default function HrDashboardPage() { return <AuthGuard roles={['hr']}>{user => <HrDashboard user={user}/>}</AuthGuard>; }
