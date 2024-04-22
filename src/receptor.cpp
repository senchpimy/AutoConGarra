#include <pines.h>
#ifdef RECEPTOR
#include <esp_now.h>
#include <WiFi.h>
#include <ESP32Servo.h>
#include <Arduino.h>
TaskHandle_t Task1;


void brazo_mov(void *);
////////////////////////
Servo servo;
Servo MotorIzquierdoFrente;
Servo MotorIzquierdoAtras;
Servo MotorDerechoFrente;
Servo MotorDerechoAtras;
int pinEntradaHorizontal = 35;
int pinEntradaVertical = 34;

//int pinServo=26;

const int SentidoHorario = 5;
const int SentidoAntihorario = 170;
const int Detenido = 90;
////////////////////////

typedef struct brazo {
  int garra;
  int muneca;
  int codo;
  int hombro;
  int rotacion;
} brazo;

brazo myData;
const int NUM_VALORES = 5;
Servo servos[NUM_VALORES]={};

void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  memcpy(&myData, incomingData, sizeof(myData));
}
 
void setup() {
  WiFi.mode(WIFI_STA);
  Serial.begin(115200);
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  esp_now_register_recv_cb(OnDataRecv);
  int pines[NUM_VALORES]={
    SERVO_GARRA_PIN,
    SERVO_MUNECA_PIN,
    SERVO_CODO_PIN,
    SERVO_HOMBRO_PIN,
    SERVO_ROTACION_PIN,
    };
  for (int i = 0; i<NUM_VALORES; i++){
    servos[i].attach(pines[i]);
    servos[i].write(0);
  }
  xTaskCreatePinnedToCore(
      brazo_mov, /* Function to implement the task */
      "Task1", /* Name of the task */
      10000,  /* Stack size in words */
      NULL,  /* Task input parameter */
      0,  /* Priority of the task */
      &Task1,  /* Task handle. */
      0); /* Core where the task should run */
  ///////////////////////////////////////////////////////
  MotorDerechoFrente.attach(LLANTA_FRENTE_DER);
  MotorIzquierdoFrente.attach(LLANTA_FRENTE_IZQ);
  MotorDerechoAtras.attach(LLANTA_ATRAS_DER); 
  MotorIzquierdoAtras.attach(LLANTA_ATRAS_IZQ);
  analogReadResolution(10);

}
 
void brazo_mov(void *) {
  int max_garra = 110;
  int min_garra = 0;
  for (;;){
    int mappedValue = map(myData.garra, 0, 180, min_garra, max_garra);
    servos[0].write(mappedValue);
    servos[1].write(myData.muneca);
    servos[2].write(myData.codo);
    servos[3].write(myData.hombro);
    servos[4].write(myData.rotacion);
  }
}

/////////////////////////////////////////////////


void MoverAtras(){
  MotorIzquierdoFrente.write(SentidoAntihorario);
  MotorDerechoFrente.write(SentidoHorario);
  //MotorIzquierdoAtras.write(SentidoAntihorario);
  //MotorDerechoAtras.write(SentidoHorario);

}

void MoverAdelante(){
  MotorIzquierdoFrente.write(SentidoHorario);
   MotorDerechoFrente.write(SentidoAntihorario);
  //MotorIzquierdoAtras.write(SentidoHorario);
  //MotorDerechoAtras.write(SentidoAntihorario);
}

void Moverderecha(){
  MotorDerechoFrente.write(SentidoAntihorario);
  MotorIzquierdoFrente.write(SentidoAntihorario);
   //MotorDerechoFrente.write(Detenido);
  //MotorIzquierdoAtras.write(Detenido);
}

void MoverIzquierda(){
  MotorDerechoFrente.write(SentidoHorario);
  MotorIzquierdoFrente.write(SentidoHorario);
  //MotorIzquierdoFrente.write(SentidoAntihorario);
  //MotorIzquierdoAtras.write(Detenido);

}

void Detener(){
  MotorDerechoFrente.write(Detenido);
  MotorDerechoAtras.write(Detenido);
  MotorIzquierdoFrente.write(Detenido);
  MotorIzquierdoAtras.write(Detenido);
}

long tiempoDeInicio = millis();



void loop() { 
  int posicionHorizontal= analogRead(JOYSTICK_X);
  int posicionVertical = analogRead(JOYSTICK_Y);
  Serial.printf("horizontal ");
  Serial.println( posicionHorizontal);
  Serial.printf("vertical ");
  Serial.println( posicionVertical);
  delay(100);
  if(posicionHorizontal < 400){
   Serial.println("IZQ");
    MoverIzquierda();
  }else if(posicionHorizontal > 900){
   Serial.println("DER");
    Moverderecha();
  }else if (posicionVertical < 400)
  {
   Serial.println("ATR");
    MoverAtras();
  }else if(posicionVertical >900){
   Serial.println("ADE");
    MoverAdelante();
  }else{
     Serial.println("STOP");
      Detener();
  }
} 
#endif