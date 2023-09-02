'use client';

import React from 'react';

export default function Page({ session }: any) {
  console.log('session', session);

  const user = {
    loginName: session?.factors?.user?.loginName,
    displayName: session?.factors?.user?.displayName,
    orgId: session?.factors?.user?.organisationId,
    userId: session?.factors?.user?.id,
  };

  return (
    <div className="flex items-center justify-center w-full">
      <form className="mt-8">
        <div className="space-y-12">
          <div className="grid gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 grid-cols-2">
            <div className="col-span-full mt-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* <div className="col-span-full">
                <label htmlFor="first-name" className="block text-sm font-large leading-6 text-gray-900">
                  OrgId: {user.orgId}
                </label>
              </div> */}

              {/* <div className="col-span-full">
                <label htmlFor="first-name" className="block text-sm font-large leading-6 text-gray-900">
                  userId: {user.userId}
                </label>
              </div> */}

              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={user.loginName || ''}
                    disabled={true}
                    type="text"
                    autoComplete="given-name"
                    className="bg-gray-100 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Display name
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={user.displayName || ''}
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
