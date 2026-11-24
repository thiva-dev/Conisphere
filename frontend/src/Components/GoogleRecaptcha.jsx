import React, { useEffect, useRef } from 'react';

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export default function GoogleRecaptcha({ onTokenChange, resetTrigger }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const callbackRef = useRef(onTokenChange);

  // Latest callback function-ah eppovum update-la vaikum
  useEffect(() => {
    callbackRef.current = onTokenChange;
  }, [onTokenChange]);

  // Google script load aanadhum indha div-kulla real reCAPTCHA widget-ah render pannum
  useEffect(() => {
    let timerId;

    const tryRender = () => {
      if (window.grecaptcha && window.grecaptcha.render && containerRef.current) {
        if (containerRef.current.childElementCount === 0) {
          try {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
              sitekey: RECAPTCHA_SITE_KEY,
              callback: (token) => callbackRef.current(token),
              'expired-callback': () => callbackRef.current(''),
              'error-callback': () => callbackRef.current(''),
            });
          } catch (err) {
            console.error('reCAPTCHA render error:', err);
          }
        }
        clearInterval(timerId);
      }
    };

    tryRender();
    timerId = setInterval(tryRender, 250);

    return () => clearInterval(timerId);
  }, []);

  // Form submit aanadhum reCAPTCHA tick-ah automatic-aa reset pannum
  useEffect(() => {
    if (resetTrigger > 0 && widgetIdRef.current !== null && window.grecaptcha?.reset) {
      window.grecaptcha.reset(widgetIdRef.current);
      callbackRef.current('');
    }
  }, [resetTrigger]);

  return (
    <div className="my-1 overflow-x-auto">
      <div ref={containerRef} />
    </div>
  );
}