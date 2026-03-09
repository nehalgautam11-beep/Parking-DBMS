const mongoose = require('mongoose');

let cached = global.__mongooseCache;
if (!cached) {
  cached = global.__mongooseCache = { conn: null, promise: null };
}

const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizeMongoUri = (uri) => {
  const raw = String(uri || '').trim();
  if (!raw.startsWith('mongodb://') && !raw.startsWith('mongodb+srv://')) {
    return raw;
  }

  // Match protocol://username:password@host[/db][?query]
  const match = raw.match(/^(mongodb(?:\+srv)?:\/\/)([^:\/?#]+):(.+)@([^\/?#]+)(\/[^?]*)?(\?.*)?$/i);
  if (!match) return raw;

  const [, protocol, usernameRaw, passwordRaw, host, path = '', query = ''] = match;
  const username = encodeURIComponent(safeDecode(usernameRaw));
  const password = encodeURIComponent(safeDecode(passwordRaw.replace(/[<>]/g, '')));

  return `${protocol}${username}:${password}@${host}${path}${query}`;
};

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set');
  }

  const normalizedUri = normalizeMongoUri(process.env.MONGO_URI);
  if (!normalizedUri) {
    throw new Error('MONGO_URI is empty');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(normalizedUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
  }

  try {
    const conn = await cached.promise;
    cached.conn = conn.connection;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
};

module.exports = connectDB;
