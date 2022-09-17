#!/usr/bin/env bash

# stand up a Postgres instance
docker run --name task-management_dev \
    -p 5432:5432 \
    -e 'POSTGRES_PASSWORD=P@ssw0rd' \
    -d postgres:14
