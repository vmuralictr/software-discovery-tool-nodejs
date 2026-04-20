import { useState } from 'react';
import faqData from './faq_data';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{
        fontFamily: 'var(--font-family-outfit)',
        fontSize: '68px',
        fontWeight: 700,
        color: '#000000',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        FAQ
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faqData.map((item, i) => (
          <div
            key={i}
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #dddddd',
            }}
          >
            <button
              onClick={() => toggle(i)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: '#f1f4ff',
                border: 'none',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-family-poppins)',
                fontSize: '22px',
                fontWeight: 700,
                color: '#044FC0',
                flexShrink: 0,
                lineHeight: 1,
              }}>
                {openIndex === i ? '−' : '+'}
              </span>
              <span style={{
                fontFamily: 'var(--font-family-poppins)',
                fontSize: '20px',
                fontWeight: 700,
                color: '#2c3148',
              }}>
                {item.question}
              </span>
            </button>
            {openIndex === i && (
              <div style={{
                background: '#ffffff',
                padding: '1rem 1.5rem 1rem 3.5rem',
                borderTop: '1px solid #dddddd',
              }}>
                <p style={{
                  fontFamily: 'var(--font-family-poppins)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#303243',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
