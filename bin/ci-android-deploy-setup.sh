#/bin/sh
set -e
# Install the sdk
brew install Caskroom/cask/android-sdk
# SDK Built Tools revision, per http://facebook.github.io/react-native/docs/getting-started.html
ANDROID_SDK_BUILD_TOOLS_REVISION=23.0.1
# API Level we build with
ANDROID_SDK_BUILD_API_LEVEL="23"
# Minimum API Level we target, used for emulator image
ANDROID_SDK_TARGET_API_LEVEL="19"

echo "Installing build SDK for Android API level $ANDROID_SDK_BUILD_API_LEVEL..."
yes | sdkmanager "platforms;android-$ANDROID_SDK_BUILD_API_LEVEL"
echo "Installing target SDK for Android API level $ANDROID_SDK_TARGET_API_LEVEL..."
yes | sdkmanager "platforms;android-$ANDROID_SDK_TARGET_API_LEVEL"
echo "Installing SDK build tools, revision $ANDROID_SDK_BUILD_TOOLS_REVISION..."
yes | sdkmanager "build-tools;$ANDROID_SDK_BUILD_TOOLS_REVISION"
echo "Installing Google APIs for Android API level $ANDROID_SDK_BUILD_API_LEVEL..."
yes | sdkmanager "add-ons;addon-google_apis-google-$ANDROID_SDK_BUILD_API_LEVEL"
# echo "Installing Android Support Repository"
# sdkmanager "extras;android;m2repository"

# ensure licenses are already accepted
# mkdir -p $ANDROID_HOME/licenses
# cp ./android/fastlane/android-sdk-license $ANDROID_HOME/licenses

# copy keystore properties
mkdir -p ~/.gradle
cp ./bin/gradle.properties ~/.gradle/gradle.properties
