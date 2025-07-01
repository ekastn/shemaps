import type { UserLocation } from "@/lib/types";

interface WebSocketServiceCallbacks {
    onOpen?: () => void;
    onMessage?: (message: any) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
}

class WebSocketService {
    private ws: WebSocket | null = null;
    private callbacks: WebSocketServiceCallbacks = {};
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000;

    private getWebSocketUrl = (deviceId: string | null) => {
        let wsUrl = import.meta.env.VITE_WS_URL
        if (deviceId) {
            wsUrl += `?deviceId=${deviceId}`;
        }
        return wsUrl;
    };

    public connect(callbacks?: WebSocketServiceCallbacks, deviceId?: string | null) {
    if (!deviceId) {
      deviceId = localStorage.getItem("device_id");
    }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    if (callbacks) {
      this.callbacks = callbacks;
    }

    this.ws = new WebSocket(this.getWebSocketUrl(deviceId));

        this.ws.onopen = () => {
            console.log("WebSocket connected");
            this.reconnectAttempts = 0; 
            this.callbacks.onOpen?.();
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.callbacks.onMessage?.(message);
        };

        this.ws.onclose = (event) => {
            console.log("WebSocket disconnected:", event.code, event.reason);
            this.ws = null;
            this.callbacks.onClose?.(event);

            // Attempt to reconnect if not a normal closure and within limits
            if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                console.log(
                    `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
                );
                setTimeout(() => this.connect(), this.reconnectDelay);
            }
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            this.callbacks.onError?.(error);
            this.ws?.close(); // Close the socket to trigger onclose and potential reconnect
        };
    }

    public disconnect() {
        if (this.ws) {
            this.ws.close(1000, "Client disconnected"); // 1000 is a normal closure code
            this.ws = null;
        }
    }

    public send(message: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket not open. Message not sent:", message);
        }
    }
}

export const websocketService = new WebSocketService();
