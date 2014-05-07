# oneclickhangout.com [![Build Status](https://drone.io/github.com/ejhayes/oneclickhangout.com/status.png)](https://drone.io/github.com/ejhayes/oneclickhangout.com/latest)

Contains the source code for oneclickhangout.com

# preparing the extension

    rm -rf extensions/chrome/hangout.zip && cd extensions/chrome && zip -r hangout.zip hangout/ && cd -
    rm -rf extensions/chrome/on_air.zip && cd extensions/chrome && zip -r on_air.zip on_air/ && cd -

# PRO Versions

    rm -rf extensions/chrome/hangout_paid.zip && cp -r extensions/chrome/hangout extensions/chrome/hangout_paid && cd extensions/chrome && perl -p -i -e 's/(\s+"name":\s+".+)(",[\s*\n])/$1 PRO$2/' hangout_paid/manifest.json && zip -r hangout_paid.zip hangout_paid/ && rm -rf hangout_paid && cd -

    rm -rf extensions/chrome/on_air_paid.zip && cp -r extensions/chrome/on_air extensions/chrome/on_air_paid && cd extensions/chrome && perl -p -i -e 's/(\s+"name":\s+".+)(",[\s*\n])/$1 PRO$2/' on_air_paid/manifest.json && zip -r on_air_paid.zip on_air_paid/ && rm -rf on_air_paid && cd -

