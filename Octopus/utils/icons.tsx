import React from 'react';

export const WalletIcon: React.FC = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="w-4 h-4 text-[rgba(255,255,255,0.76)] inline-block"
    >
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
);

// // 添加一个包装组件
// export const WalletButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
//     <button 
//         onClick={onClick}
//         className="inline-flex items-center gap-3 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
//     >
//         <WalletIcon />
//         <span className="whitespace-nowrap text-sm">连接钱包</span>
//     </button>
// ); 