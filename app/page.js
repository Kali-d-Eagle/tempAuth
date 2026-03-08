'use client';
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function Home() {
  // Ensure this is EXACTLY in E.164 format: + followed by country code + number
  const FRIEND_NUMBER = "+918088829910";
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const sendOtp = async () => {
    try {
      console.log("Initiating login for:", FRIEND_NUMBER);
      
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 
            'size': 'invisible' 
        });
      }
      
      await window.recaptchaVerifier.render();
      const confirmation = await signInWithPhoneNumber(auth, FRIEND_NUMBER, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      alert("OTP Sent! Check your phone.");
    } catch (err) { 
      console.error("Firebase Error Details:", err);
      alert("Error: " + err.message); 
    }
  };

  const verifyOtp = async () => {
    try {
      const userCredential = await confirmationResult.confirm(otp);
      if (userCredential.user.phoneNumber === FRIEND_NUMBER) {
        window.location.href = "/dashboard";
      } else {
        alert("Unauthorized number detected.");
      }
    } catch (err) { alert("Invalid OTP"); }
  };

  return (
    <main style={{ padding: '50px' }}>
      <h1>Private Access Only</h1>
      <button onClick={sendOtp}>Send OTP to {FRIEND_NUMBER}</button>
      <div id="recaptcha-container"></div>
      <br /><br />
      <input type="text" onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
      <button onClick={verifyOtp}>Verify</button>
    </main>
  );
}