'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import FormField from '@/components/FormField';
import { authenticatedRequest } from '@/lib/api';
import { getToken } from '@/lib/auth';

const initialForm = {
  employeeNumber: '', firstName: '', lastName: '', personalEmail: '', workEmail: '',
  phone: '', address: '', university: '', previousCompany: '', previousJobTitle: '',
  yearsOfExperience: '', department: '', jobTitle: '', role: 'employee', JoiningDate: '',
  probationPeriod: '', manager: '',
};

function EmployeeForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
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

  return (
    <section className="dashboard-content narrow">
      <div className="page-heading">
        <div><span className="eyebrow">People</span><h1>Add a new employee</h1><p>Create their employee profile and send a secure account invitation.</p></div>
        <a href="/dashboard/hr" className="button button-ghost">Back to dashboard</a>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success invitation-result"><div><strong>Employee created successfully</strong><span>The activation link was sent to {success.employee.workEmail}.</span></div></div>}

      <form className="employee-form" onSubmit={submit}>
        <div className="form-section">
          <div><span>01</span><h2>Personal details</h2><p>Basic information used across the employee profile.</p></div>
          <div className="form-grid">
            <FormField label="First name" name="firstName" value={form.firstName} onChange={update} required />
            <FormField label="Last name" name="lastName" value={form.lastName} onChange={update} required />
            <FormField label="Personal email" name="personalEmail" type="email" value={form.personalEmail} onChange={update} />
            <FormField label="Phone number" name="phone" type="tel" value={form.phone} onChange={update} placeholder="+94 77 000 0000" />
            <FormField label="Address (optional)" name="address" value={form.address} onChange={update} />
            <FormField label="University (optional)" name="university" value={form.university} onChange={update} />
            <FormField label="Previous company (optional)" name="previousCompany" value={form.previousCompany} onChange={update} />
            <FormField label="Previous job title (optional)" name="previousJobTitle" value={form.previousJobTitle} onChange={update} />
            <FormField label="Years of experience (optional)" name="yearsOfExperience" value={form.yearsOfExperience} onChange={update} />
          </div>
        </div>

        <div className="form-section">
          <div><span>02</span><h2>Employment details</h2><p>Information that defines their place in the organization.</p></div>
          <div className="form-grid">
            <FormField label="Employee number" name="employeeNumber" value={form.employeeNumber} onChange={update} placeholder="EMP-001" required />
            <FormField label="Work email" name="workEmail" type="email" value={form.workEmail} onChange={update} required />
            <FormField label="Joining date" name="JoiningDate" type="date" value={form.JoiningDate} onChange={update} />
            <FormField label="Probation period" name="probationPeriod" value={form.probationPeriod} onChange={update} />
            <FormField label="Manager" name="manager" value={form.manager} onChange={update} />
            <FormField label="Job title" name="jobTitle" value={form.jobTitle} onChange={update} />
            <FormField label="Department" name="department" value={form.department} onChange={update} />
            <label className="field"><span>Account role</span><select name="role" value={form.role} onChange={update}><option value="employee">Employee</option><option value="manager">Manager</option></select></label>
          </div>
        </div>

        <div className="form-actions">
          <p>An activation link will be sent to the employee's work email.</p>
          <button className="button button-primary" disabled={loading}>{loading ? 'Creating employee…' : 'Create employee & send invitation'}</button>
        </div>
      </form>
    </section>
  );
}

export default function NewEmployeePage() {
  return <AuthGuard roles={['hr', 'admin']}>{(user) => <DashboardShell user={user}><EmployeeForm /></DashboardShell>}</AuthGuard>;
}
