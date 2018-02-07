package com.vitruvimobile.googleservice;

import android.app.Dialog;
import android.content.DialogInterface;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;


public class CheckGooglePlayServicesModule extends ReactContextBaseJavaModule {
    public final ReactApplicationContext reactContext;

    public CheckGooglePlayServicesModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "CheckGooglePlayServices";
    }

    @ReactMethod
    public void checkGooglePlayServices(final Callback resultCb) {
        final int result = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(this.getCurrentActivity());
        try {
            resultCb.invoke(result);
        } catch (Exception e) {
        }
    }

    @ReactMethod
    public void showErrorDialog(int resultCode, final Callback errorDialogDismissCb) {
        if (resultCode == ConnectionResult.SUCCESS) {
            throw new IllegalArgumentException("Can not pass success code");
        }
        Dialog dialog = GoogleApiAvailability.getInstance().getErrorDialog(this.getCurrentActivity(), resultCode, 0);
        dialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
            @Override
            public void onDismiss(DialogInterface dialog) {
                try {
                    errorDialogDismissCb.invoke();
                } catch (Exception e) {}
            }
        });
        dialog.show();
    }
}

