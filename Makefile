.PHONY: build run build-test run-test

build:
	(docker container stop cyber-integration || true) && \
	(docker container rm cyber-integration || true) && \
 	(docker image rm cyber-integration || true) && \
 	docker compose build --no-cache cyber-integration

run:
	docker compose up cyber-integration -d && \
	docker cp cyber-integration:/app/node_modules ./

build-test:
	(docker container rm cyber-integration-test || true) && \
 	(docker image rm cyber-integration-test || true) && \
 	docker compose build cyber-integration-test

run-test:
	docker compose up cyber-integration-test
