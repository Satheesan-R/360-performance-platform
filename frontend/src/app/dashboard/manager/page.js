'use client';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import s from './manager.module.css';
function Manager({user}) { return <DashboardShell user={user}><div className={s.page}>
<header className={s.heading}><div><span>Manager workspace</span><h1>Team performance</h1><p>Keep priorities visible and help every team member move forward.</p></div><a href="/goals">Manage team goals</a></header>
<section className={s.summary}><article><small>Direct reports</small><strong>—</strong><span>Team members</span></article><article><small>Goals on track</small><strong>—</strong><span>Current cycle</span></article><article><small>Reviews due</small><strong>—</strong><span>Awaiting action</span></article><article><small>Feedback sent</small><strong>—</strong><span>This month</span></article></section>
<section className={s.workspace}><article className={s.team}><header><div><span>People</span><h2>My team</h2></div><a href="/performance">Open performance →</a></header><div className={s.empty}><b>👥</b><div><h3>Your team overview is ready</h3><p>Direct reports and their current progress will appear here.</p></div></div></article><aside><span>Quick actions</span><h2>Lead with clarity</h2><a href="/goals"><b>01</b> Review goals</a><a href="/performance"><b>02</b> Give feedback</a><a href="/training"><b>03</b> Plan development</a></aside></section>
</div></DashboardShell> }
export default function Page(){return <AuthGuard roles={['manager']}>{user=><Manager user={user}/>}</AuthGuard>}
