FROM debian:jessie

WORKDIR /openlmis-referencedata-ui

COPY package.json .
COPY package-yarn.json .
COPY config.json .
COPY src/ ./src/
COPY build/messages/ ./build/messages/
