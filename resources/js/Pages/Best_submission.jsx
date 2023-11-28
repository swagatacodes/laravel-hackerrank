import { Head } from '@inertiajs/react';


export default function Best_submission({ pid, best_time_submission, best_space_submission }) {
    return (
        <div >
            <Head title={`Best submission for Question - ${pid}`}>
            </Head>
            <div className='flex gap-5'>
                <div>
                    <div className='m-3'> <h3>Best submitted code with respect to time complexity</h3></div>
                    
                    <div className="mockup-code">
                        <pre className='pl-5'><code>{best_time_submission.submitted_code}</code></pre>
                    </div>
                    <div>{`Time complexity - ${best_time_submission.time}`}</div>
                </div>
                <div>
                    <div className='m-3'><h3>Best submitted code with respect to space complexity</h3></div>
                    
                    <div className="mockup-code">
                        <pre className='pl-5' ><code>{best_space_submission.submitted_code}</code></pre>
                    </div>
                    <div>{`Space complexity - ${best_space_submission.memory}`}</div>
                </div>
            </div>
        </div>
    )
}