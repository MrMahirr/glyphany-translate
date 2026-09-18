"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import { useAuth } from "../hooks/useAuth";

/* ─── Password Strength Calculation ─── */

interface StrengthResult {
  score: number; // 0-4
  label: string;
  segments: number; // Active segments out of 4
}

function calculatePasswordStrength(password: string): StrengthResult {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const clampedScore = Math.min(score, 4);

  const labels: Record<number, string> = {
    0: "Very Weak",
    1: "Weak",
    2: "Fair",
    3: "Strong",
    4: "Highly Secure",
  };

  return {
    score: clampedScore,
    label: labels[clampedScore],
    segments: clampedScore,
  };
}

/**
 * Register (Sign Up) form component.
 * Handles full name, email, password, confirm password, ToS agreement.
 * Includes password strength indicator matching the design.
 */
export function RegisterForm() {
  const { register, isLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the Terms of Service.");
      return;
    }

    try {
      await register({ fullName, email, password, passwordConfirm, acceptTerms });
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Full Name */}
      <Input
        label="Full Name"
        labelRight={
          <span className="text-label-caps text-on-surface-variant">
            Corporate / Academic
          </span>
        }
        leftIcon="badge"
        type="text"
        placeholder="Dr. Elena Rostova"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

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
        labelRight={
          <span className="text-label-caps text-secondary font-bold">
            Strong key required
          </span>
        }
        leftIcon="lock"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
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

      {/* Confirm Password */}
      <Input
        label="Confirm Password"
        leftIcon="lock_reset"
        type={showPasswordConfirm ? "text" : "password"}
        placeholder="••••••••••••"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        required
        error={error ?? undefined}
        rightAction={
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            className="text-on-surface-variant hover:text-on-surface p-1 flex items-center cursor-pointer"
          >
            <Icon
              name={showPasswordConfirm ? "visibility_off" : "visibility"}
              size={18}
            />
          </button>
        }
      />

      {/* Password Strength Indicator */}
      {password.length > 0 && (
        <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={`w-5 h-1.5 rounded-full transition-colors duration-200 ${
                    index < strength.segments
                      ? "bg-primary"
                      : "bg-secondary-fixed-dim"
                  }`}
                />
              ))}
            </div>
            <span className="text-label-caps text-on-surface">
              Entropy: {strength.label}
            </span>
          </div>
          <span className="text-label-caps text-primary">AES-256 TM</span>
        </div>
      )}

      {/* Terms of Service */}
      <label className="flex items-start gap-2.5 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded text-primary-container accent-primary-container"
        />
        <span className="text-body-sm text-on-surface-variant">
          I agree to the{" "}
          <a href="#" className="text-primary underline">
            Terms of Service
          </a>
          , strict{" "}
          <a href="#" className="text-primary underline">
            Data Non-Disclosure
          </a>
          , and{" "}
          <a href="#" className="text-primary underline">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        icon="rocket_launch"
        className="mt-2"
      >
        Create Free Account
      </Button>
    </form>
  );
}
