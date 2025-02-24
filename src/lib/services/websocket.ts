interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
}

export class WebSocketService {
  private static instance: WebSocket | null = null;
  private static listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  static initialize(organizationId: number, userId: number) {
    if (this.instance) {
      this.instance.close();
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    this.instance = new WebSocket(`${wsUrl}/ws?organizationId=${organizationId}&userId=${userId}`);

    this.instance.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.instance.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        const { type, payload } = data;

        const listeners = this.listeners.get(type);
        if (listeners) {
          listeners.forEach((listener) => listener(payload));
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    this.instance.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.instance.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        this.initialize(organizationId, userId);
      }, 5000);
    };
  }

  static subscribe<T = unknown>(type: string, callback: (data: T) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    const listeners = this.listeners.get(type)!;
    listeners.add(callback as (data: unknown) => void);

    return () => {
      listeners.delete(callback as (data: unknown) => void);
      if (listeners.size === 0) {
        this.listeners.delete(type);
      }
    };
  }

  static send<T = unknown>(type: string, payload: T) {
    if (this.instance?.readyState === WebSocket.OPEN) {
      this.instance.send(JSON.stringify({ type, payload }));
    }
  }

  static close() {
    if (this.instance) {
      this.instance.close();
      this.instance = null;
    }
    this.listeners.clear();
  }
} 