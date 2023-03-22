#include "secrets.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <time.h>
#include <ArduinoJson.h>
#define MQTT_PUB_SENSORS "esp32/sensors"

WiFiClientSecure net = WiFiClientSecure();
BearSSL::X509List cert(AWS_CERT_CA);
BearSSL::X509List client_crt(AWS_CERT_CRT);
BearSSL::PrivateKey key(AWS_CERT_PRIVATE);
PubSubClient client(net);
Adafruit_BMP280 bmp;
unsigned long currentTime;
unsigned long lastTime;
float pressure;
float temp;

time_t now;
time_t nowish = 1510592825;
 
 
void NTPConnect(void)
{
  Serial.print("Setting time using SNTP");
  configTime(TIME_ZONE * 3600, 0 * 3600, "pool.ntp.org", "time.nist.gov");
  now = time(nullptr);
  while (now < nowish)
  {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println("done!");
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.print("Current time: ");
  Serial.print(asctime(&timeinfo));
}
 

void messageHandler(char* topic, byte* payload, unsigned int length)
{
  Serial.print("incoming: ");
  Serial.println(topic);
}
 
void publishMessage(float pressure, float temp)
{
  StaticJsonDocument<200> doc;
  doc["deviceId"] = THINGNAME;
  doc["pressure"] = String(pressure);
  doc["temperature"] = String(temp);
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client
  client.publish(MQTT_PUB_SENSORS, jsonBuffer);
}

void setup()
{
  Serial.begin(115200);
  bmp.begin(0x76);
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                Adafruit_BMP280::STANDBY_MS_500);
                  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Connecting to Wi-Fi");
 
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  
  NTPConnect();
  net.setTrustAnchors(&cert);
  net.setClientRSACert(&client_crt, &key);
    client.setServer(AWS_IOT_ENDPOINT, 8883);
 
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
}
 
 
void loop()
{
  now = time(nullptr);
  client.loop();
  currentTime = millis();
  if(currentTime - lastTime >= 900000){
  pressure = bmp.readPressure();
  temp = bmp.readTemperature();
  publishMessage(pressure,temp);
  lastTime = millis();
  }


  
}
