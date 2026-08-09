'use client';

import { useState } from 'react';
import { FiMenu, FiSearch, FiBell, FiSettings, FiChevronRight, FiUser, FiBriefcase, FiBookOpen, FiSend, FiArrowLeft } from 'react-icons/fi';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import FormField from '@/components/FormField';
import { authenticatedRequest } from '@/lib/api';
import { getToken } from '@/lib/auth';
import styles from './newEmployee.module.css';

const initialForm = {
  employeeNumber: '', firstName: '', lastName: '', personalEmail: '', workEmail: '',
  phone: '', address: '', university: '', previousCompany: '', previousJobTitle: '',
  yearsOfExperience: '', department: '', jobTitle: '', role: 'employee', JoiningDate: '',
  probationPeriod: '', manager: '',
};

function SectionIntro({ icon: Icon, title, description }) {
  return <div className={styles.sectionIntro}><span><Icon /></span><div><h2>{title}</h2><p>{description}</p></div></div>;
}

function EmployeeForm({ user }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);
    try {
      const response = await authenticatedRequest('/employees', getToken(), {
        method: 'POST', body: JSON.stringify(form),
      });
      setSuccess(response.data);
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  const initials = (user.name || user.email).split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

  return <div className={styles.shellOverride}><DashboardShell user={user}><div className={styles.page}>
    <header className={styles.topbar}>
      <button type="button" className={styles.iconButton} aria-label="Toggle menu"><FiMenu /></button>
      <div className={styles.topActions}><label className={styles.search}><FiSearch /><input type="search" placeholder="Search talent..." /></label><button type="button" className={styles.iconButton} aria-label="Notifications"><FiBell /></button><a href="/settings" className={styles.iconButton} aria-label="Settings"><FiSettings /></a><span className={styles.avatar}>{initials}</span></div>
    </header>

    <main className={styles.content}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><a href="/dashboard/hr">Directory</a><FiChevronRight /><span>New Employee</span></nav>
      <header className={styles.pageHeading}>
        <div><h1>Create Talent Profile</h1><p>Create an employee profile and send a secure account invitation.</p></div>
        <div className={styles.headingActions}><a href="/dashboard/hr" className={styles.secondaryButton}><FiArrowLeft />Cancel</a><button type="submit" form="employee-create-form" className={styles.primaryButton} disabled={loading}><FiSend />{loading ? 'Creating employee…' : 'Create & Send Mail'}</button></div>
      </header>

      {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}
      {success && <div className={`${styles.alert} ${styles.success}`}><FiSend /><div><strong>Employee created successfully</strong><span>The activation link was sent to {success.employee.workEmail}.</span></div></div>}

      <form id="employee-create-form" className={styles.form} onSubmit={submit}>
        <section className={styles.formSection}>
          <SectionIntro icon={FiUser} title="Personal Details" description="Basic identification, contact, education, and previous experience information." />
          <div className={styles.formCard}><div className={styles.formGrid}>
            <FormField label="First name" name="firstName" value={form.firstName} onChange={update} placeholder="e.g. John" required />
            <FormField label="Last name" name="lastName" value={form.lastName} onChange={update} placeholder="e.g. Doe" required />
            <FormField label="Personal email" name="personalEmail" type="email" value={form.personalEmail} onChange={update} placeholder="john.doe@example.com" />
            <FormField label="Phone number" name="phone" type="tel" value={form.phone} onChange={update} placeholder="+94 77 000 0000" />
            <div className={styles.fullWidth}><FormField label="Address (optional)" name="address" value={form.address} onChange={update} placeholder="Residential address" /></div>
            <FormField label="University (optional)" name="university" value={form.university} onChange={update} placeholder="University name" />
            <FormField label="Years of experience (optional)" name="yearsOfExperience" value={form.yearsOfExperience} onChange={update} placeholder="e.g. 4" />
            <FormField label="Previous company (optional)" name="previousCompany" value={form.previousCompany} onChange={update} placeholder="Previous employer" />
            <FormField label="Previous job title (optional)" name="previousJobTitle" value={form.previousJobTitle} onChange={update} placeholder="Previous position" />
          </div></div>
        </section>

        <section className={styles.formSection}>
          <SectionIntro icon={FiBriefcase} title="Employment Details" description="Define the employee’s organizational placement and reporting information." />
          <div className={styles.formCard}><div className={styles.formGrid}>
            <FormField label="Employee number" name="employeeNumber" value={form.employeeNumber} onChange={update} placeholder="EMP-001" required />
            <FormField label="Work email" name="workEmail" type="email" value={form.workEmail} onChange={update} placeholder="john@company.com" required />
            <FormField label="Job title" name="jobTitle" value={form.jobTitle} onChange={update} placeholder="e.g. Senior Software Engineer" />
            <FormField label="Department" name="department" value={form.department} onChange={update} placeholder="e.g. Engineering" />
            <FormField label="Manager" name="manager" value={form.manager} onChange={update} placeholder="Manager name or email" />
            <label className="field"><span>Account role</span><select name="role" value={form.role} onChange={update}><option value="employee">Employee</option><option value="manager">Manager</option></select></label>
          </div></div>
        </section>

        <section className={styles.formSection}>
          <SectionIntro icon={FiBookOpen} title="Contract & Status" description="Employment start date and probation scheduling information." />
          <div className={styles.formCard}><div className={styles.formGrid}>
            <FormField label="Joining date" name="JoiningDate" type="date" value={form.JoiningDate} onChange={update} />
            <FormField label="Probation period" name="probationPeriod" value={form.probationPeriod} onChange={update} placeholder="e.g. 3 months" />
          </div><div className={styles.invitationNote}><FiSend /><p><strong>Account invitation</strong><span>An activation link will be sent to the employee’s work email after creation.</span></p></div></div>
        </section>

        <footer className={styles.formFooter}><a href="/dashboard/hr" className={styles.secondaryButton}>Cancel</a><button className={styles.primaryButton} disabled={loading}><FiSend />{loading ? 'Creating employee…' : 'Create employee & send invitation'}</button></footer>
      </form>
    </main>
  </div></DashboardShell></div>;
}

export default function NewEmployeePage() {
  return <AuthGuard roles={['hr', 'admin']}>{user => <EmployeeForm user={user} />}</AuthGuard>;
}
