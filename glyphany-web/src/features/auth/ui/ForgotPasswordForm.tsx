"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 shadow-sm">
          <Icon name="mark_email_read" size={32} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-headline-sm font-bold text-on-surface mb-2">Check your inbox</h3>
        <p className="text-body-md text-on-surface-variant mb-8 max-w-sm">
          We have sent a password reset link to <span className="font-semibold text-on-surface">{email}</span>. 
          Please check your spam folder if you don't see it.
        </p>
        <Link href="/login" className="w-full">
          <Button variant="primary" fullWidth>
            Return to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full animate-fade-in mt-6">
      <div className="text-center mb-2">
        <h2 className="text-headline-sm font-bold text-on-surface mb-1">Reset your password</h2>
        <p className="text-body-sm text-on-surface-variant">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <Input
        label="Work Email Address"
        id="email"
        type="email"
        placeholder="alan.turing@quantum.org"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon="mail"
        disabled={isSubmitting}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={!email || isSubmitting}
        loading={isSubmitting}
      >
        Send Reset Link
      </Button>

      <div className="text-center mt-2">
        <Link href="/login" className="text-label-md text-primary hover:underline inline-flex items-center gap-1">
          <Icon name="arrow_back" size={16} />
          <span>Back to Login</span>
        </Link>
      </div>
    </form>
  );
}
