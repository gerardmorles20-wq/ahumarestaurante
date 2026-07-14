/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PhoneContainerProps {
  children: React.ReactNode;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#F59E0B] selection:text-[#0D0D0D] items-center justify-start relative">
      {/* Premium ambient glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#161616]/40 via-[#050505]/95 to-black -z-10 overflow-hidden pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#F59E0B]/5 to-transparent blur-3xl opacity-30 pointer-events-none"></div>

      {/* Main Container: Full viewport height, beautifully centered with max-width on desktop, fully fluid on mobile */}
      <div className="w-full max-w-lg min-h-screen bg-[#0D0D0D] shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:border-x sm:border-white/10 flex flex-col relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};
