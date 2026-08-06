'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Brand from '@/components/Brand';
import FormField from '@/components/FormField';
import { apiRequest } from '@/lib/api';
import { dashboardFor, saveSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      saveSession(data.token, data.user);
      router.push(dashboardFor(data.user.role));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <Brand light />
        <div className="story-copy">
          <span className="eyebrow light">Better teams start with clarity</span>
          <h1>Turn every conversation into meaningful growth.</h1>
          <p>Goals, feedback, and performance insights—all in one place for your people.</p>
        </div>
        <div className="story-stat"><strong>360°</strong><span>A complete view of employee performance</span></div>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={submit}>
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in to your workspace</h2>
          <p>Use the email address connected to your employee account.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <FormField
            label="Work email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            placeholder="name@company.com"
            autoComplete="email"
            required
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <button className="button button-primary button-block" disabled={loading}>
            {loading ? <><span className="spinner small" />Signing in…</> : 'Sign in'}
          </button>
          <p className="form-footnote">New employee? Use the activation link sent to your email.</p>
        </form>
      </section>
    </main>
  );
}
