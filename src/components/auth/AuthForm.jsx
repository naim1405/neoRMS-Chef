import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui-login/input';
import { Label } from '@/components/ui-login/label';

export default function AuthForm({ onSubmit, loading, error, submitLabel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFilled = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-[#2C2C2C]">
          Email
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#999]">
            <Mail size={18} />
          </span>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 rounded-xl border border-[#FF4D4F] focus-visible:ring-2 focus-visible:ring-[#FF7F7F] focus-visible:border-[#FF7F7F] focus-visible:ring-offset-1"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-[#2C2C2C]">
          Password
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#999]">
            <Lock size={18} />
          </span>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 rounded-xl border border-[#FF4D4F] focus-visible:ring-2 focus-visible:ring-[#FF7F7F] focus-visible:border-[#FF7F7F] focus-visible:ring-offset-1"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !isFilled}
        className={`flex h-11 w-full items-center justify-center gap-2 rounded-full text-white text-sm font-medium transition-all duration-200 ${
          isFilled
            ? "bg-[#FF4D4F] hover:bg-[#FF7F7F] active:bg-[#FF4D4F] shadow-md hover:shadow-lg"
            : "bg-gray-300 cursor-not-allowed"
        } ${loading ? "opacity-80" : ""}`}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{submitLabel}</span>
      </button>
    </form>
  );
}


