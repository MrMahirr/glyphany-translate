"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import { useAuth } from "../hooks/useAuth";

/**
 * Login form component.
 * Handles email/password login with remember me and forgot password link.
 * Single Responsibility: Only login form rendering and submission.
 */
export function LoginForm() {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password, rememberMe });
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Email */}
      <Input
        label="Work Email"
        labelRight={
          <span className="text-label-caps text-primary">
            Single Sign-On Supported
          </span>
        }
        leftIcon="mail"
        type="email"
        placeholder="name@organization.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Password */}
      <Input
        label="Password"
        leftIcon="lock"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={error ?? undefined}
        rightAction={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-on-surface-variant hover:text-on-surface p-1 flex items-center cursor-pointer"
          >
            <Icon
              name={showPassword ? "visibility_off" : "visibility"}
              size={18}
            />
          </button>
        }
      />

      {/* Remember / Forgot */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-primary-container accent-primary-container"
          />
          <span className="text-label-lg text-on-surface-variant select-none">
            Remember 30 days
          </span>
        </label>
        <Link
          href="/forgot-password"
          className="text-label-md text-primary hover:underline hover:text-primary-container transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        icon="arrow_forward"
        className="mt-2"
      >
        Log in to Workspace
      </Button>
    </form>
  );
}
