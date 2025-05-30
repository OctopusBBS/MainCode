
'use client'
import React, { useState, useEffect } from 'react';
import { formatDateToMonthDay } from '../utils/common';
import { fetchTrendingInfo,TrendingInfoType } from '../utils/api';


export function TrendingContent( { handleIdChange,handleOpenTrade }: { handleIdChange: (id: number,type:"trending" | "user") => void,handleOpenTrade: (wid:number,TradeType:0 | 1) => void }) {


  // 在 TrendingContent 组件中添加
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<TrendingInfoType[]>([]);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (pageNum: number) => {
      try {
        setLoading(true);
        // 这里替换为您的实际 API 调用
        const data = await fetchTrendingInfo(pageNum,0,1) || [];
        
        if (pageNum === 1) {
          setData(data);
        } else {
          setData(prev => [...prev, ...data]);
        }
        
        // 判断是否还有更多数据
        setHasMore(data.length === 6);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
  };
    useEffect(() => {
      const handleScroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop
          === document.documentElement.offsetHeight
        ) {
          if (!loading && hasMore) {
            setPage(prev => prev + 1);
          }
        }
      };
    
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    return (
        <main className="px-8 py-12 w-[70%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {data.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleIdChange(item.id,"trending")}>
                  <img src={item.bg_img} className="w-full h-[212px] rounded-t-lg" />
                </div>
                <div className=" justify-between items-center p-6">
                    <div className="flex items-center gap-2  font-medium cursor-pointer h-20" onClick={() => handleIdChange(item.id,"trending")}>
                    {item.title}
                    </div>
                    <div className="flex items-center gap-2 pt-4">
                       <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1  cursor-pointer"  onClick={() => handleIdChange(item.userid, "user")}>
                        <img src={item.head_img_url} alt="notify" className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-gray-500">{item.user_name}</span>
                       </div>
                       <span className="text-sm text-gray-500 bg-gray-100 rounded-lg px-2 py-1">{formatDateToMonthDay(item.create_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-4 text-gray-500 h-20">
                    {item.title}
                    </div>
                    <div className="flex items-center gap-2 pt-4 justify-between">
                    <div className="flex -space-x-2"> {/* 负间距实现重叠 */}
                      
                      {(item.holders_head_imgs||[]).map((img, index) => (
                        <img 
                         className="w-6 h-6 rounded-full border-2 border-white" 
                          src={img} 
                          />
                      ))}
                      {item.hold_num>0 && (
                        <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-2 py-1">{item.hold_num} Reward</span>
                      )}
                    </div>
                        <button 
                        onClick={() => handleOpenTrade(item.id,0)}
                        className="bg-blue-200 px-4 py-1 !rounded-button whitespace-nowrap rounded-lg text-primary font-medium h-8 w-25 p-r">
                            Reward
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
          {/* 加载状态 */}
          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
    
          {/* 没有更多数据提示 */}
          {!hasMore && data.length > 0 && (
          <div className="text-center text-gray-500 py-4">
            no more data
          </div>
          )}
        </main>
      );
};
