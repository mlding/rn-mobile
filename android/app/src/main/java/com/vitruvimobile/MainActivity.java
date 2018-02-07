package com.vitruvimobile;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "VitruviMobile";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }

    /**
     * Prevent React activity being killed when press android back button
     * Make JS thread to run in background mode
     */
    @Override
    public void invokeDefaultOnBackPressed() {
        moveTaskToBack(true);
    }
}
