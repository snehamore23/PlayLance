import React from 'react';

const Loading = ({ text = 'Loading PayLance...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        <span className="absolute inset-0 flex items-center justify-center text-xs">🚀</span>
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse">
        {text}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-800">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default Loading;
