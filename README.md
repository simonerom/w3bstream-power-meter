# Build a Web3-ready Smart Energy Meter using Raspberry Pi and W3bstream  
![image](https://github.com/simonerom/w3bstream-power-meter/assets/11096047/1a9d592e-36e0-4cf1-a01f-164d7bf997ee)

## Introduction
This tutorial guides you through the process of building a smart power meter using a Raspberry Pi and integrating it with the W3bstream network. This project combines Internet of Things (IoT) and blockchain technology to create a smart energy grid that not only tracks energy usage but also incentivizes energy-efficient behavior. By the end of the tutorial, you will have a fully functional power meter that can send energy readings to the W3bstream network, enabling its use in decentralized projects.

### Hardware used
For this tutorial, the following hardware components have been used:

- Raspberry Pi. Any model should work, including the Raspberry Pi Zero W.  
- Display: [Adafruit ST7735 1.8" 160x128 display breakout](https://www.adafruit.com/product/358) . Any ST7735 based breakout board should work.  
- Current sensor: [Adafruit INA219 breakout](https://www.adafruit.com/product/904). Any INA219 based breakout board should work.  

### What you will build
By following this tutorial, you will:

- Learn the basics of building a Decentralized Physical Infrastructure (DePIN) project using W3bstream.
- Create a smart energy meter device using a Raspberry Pi, an energy sensor, a TFT display, a power supply, and some LED lights.
- Build and install the services on the Raspberry Pi to collect energy data from the sensor and display it.
- Develop a fully functional power meter that tracks energy usage and is ready to be used in W3bstream-based DePIN projects.

By the end, you will have a fully functional smart meter “demo device” that tracks energy usage, and is ready to be used in W3bstream-based DePIN projects. You can find a tutorial on how to create the decentralized part of this project using w3bstream here: https://developers.iotex.io/posts/building-an-energy-efficient-smart-grid-that-rewards-responsible-users-with-w3bstream-and-the-iotex-blockchain

### The project architecture
Here is a simplified architecture for a DePIN (Decentralized Physical Infrastructure) application that can be used to implement a smart energy grid, leveraging the smart meter created in this tutorial. The architecture involves three main components: smart meters, the W3bstream project, and the IoTeX blockchain (although other blockchains can be utilized).

![image](https://github.com/simonerom/w3bstream-power-meter/assets/11096047/90175b0d-b719-4f7c-993d-308626a19434)

Firstly, multiple smart meters are deployed to collect energy consumption data. These smart meters are designed to send the gathered data to a W3bstream project, enabling seamless integration with the network.

Secondly, the logic of the energy grid is deployed on the W3bstream network. This entails implementing the necessary algorithms and functionalities to manage and optimize energy distribution, consumption, and incentives. By utilizing W3bstream's capabilities, the energy grid can benefit from the decentralized nature and inherent security of blockchain technology.

Lastly, the IoTeX blockchain is employed to trigger token rewards to users based on their energy consumption patterns. A predefined incentive model is utilized to determine the distribution of tokens, ensuring that users who exhibit energy-efficient behaviors are appropriately rewarded. 

It's important to note that each smart meter has its own identity stored on a blockchain, which is used for device authorization and data validation within the W3bstream logic.

Let's get started!

## IoT data
In order to enable real-time energy monitoring, the device will calculate the average energy consumption over a 5-second window and send a data message to the W3bstream endpoint. The message structure will resemble the following JSON format:
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
Here, the `sensor_reading` represents the averaged energy consumption over 5 seconds, and `timestamp` denotes the time when the calculation was made. The `public_key` corresponds to a unique identifier generated within the device, while the `signature` is the corresponding signature of the nested data object, produced using elliptic curve cryptography (in this case, utilizing curve secp256r1).

## Final demo device
Shown below is an image of the final demo device:

![image](https://github.com/simonerom/w3bstream-power-meter/assets/11096047/84ed1473-c540-418c-b0d5-000432fe0140)

### Energy Consumption
For this project, I have designed a simple demo device. It features a circuit comprising six LED lights that can be powered at 12V, each drawing approximately 2W of power. The LED lights are arranged in three parallel pairs, with each pair connected to one of three manual switches. This setup  simulates the energy consumption of different appliances within a hypothetical building.

![image](https://github.com/simonerom/w3bstream-power-meter/assets/11096047/3226a6df-b31e-4cd0-8d7a-d60dcb063137)

The load can be controlled by manipulating the switches, allowing for energy consumption levels of 4W, 8W, and 12W. A 12V power supply is used to energize the circuit, and an INA219 digital power sensor is connected in series with the positive line of the power supply. This sensor accurately measures the actual power consumption of the circuit.

### Energy Meter
To implement the energy meter, a Raspberry Pi 3b was employed. The W3bstream client SDK, which facilitates the required cryptography, is available for Raspberry Pi 3b as well as other platforms such as ESP32 and mobile devices. Although the SDK is currently undergoing significant development, it already provides an implementation of the PSA crypto layer.

In addition to the Raspberry Pi, an ST7735-based TFT display (160x320 pixels) is connected. This display will showcase real-time power consumption data, as well as the corresponding blockchain rewards that users will receive based on their current energy consumption. Remember, the lower the consumption, the higher the rewards!

## The connections
To connect the sensor and the display to the Raspberry Pi, follow the diagram provided below:

<img width="1320" alt="image" src="https://github.com/simonerom/w3bstream-power-meter/assets/11096047/a65a1904-af0a-49ee-af5c-32e370152f24">

Double-check the connections to ensure they are secure and accurate. Once everything is properly connected, we can proceed to the next steps.

## Device firmware
On the software side, this device utilizes the W3bstream IoT SDK power-meter example to create a device identity in the form of a public/private key pair stored on the Raspberry Pi. Please note that the Raspberry Pi does not provide a hardware secure element for securely generating and storing private keys. In the future, as more boards are supported by the SDK, these elements can be utilized to enhance the security of the device identity.

### Configure Raspberry Pi Network
It's assumed you have already flashed an SD card for your Raspberry Pi using the official Raspberry Imager tool, and using the official Raspberry OS Lite or Full (no desktop needed). The Imager tool also allows you to configure the WiFi network. However, if you need to reconfigure the network at a later time you can follow the instructions below:

1. Create a file named wpa_supplicant.conf and place it in the /boot directory.
2. Edit the wpa_supplicant.conf file with the following content, adjusting it based on your actual location and network settings:
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

Alternatively, if you are connecting to a password-less Wi-Fi network during the development phase, use the following configuration:

```json
network={
        ssid="SSID_for_NEW_Network"
        priority=80
        key_mgmt=NONE
}
```

Once the configuration file is set, start your Raspberry Pi, and it should connect to your Wi-Fi network. After that, proceed to the next steps.

### Download the project files
To download the project files, follow these steps:

1. Clone the repository and navigate to the raspberry_pi folder.
2. Open a terminal and change the directory to the raspberry_pi folder.
3. Run the following script to ensure that all the necessary packages and libraries are installed on your Raspberry Pi:

```bash
git clone [ repo url ]
cd raspberry_pi
./install-requirements.sh
```

Please notice that you will need to create W3bstream project and generate a devie authorization token, you can do this step by [accessing W3bstream](https://docs.w3bstream.com/get-started/access-w3bstream) and  following the [video how-tos](https://docs.w3bstream.com/get-started/video-how-to): , however we will not go through the creation of a full W3bstream project to implement a smart grid, here you can find a full tutorial on how to build such an example: https://developers.iotex.io/posts/building-an-energy-efficient-smart-grid-that-rewards-responsible-users-with-w3bstream-and-the-iotex-blockchain

After creating your W3bstream project and at least one device token, replace the values of `publisher_token` and `publish_url` in the main.cpp file with the corresponding values for your project. You can obtain the publish URL for your project in the settings section, and the publisher token from the devices tab. 

### Build the Firmware

To build the client application, use the following commands:

```bash
mkdir build-out
cmake -DGIT_SUBMODULE_UPDATE=ON -S ./ -B ./build-out
cmake --build build-out --target power-meter
```

If the build process is successful, you should see an executable named `power-meter` inside the `build-out` directory.

### Run the Frontend (display)

The display is controlled by a Python script. Run the following command to execute it:

```bash
python3 display.py
```
You may want to edit python.py to account for a different wiring for your display.
Please note that the current reading value will not be updated unless you also run the backend.

### Run the backend

Execute the following command to run the backend service, that is incharge of reading the sensor and sending the IoT data messages to the W3bstream project:

```bash
chmod +x build-out/power-meter
./build-out/power-meter
```  

### Installation

To automatically start the application when the device powers on, you can install it as a service using the provided install script. Run the following command to install the application:

```bash
./install.sh
```

Note: This assumes that the user of the Raspberry Pi is the default user (pi). If you are using a different user, make sure to adjust the `storage_path` accordingly in the installation script.

### What does the installation script do?

The installation script performs the following tasks:

1. Builds the SDK and the example.
2. Creates two `systemctl` units (_daemons_):
   - **power-meter** (backend): This is the main C++ script responsible for reading the sensor data, sending it to W3bstream, and writing it to a file located in `/home/pi/data/power-meter/`.
   - **power-meter-display** (frontend): This is the display script that reads the data from the files and displays it on the screen.
3. Enables the services and starts them. The services will also automatically start on power-up and in case of failure.

### How to check if the services are running?
To check the status of the services, use the following commands:

Backend:  

```bash
sudo systemctl status power-meter
```

Frontend:  

```bash
sudo systemctl status power-meter-display
```

### How to start/stop/restart the services?
To start, stop, or restart the services, use the following commands:

Backend:  

```bash
sudo systemctl start/stop/restart power-meter
```

Frontend:  

```bash
sudo systemctl start/stop/restart power-meter-display
```

### How to enable/disable the services on startup?
To enable or disable the services to automatically start on boot:

Backend:  

```bash
sudo systemctl enable/disable power-meter
```

Frontend:  

```bash
sudo systemctl enable/disable power-meter-display
```
