import { Server } from 'ws';
import { parse } from 'url';
import type { NextApiRequest } from 'next';
import { getServerSession } from 'next-auth';

interface WebSocketConnection extends WebSocket {
  organizationId?: number;
  userId?: number;
  isAlive?: boolean;
}

const connections = new Map<string, WebSocketConnection>();

function heartbeat(this: WebSocketConnection) {
  this.isAlive = true;
}

if (!global.wss) {
  global.wss = new Server({ noServer: true });

  global.wss.on('connection', (ws: WebSocketConnection, req) => {
    const { query } = parse(req.url!, true);
    const organizationId = parseInt(query.organizationId as string);
    const userId = parseInt(query.userId as string);

    ws.organizationId = organizationId;
    ws.userId = userId;
    ws.isAlive = true;

    const connectionId = `${organizationId}:${userId}`;
    connections.set(connectionId, ws);

    ws.on('pong', heartbeat);

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        // Handle incoming messages if needed
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('close', () => {
      connections.delete(connectionId);
    });
  });

  // Heartbeat interval to check connection status
  setInterval(() => {
    global.wss.clients.forEach((ws: WebSocketConnection) => {
      if (ws.isAlive === false) {
        const connectionId = `${ws.organizationId}:${ws.userId}`;
        connections.delete(connectionId);
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);
}

export default async function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.ws) {
    res.socket.server.ws = global.wss;

    res.socket.server.on('upgrade', async (request: any, socket: any, head: any) => {
      const session = await getServerSession(request);
      if (!session?.user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      res.socket.server.ws.handleUpgrade(request, socket, head, (ws) => {
        res.socket.server.ws.emit('connection', ws, request);
      });
    });
  }

  res.end();
}

export const broadcastToOrganization = (
  organizationId: number,
  type: string,
  payload: any
) => {
  connections.forEach((ws, connectionId) => {
    if (
      ws.organizationId === organizationId &&
      ws.readyState === ws.OPEN
    ) {
      ws.send(JSON.stringify({ type, payload }));
    }
  });
};

export const sendToUser = (
  organizationId: number,
  userId: number,
  type: string,
  payload: any
) => {
  const connectionId = `${organizationId}:${userId}`;
  const ws = connections.get(connectionId);
  
  if (ws?.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  }
}; 