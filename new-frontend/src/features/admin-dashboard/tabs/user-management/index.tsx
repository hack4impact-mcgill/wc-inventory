import {useState} from "react";
import {supabase} from "@/lib/supabaseClient.ts";
import {createClient} from "@supabase/supabase-js";

// Initialize Supabase client with an admin key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ADMIN_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY);

async function createNewUser(email:string, password: string, role: string, firstName:string, lastName:string) {
    const {data, error} = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: {first_name: firstName, last_name: lastName, role: role}
    });

    if (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
}

const UserManagement = () => {

    // State to control form visibility:
    const [isModalOpen, setIsModalOpen] = useState(false)

    // States for attributes
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('volunteer')

    // Error handling states
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [successMessage, setSuccessMessage] = useState('');

    //Function to handle form open/close
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)

        // Reset all input fields and messages when the modal is toggled
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setRole('volunteer');
        setError('');
        setSuccess('');
    }

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleCreateUser = async (e: React.FormEvent) => {

        e.preventDefault()

        // clear prev messages
        setError('')
        setSuccess('')

        if (!isValidEmail(email)) {
            setError('The email must be a valid email address.')
            return
        }

        try {
            //1. check if a user with this email already exists
            const {data: userExists, error: checkError} = await supabase
                .rpc('check_user_exists', {input_email: email});


            if (checkError && checkError.code !== 'PGRST116') { //handle error if it is not "no match found"
                setError(`Error checking existing user: ${checkError.message}`);
                return
            }

            if (userExists) {
                setError('A user with this email already exists.')
                return
            }

            // 2. Create the user using public.create_new_user function
            const newUser = await createNewUser(email, password, role, firstName, lastName);

            // 3. Get the new user's ID and insert record into user_roles.
            const userId = newUser.user?.id;

            // Insert the role into user_roles if not handled by create_new_user
            const {error: roleError} = await supabase.rpc('insert_user_role_uuid', {
                new_user_id: userId,
                new_role: role
            });

            if (roleError) {
                setError(`Failed to assign role: ${roleError.message}`);
                return;
            }

            // Show success message and reset fields
            setSuccess('User created successfully!');
            setSuccessMessage(`${role}: ${email} successfully added!`);
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setRole('volunteer');
            toggleModal();

        } catch (err) {
            setError('An unexpected error occurred.')
        }

    }


    return (
        <div className="h-[70vh] flex flex-col items-center justify-center">
            {/* Display dashboard success message */}
            {successMessage && (
                <div
                    className="mb-4 bg-green-100 text-green-700 p-4 rounded-lg shadow-lg transition-opacity duration-500">
                    {successMessage}
                </div>
            )}

            {/* Create User Button */}
            <button
                onClick={toggleModal}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Create User
            </button>

            {/* Modal for Create User Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Create a New User</h2>

                        {/* Display error or success message */}
                        {error && <p className="text-red-500 mb-2">{error}</p>}
                        {success && <p className="text-green-500 mb-2">{success}</p>}

                        {/* Form Fields */}
                        <form onSubmit={handleCreateUser}>
                            {/* Email */}
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 border rounded-md"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-4">
                                <label className="block text-gray-700">Password</label>
                                <input
                                    type="password"
                                    className="w-full mt-1 p-2 border rounded-md"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {/* First Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 border rounded-md"
                                    placeholder="Enter first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            {/* Last Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 border rounded-md"
                                    placeholder="Enter last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            {/* Role */}
                            <div className="mb-4">
                                <label className="block text-gray-700">Role</label>
                                <select
                                    className="w-full mt-1 p-2 border rounded-md"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="volunteer">Volunteer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="mr-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
