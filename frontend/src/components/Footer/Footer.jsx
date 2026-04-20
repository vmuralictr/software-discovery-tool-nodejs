import omfImg from '../../images/openmainframe.png';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(to bottom, #044FC0, #000000)',
      color: '#ffffff',
      padding: '2.5rem 1.5rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <img
          src={omfImg}
          alt="Open Mainframe Project"
          style={{ maxWidth: '220px', objectFit: 'contain', marginBottom: '1.25rem' }}
        />
        <p style={{
          fontFamily: 'var(--font-family-poppins)',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.8)',
          maxWidth: '640px',
          margin: '0 auto 1.25rem',
          lineHeight: 1.6,
        }}>
          Package information is provided as-is. Availability may vary depending on your system configuration.
          Always verify packages through your distribution's official repositories.
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/openmainframeproject"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ffffff', fontFamily: 'var(--font-family-poppins)', fontSize: '14px', textDecoration: 'underline' }}
          >
            Source Code
          </a>
          <a
            href="https://github.com/openmainframeproject"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ffffff', fontFamily: 'var(--font-family-poppins)', fontSize: '14px', textDecoration: 'underline' }}
          >
            Data Repository
          </a>
          <a
            href="https://openmainframeproject.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ffffff', fontFamily: 'var(--font-family-poppins)', fontSize: '14px', textDecoration: 'underline' }}
          >
            Open Mainframe Project
          </a>
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-family-poppins)' }}>
          © {new Date().getFullYear()} Open Mainframe Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
