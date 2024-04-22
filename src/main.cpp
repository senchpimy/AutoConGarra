#include <pines.h>
#ifdef EMISOR
/*
Este es el codigo de el esp32 el cual se conecta a la computadora
*/
#include <Arduino.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>
#include <esp_now.h>
#include <WiFi.h>
uint8_t broadcastAddress[] = {0x10, 0x06, 0x1C, 0x82, 0xCA, 0x98}; //MODIFICAR SEGUN EL ESP32
const int NUM_VALORES = 5;
const char* nombres[NUM_VALORES] = {"garra", "muneca", "codo", "hombro", "rotacion"};
int posiciones[NUM_VALORES] = {0};

typedef struct brazo {
  int garra;
  int muneca;
  int codo;
  int hombro;
  int rotacion;
} brazo;

brazo myData;
esp_now_peer_info_t peerInfo;
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  if (status != ESP_NOW_SEND_SUCCESS){
    Serial.print("Error Enviando los datos: ");
    Serial.print(status);
    Serial.println();
  }
}

void setup() {
  Serial.begin(115200);
  ////////////////////////////////////////////////////
  WiFi.mode(WIFI_STA); //Modo de estacion

  if (esp_now_init() != ESP_OK) {
    Serial.println("Error Iniciando ESP-NOW");
    return;
  }

  esp_now_register_send_cb(OnDataSent);
  
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;  
  peerInfo.encrypt = false;
  
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("Error COnectando con el receptor");
    return;
  }
}

JsonDocument doc;

int sendBrazo(){
  esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &myData, sizeof(myData));
   
  if (result != ESP_OK) {
    return -1;
  }
  return 0;
}


void loop() {
  if (!Serial.available()){
    return;
  }
  auto s = Serial.readStringUntil('\n');
  auto error = deserializeJson(doc,s);
  if (error){
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }
  bool conectado = doc["conectado"] | false;
  if (conectado){
    Serial.println("Respuesta desde el ESP32");
    return;
  }
  JsonArray arr = doc["posiciones"];
  if (!arr){
    Serial.println("El Arrays posiciones no existe");
    return;
  }
for (JsonObject v : arr) {
    const char* nombre = v["nombre"].as<const char*>();
    if (nombre) {
        for (int i = 0; i < NUM_VALORES; ++i) {
            if (strcmp(nombre, nombres[i]) == 0) {
                posiciones[i] = v["pos"];
                break;
            }
        }
    }
}

// Asigna las posiciones según los nombres específicos
myData.garra = posiciones[0];
myData.muneca = posiciones[1];
myData.codo = posiciones[2];
myData.hombro = posiciones[3];
myData.rotacion = posiciones[4];
if (sendBrazo()==-1){
  Serial.println("Error Enviando datos");
  return;
}
Serial.println("0");
}
#endif