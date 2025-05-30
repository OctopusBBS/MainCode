
'use client'
import type { SuiClient } from '@mysten/sui/client';

export const getBalance = async (client: SuiClient,address: string,coinType: string) => {
    try {
      const balance = await client.getBalance({
        owner: address,
        coinType: coinType
      });
      return balance;
    } catch (error) {
      console.error('获取余额失败:', error);
      return null;
    }
  };


export const getCoins = async (client: SuiClient,address: string,coinType: string) => {
    try {
      const balance = await client.getCoins({
        owner: address,
        coinType: coinType
      });
      return balance;
    } catch (error) {
      console.error('获取余额失败:', error);
      return null;
    }
  };