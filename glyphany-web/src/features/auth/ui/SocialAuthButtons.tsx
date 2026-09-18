"use client";

import React from "react";

/**
 * Social OAuth buttons: Google + GitHub.
 * SVG icons embedded directly — no external dependency needed.
 */
export function SocialAuthButtons() {
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth redirect
    console.log("Google OAuth");
  };

  const handleGitHubLogin = () => {
    // TODO: Implement GitHub OAuth redirect
    console.log("GitHub OAuth");
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2.5 h-11 px-3 bg-surface-container-low hover:bg-surface-container rounded-lg text-label-lg text-on-surface transition shadow-sm cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            fill="#EA4335"
          />
          <path
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
            fill="#4285F4"
          />
          <path
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            fill="#FBBC05"
          />
          <path
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            fill="#34A853"
          />
        </svg>
        <span>Google</span>
      </button>

      <button
        type="button"
        onClick={handleGitHubLogin}
        className="flex items-center justify-center gap-2.5 h-11 px-3 bg-surface-container-low hover:bg-surface-container rounded-lg text-label-lg text-on-surface transition shadow-sm cursor-pointer"
      >
        <svg
          className="w-4 h-4 fill-current text-on-surface"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
        <span>GitHub</span>
      </button>
    </div>
  );
}
