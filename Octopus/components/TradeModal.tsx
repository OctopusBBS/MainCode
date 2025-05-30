// app/components/TradeModalProps.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { UserInfoType } from '../utils/api';
import { Transaction } from '@mysten/sui/transactions';
import { getBalance } from '../utils/nut';

import { 
  useConnectWallet, 
  useCurrentWallet, 
  useWallets, 
  useSuiClient,
  useDisconnectWallet,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';

type TradeModalProps = {
  isOpenTrade: boolean;
  onCloseTrade: () => void;
  wid:number;
  userInfo:UserInfoType;
  TradeType:number;// 0:buy 1:sell
};



export function TradeModal({ isOpenTrade, onCloseTrade,wid,userInfo,TradeType }: TradeModalProps) {
  const [tradeNum, setTradeNum] = useState<number>(0);
  useEffect(() => {
    setTradeNum(0);
  }, [wid]);

  if (!isOpenTrade) return null;

  const client = useSuiClient();

  const handleReward = async () => {
    // 获取NUT余额
    const nut = await getBalance(client,userInfo.sui_address,'0x98fb5f5fb43eb6cae72784505914f59ac4a6414b5a212a187d2fc400e4e8db7d::nut::NUT');
    if (nut) {
      console.log("nut:",nut)
    }
    
    // try {
    //   const tx = new Transaction();
    //   tx.moveCall({
    //     target: `${packageId}::nut::tip`,
    //     arguments: [
    //       tx.object(tipPoolId),  // TipPool对象ID
    //       tx.object(nutBalanceId),  // 用户的NUT余额对象ID
    //       tx.pure(to, "address"),  // 接收者地址
    //       tx.pure(amount, "u64"),  // 打赏金额
    //       tx.object("0x6")  // Clock对象ID
    //     ]
    //   });
  
    //   // 设置 gas 预算
    //   tx.setGasBudget(10000000);
  
    //   // 执行交易
    //   const result = await signAndExecute({ transaction: tx });
    //   console.log("Tip result:", result);
      
    //   return result;
    // } catch (error) {
    //   console.error('打赏失败:', error);
    //   throw error;
    // }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* 灰色遮罩层 */}
    <div 
      className="absolute inset-0 bg-gray-800 bg-opacity-50"
      onClick={() => onCloseTrade()}
    ></div>

    {/* 弹窗内容 */}
    <div className="relative z-50 bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <div className="text-gray-500 text-sm">Give Reward NUT（{userInfo.username}）</div>
      <div className="flex items-center gap-2 pt-4 pb-4 text-2xl">
          
      </div>
      <div className="text-gray-500 text-sm">Options</div>
      <div className="flex items-center gap-2 pt-4">
          <div className="border border-gray-300 rounded-lg px-2 py-1 w-[25%] h-10 flex items-center justify-center hover:border-primary cursor-pointer border-2" onClick={() => setTradeNum(1)}>1</div>
          <div className="border border-gray-300 rounded-lg px-2 py-1 w-[25%] h-10 flex items-center justify-center hover:border-primary cursor-pointer border-2" onClick={() => setTradeNum(5)}>5</div>
          <div className="border border-gray-300 rounded-lg px-2 py-1 w-[25%] h-10 flex items-center justify-center hover:border-primary cursor-pointer border-2" onClick={() => setTradeNum(10)}>10</div>
          <div className="border border-gray-300 rounded-lg px-2 py-1 w-[25%] h-10 flex items-center justify-center hover:border-primary cursor-pointer border-2" onClick={() => setTradeNum(20)}>20</div>
      </div>
      <div className="text-gray-500 text-sm pt-4">Options</div>
      <div className="flex items-center gap-2 pt-4">
          <input type="text" className="w-full rounded-lg p-2 bg-gray-100" value={tradeNum} onChange={(e) => setTradeNum(Number(e.target.value))} />
          <span className="absolute right-6 px-2 bg-gray-100 rounded-r-md border-gray-300">
              NUT
          </span>
      </div>
      <div className="text-gray-500 pt-6 text-right pb-6">Pay Total：{tradeNum} NUT</div>
      <button 
      onClick={handleReward}
      className="bg-primary text-white px-4 py-1 rounded-lg w-full h-12 font-bold text-lg hover:bg-primary-dark transition-colors">Confirm</button>
    </div>
  </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* 灰色遮罩层 */}
    <div 
      className="absolute inset-0 bg-gray-800 bg-opacity-50"
      onClick={() => onCloseTrade()}
    ></div>

    {/* 弹窗内容 */}
    <div className="relative z-50 bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <div className="text-gray-500 text-sm">{TradeType==0?'Buy':'Sell'} Key（{userInfo.username}）</div>
      <div className="flex items-center gap-2 pt-4 pb-4 text-2xl">
          <span className="font-bold">1 Wallet</span>for
          <span className="font-bold">1 Key</span>
      </div>
      <div className="text-gray-500 text-sm">Options</div>
      <div className="flex items-center gap-2 pt-4">
          <div className="border border-gray-300 rounded-lg px-2 py-1 w-[25%] h-10 flex items-center justify-center hover:border-primary cursor-pointer border-2" onClick={() => setTradeNum(1)}>1</div>
          <div className="border border-gray-300 rounded-lg px-2 py-1 w-[25%] h-10 flex items-center justify-center hover:border-primary cursor-pointer border-2" onClick={() => setTradeNum(5)}>5</div>
          <div className="border border-gray-300 rounded-lg px-2 py-1 w-[25%] h-10 flex items-center justify-center hover:border-primary cursor-pointer border-2" onClick={() => setTradeNum(10)}>10</div>
          <div className="border border-gray-300 rounded-lg px-2 py-1 w-[25%] h-10 flex items-center justify-center hover:border-primary cursor-pointer border-2" onClick={() => setTradeNum(20)}>20</div>
      </div>
      <div className="text-gray-500 text-sm pt-4">Options</div>
      <div className="flex items-center gap-2 pt-4">
          <input type="text" className="w-full rounded-lg p-2 bg-gray-100" value={tradeNum} />
          <span className="absolute right-6 px-2 bg-gray-100 rounded-r-md border-gray-300">
              Key
          </span>
      </div>
      <div className="text-gray-500 pt-6 text-right pb-6">Pay Total：1WAL</div>
      <button className="bg-primary text-white px-4 py-1 rounded-lg w-full h-12 font-bold text-lg hover:bg-primary-dark transition-colors">Confirm</button>
      <div className="text-gray-500 text-sm pt-4 pb-4">Share price will go up when more people buy. <br />
      And you can sell it anytime.</div>
      <div className="text-gray-500 text-sm pb-4 flex items-center gap-2">
          <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-gray-400 text-gray-600">
            <span className="text-sm font-medium">?</span>
          </div>
          <div className="text-gray-500 text-sm">Total Supply: 80 Key</div>
      </div>
    </div>
  </div>
  );
}