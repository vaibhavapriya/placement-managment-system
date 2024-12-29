import React, { useState, useEffect } from 'react';
import { usePatContext } from '../context/PatContext';
import axios from 'axios';

function EditProfile({ closeModal }) {
    const { state, dispatch } = usePatContext();
    const user = state.id;

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        resume: '',
        coverLetter: '',
        grade: '',
        achievements: '',
        transcripts: '',
    });

    const token = localStorage.getItem('token');
    console.log("user:" +user);
    if (!token) {
        alert('You must be logged in to post a job.');
        return;
    }
    // Dispatch action to add application
        // dispatch({
        //     type: 'ADD_APPLICATION',
        //     payload: { application: newApplication },
        // });
        

    // Fetch existing profile details
    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                alert('You must be logged in to post a job.');
                return;
            }

            try {
                const res = await axios.get(`http://localhost:5000/student/${user}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const fetchedProfile = res.data || {
                    name: '',
                    email: '',
                    resume: '',
                    coverLetter: '',
                    grade: '',
                    achievements: '',
                    transcripts: '',
                };

                setProfile(fetchedProfile);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [user, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(profile);
        try {
            await axios.put(`http://localhost:5000/student/${user}`, profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); // Update profile
            dispatch({
                type: 'SET_DETAILS',
                payload: { profile },
            });
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg text-black">
            <h2 className="text-lg font-semibold ">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Resume (URL)</label>
                    <input
                        type="text"
                        name="resume"
                        value={profile.resume}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Cover Letter</label>
                    <textarea
                        name="coverLetter"
                        value={profile.coverLetter}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Academic Grade</label>
                    <input
                        type="number"
                        name="grade"
                        value={profile.grade }
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Achievements</label>
                    <input
                        type="text"
                        name="achievements"
                        value={profile.achievements}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Transcripts (URL)</label>
                    <input
                        type="text"
                        name="transcripts"
                        value={profile.transcripts }
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </form>
            </div>
        </div>
    );
}

export default EditProfile;
