'use client'; // <-- THIS IS MANDATORY for interactive pages

export default function Dashboard() {
  return (
    <main style={{ padding: '50px' }}>
      <h1>Welcome to your Private Dashboard</h1>
      <p>This page is only visible to the authorized user.</p>
      <button onClick={() => { 
        window.location.href = "/"; 
      }}>
        Go Home
      </button>
    </main>
  );
}