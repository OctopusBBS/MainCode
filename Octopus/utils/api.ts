// API 请求基础配置
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// 通用请求方法
export const fetchApi = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    const url = `${BASE_URL}${endpoint}`;
    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// GET 请求
export const get = <T>(endpoint: string, options: RequestInit = {}) => {
    return fetchApi<T>(endpoint, { ...options, method: 'GET' });
};

// POST 请求
export const post = <T>(endpoint: string, data: any, options: RequestInit = {}) => {
    return fetchApi<T>(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// PUT 请求
export const put = <T>(endpoint: string, data: any, options: RequestInit = {}) => {
    return fetchApi<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

// DELETE 请求
export const del = <T>(endpoint: string, options: RequestInit = {}) => {
    return fetchApi<T>(endpoint, { ...options, method: 'DELETE' });
};

// 文件上传
export const uploadFile = async <T>(
    endpoint: string,
    file: File,
    options: RequestInit = {}
): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    return fetchApi<T>(endpoint, {
        ...options,
        method: 'POST',
        body: formData,
        headers: {
            // 不设置 Content-Type，让浏览器自动设置
        },
    });
}; 


const USER_INFO = process.env.NEXT_PUBLIC_USER_INFO || ''

const TRENDING_INFO = process.env.NEXT_PUBLIC_TRENDING || ''





export type UserInfoType = {
    Id:number;
    head_img: string;
    username: string;
    bgImg:string;
    sui_address:string;
  };

export const fetchUserInfo = async (addr: string,id :number)
:Promise<UserInfoType | null> => {
    try {
      // 获取用户信息
      const userStateResponse = await fetch(USER_INFO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addr,id }),
      })

      if (!userStateResponse.ok) {
        throw new Error('获取 用户信息 失败')
      }

      const { data } = await userStateResponse.json()

      return {
            Id:data.id,
            head_img:data.head_img_url,
            username:data.user_name,
            bgImg:data.bg_img_url,
            sui_address:addr,
        };
    } catch (error) {
      console.error('获取用户数据失败:', error);
      return null;
    }
  };

 export type TrendingInfoType = {
    id: number;
    create_time:string;
    userid:number;
    bg_img:string;
    title:string;
    user_name:string;
    head_img_url:string;
    holders_head_imgs:string[];
    hold_num:number;
  };

  export const fetchTrendingInfo = async (pageNum: number,userid:number,pageType:number)
  :Promise<TrendingInfoType[] | null> => {
    try {
      // 这里替换为您的实际 API 调用
      const userStateResponse = await fetch(TRENDING_INFO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page:pageNum,pagesize:6,pageType:pageType,userid:userid }),
      })
  
      if (!userStateResponse.ok) {
        throw new Error('获取信息 失败')
      }
  
      const { data } = await userStateResponse.json()
      
      return data;
    } catch (error) {
      console.error('获取数据失败:', error);
      return null
    }
};