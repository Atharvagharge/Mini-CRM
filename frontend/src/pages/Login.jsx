import React, { useEffect, useState } from 'react';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const start = () => {
    setIsLoading(true);
    window.location.href = `${BACKEND}/auth/google`;
  };

  // Add floating particles
  useEffect(() => {
    const particles = [];
    const container = document.querySelector('.background-particles');

    if (container) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';

        const size = Math.random() * 6 + 2 + 'px';
        particle.style.width = size;
        particle.style.height = size;

        container.appendChild(particle);
        particles.push(particle);
      }
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <>
      <div className="background-particles"></div>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          position: 'relative',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
          }}
        ></div>

        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '15%',
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        ></div>

        <div
          className="glass card fade-in-up"
          style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            overflow: 'visible',
          }}
        >
          {/* Glowing top border */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c)',
              borderRadius: '16px 16px 0 0',
              backgroundSize: '300% 100%',
              animation: 'gradientShift 3s ease infinite',
            }}
          ></div>

          {/* Logo/Icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: 'white',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              animation: 'glow 2s ease-in-out infinite alternate',
            }}
          >
            <i className="fas fa-users"></i>
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea, #f093fb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}
          >
            Mini CRM
          </h1>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '18px',
              marginBottom: '32px',
              lineHeight: '1.6',
            }}
          >
            Welcome to your Customer Relationship Management platform
          </p>

          <div
            style={{
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '16px',
                marginBottom: '16px',
                fontWeight: '600',
              }}
            >
              🚀 What you can do:
            </h3>
            <div style={{ textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-database" style={{ width: '16px' }}></i>
                <span>Ingest and manage customer data</span>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-users-cog" style={{ width: '16px' }}></i>
                <span>Create intelligent audience segments</span>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-paper-plane" style={{ width: '16px' }}></i>
                <span>Launch personalized campaigns</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-chart-line" style={{ width: '16px' }}></i>
                <span>Track delivery and engagement stats</span>
              </div>
            </div>
          </div>

          <button
            className="btn btn-google"
            onClick={start}
            disabled={isLoading}
            style={{
              fontSize: '16px',
              padding: '16px 32px',
              width: '100%',
              marginBottom: '24px',
              position: 'relative',
            }}
          >
            {isLoading && <div className="loading-spinner"></div>}
            <i className="fab fa-google" style={{ fontSize: '20px' }}></i>
            {isLoading ? 'Connecting...' : 'Sign in with Google'}
          </button>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            <i className="fas fa-shield-alt"></i> Secure authentication via Google OAuth
            <br />
            <span style={{ fontSize: '12px' }}>You'll be redirected to your dashboard after signing in</span>
          </p>

          {/* Floating icons */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '40px',
              height: '40px',
              background: 'rgba(245, 87, 108, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f5576c',
              animation: 'float 4s ease-in-out infinite',
            }}
          >
            <i className="fas fa-heart"></i>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '-15px',
              left: '-15px',
              width: '30px',
              height: '30px',
              background: 'rgba(102, 126, 234, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#667eea',
              animation: 'float 5s ease-in-out infinite reverse',
            }}
          >
            <i className="fas fa-star"></i>
          </div>
        </div>
      </div>
    </>
  );
}

