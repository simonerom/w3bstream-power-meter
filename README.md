# w3bstream-power-meter
![image](https://github.com/simonerom/w3bstream-power-meter/assets/11096047/1a9d592e-36e0-4cf1-a01f-164d7bf997ee)

# Introduction
Energy conservation and efficiency have become increasingly important in our world today, as we strive to reduce our carbon footprint and combat climate change.
With the advent of the Internet of Things (IoT) and blockchain technology, it is now possible to build smart energy grids that not only track energy usage but also incentivize energy-efficient behavior by rewarding users who tune their energy consumption based on the status of the grid. 
This tutorial will guide you through the process of building a smart power meter that can send energy readings to the W3bstream network, using a Raspberry Pi. 
Such device could be used in a smart grid,  whose logic is deployed on W3bstream, that collects data and implements some sort of blockchain-based incentive model for energy-efficient users.

# What will you learn
By the end of this tutorial, you will:
- Create a smart energy meter using a Raspberry Pi, an energy sensor, a power supply and some led lights 
- Create a Linux service in C++ that collects energy data from the sensor
- Use the W3bstream IoT SDK to create a blockchain account for the device, use it to sign the data
- Send the energy data to W3bstream using the HTTP protocol
- View the data message in the W3bstream project log

By the end, you will have a fully functional power meter “demo” that tracks energy usage, and is ready to be used in W3bstream-based DePIN projects.

Let's get started!

# Architecture
The diagram below shows a simple architecture of a DePIN applictaion where the logic of the energy grid is deployed to the W3bstream network, the smart meters send energy readings to W3bstream, and the IoTeX blockchain is used to trigger token rewards to users according to some incentive logic. 

![image](https://github.com/simonerom/w3bstream-power-meter/assets/11096047/90175b0d-b719-4f7c-993d-308626a19434)

It's worth saying that each smart meter should have its own identity stored on be authorized to send data to the W3bstream logic
Before we start, let's look at every single component of this project in detail.

# The IoT data
We just want the power-meter device to send real-time energy consumption to the W3bstream network: it will average the energy over a 5s window and send a data message to the W3bstream endpoint that looks like this:
```json
{  
  "data": { 
    "sensor_reading": 134.7,    
    "timestamp": 1677091161  
  },  
  "signature": "00000008000000000200000000000000ffffffe042fff...100000000000000",
  "public_key": "04abbd9bb8f6a2928d179e9f83f265f5f0a6994f8...934dd47a0cbae9d555" 
}
```


# The device
## The final demo device
The image below shows how my final demo device looks like:
![image](https://github.com/simonerom/w3bstream-power-meter/assets/11096047/84ed1473-c540-418c-b0d5-000432fe0140)

## The “Energy Consumption” section
For this project, I've designed a simple demo device: on one side, I put a simple circuit of 6 12V LED lights that can be powered on/off by means of 3 switches. The LED lights use ~2W of power each, and they are configured in three parallel couples, each one driven by a switch. This circuit will simulate the energy consumption by different appliances inside the building.
![image](https://github.com/simonerom/w3bstream-power-meter/assets/11096047/3226a6df-b31e-4cd0-8d7a-d60dcb063137)


Using switches, we can configure power consumption across 4W, 8W and 12W. I also put an INA219 digital power sensor on the positive line of the power supply, to gauge the actuall power consumption of the circuit.

## The “Energy Meter” section
At the time of writing, the W3bstream IoT SDK is currently available only for Linux-based devices. Therefore, I have designed the power meter using a Raspberry Pi Zero W. However, I will update the tutorial with a different board once the SDK supports more devices. The Raspberry Pi is also connected to an ST7735-based TFT display (160x320 pixels), where I want to show the real-time power consumption and the corresponding rewards.

![image](https://github.com/simonerom/w3bstream-power-meter/assets/11096047/b7d6659f-53df-4d8e-8e9b-98fb467e4874)



## The connections
The image below shows how I connected the sensor and the display to the Raspberry Pi:

![image](https://github.com/simonerom/w3bstream-power-meter/assets/11096047/9db7859c-e3d1-44b9-9471-543181299078)


# The device firmware
On the software side, this device uses the W3bstream IoT SDK power-meter example to create a device identity in the form pf a public/private key pair that is stored on the Raspberry Pi. Unfortunately the Raspberry Pi does not provide any hardware secure element to securely generate and store private keys: once more boards will be supported by the SDK, these elements can be used to make the device identity more secure.  

## Configure Raspberry Pi Network
Put wpa_supplicant.conf into /boot with the content below (edit based on your real location and network settings):

```json
country=GB
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
network={
        ssid="Old_Network_SSID"
        priority=90
        psk="Password_for_OLD_network"
}
network={
        ssid="SSID_for_NEW_Network"
        priority=80
        psk="Password_for_new_network"
}
```

or, just in case, if during the development phase you are connecting to a wifi network without a password:

```json
network={
        ssid="SSID_for_NEW_Network"
        priority=80
        key_mgmt=NONE
}
```

