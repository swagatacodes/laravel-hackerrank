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
    const [selecedLanguage, setSelectedLanguage] = useState('Python 3');
    const LOCAL_SOURCE_CODE_KEY = `soure_code_for_problem_${question_data.id}_for_${selecedLanguage}`;
    const languages = [
        { id: 92, name: "Python 3" ,monacolanguageid:'python'},
        { id: 62, name: "Java" ,monacolanguageid:'java'},
        { id: 50, name: "C (GCC 9.2.0)" ,monacolanguageid:'c'},
        { id: 63, name: "JavaScript" ,monacolanguageid:'javascript'},
        { id: 68, name: "PHP" ,monacolanguageid:'php' },
        { id: 54, name: "C++" ,monacolanguageid:'cpp'},
        { id: 46, name: "Shell" ,monacolanguageid:'shell'},
    ]
    useEffect(()=>{
        const lastusedlang=localStorage.getItem("language");
        if (lastusedlang){
            setSelectedLanguage(lastusedlang);
        }
        
    },[])
    useEffect(() => {
        const source_code = localStorage.getItem(LOCAL_SOURCE_CODE_KEY);
        setCurrentCode(source_code);
        localStorage.setItem('language',selecedLanguage);

    }, [selecedLanguage])
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Question {question_data.id}</h2>}
        >
            <Head title="Question_code" />

            <div className='flex gap-3'>
                <div className="flex-1 p-4">
                    <div className='font-medium text-lg mb-6 text-info-content'>{question_data.title}</div>
                    <div className="text-base text-info-content rich-text">
                        <div dangerouslySetInnerHTML={{__html: question_data.description}}></div>
                    </div>
                </div>
                <div className='flex-1 p-4'>
                    <div className="h-80 mb-3">
                        <div className='dropdown-holder'>
                            <details className="dropdown dropdown-end">
                                <summary className="m-1 btn">{selecedLanguage ?? "Select Language"}</summary>
                                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                                {languages.map(l => <li onClick={() => {
                                        setSelectedLanguage(l.name)
                                    }}>{l.name}</li>)}
                                </ul>
                            </details>
                        </div>
                        <div className='code-holder'>
                            <Editor value={currentCode} language={languages.find((l)=>l.name==selecedLanguage).monacolanguageid}
                                onChange={(val => {
                                    setCurrentCode(val)
                                    localStorage.setItem(LOCAL_SOURCE_CODE_KEY, val);
                                    // const locstorage=localStorage.getItem(LOCAL_SOURCE_CODE_KEY)
                                    // console.log("stored code: ",locstorage)
                                })} />
                        </div>

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
                                alert("error check log")
                            }
                            finally {
                                setIsSubmitting(false)
                            }


                        }} disabled={isSubmitting}>
                            {isSubmitting && <span className="loading loading-spinner"></span>}
                            Run
                        </button>
                        <Link href={route("submission_list", { problem_id: question_data.id })} className='btn' role='button'>See your submissions</Link>
                        <Link href={route("best_submission", {pid: question_data.id})} className='btn' role='button'>Best Submission</Link>
                    </div>
                    {submissionResult
                        &&
                        <div className="overflow-x-auto">
                            <table className="table text-info-content">
                                {/* head */}
                                <thead className='text-info-content'>
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
