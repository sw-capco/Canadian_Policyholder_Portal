import http from 'node:http';
import { PassThrough } from 'node:stream';

function normalizeHeaders(headers) {
  return Object.fromEntries(Object.entries(headers || {}).map(([k, v]) => [String(k).toLowerCase(), v]));
}

export async function testRequest(app, { method = 'GET', url = '/', headers = {}, body } = {}) {
  const socket = new PassThrough();
  const reqStream = new PassThrough();
  const req = new http.IncomingMessage(reqStream);
  req.method = method;
  req.url = url;
  req.headers = normalizeHeaders(headers);

  const res = new http.ServerResponse(req);
  res.assignSocket(socket);

  const chunks = [];
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);
  res.write = (chunk, encoding, cb) => {
    if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
    return originalWrite(chunk, encoding, cb);
  };
  res.end = (chunk, encoding, cb) => {
    if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
    return originalEnd(chunk, encoding, cb);
  };

  const done = new Promise((resolve) => {
    res.on('finish', resolve);
  });

  if (body !== undefined) {
    // Avoid needing to stream/parse JSON in this sandboxed environment.
    // This mirrors what express.json would do for our route handlers.
    req.body = body;
    req._body = true;
  }
  reqStream.end();

  app.handle(req, res);
  await done;

  const rawBody = Buffer.concat(chunks).toString('utf8');
  const contentType = String(res.getHeader('content-type') || '');
  let parsedBody = rawBody;
  if (contentType.includes('application/json')) {
    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      parsedBody = null;
    }
  }

  return {
    status: res.statusCode,
    headers: res.getHeaders(),
    body: parsedBody,
    rawBody,
  };
}
