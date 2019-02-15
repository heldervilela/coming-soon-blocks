#!/bin/bash

# Enable nicer messaging for build status
YELLOW_BOLD='\033[1;33m';
COLOR_RESET='\033[0m';
status () {
    echo -e "${YELLOW_BOLD}$1${COLOR_RESET}"
}

# Exit if any command fails
set -e

read -p "Do you want to compile the plugin Boss? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then

    # Change to the expected directory
    #cd "$(dirname "$0")"
    #cd ..
    status "Update translations."
    gulp translate --silent

    status "Cleaning cache."
    gulp clearCache --silent
    gulp clean --silent

    status "Build assets to produtction."
    npm run build

    status "Copy files."
    gulp copy --silent

    status "Remove files for production."
    gulp removeProductionFiles --silent
    gulp removeStyleFiles --silent

    status "Update translations."
    gulp translate --silent
    # wp i18n make-pot . --merge=./__build/coming-soon-blocks/languages/coming-soon-blocks-js.pot --skip-js

    status "Replace development variables."
    gulp variables --silent

    status "Building zip."
    gulp zip --silent

    status "🚀"

fi
