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
    const expiresAt = new Date(Date.now() + 4 * 60000); // 4 minutes expiry

    // Save to Firestore
    await setDoc(doc(db, "otps", TARGET_EMAIL), { code: otpCode, expiresAt: expiresAt });

    // Send via EmailJS
    try {
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: TARGET_EMAIL,
        otp_code: otpCode,
      }, 'YOUR_PUBLIC_KEY');
      setStatus("OTP sent! Check your email.");
    } catch (e) {
      setStatus("Failed to send email. Check EmailJS config.");
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
