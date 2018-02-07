package com.vitruvimobile.mapcompat;

import com.airbnb.android.react.maps.AirMapManager;
import com.airbnb.android.react.maps.AirMapView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.gms.maps.GoogleMapOptions;

public class VmAirMapView extends AirMapView{
    public VmAirMapView(ThemedReactContext reactContext,
                        ReactApplicationContext appContext,
                        AirMapManager manager,
                        GoogleMapOptions googleMapOptions) {
        super(reactContext, appContext, manager, googleMapOptions);
    }

    @Override
    public void fitToCoordinates(ReadableArray coordinatesArray, ReadableMap edgePadding, boolean animated) {
        if (map == null) {
            return;
        }
        super.fitToCoordinates(coordinatesArray, edgePadding, animated);
    }
}
