// app/components/EditProfileModal.tsx
'use client'
import React from 'react';
import { UserInfoType } from '../utils/api';

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userInfo: UserInfoType;
};

export function EditProfileModal({ isOpen, onClose, userInfo }: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 灰色遮罩层 */}
      <div 
        className="absolute inset-0 bg-gray-800 bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* 弹窗内容 */}
      <div className="relative z-50 bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-gray-500 text-sm text-center pb-4">Edit Profile</div>
        <div className="relative h-[150px]">
          <div 
            className="w-full h-full bg-cover bg-center bg-gray-100"
            style={{
              backgroundImage: `url(${userInfo.bgImg})`
            }}
          />
          <div className="absolute inset-0 flex items-top justify-end cursor-pointer pt-2 pr-2">
            <img src="./images/upload.png" alt="notify" className="w-6 h-6 rounded-full" />
          </div>
      
          {/* 头像 */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
            <div 
              style={{
                backgroundImage: `url(${userInfo.head_img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                <img src="./images/upload.png" alt="notify" className="w-6 h-6 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="items-center gap-2 pt-14 pb-2 text-2xl font-medium text-center">
          {userInfo.username}
        </div>
        <div className="items-center gap-2 text-2xl font-medium">
          Name
        </div>
        <div className="text-gray-500 text-sm">
          What do you want to be known as?
        </div>
        <div className="items-center gap-2 py-4">
          <input type="text" className="w-full rounded-lg p-2 border border-gray-300" />
        </div>
        
        <button className="bg-primary text-white px-4 py-1 rounded-lg w-full h-12 font-medium text-lg hover:bg-primary-dark transition-colors">Confirm</button>
      </div>
    </div>
  );
}