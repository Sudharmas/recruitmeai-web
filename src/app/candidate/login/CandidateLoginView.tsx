"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CandidateLoginView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            router.push('/candidate/dashboard');
        } catch (err: any) {
            alert("Login failed. Check credentials.");
        }
    };

    return (
        <StyledWrapper>
            <div className="container">
                <div className="heading">Candidate Sign In</div>
                <form className="form" onSubmit={handleLogin}>
                    <input required className="input" type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
                    <input required className="input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button className="login-button" type="submit">Sign In</button>
                </form>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    .container {
        max-width: 350px;
        background: #F8F9FD;
        background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
        border-radius: 40px;
        padding: 25px 35px;
        border: 5px solid rgb(255, 255, 255);
        box-shadow: rgba(133, 189, 215, 0.87) 0px 30px 30px -20px;
    }

    .heading {
        text-align: center;
        font-weight: 900;
        font-size: 30px;
        color: rgb(16, 137, 211);
    }

    .form .input {
        width: 100%;
        background: white;
        border: none;
        padding: 15px 20px;
        border-radius: 20px;
        margin-top: 15px;
        box-shadow: #cff0ff 0px 10px 10px -5px;
    }

    .error-text {
        color: #ff4d4d;
        font-size: 10px;
        margin-top: 10px;
        text-align: center;
        font-weight: bold;
    }

    .form .login-button {
        display: block;
        width: 100%;
        font-weight: bold;
        background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
        color: white;
        padding-block: 15px;
        margin: 20px auto;
        border-radius: 20px;
        box-shadow: rgba(133, 189, 215, 0.87) 0px 20px 10px -15px;
        border: none;
        cursor: pointer;
    }

    .social-account-container .title {
        display: block;
        text-align: center;
        font-size: 10px;
        color: rgb(170, 170, 170);
    }

    .social-account-container .social-accounts {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }

    .social-button {
        background: #000;
        border: 3px solid white;
        border-radius: 50%;
        padding: 8px;
        cursor: pointer;
    }

    .social-button .svg { fill: white; }

    .agreement {
        display: block;
        text-align: center;
        margin-top: 15px;
        font-size: 9px;
        color: #0099ff;
    }

    .agreement a { text-decoration: none; color: inherit; }
`;
