#!/bin/sh

yarn install --frozen-lockfile

yarn prisma migrate deploy

echo "Container is ready"

tail -f /dev/null
