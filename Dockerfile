# Stage 1: Build frontend + install server deps
FROM node:22 AS builder
WORKDIR /app
COPY . ./
RUN echo "API_KEY=PLACEHOLDER" > ./.env
RUN echo "GEMINI_API_KEY=PLACEHOLDER" >> ./.env
WORKDIR /app/server
RUN npm install
WORKDIR /app
RUN mkdir -p dist
RUN bash -c 'if [ -f package.json ]; then npm install && npm run build; fi'
RUN cp -r public/* dist/ 2>/dev/null || true

# Stage 2: Production server
FROM node:22
WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "server.js"]
