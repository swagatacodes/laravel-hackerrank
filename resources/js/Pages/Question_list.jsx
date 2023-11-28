import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

export default function Question_list({ auth, problems }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Problems</h2>}
        >
            <Head title="Problems" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Total problems: {problems.length}</div>
                    </div>
                    {/* this is the table */}
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Title</th>
                                    <th>Difficulty</th>
                                    {/* <th>Favorite Color</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                {problems.map(q => {
                                    return (
                                            <tr>
                                                <th>{q.id}</th>
                                                <td>{q.title}</td>
                                                <td>{q.difficulty}</td>
                                                <td><Link href={route("question_code", {qid: q.id})} className='btn' role='button'>Go</Link></td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
