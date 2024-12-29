import React, { useState } from 'react';
import FormApplication from './FormApplication';
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
            className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition-shadow duration-300"
        >
            {isModalOpen && <FormApplication job={job} closeModal={closeModal} />}
            <div className="flex flex-col space-y-2">
                {/* Drive Title */}
                <h2 className="text-xl font-semibold text-blue-600">{job.title}</h2>

                {/* Package Information */}
                <div className="text-lg text-gray-700">
                    <span className="font-bold text-black">Package: </span>₹{job.package} LPA
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500">{job.description}</p>
                <button>delailed</button>
            </div>

            <div>below this changes if student all drives apply button or applied,if applied drivesin students status as read,shotlisted,interview etc if c/a:edit drive open or close status view applicants button</div>
            {/* Apply Button */}
            <button onClick={handleApply}
                className="mt-4 w-full py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            > Apply
            </button>
            
        </li>
    );
}

export default DriveCard;
