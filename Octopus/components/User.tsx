
'use client'
import React, { useState, useEffect } from 'react';
import { fetchUserInfo,fetchTrendingInfo,UserInfoType,TrendingInfoType } from '../utils/api';
import { formatDateToMonthDay } from '../utils/common';

export function UserInfo( { 
  handleIdChange,
  userTab,
  setUserTab,
  setIsOpenEditProfile,
  CurrentUserInfo,
  tempUserId,
  handleOpenTrade,
}: { 
  handleIdChange: (id: number,type:"trending" | "user") => void,
  userTab:string,
  setUserTab:(tab:"Content" | "Nfts & Holders") => void,
  setIsOpenEditProfile:(isOpen:boolean) => void,
  CurrentUserInfo: UserInfoType | null,   
  tempUserId:number,
  handleOpenTrade: (wid:number,TradeType:0 | 1) => void
}) {


  // 分页状态
  const [contentPage, setContentPage] = useState(1);
  const [nftPage, setNftPage] = useState(1);
  const [hasMoreContent, setHasMoreContent] = useState(true);
  const [hasMoreNft, setHasMoreNft] = useState(true);
  const [loading, setLoading] = useState(false);

  const [UserInfo, setUserInfo] = useState<UserInfoType | null>(null);

  const [userContentData, setUserContentData] = useState<TrendingInfoType[]>([]);
  const [userNftData, setUserNftData] = useState<TrendingInfoType[]>([]);

  useEffect(() => {
    console.log("tempUserId",tempUserId)
    if(tempUserId!=0  && CurrentUserInfo?.Id!=tempUserId){
      setUserTab("Content");
      fetchUserData();
    }else{
      setUserInfo(CurrentUserInfo);
    }
  }, [tempUserId]);

  const fetchUserData = async () => {
    const userInfo = await fetchUserInfo('',tempUserId);
    if (userInfo!=null){
      setUserInfo(userInfo);
    }
  }

  const fetchUserContentData = async (page: number) => {
    setLoading(true);
    const data = await fetchTrendingInfo(page,tempUserId, 2) || [];
    if (page === 1) {
        setUserContentData(data);
    } else {
        setUserContentData(prev => [...prev, ...data]);
    }
    setHasMoreContent(data.length === 6); // 假设每页6条数据
    setLoading(false);
  }
  const fetchUserNftData = async (page: number) => {
    setLoading(true);
    const data = await fetchTrendingInfo(page,tempUserId, 3) || [];
    if (page === 1) {
       setUserNftData(data);
    } else {
       setUserNftData(prev => [...prev, ...data]);
    }
    setHasMoreNft(data.length === 6);
    setLoading(false);
  }

  useEffect(() => {
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop
            === document.documentElement.offsetHeight
        ) {
            if (!loading) {
                if (userTab === 'Content' && hasMoreContent) {
                    setContentPage(prev => prev + 1);
                } else if (userTab === 'Nfts & Holders' && hasMoreNft) {
                    setNftPage(prev => prev + 1);
                }
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, [loading, hasMoreContent, hasMoreNft, userTab]);

useEffect(() => {
  if (contentPage > 1) {
      fetchUserContentData(contentPage);
  }
}, [contentPage]);

useEffect(() => {
  if (nftPage > 1) {
      fetchUserNftData(nftPage);
  }
}, [nftPage]);

useEffect(() => {
  setContentPage(1);
  setNftPage(1);
  setHasMoreContent(true);
  setHasMoreNft(true);
  if (userTab === 'Content') {
      fetchUserContentData(1);
  } else {
      fetchUserNftData(1);
  }
}, [userTab]);

  return (
    <main className="mx-auto">
    <div className="min-h-[1024px] bg-white">
      {/* 顶部背景横幅 */}
      <div className="relative h-[300px]">
        <div 
          className="w-full h-full bg-cover bg-center  bg-gray-100"
          style={{
            backgroundImage: `url(${UserInfo?.bgImg})`
          }}
        />
        
        {/* 头像 */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div 
          style={{
            backgroundImage: `url(${UserInfo?.head_img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="w-24 h-24 rounded-full border-4 border-white overflow-hidden  bg-gray-100">
            {/* <img 
              src={UserInfo?.head_img}
              className="w-full h-full object-cover"
            /> */}
          </div>
        </div>
      </div>

      {/* 个人信息 */}
      <div className="mt-16 text-center bg-white">
        <h1 className="text-2xl font-bold mb-2">{UserInfo?.username}</h1>
        {CurrentUserInfo?.Id==tempUserId && (
          <button 
          onClick={() => setIsOpenEditProfile(true)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap !rounded-button text-sm">
          Edit Profile
        </button>
        )}
      </div>

      {/* 导航栏 */}
      <div className=" mx-auto mt-8 border-b border-gray-200">
        <div className="flex items-center justify-center space-x-8">
          <div className="relative pb-4 cursor-pointer" onClick={() => setUserTab('Content')}>
            <span className={`${userTab=='Content' ? 'text-blue-600' : 'text-gray-500'}`}>Content</span>
            <div className={`${userTab=='Content' ? 'absolute bottom-0 left-0 w-full h-0.5 bg-blue-600' : 'hidden'}`}></div>
          </div>
          {CurrentUserInfo?.Id==tempUserId && (
            <div className="relative pb-4 cursor-pointer" onClick={() => setUserTab('Nfts & Holders')}>
            <span className={`${userTab=='Nfts & Holders' ? 'text-blue-600' : 'text-gray-500'}`}>Nfts & Holders</span>
            <div className={`${userTab=='Nfts & Holders' ? 'absolute bottom-0 left-0 w-full h-0.5 bg-blue-600' : 'hidden'}`}></div>
          </div>
          )}
        </div>
      </div>

      {/* NFT 卡片列表 */}
      {userTab=='Content' && (
        <div className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 w-[70%] mx-auto">
        {/* 卡片1 */}
        {(userContentData||[]).map((item) => (
            <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="h-[240px] bg-cover bg-center" style={{
            backgroundImage: `url(${item.bg_img})`
          }} />
          <div className="p-6">
          <div className="flex items-center gap-2  font-medium cursor-pointer h-20" onClick={() => handleIdChange(item.id,"trending")}>
                    {item.title}
                    </div>
            <div className="flex items-center gap-2 pt-4">
                       <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                        <img src={item.head_img_url} alt="notify" className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-gray-500">{item.user_name}</span>
                       </div>
                       <span className="text-sm text-gray-500 bg-gray-100 rounded-lg px-2 py-1">{formatDateToMonthDay(item.create_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-4 text-gray-500 h-20">
                    {item.title}
                    </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                {(item.holders_head_imgs||[]).map((img, index) => (
                        <img 
                         className="w-6 h-6 rounded-full border-2 border-white" 
                          src={img} 
                          />
                      ))}
                      {item.hold_num>0 && (
                        <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-2 py-1">{item.hold_num} Holders</span>
                      )}
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="px-6 py-2 text-sm font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap !rounded-button cursor-pointer" onClick={()  => handleOpenTrade(item.id,0)}>
                  Buy
                </button>
                <button className="px-6 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap !rounded-button cursor-pointer" onClick={() => handleOpenTrade(item.id,1)}>
                  Sell
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
        ))}
      </div>
      )}
      {userTab=='Content' && loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {userTab=='Content' && !hasMoreContent && userContentData.length >= 0 && (
        <div className="text-center text-gray-500 py-4">
            no more data
        </div>
      )}



      {userTab=='Nfts & Holders' && (
        <div className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 w-[70%] mx-auto">
        {/* 卡片1 */}
        {(userNftData||[]).map((item) => (
            <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="h-[240px] bg-cover bg-center" style={{
            backgroundImage: `url(${item.bg_img})`
          }} />
          <div className="p-6">
          <div className="flex items-center gap-2  font-medium cursor-pointer h-20" onClick={() => handleIdChange(item.id,"trending")}>
                    {item.title}
                    </div>
            <div className="flex items-center gap-2 pt-4">
                       <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                        <img src={item.head_img_url} alt="notify" className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-gray-500">{item.user_name}</span>
                       </div>
                       <span className="text-sm text-gray-500 bg-gray-100 rounded-lg px-2 py-1">{formatDateToMonthDay(item.create_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-4 text-gray-500 h-20">
                    {item.title}
                    </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                {(item.holders_head_imgs||[]).map((img, index) => (
                        <img 
                         className="w-6 h-6 rounded-full border-2 border-white" 
                          src={img} 
                          />
                      ))}
                      {item.hold_num>0 && (
                        <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-2 py-1">{item.hold_num} Holders</span>
                      )}
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="px-6 py-2 text-sm font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap !rounded-button">
                  Buy
                </button>
                <button className="px-6 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap !rounded-button">
                  Sell
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
        ))}
      </div>
      )}
      {userTab=='Nfts & Holders' && loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {userTab=='Nfts & Holders' && !hasMoreNft && userNftData.length >= 0 && (
        <div className="text-center text-gray-500 py-4">
            no more data
        </div>
      )}
      
    </div>
    
    </main>
  );
}


// {isOpenEditProfile && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center">
//     {/* 灰色遮罩层 */}
//     <div 
//       className="absolute inset-0 bg-gray-800 bg-opacity-50"
//       onClick={() => setIsOpenEditProfile(false)}
//     ></div>

//     {/* 弹窗内容 */}
//     <div className="relative z-50 bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//       <div className="text-gray-500 text-sm text-center pb-4">Edit Profile</div>
//       <div className="relative h-[150px]">
//           <div 
//           className="w-full h-full bg-cover bg-center bg-gray-100"
//           style={{
//           backgroundImage: "url('./images/b1e1fb1ac8447e57fc6d87ecc04a384b.jpg')"
//           }}
//           />
//           <div className="absolute inset-0 flex items-top justify-end cursor-pointer pt-2 pr-2">
//                       <img src="./images/upload.png" alt="notify" className="w-6 h-6 rounded-full" />
//                   </div>
  
//           {/* 头像 */}
//           <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
//               <div 
//               style={{
//                   backgroundImage: `url(${userInfo.head_img})`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center'
//               }}
//               className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100">
                 
//                   <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
//                       <img src="./images/upload.png" alt="notify" className="w-6 h-6 rounded-full" />
//                   </div>
//               </div>
//           </div>
//       </div>
//       <div className="items-center gap-2 pt-14 pb-2 text-2xl font-medium text-center">
//           0x61
//       </div>
//       <div className="items-center gap-2 text-2xl font-medium">
//           Name
//       </div>
//       <div className="text-gray-500 text-sm">
//       What do you want to be known as?
//       </div>
//       <div className="items-center gap-2 py-4">
//           <input type="text" className="w-full rounded-lg p-2 border border-gray-300" />
//       </div>
      
//       <button className="bg-primary text-white px-4 py-1 rounded-lg w-full h-12 font-medium text-lg hover:bg-primary-dark transition-colors">Confirm</button>
      
//     </div>
//   </div>
// )}