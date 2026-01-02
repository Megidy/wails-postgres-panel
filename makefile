build-app:
	@wails build --tags webkit2_41
start-dev:
	@wails dev --tags webkit2_41
gen-modules:
	@wails generate module
start-deps:
	@docker compose -f docker-compose.deps.yaml up -d
