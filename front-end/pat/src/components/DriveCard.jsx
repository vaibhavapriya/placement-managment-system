import React, { useState } from 'react';
import FormApplication from './FormApplication';
import { Link } from 'react-router-dom';

function DriveCard({ job }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleApply = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <li  key={job._id}
            className="border rounded-lg shadow-lg p-4 bg-[#F7F4FF] hover:shadow-xl transition-shadow duration-300"
        >
            {isModalOpen && <FormApplication job={job} closeModal={closeModal} />}
            <div className="flex flex-col space-y-2">
                {/* Drive Title */}
                <h2 className="text-xl font-semibold text-[#3D52A0]">{job.title}</h2>

                {/* Package Information */}
                <div className="text-lg text-[#8697C4]">
                    <span className="font-bold text-black">Package: </span>₹{job.package} LPA
                </div>
                <p className="text-lg text-[#6B6A85]">{job.type}</p>

                {/* Description */}
                <p className="text-sm text-[#6B6A85]">{job.description}</p>
                <Link to={`/job/${job._id}`}><button className="text-[#7091E6] hover:underline focus:outline-none">delailed</button></Link>
            </div>

            {/* Apply Button */}
            <button onClick={handleApply}
                className="mt-4 w-full py-2 px-4 text-white bg-[#3D52A0] hover:bg-[#2E4292] rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:ring-offset-2"
            > Apply
            </button>
            
        </li>
    );
}

export default DriveCard;
