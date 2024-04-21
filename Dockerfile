FROM node:18

# target can be "dist" or "build"
ARG BUILD_TARGET=dist

ENV MONGO_URI "mongodb://mongodb:27017/kizanoStory"
ENV HOST 0.0.0.0
ENV PORT 3000

COPY server /tmp/server
COPY web /tmp/web

WORKDIR /tmp/server
RUN npm install && npm run ${BUILD_TARGET}

WORKDIR /tmp/web
RUN npm install && npm run ${BUILD_TARGET}

RUN mkdir -p /usr/share/story
RUN cp -av /tmp/server/dist /usr/share/story
RUN cp -av /tmp/web/dist /usr/share/story/web

EXPOSE ${PORT}

WORKDIR /usr/share/story
ENTRYPOINT [ "/usr/bin/node" ]
CMD [ "/usr/share/story/index.js" ]

