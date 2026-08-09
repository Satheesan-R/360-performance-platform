'use client';
import { ProtectedActorDashboard } from '@/components/dashboards/ActorDashboard';
export default function AdminDashboardPage() { return <ProtectedActorDashboard role="admin" />; }
