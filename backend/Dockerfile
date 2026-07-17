# ════════════════════════════════════════════════════════
#  TacticBord Backend — Dockerfile
#  Pakai node:sqlite bawaan Node 22+, jadi TIDAK butuh
#  python3/make/g++ untuk kompilasi native seperti
#  better-sqlite3. Image jauh lebih ringan & cepat build.
# ════════════════════════════════════════════════════════
FROM node:22-alpine

WORKDIR /app

# Install dependencies dulu (cache layer terpisah dari source code)
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy source code
COPY . .

# Direktori data SQLite (di-mount sebagai volume agar persist)
RUN mkdir -p /app/data
VOLUME ["/app/data"]

ENV PORT=8787
ENV DATA_DIR=/app/data
EXPOSE 8787

# --experimental-sqlite wajib karena node:sqlite masih flag experimental di Node 22
CMD ["node", "--experimental-sqlite", "server.js"]
