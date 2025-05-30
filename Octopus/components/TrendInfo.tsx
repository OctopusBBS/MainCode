
'use client'
import React, { useState, useEffect } from 'react';
import { formatDateToMonthDay } from '../utils/common';

import ReactMarkdown from 'react-markdown';

import 'react-markdown-editor-lite/lib/index.css';

type TrendInfoType = {
  id: number;
  create_time: string;
  userid: number;
  bg_img: string;
  title: string;
  markdown_content:string;
  user_head_img:string;
  user_name:string;
  // nft_address:string;
  // nft_price:number;
  // nft_total_supply:number;
  // nft_holders:number;
}

type TradesType = {
  head_img: string;
  user_name: string;
  trades_type: string;
  token_num: number;
  use_token_num: number;
  use_token_unit: string;
}

type HoldersType = {
  head_img: string;
  user_name: string;
  token_num: number;
}

export function TrendInfo( { trendId, handleIdChange,handleOpenTrade }: { trendId: number, handleIdChange: (id: number, type: "trending" | "user") => void,handleOpenTrade: (wid:number,TradeType:0 | 1) => void }) {
  const [trendTab, setTrendTab] = useState<'Trades' | 'Holders'>('Trades');

  const [trendInfo, setTrendInfo] = useState<TrendInfoType>({} as TrendInfoType);
  const [trades, setTrades] = useState<TradesType[]>([]);
  const [holders, setHolders] = useState<HoldersType[]>([]);

  const TREND_INFO = process.env.NEXT_PUBLIC_TREND_INFO || ''

  useEffect(() => {
    const fetchTrendInfo = async () => {
      try {
        // 获取用户信息
        const userStateResponse = await fetch(TREND_INFO, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ wid:trendId }),
        })
  
        if (!userStateResponse.ok) {
          throw new Error('获取信息 失败')
        }
  
        const { data } = await userStateResponse.json()

        setHolders(data.holders)
        setTrades(data.trades)
        setTrendInfo(data.trade_info)



        console.log("data.trade_info.markdown_content");
        console.log(data.trade_info.markdown_content);

      } catch (error) {
        console.error('获取用户数据失败:', error);
      }
      fetchWalurData()
    };


    fetchTrendInfo();
  }, [trendId]);

  const fetchWalurData = async () => {
    // 获取Walrus信息
    const walrusResponse = await fetch("https://agg.walrus.eosusa.io/v1/blobs/9k95lgtG9iPU8yk_wYz8m8CUY1snveemF8ypfpBLUUg", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

  if (!walrusResponse.ok) {
    throw new Error('获取 用户信息 失败')
  }
  console.log("walrusResponse:",walrusResponse)

  const TextData = await walrusResponse.text()

  console.log("walrusResponse.text:",TextData)
  }

  return (
    ////

    <main className="px-8 py-12 w-[70%] mx-auto">
      <div className=" border border-gray-200 rounded-lg">
        <div>
          <img src={trendInfo.bg_img} alt="trending" className="w-full h-[212px] rounded-t-lg" />
        </div>
        <h2 className="text-3xl font-bold cursor-pointer p-6">
          {trendInfo.title}
        </h2>
        <div className='px-6'>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg py-1 cursor-pointer" onClick={() => handleIdChange(trendInfo.userid, "user")}>
              <img src={trendInfo.user_head_img} alt="notify" className="w-8 h-8 rounded-full" />
              <span className="text-gray-500">{trendInfo.user_name}</span>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 rounded-lg px-4 py-1">{formatDateToMonthDay(trendInfo.create_time)}</span>
          </div>
        </div>
        <div className='p-6'>


        <div className='rc-md-editor' style={{ border: 'none' }}>
          <div className='editor-container'>
            <section className='section sec-html visible' style={{ border:'none'}}>
              <div className="section-container html-wrap">
                <div className="custom-html-style">
                  <ReactMarkdown>{trendInfo.markdown_content}</ReactMarkdown>
                </div>
              </div>
            </section>
          </div>
        </div>
          
        </div>
        <div className='flex  justify-between px-6 pb-10'>
          <div className='flex w-[48%] bg-gray-100 rounded-lg flex-col items-center p-4'>
            <div className='w-[60%] mt-[20px] bg-white rounded-3xl'>
              <img src={trendInfo.bg_img} alt="trending" className="w-full rounded-t-3xl" />
              <div className='m-2 font-bold text-sm line-clamp-2'>
                {trendInfo.title}
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-2">
                <img src={trendInfo.user_head_img} alt="notify" className="w-6 h-6 rounded-full" />
                <span className="text-gray-500 text-sm bg-gray-100 rounded-lg px-2 py-1 line-clamp-1 max-w-[40%]">{trendInfo.user_name}</span>
              </div>
            </div>
            <div className=" w-[60%] text-sm text-gray-500 py-4 border-b border-gray-300">
              Reward this entry as NFT and <br />
              buy the creator's KEY
            </div>
            <div className="w-[60%] text-sm text-gray-500 py-4">
              <span className='font-bold text-2xl text-black'>1 WAL </span><span>/ Key</span>
            </div>
            <div className="w-[60%] text-sm text-gray-500 pb-4 flex items-center gap-4">
              <button className="bg-blue-500 text-white rounded-lg px-7 py-3 font-bold cursor-pointer" onClick={() => handleOpenTrade(trendInfo.id,0)}>Buy</button>
              <button className="bg-blue-100 rounded-lg px-7 py-3 font-bold text-blue-500 cursor-pointer" onClick={() => handleOpenTrade(trendInfo.id,1)}>Shell</button>
            </div>
          </div>
          <div className='flex w-[48%] bg-gray-100 rounded-lg flex-col items-center p-4'>
          <div className='w-[90%] mt-[20px] rounded-3xl'>
              <div className='font-bold text-lg rounded-t-3xl'>
                Verification
              </div>
              <div className='text-sm line-clamp-2 py-4 text-sm text-gray-500'>
              This entry has been permanently stored <br />
              onchain and signed by its creator.
              </div>
              <div className="w-full items-center gap-2 rounded-lg px-2 py-2 bg-white border border-gray-300 text-sm text-gray-400 mt-10 leading-loose">
                <div className='border-b border-gray-300 py-2'>
                ARWEAVE TRANSACTION
                <br />
                E4qONE7V65J7mUv.5QpEPEazGw IkIS
                </div>
                <div className='border-b border-gray-300 py-2'>
                AUTHOR ADDRESS
                <br />
                0x547a2e8d97Dc99B.3C4FA5dd76b8ED0
                </div>
                <div className='py-2'>  
                NFT ADDRESS
                <br />
                0x08dD8F03Db36724.6b9D969b0c6B7B7
                </div>
              </div>
            </div>
            </div>
        </div>
      </div>
      <div className="w-full mx-auto p-6 bg-white rounded-lg mt-4 shadow-md border border-gray-200">
  {/* 顶部数据统计 */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="space-y-1">
      <h3 className="text-sm font-bold">Total Value in the Pool</h3>
      <p className="text-lg"><span className='text-2xl font-bold'>$0.62</span> / 1 WAL</p>
    </div>
    <div className="space-y-1">
      <h3 className="text-sm font-bold">Key Supply</h3>
      <p className="text-lg"><span className='text-2xl font-bold'>1</span>  Key</p>
    </div>
  </div>

  {/* 分割线 */}
  <div className="border-t border-gray-200 my-4"></div>

  {/* 交易记录标题 */}
  <div className="flex items-center gap-8 mb-3 border-b border-gray-200">
    <h3 className={`cursor-pointer text-sm text-gray-500 border-b-2 ${trendTab === 'Trades' ? 'border-primary text-primary' : 'border-transparent font-medium '} py-6 font-bold`} onClick={() => setTrendTab('Trades')}>Recent Trades</h3>
    <h3 className={`cursor-pointer text-sm text-gray-500 border-b-2 ${trendTab === 'Holders' ? 'border-primary text-primary' : 'border-transparent font-medium '} py-6 font-bold`} onClick={() => setTrendTab('Holders')}>Holders</h3>
  </div>

  {/* 交易记录列表 */}
  {trendTab === 'Trades' && (

<div className="space-y-3">
    {(trades || []).map((trade) => (
      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
      <div className="flex items-center space-x-2">
        <img src={trade.head_img} alt="notify" className="w-6 h-6 rounded-full" />
        <span className="font-mono text-sm">{trade.user_name}</span>
        <span className={`text-sm rounded-lg px-2 py-1 font-bold ${trade.trades_type === 'BOUGHT' ? 'bg-green-100' : 'bg-red-100'}`}>{trade.trades_type}</span>
        <span className="text-sm">{trade.token_num} share for {trade.use_token_num} {trade.use_token_unit}</span>
      </div>
    </div>
    ))}
    </div>
  )}
  {trendTab === 'Holders' && (
    <div className="space-y-3">
    {(holders || []).map((holder) => (
      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
      <div className="flex items-center space-x-2">
        <img src={holder.head_img} alt="notify" className="w-6 h-6 rounded-full" />
        <span className="font-mono text-sm">{holder.user_name}</span>
        <span className="text-sm bg-green-100 rounded-lg px-2 py-1 font-bold">Holders</span>
        <span className="text-sm">{holder.token_num} share</span>
      </div>
    </div>
    ))}
    </div>
  )}
</div>
    </main>
  );
}
