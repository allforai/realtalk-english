'use client';

import { LoginForm } from '@/components/auth/LoginForm';

/**
 * /admin/login -- S037 Login page.
 * Provenance: REQ-009, design.md Section 2.1
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">RealTalk English</h1>
          <p className="mt-2 text-sm text-gray-600">Admin Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
