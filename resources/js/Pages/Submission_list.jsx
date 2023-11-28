import { Head } from "@inertiajs/react"

export default function Submission_list({ submissions, problem }) {
    return (
        <div>
            <Head title={`Submission list for - ${problem.title}`}>
            </Head>
            {/* <div>{JSON.stringify(submissions)}</div> */}
            <div className="p-10">
                <h2 className="text-3xl">{problem.title}</h2>
                <h3><div dangerouslySetInnerHTML={{__html: problem.description}}></div></h3>
                
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>LANGUAGE ID</th>
                            <th>STATUS</th>
                            <th>CREATED AT</th>
                            <th>TIME</th>
                            <th>MEMORY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {submissions.map(each => {
                            return (
                                <tr>
                                    <th>{each.id}</th>
                                    <td>{each.language_id}</td>
                                    <td>{each.status}</td>
                                    <td>{each.created_at.substring(0,10)}</td>
                                    <td>{each.time}</td>
                                    <td>{each.memory}</td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </div>
        </div>
    )
}