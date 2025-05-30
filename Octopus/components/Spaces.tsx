
'use client'
import React, { useState, useEffect } from 'react';

type SpaceDataType = {
    id: number;
    user_name: string;
    revenue: number;
    key_price: number;
    ranking: number;
  };
  

export function SpacesContent( { handleIdChange }: { handleIdChange: (id: number, type: "trending" | "user") => void }) {
  const [spaces, setSpaces] = useState<SpaceDataType[]>([]);

  const SPACES_INFO = process.env.NEXT_PUBLIC_SPACE || ''



  const fetchSpaces = async () => {
    const userStateResponse = await fetch(SPACES_INFO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!userStateResponse.ok) {
      throw new Error('获取信息 失败')
    }

    const { data } = await userStateResponse.json()
    setSpaces(data);
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  return (
    <main className="px-8 py-12 w-[70%] mx-auto">
      <div className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Space</h1>
            <p className="text-gray-500 text-sm">Groups to share and discuss, where people can vote with money.</p>
          </div>
          <div className="overflow-hidden border-gray-200 rounded-lg">
            <table className="w-full">
              <tbody>
                <tr className='border-y border-gray-200'>
                  <td className="px-6 py-6 text-sm font-medium text-gray-500">ID</td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-500">NAME</td>
                  {/* <td className="px-6 py-6 text-sm font-medium text-gray-500">
                    REVENUE
                    <i className="fa-regular fa-circle-question ml-1 text-gray-400"></i>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-500 hi">
                    KEY PRICE
                    <i className="fa-regular fa-circle-question ml-1 text-gray-400"></i>
                  </td> */}
                  <td className="px-6 py-6 text-sm font-medium text-gray-500">
                    REWARD
                    <i className="fa-regular fa-circle-question ml-1 text-gray-400"></i>
                  </td>
                </tr>
                {spaces.map((item, index) => (
                  <tr key={item.id} className={`border-t border-gray-200 ${index % 2 === 1 ? '' : ''}`}>
                    <td className="px-6 py-6 text-sm text-gray-900">{item.ranking}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleIdChange(item.id, "user")}>
                        <span className="text-sm">{item.user_name}</span>
                      </div>
                    </td>
                    {/* <td className="px-6 py-6 text-sm text-gray-900">$ {item.revenue.toFixed(2)}</td>
                    <td className="px-6 py-6 text-sm text-gray-900">$ {item.key_price.toFixed(2)}</td> */}
                    <td className="px-6 py-6 text-sm text-gray-900">{item.revenue.toFixed(2)} NUT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      );
};