package com.vitruvimobile.mapcompat;

import com.airbnb.android.react.maps.AirMapManager;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.List;

public class VmMapsPackage extends MapsPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        AirMapManager mapManager = new VmMapManager(reactContext);
        List<ViewManager> result = super.createViewManagers(reactContext);
        for (int i = 0, size = result.size(); i < size; i++) {
            if (mapManager.getName().equals(result.get(i).getName())){
                result.set(i, mapManager);
            }
        }
        return result;
    }
}
