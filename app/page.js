'use client';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Home() {
  const TARGET_EMAIL = "aakashheroor671@gmail.com";
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('');

  const sendOtp = async () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 15 * 60000); // 15 mins based on your template text

    // Save to Firestore
    await setDoc(doc(db, "otps", TARGET_EMAIL), { 
      code: otpCode, 
      expiresAt: expiryTime 
    });

    // Send via EmailJS - Matches your template variables
    try {
      await emailjs.send('service_c6ihqjs', 'template_5izfblb', {
        passcode: otpCode,          // Matches {{passcode}} in your template
        time: expiryTime.toLocaleTimeString(), // Matches {{time}} in your template
        email: TARGET_EMAIL         // Matches {{email}} in your template
      }, '4DI8hU5KC3hymJIJx');        // Put your public key here
      
      setStatus("OTP sent! Check your email.");
    } catch (e) {
      console.error("EmailJS Error:", e);
      setStatus("Failed to send email. Check console.");
    }
  };

  const verifyOtp = async () => {
    const docRef = await getDoc(doc(db, "otps", TARGET_EMAIL));
    const data = docRef.data();

    if (data && data.code === otp && new Date() < data.expiresAt.toDate()) {
      window.location.href = "/dashboard";
    } else {
      alert("Invalid or Expired OTP.");
    }
  };

  return (
    <main style={{ padding: '50px' }}>
      <h1>Private Access</h1>
      <button onClick={sendOtp}>Send OTP to {TARGET_EMAIL}</button>
      <p>{status}</p>
      <input onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" />
      <button onClick={verifyOtp}>Verify</button>
    </main>
  );
}
