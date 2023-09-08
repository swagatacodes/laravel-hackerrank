import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import "./Category.css";
import { useState } from 'react';
import NavLink from '@/Components/NavLink';

export default function Category({ auth, cats }) {
    const [res, setRes] = useState("");
    //const arr = ["Array", "String", "Greedy","Dynamic Programming","Sorting","Hash Table","Tree","Graph"]
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Category</h2>}
        >
            <Head title="Category" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Categories shown here!</div>
                        <div className='grid grid-cols-3'>
                            {cats.map((e) => {
                                return (
                                    <NavLink href={route("question_list", {category_id:e.id})} >
                                    <div className="card w-96 bg-primary text-primary-conte">
                                        <div className="card-body">
                                            <h2 className="card-title">{e.id}</h2>

                                            <div className="card-actions justify-end">
                                                <button className="btn"
                                                 //  onClick={async () => {
                                                    // var url = new URL("http://localhost:8000/api/ping");
                                                    // url.searchParams.append("command", "echo " + e.id);
                                                    // let x = await fetch(url);
                                                    // let y = await x.text();
                                                    // setRes(y);
                                                    // let id = document.getElementById("my_modal");
                                                    // id.showModal();
                                                // }}
                                                 >Start</button>

                                            </div>
                                        </div>
                                    </div>
                                    </NavLink>

                                )
                            })}
                            <dialog id="my_modal" className="modal">
                                <form method="dialog" className="modal-box">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    <h3 className="font-bold text-lg">Output!</h3>
                                    <p className="py-4">{res}</p>
                                </form>
                            </dialog>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
