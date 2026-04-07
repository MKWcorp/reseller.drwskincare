// Utility functions untuk Meta Pixel tracking

interface EventData {
  event_source_url?: string;
  user_data?: {
    em?: string; // email (hashed)
    ph?: string; // phone (hashed)
    fn?: string; // first name (hashed)
    ln?: string; // last name (hashed)
    ct?: string; // city (hashed)
    st?: string; // state (hashed)
    zp?: string; // zip code (hashed)
    country?: string; // country code
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    contents?: Array<{ id: string; quantity: number }>;
    num_items?: number;
    [key: string]: any;
  };
}

/**
 * Track event via client-side (fbq) and server-side (CAPI)
 */
export const trackMetaPixelEvent = async (
  eventName: string,
  eventData?: EventData
) => {
  try {
    // Client-side tracking
    if (typeof window !== 'undefined' && (window as any).fbq) {
      if (eventData?.custom_data) {
        (window as any).fbq('track', eventName, eventData.custom_data);
      } else {
        (window as any).fbq('track', eventName);
      }
    }

    // Server-side tracking via CAPI
    await fetch('/api/meta-pixel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: eventName,
        event_data: {
          ...eventData,
          event_source_url: window.location.href,
        },
      }),
    });
  } catch (error) {
    console.error('Error tracking Meta Pixel event:', error);
  }
};

/**
 * Track PageView event
 */
export const trackPageView = () => {
  trackMetaPixelEvent('PageView');
};

/**
 * Track ViewContent event
 */
export const trackViewContent = (data?: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}) => {
  trackMetaPixelEvent('ViewContent', {
    custom_data: data,
  });
};

/**
 * Track AddToCart event
 */
export const trackAddToCart = (data?: {
  content_name?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}) => {
  trackMetaPixelEvent('AddToCart', {
    custom_data: data,
  });
};

/**
 * Track InitiateCheckout event
 */
export const trackInitiateCheckout = (data?: {
  content_ids?: string[];
  num_items?: number;
  value?: number;
  currency?: string;
}) => {
  trackMetaPixelEvent('InitiateCheckout', {
    custom_data: data,
  });
};

/**
 * Track Purchase event
 */
export const trackPurchase = (data: {
  value: number;
  currency: string;
  content_ids?: string[];
  content_name?: string;
  num_items?: number;
}) => {
  trackMetaPixelEvent('Purchase', {
    custom_data: data,
  });
};

/**
 * Track Lead event
 */
export const trackLead = (data?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) => {
  trackMetaPixelEvent('Lead', {
    custom_data: data,
  });
};

/**
 * Track CompleteRegistration event
 */
export const trackCompleteRegistration = (data?: {
  content_name?: string;
  value?: number;
  currency?: string;
}) => {
  trackMetaPixelEvent('CompleteRegistration', {
    custom_data: data,
  });
};

/**
 * Track Contact event (button WhatsApp, phone, dll)
 */
export const trackContact = (data?: {
  content_name?: string;
  content_category?: string;
}) => {
  trackMetaPixelEvent('Contact', {
    custom_data: data,
  });
};

/**
 * Track custom event
 */
export const trackCustomEvent = (eventName: string, data?: EventData) => {
  trackMetaPixelEvent(eventName, data);
};
