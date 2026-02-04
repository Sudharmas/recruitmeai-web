"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CandidateSignup = () => {
    const router = useRouter();

    // 1. Define all state variables from your design to fix TS2304
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('Male'); // Default value
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('USA');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // 2. Prepare the payload for the Backend AuthController
        const payload = {
            name,
            email,
            password,
            phoneNumber: phone,
            birthDate,
            gender,
            address,
            city,
            country
        };

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register-candidate`, payload);
            alert("Registration Successful! Please login.");
            router.push('/candidate/login');
        } catch (err: any) {
            alert(err.response?.data || "Registration failed. Check if email is unique.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCEDDA] p-4">
            <StyledWrapper>
                <section className="container">
                    <header>Registration Form</header>
                    <form className="form" onSubmit={handleSignup}>
                        <div className="input-box">
                            <label>Full Name</label>
                            <input required placeholder="Enter full name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="column">
                            <div className="input-box">
                                <label>Work Email</label>
                                <input required placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="input-box">
                                <label>Set Password</label>
                                <input required placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <div className="column">
                            <div className="input-box">
                                <label>Phone Number</label>
                                <input required placeholder="Enter phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="input-box">
                                <label>Birth Date</label>
                                <input required type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                            </div>
                        </div>

                        <div className="gender-box">
                            <label>Gender</label>
                            <div className="gender-option">
                                {['Male', 'Female', 'Other'].map((g) => (
                                    <div className="gender" key={g}>
                                        <input
                                            name="gender"
                                            id={`check-${g}`}
                                            type="radio"
                                            checked={gender === g}
                                            onChange={() => setGender(g)}
                                        />
                                        <label htmlFor={`check-${g}`}>{g}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="input-box address">
                            <label>Address</label>
                            <input required placeholder="Street address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                            <div className="column">
                                <div className="select-box">
                                    <select value={country} onChange={(e) => setCountry(e.target.value)}>
                                        <option>USA</option>
                                        <option>UK</option>
                                        <option>Germany</option>
                                        <option>India</option>
                                    </select>
                                </div>
                                <input required placeholder="City" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </section>
            </StyledWrapper>
        </div>
    );
}

const StyledWrapper = styled.div`
  /* Insert your provided Registration CSS here */
  .container { position: relative; max-width: 500px; width: 100%; background: #FCEDDA; padding: 25px; border-radius: 8px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); }
  .form .input-box { width: 100%; margin-top: 10px; }
  .form :where(.input-box input, .select-box) { height: 35px; width: 100%; border: 1px solid #EE4E34; border-radius: 6px; padding: 0 15px; background: #FCEDDA; }
  .form button { height: 40px; width: 100%; color: #000; margin-top: 15px; border: none; border-radius: 6px; cursor: pointer; background: #EE4E34; }
  .form .column { display: flex; column-gap: 15px; }
  .form .gender-option { display: flex; align-items: center; column-gap: 20px; flex-wrap: wrap; margin-top: 5px; }
  .form .gender { display: flex; align-items: center; column-gap: 5px; }
`;

export default CandidateSignup;