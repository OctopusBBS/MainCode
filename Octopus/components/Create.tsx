
'use client'
import React from 'react';
import * as ReactDOM from 'react-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import MdRender from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

export function CreateContent() {

const mdParser = new MarkdownIt(/* Markdown-it options */);


// Finish!
const handleEditorChange = ({ html, text }: { html: string, text: string }) => {
    console.log('html handleEditorChange:', html);
    console.log('text handleEditorChange:', text);
  }
return (
    <main className="px-4 py-2">
    <MdEditor className='h-[500px] mx-auto mt-4' renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
    <div className='flex justify-between mt-6'>
        <div className='flex items-center gap-2'>
            <div className='bg-blue-100 rounded-lg px-7 py-3 font-bold text-blue-500 w-[220px] h-[100px] flex items-center justify-center'>
            <img src="./images/xj.png" alt="notify" className="w-10 h-10 rounded-full mr-2" /> Add Image
            </div>
            <div className='text-sm pl-4'>Blockchain Storage Cost:<span className=' text-gray-500'> &lt; $0.001  </span><span className='text-blue-500 font-bold text-2xl pl-2'>Free Now</span></div>
        </div>
        <div>
            <button className='bg-blue-500 text-white rounded-lg px-7 py-3 h-[45px] w-[200px] text-sm'>+ Upload & Publish</button>  
        </div>
    </div>
    </main>
  );
};
