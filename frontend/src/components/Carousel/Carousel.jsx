import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ubuntuImg from '../../images/ubuntu.png';
import opensuseImg from '../../images/opensuse.png';
import debianImg from '../../images/debian.png';
import fedoraImg from '../../images/fedora.png';
import rockyImg from '../../images/rocky.png';
import redhatImg from '../../images/redhat.png';
import clefosImg from '../../images/clefos.png';
import zosImg from '../../images/zos.png';
import almalinuxImg from '../../images/almalinux.png';

const distros = [
  { name: 'Ubuntu', img: ubuntuImg },
  { name: 'OpenSUSE', img: opensuseImg },
  { name: 'Debian', img: debianImg },
  { name: 'Fedora', img: fedoraImg },
  { name: 'Rocky Linux', img: rockyImg },
  { name: 'Red Hat', img: redhatImg },
  { name: 'ClefOS', img: clefosImg },
  { name: 'IBM z/OS', img: zosImg },
  { name: 'AlmaLinux', img: almalinuxImg },
];

export default function Carousel() {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div style={{ padding: '2rem 2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <p style={{
        textAlign: 'center',
        fontFamily: 'var(--font-family-poppins)',
        fontSize: '16px',
        fontWeight: 700,
        letterSpacing: '0.18em',
        color: '#666666',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
      }}>
        SUPPORTED FOR
      </p>
      <Slider {...settings}>
        {distros.map((distro) => (
          <div key={distro.name} style={{ padding: '0 12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src={distro.img}
                alt={distro.name}
                style={{ height: '60px', objectFit: 'contain', margin: '0 auto' }}
              />
              <span style={{
                fontFamily: 'var(--font-family-poppins)',
                fontSize: '13px',
                fontWeight: 700,
                color: '#666666',
                textAlign: 'center',
              }}>
                {distro.name}
              </span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
