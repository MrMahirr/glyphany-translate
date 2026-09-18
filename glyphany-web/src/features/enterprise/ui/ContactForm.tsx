"use client";

import React, { useState } from "react";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 sm:p-12 text-center animate-fade-in shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
          <Icon name="check_circle" size={32} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-3">Message Received</h3>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto mb-6">
          Thank you for reaching out. Our enterprise team will get back to you within 24 hours.
        </p>
        <Button variant="primary" onClick={() => setIsSuccess(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input 
          id="firstName"
          label="First Name" 
          placeholder="Alan" 
          required 
          disabled={isSubmitting}
        />
        <Input 
          id="lastName"
          label="Last Name" 
          placeholder="Turing" 
          required 
          disabled={isSubmitting}
        />
      </div>

      <Input 
        id="email"
        type="email"
        label="Work Email" 
        placeholder="alan@organization.com" 
        required 
        leftIcon="mail"
        disabled={isSubmitting}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiryType" className="font-label-md text-label-md text-on-surface">
          Inquiry Type
        </label>
        <div className="relative">
          <select 
            id="inquiryType"
            className="w-full h-[44px] px-3 bg-surface-container-low border border-outline-variant text-on-surface rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none disabled:opacity-50"
            required
            disabled={isSubmitting}
          >
            <option value="">Select a topic...</option>
            <option value="sales">Enterprise Pricing & Sales</option>
            <option value="support">Technical Support (VPC / API)</option>
            <option value="security">Security & SOC2 Auditing</option>
            <option value="other">Other Inquiry</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
            <Icon name="expand_more" size={20} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="font-label-md text-label-md text-on-surface">
          Message
        </label>
        <textarea 
          id="message"
          rows={4}
          placeholder="Tell us about your organization's translation needs..."
          className="w-full p-3 bg-surface-container-low border border-outline-variant text-on-surface rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50"
          required
          disabled={isSubmitting}
        ></textarea>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          fullWidth 
          loading={isSubmitting}
          icon="send"
        >
          Submit Inquiry
        </Button>
      </div>
      
      <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-2">
        By submitting, you agree to our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
