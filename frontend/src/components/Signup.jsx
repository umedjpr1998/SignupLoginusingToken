import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useEffect } from 'react';


function Signup() {
    const [showTerms, setShowTerms] = useState(false)
    const [errors, setErrors] = useState({})


    const [formdata, setFormdata] = useState({
        name: "",
        email: "",
        contact: "",
        cpassword: "",
        password: "",
        bloodgroup: "",
        city: "",
        address: "",
        dob: "",
        gender: "",
        aadhar: "",
        profilepic: "",
        term: false
    })

    const navigate = useNavigate();


    const handleChange = (e) => {
        if (e.target.name === 'term') {
            setFormdata({ ...formdata, [e.target.name]: e.target.checked });
        } else if (e.target.name === 'profilepic') {
            setFormdata({ ...formdata, [e.target.name]: e.target.files[0] });
        } else if (e.target.name === 'contact' || e.target.name === 'aadhar') {
            // Only allow digits and enforce max length
            const maxLength = e.target.name === 'contact' ? 10 : 12;
            const cleanedValue = e.target.value.replace(/\D/g, '').slice(0, maxLength);
            setFormdata({ ...formdata, [e.target.name]: cleanedValue });
        } else {
            setFormdata({ ...formdata, [e.target.name]: e.target.value });
        }
    };



    const validateForm = () => {
        let newError = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;


        if (!formdata.name) newError.name = "Name is required";

        if
            (!formdata.email) { newError.email = "Email is required"; }
        else if
            (!emailRegex.test(formdata.email)) { newError.email = "Invalid email format"; }

        if (!formdata.contact) { newError.contact = "Contact number is required"; }
        if (!formdata.aadhar) { newError.aadhar = "Aadhar number is required"; }
        if (!formdata.gender) newError.gender = "Gender is required";
        if (!formdata.dob) newError.dob = "Date of birth is required";
        if (!formdata.address) newError.address = "Address is required";
        if (!formdata.city) newError.city = "City is required";
        if (!formdata.bloodgroup) newError.bloodgroup = "Blood group is required";

        if
            (!formdata.password) { newError.password = "Password is required"; }
        else if
            (!passwordRegex.test(formdata.password)) {
            newError.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
        }

        if (formdata.password !== formdata.cpassword) newError.cpassword = "Confirm password does not match";

        if (!formdata.term) newError.term = "You must accept the Terms & Conditions";
        if (!formdata.profilepic) newError.profilepic = "Profile picture is required";

        setErrors(newError);
        return Object.keys(newError).length === 0;
    };



    useEffect(() => {
        console.log("Form data updated:", formdata);
    }, [formdata]);





    const handlesubmit = async () => {
        if (!validateForm()) return;

        const formData = new FormData();
        Object.entries(formdata).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, formData);
            console.log("Response:", response.data);
            alert("Registration successful! Redirecting to login...");
            console.log("User data from server:", response.data.user);

            navigate('/login'); // ✅ Redirect to login page
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error submitting form");
        }
    };



    return (
        <>
            <div className='w-75 shadow m-auto my-4'>
                <h1 className='text-center mt-0 alert alert-primary'>User Detail</h1>
                <div className='w-75 py-2 m-auto'>

                    <label className='form-label fw-bold' htmlFor="name">Full Name</label>
                    <input className='form-control mb-2' type="text" value={formdata?.name} onChange={handleChange} name="name" id="name" placeholder='Enter Your Name' />
                    <div className="text-danger small">{errors.name}</div>


                    <label className='form-label fw-bold' htmlFor="email">Email</label>
                    <input className='form-control mb-2' type="email" value={formdata?.email} onChange={handleChange} name="email" id="email" placeholder='Enter Your Email Address' />
                    <div className="text-danger small">{errors.email}</div>


                    <label className='form-label fw-bold' htmlFor="contact">Contact Number</label>
                    <input className='form-control mb-2' type="text" value={formdata?.contact} onChange={handleChange} name="contact" id="contact" placeholder='Enter Your Contact Number' maxLength={10} />
                    <div className="text-danger small">{errors.contact}</div>


                    <label className='form-label fw-bold' htmlFor="aadhar">Aadhar Number</label>
                    <input className='form-control mb-2' type="text" value={formdata?.aadhar} onChange={handleChange} name="aadhar" id="aadhar" placeholder='Enter Your Aadhar Number' maxLength={12} />
                    <div className="text-danger small">{errors.aadhar}</div>


                    <label className='form-label fw-bold' htmlFor="male" >Gender</label><br />
                    <p className='mb-2'>
                        Male<input className='ms-2' value="male" type="radio" onChange={handleChange} name="gender" id="male" />
                    </p>

                    <p>
                        Female<input className='ms-2' value="female" type="radio" onChange={handleChange} name="gender" id="female" />
                    </p>

                    <label className='form-label fw-bold' htmlFor='dob'>Date Of Birth</label>
                    <input className='form-control mb-2' type="date" value={formdata?.dob} onChange={handleChange} name="dob" id="dob" />
                    <div className="text-danger small">{errors.dob}</div>


                    <label className='form-label fw-bold' htmlFor="address">Address</label>
                    <input className='form-control mb-2' type="text" value={formdata?.address} onChange={handleChange} name="address" id="address" placeholder='Enter Your Address' />
                    <div className="text-danger small">{errors.address}</div>


                    <label className='form-label fw-bold' htmlFor="city">City</label>
                    <input className='form-control mb-2' type="text" value={formdata?.city} onChange={handleChange} name="city" id="city" placeholder='Enter Your City' />
                    <div className="text-danger small">{errors.city}</div>


                    <label className='form-label fw-bold' htmlFor="bloodgroup">Blood group</label>
                    <select className='form-select' value={formdata?.bloodgroup || ""} name="bloodgroup" onChange={handleChange} id="bloodgroup">
                        <option value="" hidden={!!formdata?.bloodgroup}>Select Your Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                    <div className="text-danger small">{errors.bloodgroup}</div>


                    <label htmlFor='password' className='form-label fw-bold'>Password</label>
                    <input className='form-control mb-2' type="password" value={formdata?.password} onChange={handleChange} name="password" id="password" placeholder='Enter Your Password' />
                    <div className="text-danger small">{errors.password}</div>


                    <label htmlFor='cpassword' className='form-label fw-bold' >Confirm password</label>
                    <input className='form-control mb-2' type="password" value={formdata?.cpassword} onChange={handleChange} name="cpassword" id="cpassword" placeholder='Re-Enter Your Password' />
                    <div className="text-danger small">{errors.cpassword}</div>


                    <label htmlFor='profilepic' className='form-label fw-bold'>Profile Pic</label>
                    <input className='form-control mb-2' type="file" onChange={handleChange} name="profilepic" id="profilepic" />
                    <div className="text-danger small">{errors.profilepic}</div>



                    {/* Terms & Condition */}
                    <div className='my-5'>
                        <input className='me-2' type="checkbox" onChange={handleChange} name="term" id="term" checked={formdata.term} />
                        <span>I agree to the
                            <button type="button" className="btn btn-link p-0 ms-1" style={{ fontSize: "1rem" }} onClick={() => setShowTerms(!showTerms)}>Terms & Conditions</button>
                        </span>

                        {/* Show validation error for terms here */}
                        <div className="text-danger small">{errors.term}</div>
                    </div>

                    {showTerms && (
                        <div className='alert alert-secondary small'>
                            <strong>Terms & Conditions:</strong>
                            <ul className='mb-0'>
                                <li>Your information will be securely stored.</li>
                                <li>You agree to be contacted via email or phone.</li>
                                <li>All data provided must be accurate and truthful.</li>
                                <li>This form does not guarantee service eligibility.</li>
                            </ul>
                        </div>
                    )}


                    <button className='d-block m-auto btn btn-primary mt-2' onClick={handlesubmit}>Submit</button>
                    <Link to="/login" className="btn btn-link d-block text-end mb-4">Already have an account? Login</Link>

                </div >
            </div >
        </>
    )
}

export default Signup