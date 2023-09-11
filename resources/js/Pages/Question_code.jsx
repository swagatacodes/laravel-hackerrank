import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Editor from '@monaco-editor/react'
import { useState } from 'react';

export default function Question_code({ auth, question_data }) {
    const [currentCode, setCurrentCode] =  useState("")
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Question {question_data.id}</h2>}
        >
            <Head title="Question_code" />

            <div className='flex gap-3'>
                <div className="flex-1 p-4">
                    <div className='font-medium text-lg mb-6'>{question_data.title}</div>
                    <div className="text-base">{question_data.description}</div>
                </div>
                <div className='flex-1 p-4'>
                    <Editor value={question_data.python_driver_code} language='python' className='h-80' onChange={(val => setCurrentCode(val))}/>
                    <div className="flex">
                        <button className="btn" onClick={()=> {
                            console.log(currentCode);
                            // will do some backend call and send the data to backend to evaluate..
                        }}>Run</button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
