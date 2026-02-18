import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: React.ReactNode;
}

const ModalPortal: React.FC<ModalPortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const portalRoot = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Ensure we have a dedicated portal container at the root of <body>
    let el = document.getElementById('modal-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-root';
      document.body.appendChild(el);
    }
    portalRoot.current = el;
    setMounted(true);

    return () => {
      // Clean up only if we created the element and it's empty
      if (el && el.childNodes.length === 0) {
        el.remove();
      }
    };
  }, []);

  if (!mounted || !portalRoot.current) return null;

  return createPortal(children, portalRoot.current);
};

export default ModalPortal;
