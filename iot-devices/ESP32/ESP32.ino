#include "secrets.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include "WiFi.h"
#include "DHT.h"

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH1106.h>

#define MQTT_SUB_LAMP1 "esp32/lamp1"
#define MQTT_SUB_FURNACE "esp32/furnace"
#define MQTT_SUB_DOORS "esp32/door"
#define MQTT_PUB_SENSORS "esp32/sensors"
#define LEDPIN 13
#define NUMPIXELS 8
#define DHTPIN 15
#define DHTTYPE DHT11
#define OLED_SDA 21
#define OLED_SCL 22


Adafruit_SH1106 display(21, 22);
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS,LEDPIN, NEO_GRB + NEO_KHZ800);
DHT dht(DHTPIN, DHTTYPE);

WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);
unsigned long currentTime, currentTime2;
unsigned long lastTime, lastTime2;
float humidity;
float temp;
int furnaceValue = 50;
String doorState = "zamkniete";

void reconnect() {
  Serial.println("Connecting to MQTT Broker...");
  while (!client.connected()) {
      Serial.println("Reconnecting to MQTT Broker..");
      String clientId = "ESP32Client-";
      clientId += String(random(0xffff), HEX);
      
      if (client.connect(clientId.c_str())) {
        Serial.println("Connected.");
        // subscribe to topic
        client.subscribe(MQTT_SUB_LAMP1);
      }
      
  }
}
void messageHandler(char* topic, byte* payload, unsigned int length)
{
  Serial.print("incoming: ");
  Serial.println(topic);
/*##################### Lamp 1 #####################*/
  if ( strstr(topic, "esp32/lamp1") )
  {
    StaticJsonDocument<200> doc;
    deserializeJson(doc, payload);
    String lampIndex = doc["lampIndex"];
    String colorR = doc["colorR"];
    String colorG = doc["colorG"];
    String colorB = doc["colorB"];
    String brightness = doc["brightness"];
    String state = doc["state"];
    int index = lampIndex.toInt() - 1;
    int colR = colorR.toInt();
    int colG = colorG.toInt();
    int colB = colorB.toInt();
    int bright = ceil(brightness.toFloat()*255);
    int lampState = state.toInt();
    Serial.println(lampState);
    if(lampState == 1){ 
    pixels.setPixelColor(index, pixels.Color(colR*bright/255,colG*bright/255,colB*bright/255));
    pixels.show(); // This sends the updated pixel color to the hardware.
      Serial.print("Lamp changed color");
    }
    else if(lampState == 0){
      pixels.setPixelColor(index, pixels.Color(0,0,0)); 
      pixels.show();
      }
  }
  if ( strstr(topic, "esp32/furnace") )
  {
    StaticJsonDocument<200> doc;
    deserializeJson(doc, payload);
    String furnaceVal = doc["furnaceValue"];
    furnaceValue = furnaceVal.toInt();
  }
  if ( strstr(topic, "esp32/door") )
  {
    StaticJsonDocument<200> doc;
    deserializeJson(doc, payload);
    String door = doc["door"];
    if (door == "true") {
      doorState="zamkniete";
    }
    if (door =="false"){
      doorState = "otwarte";
      }
    
  }
}
 
void publishMessage(float hum, float temp)
{
  StaticJsonDocument<200> doc;
  doc["deviceId"] = THINGNAME;
  doc["humidity"] = hum;
  doc["temperature"] = String(temp);
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client
  client.publish(MQTT_PUB_SENSORS, jsonBuffer);
  Serial.println("MQTT message published:");
  Serial.println(jsonBuffer);
}

void useOLED()
{
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(5,0);
  display.println("Temp pieca");
  display.setCursor(50,20);
  display.println(furnaceValue);
  display.setCursor(0,50);
  display.setTextSize(1);
  display.print("Drzwi: ");
  display.print(doorState);
  display.display();
  display.clearDisplay();
  }

void setup()
{
  display.begin(SH1106_SWITCHCAPVCC, 0x3C); 
  display.clearDisplay();
  pixels.begin();
  dht.begin();
  Serial.begin(115200);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
 
  Serial.println("Connecting to Wi-Fi");
 
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
 
  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);
 
  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.setServer(AWS_IOT_ENDPOINT, 8883);
 
  // Create a message handler
  client.setCallback(messageHandler);
 
  Serial.println("Connecting to AWS IOT");
 
  while (!client.connect(THINGNAME))
  {
    Serial.print(".");
    delay(100);
  }
 
  if (!client.connected())
  {
    Serial.println("AWS IoT Timeout!");
    return;
  }
 
  // Subscribe to a topic
  client.subscribe(MQTT_SUB_LAMP1);
  client.subscribe(MQTT_SUB_FURNACE);
  client.subscribe(MQTT_SUB_DOORS);
  Serial.println("AWS IoT Connected!");
}
 
 
void loop()
{

  client.loop();
  currentTime = millis();
  char message[] = "test";
  if(currentTime - lastTime >= 900000){
//  humidity = dht.readHumidity();
//  temp = dht.readTemperature();
  
  humidity= 49;
  temp = 21.3;
  publishMessage(humidity,temp);
  lastTime = millis();
  }
  currentTime2 = millis();
  if(currentTime2 - lastTime2 >= 1000){
  useOLED();
  lastTime2 = millis();
  
  }
  

  
}
