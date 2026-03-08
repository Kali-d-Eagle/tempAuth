'use client';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Defined at the top level so it is globally available in this file
const TARGET_EMAIL = "aakashheroor671@gmail.com";

export default function Home() {
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('');

  /*
  const sendOtp = async () => {
    
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 15 * 60000); // 15 minutes expiry

    // Save to Firestore
    await setDoc(doc(db, "otps", TARGET_EMAIL), { 
      code: otpCode, 
      expiresAt: expiryTime 
    });

    // Send via EmailJS - ensure these IDs match your dashboard exactly
    try {
      await emailjs.send('service_lue4xbj', 'template_5izfblb', {
        passcode: otpCode,
        time: expiryTime.toLocaleTimeString(),
        email: TARGET_EMAIL
      }, '4DI8hU5KC3hymJIJx'); // <--- PASTE YOUR PUBLIC KEY HERE
      
      setStatus("OTP sent! Check your email.");
    } catch (e) {
      console.error("EmailJS Error:", e);
      setStatus("Failed to send email. Check Console for details.");
    }
    
  };

  */

  const sendOtp = async () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 15 * 60000);

    const templateParams = {
      passcode: otpCode,
      time: expiryTime.toLocaleTimeString(),
      email: TARGET_EMAIL
    };

    console.log("Sending to EmailJS:", {
      service: 'service_c6ihqjs',
      template: 'template_5izfblb',
      params: templateParams
    });

    try {
      const response = await emailjs.send('service_lue4xbj', 'template_5q7dpyp', templateParams, '4DI8hU5KC3hymJIJx');
      setStatus("OTP sent!");
    } catch (error) {
      console.error("EmailJS Error Object:", error);
      setStatus("Failed. Check Console.");
    }
  };

const verifyOtp = async () => {
    try {
      const docRef = await getDoc(doc(db, "otps", TARGET_EMAIL));
      
      if (!docRef.exists()) {
        alert("No OTP found. Please send a new one.");
        return;
      }

      const data = docRef.data();
      const dbCode = String(data.code); // Force string conversion
      const userCode = String(otp);     // Force string conversion
      const expiry = data.expiresAt.toDate(); // Convert Firestore Timestamp to JS Date

      console.log("Comparing:", { dbCode, userCode, expiry, now: new Date() });

      if (dbCode === userCode && new Date() < expiry) {
        window.location.href = "/dashboard";
      } else if (new Date() >= expiry) {
        alert("OTP has expired. Please request a new one.");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      alert("Verification failed. Check console.");
    }
  };

  return (
    <main style={{ padding: '50px' }}>
      <h1>Private Access</h1>
      <button onClick={sendOtp}>Send OTP to {TARGET_EMAIL}</button>
      <p>{status}</p>
      <input 
        type="text" 
        onChange={(e) => setOtp(e.target.value)} 
        placeholder="Enter 6-digit OTP" 
      />
      <button onClick={verifyOtp}>Verify</button>
    </main>
  );
}
