package com.vitruvimobile;

import android.app.Application;
import com.beefe.picker.PickerViewPackage;
import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import com.wix.interactable.Interactable;
import com.liyuan.pdfviewer.PdfViewerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.oblador.keychain.KeychainPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.vitruvimobile.googleservice.CheckGooglePlayServicesPackage;
import com.vitruvimobile.mapcompat.VmMapsPackage;
import com.rnfs.RNFSPackage;
import io.fabric.sdk.android.Fabric;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new Interactable(),
            new PdfViewerPackage(),
            new SplashScreenReactPackage(),
            new RNDeviceInfo(),
            new FIRMessagingPackage(),
          new RNFSPackage(),
          new ImagePickerPackage(),
          new VmMapsPackage(),
          new PickerViewPackage(),
          new KeychainPackage(),
          new VectorIconsPackage(),
          new CheckGooglePlayServicesPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
