import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Editor from '@monaco-editor/react'
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import "./codingarea.css";

export default function Question_code({ auth, question_data }) {
    const [currentCode, setCurrentCode] = useState("");
    const [submissionResult, setSubmissionResult] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selecedLanguage, setSelectedLanguage] = useState();
    const LOCAL_SOURCE_CODE_KEY = `soure_code_for_problem_${question_data.id}`;
    const languages = [
        {id: 92, name: "Python 3"},
        {id: 31, name: "Java"}

    ]
    useEffect(() => {
        const source_code = localStorage.getItem(LOCAL_SOURCE_CODE_KEY);
        setCurrentCode(source_code);
    }, [])

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
                    <div className="h-80 mb-3">
                        <div className='dropdown-holder'>
                        <div className="dropdown dropdown-hover display flex ">
                            <label tabIndex={0} className="btn m-1">{selecedLanguage ?? "Select Language"}</label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                {languages.map(l => <li onClick={() => {
                                    setSelectedLanguage(l.name)
                                }}>{l.name}</li>)}
                            </ul>
                        </div>
                        </div>
                        <Editor value={currentCode} language='python'
                            onChange={(val => {
                                setCurrentCode(val)
                                localStorage.setItem(LOCAL_SOURCE_CODE_KEY, val);
                                // const locstorage=localStorage.getItem(LOCAL_SOURCE_CODE_KEY)
                                // console.log("stored code: ",locstorage)
                            })} />
                    </div>
                    <div className="flex gap-4">
                        <button className="btn" onClick={async () => {
                            console.log(currentCode);
                            let langid = languages.find(l => l.name == selecedLanguage).id;
                            // will do some backend call and send the data to backend to evaluate..
                            setIsSubmitting(true)
                            try {
                                let response = await axios.post('/api/startevaluation', { "language_id": langid, "source_code": currentCode, "problem_id": question_data.id })
                                console.log(response.data)
                                setSubmissionResult(response.data);
                            } catch (e) {
                                console.error(e);
                                alert("eerror check log")
                            }
                            finally {
                                setIsSubmitting(false)
                            }


                        }} disabled={isSubmitting}>
                            {isSubmitting && <span className="loading loading-spinner"></span>}
                            Run
                        </button>
                        <Link href={route("submission_list", { problem_id: question_data.id })} className='btn' role='button'>See your submissions</Link>
                    </div>
                    {submissionResult
                        &&
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Output</th>
                                        <th>Expected Output</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    <tr>
                                        <td>{submissionResult.status}</td>
                                        <td>{submissionResult.stdout || submissionResult.stderr}</td>
                                        <td>{submissionResult.expected_output}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
