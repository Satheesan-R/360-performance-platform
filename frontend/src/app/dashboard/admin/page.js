'use client';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import s from './admin.module.css';
function Admin({user}) { return <DashboardShell user={user}><div className={s.page}>
<header className={s.header}><div><span>Administration</span><h1>Platform overview</h1><p>Monitor access, organization health, and performance operations.</p></div><a href="/settings">Platform settings</a></header>
<section className={s.health}><div><b>●</b><p><small>System status</small><strong>Workspace is ready</strong></p></div><span>Core authentication services are available.</span></section>
<section className={s.cards}><article><b>👤</b><small>Active users</small><strong>—</strong><p>Across all roles</p></article><article><b>⌁</b><small>Administrators</small><strong>—</strong><p>Platform access</p></article><article><b>◫</b><small>Review cycles</small><strong>—</strong><p>Active now</p></article></section>
<section className={s.grid}><article><div><span>Access control</span><h2>People and permissions</h2><p>Create employee accounts and keep role access organized.</p></div><a href="/hr/employees/new">Add an employee</a></article><aside><span>Administration activity</span><h2>Recent changes</h2><div><b>✓</b><p><strong>No pending actions</strong><small>System events will appear here.</small></p></div></aside></section>
</div></DashboardShell> }
export default function Page(){return <AuthGuard roles={['admin']}>{user=><Admin user={user}/>}</AuthGuard>}
