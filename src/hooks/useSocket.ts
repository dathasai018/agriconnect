import { useEffect, useRef, useCallback } from 'react';

const WS_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'ws://localhost:5000'
  : 'wss://agriconnect-api-q2bv.onrender.com';

type MessageHandler = (event: string, data: unknown) => void;

export function useSocket(centreId?: string, onMessage?: MessageHandler) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    if (!isMounted.current) return;
    const token = localStorage.getItem('agri_token');
    const url = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (centreId) ws.send(JSON.stringify({ type: 'join:centre', centreId }));
      };

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data) as { event: string; data: unknown };
          if (msg.event && onMessage) onMessage(msg.event, msg.data);
        } catch (_) {}
      };

      ws.onclose = () => {
        if (isMounted.current) {
          reconnectRef.current = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => { ws.close(); };
    } catch (_) {
      // Backend not running — silently fail in dev
    }
  }, [centreId, onMessage]);

  useEffect(() => {
    isMounted.current = true;
    connect();
    return () => {
      isMounted.current = false;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const send = useCallback((type: string, data?: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, ...((data as object) || {}) }));
    }
  }, []);

  return { send };
}
