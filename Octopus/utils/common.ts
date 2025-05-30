
// 日期格式化
export const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};


export const calculateCountdown = (timeDiff: number) => {
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

// 数字格式化（添加千分位）
export const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
};

// 截断文本
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// 深拷贝
export const deepClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime()) as any;
    }
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item)) as any;
    }
    if (obj instanceof Object) {
        const copy = {} as T;
        Object.keys(obj).forEach(key => {
            copy[key as keyof T] = deepClone(obj[key as keyof T]);
        });
        return copy;
    }
    return obj;
}; 

export const formatDateToMonthDay = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit' });
};