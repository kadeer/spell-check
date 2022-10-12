Spell checker

# Screen recording
The screen recording can be found at https://1drv.ms/v/s!ArdmYX28fo59pSqHlq90ZFNKZCSJ?e=JLi7AS

# How to run
The project contains 2 parts, 
- `ui`: containing the UI for the application build in `React` / `TS` with `vite` for the toolchain
- `api`: containing the API for the application build in `PHP` using the `Symfony` framework


To run the API,
- cd into the `api` directory, 
	- install the `symfony` CLI from `https://symfony.com/download` (TLDR: run `brew install symfony-cli/tap/symfony-cli`), 
	- run `composer update` to grab the dependencies for the project
	- run `symfony server:start 127.0.0.1:8000`.

To run the UI, 
- cd into the `ui` directory, 
	- run `yarn` or `npm install` to pull the dependencies, 
	- `npm run dev` or `yarn dev` to start the UI and open the app in the browser at the  `http://localhost:5173/`.


# With docker-compose
Alternatively, the project can be run by downloading the `docker-compose.yml` into a directory and running `docker-compose up` in the directory, then visiting the UI at `http://localhost:5173/`. Unfortunately, this requires authentication to Github setup.