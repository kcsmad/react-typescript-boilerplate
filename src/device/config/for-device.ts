const forDevice = (device) => {
    return (target) => {
        Object.defineProperty(target, 'supportedDevices', {
            value: device,
            writable: false,
        });

        return target
    }
};