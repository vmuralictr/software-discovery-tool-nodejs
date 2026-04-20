import heroImg from '../images/hero-theme-pic.png';

export default function HeroSection() {
  return (
    <section style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      padding: '3rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Text */}
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontFamily: 'var(--font-family-outfit)',
          fontSize: '68px',
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1.1,
          marginBottom: '1.25rem',
        }}>
          Packages From any Source any Repository in One Place
        </h1>
        <p style={{
          fontFamily: 'var(--font-family-outfit)',
          fontSize: '26px',
          fontWeight: 700,
          color: '#000000',
        }}>
          Discover open-source software for zArchitecture / s390x
        </p>
      </div>

      {/* Image */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }} className="hero-image-wrapper">
        <img
          src={heroImg}
          alt="IBM Z Software Discovery"
          style={{ maxWidth: '100%', width: '100%', objectFit: 'contain' }}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-image-wrapper { display: none !important; }
          section h1 { font-size: 36px !important; }
          section p { font-size: 20px !important; }
        }
      `}</style>
    </section>
  );
}
