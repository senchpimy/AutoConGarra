use crate::tresd;
use eframe::{egui, egui_glow, glow};
use egui::mutex::Mutex;
use egui::{Ui, Vec2};
use std::sync::Arc;

struct Brazo {
    nombre: String,
    pos: f32,
}

impl Brazo {
    fn new(nombre: String, pos: f32) -> Self {
        Self { nombre, pos }
    }
}
impl Default for Brazo {
    fn default() -> Self {
        Self {
            ..Default::default()
        }
    }
}

pub struct GripperApp {
    garra: Brazo,
    muñeca: Brazo,
    codo: Brazo,
    hombro: Brazo,
    rotacion: Brazo,
    angle: f32,
    angle2: f32,
    brazo: Arc<Mutex<tresd::RotatingTriangle>>,
}

impl GripperApp {
    fn start(gl: &glow::Context) -> Self {
        Self {
            garra: Brazo::new(String::from("garra"), 0.),
            muñeca: Brazo::new(String::from("muñeca"), 90.),
            codo: Brazo::new(String::from("codo"), 90.),
            hombro: Brazo::new(String::from("hombro"), 0.),
            rotacion: Brazo::new(String::from("rotacion"), 0.),
            angle: 0.,
            angle2: 0.,
            brazo: Arc::new(Mutex::new(tresd::RotatingTriangle::new(gl))),
        }
    }

    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        let gl = cc
            .gl
            .as_ref()
            .expect("You need to run eframe with the glow backend");
        Self::start(gl)
    }
}

impl eframe::App for GripperApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ctx, |ui| {
            egui::Frame::canvas(ui.style()).show(ui, |ui| {
                self.custom_painting(ui);
            });
            crear_slider(ui, &mut self.garra);
            crear_slider(ui, &mut self.muñeca);
            crear_slider(ui, &mut self.codo);
            crear_slider(ui, &mut self.hombro);
            crear_slider(ui, &mut self.rotacion);
        });
    }
    fn on_exit(&mut self, gl: Option<&glow::Context>) {
        if let Some(gl) = gl {
            self.brazo.lock().destroy(gl);
        }
    }
}

fn crear_slider(ui: &mut Ui, var: &mut Brazo) {
    ui.add(egui::Slider::new(&mut var.pos, 0.0..=180.0).text(&var.nombre));
}
impl GripperApp {
    fn custom_painting(&mut self, ui: &mut egui::Ui) {
        let (rect, response) = ui.allocate_exact_size(Vec2::new(100., 100.), egui::Sense::drag());

        self.angle += response.drag_motion().x * 0.01;
        self.angle2 += response.drag_motion().y * 0.01;

        // Clone locals so we can move them into the paint callback:
        let angle = self.angle;
        let rotating_triangle = self.brazo.clone();

        let callback = egui::PaintCallback {
            rect,
            callback: std::sync::Arc::new(egui_glow::CallbackFn::new(move |_info, painter| {
                rotating_triangle.lock().paint(painter.gl(), angle); //cambiar angulo
            })),
        };
        ui.painter().add(callback);
    }
}
