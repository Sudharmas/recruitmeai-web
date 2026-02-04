"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import Link from "next/link";

// 1. Define the custom JWT Payload interface to fix TS2339
interface RecruitMePayload extends JwtPayload {
    role: 'LEAD_HR' | 'SUB_HR' | 'CANDIDATE';
    orgId?: string;
}

const HRLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // 2. Explicitly type the event to fix TS7006
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // 3. Post to your Spring Boot Backend
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);

            // Define the token variable clearly so it's found in scope
            const token = res.data.token;

            // 4. Decode the token using our custom interface
            const decoded = jwtDecode<RecruitMePayload>(token);

            // 5. Enterprise Guardrail: Prevent Candidates from entering the HR Suite
            if (decoded.role === 'CANDIDATE') {
                setError("This portal is for HR staff only. Candidates, please use the Talent Portal.");
                return;
            }

            // 6. Success: Store and Redirect
            localStorage.setItem('token', token);
            router.push('/candidate/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <StyledWrapper>
                <div className="container">
                    <div className="heading">Enterprise Sign In</div>
                    <form className="form" onSubmit={handleLogin}>
                        <input
                            required
                            className="input"
                            type="email"
                            placeholder="Work E-mail"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            required
                            className="input"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="error-text">{error}</p>}
                        <span className="forgot-password"><a href="#">Forgot Password ?</a></span>
                        <input className="login-button" type="submit" value="Sign In" />
                    </form>
                    <div className="social-account-container">
                        <span className="title">Or Sign in with Corporate SSO</span>
                        <div className="social-accounts">
                            <button className="social-button google">
                                <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <span className="agreement">
            <Link href="/">← Back to Gateway</Link>
          </span>
                </div>
            </StyledWrapper>
        </div>
    );
};

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

export default HRLogin;