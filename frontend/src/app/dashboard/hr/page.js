'use client';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import s from './hr.module.css';
function HR({user}) { return <DashboardShell user={user}><div className={s.page}>
<section className={s.hero}><span>HR workspace</span><h1>People operations,<br/>all in one place.</h1><p>Guide onboarding, support performance cycles, and help your organization thrive.</p><a href="/hr/employees/new">+ Add an employee</a></section>
<section className={s.stats}><article><small>Total employees</small><strong>—</strong><p>Active people</p></article><article><small>Pending activation</small><strong>—</strong><p>Invitations sent</p></article><article><small>Review participation</small><strong>—</strong><p>Current cycle</p></article></section>
<section className={s.grid}><article className={s.activity}><span>Organization</span><h2>Recent people activity</h2><div><b>◇</b><h3>No recent activity</h3><p>Employee onboarding and profile updates will be shown here.</p></div></article><aside><span>Performance cycle</span><h2>Prepare your next review</h2><p>Set timelines, align participants, and make every conversation count.</p><a href="/performance">Manage reviews →</a></aside></section>
</div></DashboardShell> }
export default function Page(){return <AuthGuard roles={['hr']}>{user=><HR user={user}/>}</AuthGuard>}
