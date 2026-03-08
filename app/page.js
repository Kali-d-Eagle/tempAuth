const sendOtp = async () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 15 * 60000);

    await setDoc(doc(db, "otps", TARGET_EMAIL), { 
      code: otpCode, 
      expiresAt: expiryTime 
    });

    try {
      // 1. Ensure SERVICE_ID is correct (service_c6ihqjs from your image)
      // 2. Use the CORRECT Template ID: template_5izfblb
      const response = await emailjs.send('service_c6ihqjs', 'template_5izfblb', {
        passcode: otpCode,        // Check: Does your template have {{passcode}}?
        time: expiryTime.toLocaleTimeString(),
        email: TARGET_EMAIL
      }, '4DI8hU5KC3hymJIJx');      // <--- Put your Public Key here
      
      setStatus("OTP sent! Check your email.");
      console.log("Success:", response);
    } catch (error) {
      // THIS will print the full error message to the console so you can see exactly what's wrong
      console.error("Full EmailJS Error:", error); 
      setStatus("Failed. Check Console for details.");
    }
  };

// ... (your imports and logic)

export default function Home() {
  // ... (your return JSX)
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
