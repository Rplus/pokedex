deploy: copy-assets build
	sh deploy.sh

build:
	npm run build;

# build-sw:
# 	workbox generateSW workbox-config.js;

genGM:
	node ./task/genGM.js

copy-assets:
	mkdir -p public; \
	cp -r ./assets/* ./public/
