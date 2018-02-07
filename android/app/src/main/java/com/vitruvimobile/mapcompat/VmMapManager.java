package com.vitruvimobile.mapcompat;

import com.airbnb.android.react.maps.AirMapManager;
import com.airbnb.android.react.maps.AirMapView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;

public class VmMapManager extends AirMapManager {
    private final ReactApplicationContext appContext;

    public VmMapManager(ReactApplicationContext context) {
        super(context);
        appContext = context;
    }

    @Override
    protected AirMapView createViewInstance(ThemedReactContext context) {
        return new VmAirMapView(context, this.appContext, this, googleMapOptions);
    }
}
