'use client'
import React, { useState, useEffect, useRef } from 'react';
import { WalletIcon } from '../utils/icons';
import { fetchUserInfo } from '../utils/api';
import { calculateCountdown } from '../utils/common';
import { getBalance,getCoins } from '../utils/nut';
import { 
  useConnectWallet, 
  useCurrentWallet, 
  useWallets, 
  useSuiClient,
  useDisconnectWallet,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/bcs';
export function Header( { 
  setCurrentTab,
  handleIdChange,
  CurrentTab,
  setUserTab,
  setIsOpenEditProfile,
  setUserInfo,
  UserInfo }: { 
    setCurrentTab: (tab: 'spaces' | 'trending' | 'create') => void,
    handleIdChange: (id: number,type:"trending" | "user") => void,
    CurrentTab:string,
    setUserTab:(tab:"Content" | "Nfts & Holders") => void,
    setIsOpenEditProfile:(isOpen:boolean) => void,
    setUserInfo:(UserInfo:{
      Id:number;
      head_img: string;
      username: string;
      bgImg:string;
      sui_address:string;
    } | null) => void,
    UserInfo: {
    Id:number;
    head_img: string;
    username: string;
    bgImg:string;
    sui_address:string;
  } | null}) {
  const { currentWallet, isConnected } = useCurrentWallet();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const wallets = useWallets();

  const [showDropdown, setShowDropdown] = useState(false);

  // 检查当前连接的是否为 Slush 钱包
  const isSlushWallet = currentWallet?.name?.toLowerCase().includes('slush');
  
  // 在 Header 组件中添加
  const dropdownRef = useRef<HTMLDivElement>(null);

  const client = useSuiClient();

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 领水函数
  const handleClaim = async () => {
    if (!currentWallet?.accounts[0]?.address) return;
    if (timeLeft>0) return;
  try {
    const tx = new Transaction();
    
    // 获取合约对象
    const [faucet, config, cap, clock] = tx.moveCall({
      target: `0x98fb5f5fb43eb6cae72784505914f59ac4a6414b5a212a187d2fc400e4e8db7d::nut::claim`,
      arguments: [
        tx.object("0x7bb09d139095f54303240d09cc633cf3b67e77eb13d9d614286ccc2510f45679"),  // Faucet对象ID
        tx.object("0xd2cfbc8b8b226afda93f0f199421e32d80cb8dc03e1035dbfe7bf9f697ad89a7"),  // FaucetConfig对象ID
        tx.object("0x83a7b2b4a05cfd035fb97a7c4608f086192ce61938b881a614b02907d1efe8e4"),     // Cap对象ID
        tx.object("0x6"),   // Clock对象ID
      ],
    });

    // 设置 gas 预算
    tx.setGasBudget(10000000); // 设置 gas 预算为 0.01 SUI

    // 使用 useSignAndExecuteTransaction hook 进行签名和广播
    const result = await signAndExecute(
      { 
        transaction: tx
      },
      {
        onSuccess: (success_result) => {
          console.log('object changes', success_result);
          console.log('digest', success_result.digest);
        },
        onError:(error)=>{
          console.error("领水失败2131321:",error)
        }
      }
    );
    console.log("result",result)
  } catch (error) {
    console.error('领水出错:', error);
  }
};

  const getTime = async () => {
    if (!currentWallet?.accounts[0]?.address) return;
    
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `0x98fb5f5fb43eb6cae72784505914f59ac4a6414b5a212a187d2fc400e4e8db7d::nut::get_last_claim_time`,
        arguments: [
          tx.object("0x7bb09d139095f54303240d09cc633cf3b67e77eb13d9d614286ccc2510f45679"),  // Faucet对象ID
          tx.pure.address(currentWallet.accounts[0].address)
        ]
      });

      const result = await client.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: currentWallet.accounts[0].address
      });
      
      console.log("Last claim time result:", result);

      if (result.results?.[0].returnValues?.[0][0][0]==0){//not claim
        return 0;
      }

      const lastClaimTimeValue = result?.results?.[0].returnValues?.[1][0]||[];
      if (!lastClaimTimeValue) {
        console.error('lastClaimTimeValue 为空');
        return null;
      }
      console.log("lastClaimTimeValue",lastClaimTimeValue)

      let value = BigInt(0);
      for (let i = 0; i < lastClaimTimeValue.length; i++) {
        value += BigInt(lastClaimTimeValue[i]) * BigInt(2) ** BigInt(8 * i);
      }
      console.log('u64 值:', value.toString());

      return value;
    } catch (error) {
      console.error('获取最后领水时间失败:', error);
      return null;
    }
  };

  const fetchBalances = async () => {
  if (currentWallet?.accounts[0]?.address) {
    // 获取SUI余额
    const sui = await getBalance(client, currentWallet.accounts[0].address,'0x2::sui::SUI');
    if (sui) {
      console.log("sui:",sui)
      //setSuiBalance((Number(sui.totalBalance) / 1e9).toString());
    }
    
    // 获取NUT余额
    const nut = await getCoins(client, currentWallet.accounts[0].address,'0x98fb5f5fb43eb6cae72784505914f59ac4a6414b5a212a187d2fc400e4e8db7d::nut::NUT');
    if (nut) {
      nut.data[0].coinObjectId //用户的NUT余额对象ID
      console.log("nut:",JSON.stringify(nut))
    }
  }
  };
useEffect(() => {
  fetchBalances()
  const updateCountdown = async () => {
    const result = await getTime();
    if (result==null){
      setTimeLeft(0);
      return;
    }
    if (result==0){
      setTimeLeft(0);
      return;
    }
    const now = Date.now();

    console.log("result",result)
    console.log("now",now)
    console.log("now-result",now-Number(result))

    if (now-Number(result)>24*60*60*1000){
      setTimeLeft(0);
      return;
    }else{
      console.log("Number(result)-now+5*60*1000",now-Number(result)+5*60*1000)
      setTimeLeft(24*60*60*1000-(now-Number(result)+5*60*1000));
    }
  };
  if (currentWallet?.accounts[0]?.address) {
    updateCountdown();
  }
}, [currentWallet?.accounts[0]?.address]);

// 控制倒计时
useEffect(() => {
  if (timeLeft > 0) {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          console.log("timeLeft",timeLeft)
          clearInterval(timerRef.current?timerRef.current:0);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  }

  return () => clearInterval(timerRef.current?timerRef.current:0);
}, [timeLeft]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 当钱包连接状态改变时获取用户数据
  useEffect(() => {
    console.log("isConnected",isConnected)
    if (isConnected && currentWallet?.accounts[0]?.address) {
      // 获取用户数据
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
      } else {
        fetchUserData(currentWallet.accounts[0].address);
      }
    } else {
      setUserInfo(null);
    }
  }, [isConnected, currentWallet]);

  const fetchUserData = async (addr: string) => {
    // 获取用户信息
    const userData = await fetchUserInfo(addr,0);
    if (userData!=null){
      setUserInfo(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData))
    }
  };

  const handleConnect = async () => {
    // 精确匹配（假设 Slush 钱包的 name 包含 "Slush"）
    const slushWallet = wallets.find(wallet => 
      wallet.name.toLowerCase().includes('slush')
    );

    if (!slushWallet) {
      alert('未检测到 Slush 钱包，请确保已安装插件！');
      return;
    }

    try {
      await connect({ wallet: slushWallet, silent: false });
    } catch (error) {
      console.error('连接失败:', error);
      alert('连接失败，请查看控制台');
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const userDropdown = () => (
    <div 
    ref={dropdownRef}
    style={{zIndex:1000}}
     //className={`absolute right-40 mt-2 w-60 bg-white rounded-lg shadow-lg top-20 border-2 border-gray-200 ${showDropdown ? '' : 'hidden'}`}
     className={`absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg top-16 border-2 border-gray-200 ${showDropdown ? '' : 'hidden'}`}
    >
      <div className="py-1">
        <div className="flex items-center justify-between h-20 py-2 px-4"> 
          <div className="flex items-center gap-2 h-30">
            <img src={UserInfo?.head_img} alt="logo" className="w-10 h-10" />
            <div className="text-sm font-bold">
              {UserInfo?.username}
            </div>
          </div>
        </div>

        <div 
        onClick={()=>{setShowDropdown(false);handleIdChange(UserInfo?.Id?UserInfo?.Id:0,"user");setCurrentTab("trending");setUserTab("Content")}}
        className="flex items-center justify-between h-10 py-2 px-4 hover:bg-gray-100 cursor-pointer"> 
          <div 
          className="flex items-center gap-2 h-30 cursor-pointer">
            <img src="./images/contents.png" alt="logo" className="w-5 h-5" />
            <div className="text-sm pl-2">
              Contents
            </div>
          </div>
        </div>

        <div 
          onClick={()=>{setShowDropdown(false);handleIdChange(UserInfo?.Id?UserInfo?.Id:0,"user");setCurrentTab("trending");setUserTab("Nfts & Holders")}}
          className="flex items-center justify-between h-10 py-2 px-4 hover:bg-gray-100 cursor-pointer"> 
          <div 
          className="flex items-center gap-2 h-30 cursor-pointer">
            <img src="./images/nfts.png" alt="logo" className="w-5 h-5" />
            <div className="text-sm pl-2">
              Nfts & Holdings
            </div>
          </div>
        </div>

        <div 
          onClick={()=>{
            setShowDropdown(false);
            setIsOpenEditProfile(true)
          }}
          className="flex items-center justify-between h-10 py-2 px-4 hover:bg-gray-100 cursor-pointer"> 
          <div 
          className="flex items-center gap-2 h-30 cursor-pointer">
            <img src="./images/settings.png" alt="logo" className="w-5 h-5" />
            <div className="text-sm pl-2">
              Settings
            </div>
          </div>
        </div>

        <div 
          onClick={()=>{
            setShowDropdown(false);
            setUserInfo(null);
            setCurrentTab("spaces");
            handleDisconnect()
          }}
          className="flex items-center justify-between h-10 py-2 px-4 hover:bg-gray-100 cursor-pointer"> 
          <div 
          className="flex items-center gap-2 h-30 cursor-pointer"
          >
            <img src="./images/disconnect.png" alt="logo" className="w-5 h-5" />
            <div className="text-sm pl-2">
              Disconnect
            </div>
          </div>
        </div>
        

        <div className="flex items-center justify-between h-3 py-2 px-4"> 
        </div>
      </div>
    </div>
  );

  return (
    <header className="flex items-center justify-between px-8 h-[72px] border-b border-gray-200">
      <div 
      onClick={()=>setCurrentTab("spaces")}
      className="flex items-center gap-2  cursor-pointer">
        <div>
        <img src="./images/logo.png" alt="logo" className="w-25 h-10 mr-2" />
        </div>
        <div 
        className="text-2xl font-bold"
        >
          Polly</div>
      </div>
      {CurrentTab != 'create' && (
        <>
        <nav className="flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
        <a onClick={()=>setCurrentTab("spaces")}
        href="#" 
        className={`${CurrentTab === 'spaces' ? 'text-primary font-medium border-b-2 border-primary py-6' : 'text-gray-600 hover:text-gray-900 py-6'}`}
        // className="text-primary font-medium border-b-2 border-primary py-6"
        >Spaces</a>
        <a onClick={()=>{handleIdChange(0,"trending");setCurrentTab("trending");}}
        href="#" 
        // className="text-gray-600 hover:text-gray-900 py-6"
        className={`${CurrentTab === 'trending' ? 'text-primary font-medium border-b-2 border-primary py-6' : 'text-gray-600 hover:text-gray-900 py-6'}`}
        >Trending</a>
      </nav>
        </>
      )}
      
      <div className="flex items-center gap-4">
        {isConnected ? (
          <>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 !rounded-button whitespace-nowrap">
            <i className="fa-regular fa-bell text-gray-600"><img src="./images/notify.png" alt="bell" className="w-8 h-8" /></i>
          </button>
          <div className='relative'>
          <div 
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer">
            <img src={UserInfo?.head_img} alt="avatar" className="w-10 h-10" />
          </div>
          {showDropdown && userDropdown()}
          </div>
          {CurrentTab != 'create' && (
            <>

          <button 
          onClick={handleClaim}
          className={`bg-primary text-white px-4 py-2 rounded-full !rounded-button flex items-center gap-2 whitespace-nowrap transition-colors ${timeLeft == 0 ? 'hover:bg-primary-dark' : 'text-sm'}`}>
            {timeLeft > 0 ? `Available in ${calculateCountdown(timeLeft)}` : 'Claim +5 NUT'}
          </button>
          
            <button 
          onClick={()=>setCurrentTab("create")}
          className="bg-primary text-white px-4 py-2 !rounded-button flex items-center gap-2 whitespace-nowrap hover:bg-primary-dark transition-colors">
            {/* <i className="fas fa-plus"></i>
            <span>+ Create</span> */}
            <i className="fas fa-plus"></i>
            <span className="flex items-baseline"> {/* 对齐基线 */}
              <span className="text-lg mr-1">+</span> {/* 增大 + 号并添加右边距 */}
              <span>Create</span>
            </span>
          </button>
            </>
          )}
        
          </>
        ) : (
          <button
                onClick={handleConnect}
                className="inline-flex items-center gap-3 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <WalletIcon />
                Connect Wallet
              </button>
        )}
      </div>
    </header>
  );
}