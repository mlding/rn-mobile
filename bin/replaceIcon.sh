#!/bin/bash
#set -x
WORK_DIR=$(pwd)
DOWLOAD="${HOME}/Downloads"
ICOMOON_DIR="icomoon"

cd $DOWLOAD
rm -rf $ICOMOON_DIR
LATEST_ZIP="icomoon_`date +%Y%m%d%H%M.zip`"
echo "Will unzip ${LATEST_ZIP}"
ls -t | grep 'icomoon.*.zip'| awk 'NR==1 {print $0}'|xargs -I % mv % $LATEST_ZIP
unzip $LATEST_ZIP -d $ICOMOON_DIR

cd $ICOMOON_DIR

ICON_FOLDER=$(pwd)

cd $WORK_DIR

cp "${ICON_FOLDER}/fonts/icomoon.ttf" "${WORK_DIR}/ios"
cp "${ICON_FOLDER}/fonts/icomoon.ttf" "${WORK_DIR}/android/app/src/main/assets/fonts/"
cp "${ICON_FOLDER}/selection.json" "${WORK_DIR}/src/assets/icons/"



