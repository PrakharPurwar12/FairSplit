.PHONY: format lint check

format:
	black backend/
	isort --profile black backend/

lint:
	flake8 backend/ --max-line-length=120 --extend-ignore=E203,E501,W503 --exclude=*/migrations/*,myenv/*

check:
	black --check backend/
	isort --check-only --profile black backend/
	flake8 backend/ --max-line-length=120 --extend-ignore=E203,E501,W503 --exclude=*/migrations/*,myenv/*
