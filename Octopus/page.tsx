'use client'

//import { useState, useEffect } from 'react'
// import { TaskList } from './components/TaskList'
import { Header } from './components/Header'
import { CreateContent } from './components/Create'
import { SpacesContent } from './components/Spaces'
import { TrendingContent } from './components/Trending'
import { TrendInfo } from './components/TrendInfo'
import { UserInfo } from './components/User'
import { EditProfileModal } from './components/EditProfileModal'
import { UserInfoType } from './utils/api'
import { TradeModal } from './components/TradeModal'

// import { useCurrentWallet } from '@mysten/dapp-kit'

// export default function Home() {
//   const { isConnected } = useCurrentWallet();
//   const [tasks] = useState([])
//   const [refreshCount, setRefreshCount] = useState(0);

//   const handleTaskComplete = () => {
//     setRefreshCount(prev => prev + 1); // 触发刷新
//   };

//   return (
//     <main className="min-h-screen bg-background">
//       <Header refreshTrigger={refreshCount} />
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col items-center justify-center mb-8">
//           <h1 className="text-4xl font-bold text-center mb-4">
//             完成任务赚取积分奖励
//           </h1>
//           <p className="text-xl text-gray-600 text-center mb-8">
//             {isConnected ? '选择任务开始完成' : '连接 Slush 钱包开始赚取积分'}
//           </p>
//         </div>
//         <TaskList onTaskComplete={handleTaskComplete} />
//       </div>
//     </main>
//   )
// } 



// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
import React, { useState } from 'react';

const App: React.FC = () => {

  const [currentTab, setCurrentTab] = useState<'spaces' | 'trending' | 'create'>('spaces');
  const [trendId, setTrendId] = useState<number>(0);
  const [tempUserId, setTempUserId] = useState<number>(0);
  const [userTab, setUserTab] = useState<'Content' | 'Nfts & Holders'>('Content');
  const [isOpenEditProfile, setIsOpenEditProfile] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

  const [isOpenTrade, setIsOpenTrade] = useState<boolean>(false);
  const [tradeWid, setTradeWid] = useState<number>(0);
  const [tradeType, setTradeType] = useState<0 | 1>(0);

  const handleIdChange = (id: number,type:string) => {
    setCurrentTab('trending');
    if(type=='trending'){
      setTempUserId(0);
      setTrendId(id);
    }else if(type=='user'){
      setTempUserId(id);
      setTrendId(0);
    }
  };

  const handleOpenTrade = (wid:number,TradeType:0 | 1) => {
    if(userInfo==null){
      alert('Please login first');
      return;
    }
    setTradeWid(wid);
    setTradeType(TradeType);
    setIsOpenTrade(true);
  }

  return (
    <div className="bg-white min-h-[1024px]">
      <div className="max-w-[1440px] mx-auto">
        <Header setCurrentTab={setCurrentTab} CurrentTab={currentTab} handleIdChange={handleIdChange} setUserTab={setUserTab} setIsOpenEditProfile={setIsOpenEditProfile} setUserInfo={setUserInfo} UserInfo={userInfo} />
        {currentTab === 'spaces' && <SpacesContent handleIdChange={handleIdChange} />} 
        {currentTab === 'create' && <CreateContent />}
        {currentTab === 'trending' && tempUserId==0 && trendId==0 && <TrendingContent handleIdChange={handleIdChange} handleOpenTrade={handleOpenTrade} />}
        {currentTab === 'trending' && tempUserId==0 && trendId!=0 && <TrendInfo trendId={trendId} handleIdChange={handleIdChange} handleOpenTrade={handleOpenTrade} />}
        {currentTab === 'trending' && tempUserId!=0 && trendId==0 && <UserInfo CurrentUserInfo={userInfo} tempUserId={tempUserId} userTab={userTab} setUserTab={setUserTab} setIsOpenEditProfile={setIsOpenEditProfile} handleIdChange={handleIdChange} handleOpenTrade={handleOpenTrade} />}


        {/* {currentTab === 'spaces' ? <SpacesContent /> : 
        (currentTab == 'trending' ? 
        (trendId == 0 ? 
        <TrendingContent setTrendId={setTrendId} /> : <TrendInfo trendId={trendId} /> ): <CreateContent />)} */}
        {
          userInfo && (
            <EditProfileModal 
              isOpen={isOpenEditProfile}
              onClose={() => setIsOpenEditProfile(false)}
              userInfo={userInfo}  // 需要从某处获取用户信息
            />
          )
        }

        {
          userInfo && (
            <TradeModal 
              isOpenTrade={isOpenTrade}
              onCloseTrade={() => setIsOpenTrade(false)}
              wid={tradeWid}
              userInfo={userInfo}
              TradeType={tradeType}
            />
          )
        }
      </div>
    </div>
  );
};

export default App