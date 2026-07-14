/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3.5 p-1">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-stone-900 border border-stone-800/80 rounded-2xl overflow-hidden shadow-md flex flex-col h-full animate-pulse"
        >
          {/* Mock image */}
          <div className="w-full aspect-[4/3] bg-stone-800 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-700/15 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
          </div>

          {/* Mock details */}
          <div className="p-3 flex-1 flex flex-col gap-2">
            <div className="h-2 w-1/3 bg-stone-800 rounded"></div>
            <div className="h-4 w-4/5 bg-stone-800 rounded"></div>
            <div className="h-3 w-11/12 bg-stone-800/60 rounded"></div>
            <div className="h-3 w-8/12 bg-stone-800/60 rounded mt-0.5"></div>

            <div className="mt-auto pt-3 flex items-center justify-between">
              <div className="h-4 w-1/2 bg-stone-800 rounded"></div>
              <div className="h-8 w-8 rounded-lg bg-stone-800"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SingleSkeletonLoader: React.FC = () => {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex gap-4 w-full animate-pulse">
      <div className="w-20 h-20 bg-stone-800 rounded-xl shrink-0"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-stone-800 rounded w-1/4"></div>
        <div className="h-4 bg-stone-800 rounded w-3/4"></div>
        <div className="h-3 bg-stone-800 rounded w-1/2"></div>
      </div>
    </div>
  );
};
