'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProfileImage from '@/components/ProfileImage';
import FormLayout from '@/components/FormLayout';
import { Session } from '@/zitadel-server';

export default function Page({ sessions }: { sessions: Session[] }) {
  const [session, setSession] = useState(sessions?.[0]);

  return (
    <div className="bg-white">
      <div className="relative bg-white">
        <nav aria-label="Top" className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="h-16 flex items-center">
              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <p>
                    <span className="sr-only">Workflow</span>
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                    />
                  </p>
                </Link>
              </div>

              <div className="ml-auto flex items-center">
                <ProfileImage setSession={(data: Session) => setSession(data)} session={session} sessions={sessions} />
              </div>
            </div>
          </div>
        </nav>
      </div>
      <FormLayout session={session} />
    </div>
  );
}
