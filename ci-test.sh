apk add binutils-gold curl g++ gcc gnupg libgcc linux-headers make python3-dev git openssl openssh bash lcms2-dev libpng-dev autoconf automake
curl -s "https://gitlab.com/api/v4/projects/9905046/repository/files/gitlab%2Fsetup_key.sh/raw?ref=master&private_token=FjCQxPFMNXJwmaomMoKi" 2>&1 | sh
ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts
npm install npm@6.14.16 -g
npm install --only=dev

source run.local.test.sh

node tools/coverage_output.js
