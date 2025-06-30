'use client';

import { ConnectAddress } from '@/sections/connect-address';
import { MiddleSection } from '@/sections/middle-section';
import { NavbarSection } from '@/sections/navbar-section';
import { TouchIn } from '@/sections/touch-in';
import { useRef } from 'react';

export default function Home() {
  const callRef = useRef<HTMLElement>(null!);
  const addressRef = useRef<HTMLElement>(null!);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <NavbarSection
        scrollToSection={scrollToSection}
        call={callRef}
        address={addressRef}
      />
      <MiddleSection />
      <section ref={addressRef}>
        <ConnectAddress />
      </section>
      <section ref={callRef}>
        <TouchIn />
      </section>
    </>
  );
}
