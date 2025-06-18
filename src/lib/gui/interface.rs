use gpui::{div, prelude::*, px, rgb, Context, SharedString, Window};
use gpui_component::button::Button;

pub struct HomeView {
    pub text: String,
}

impl Render for HomeView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .gap_4()
            .bg(rgb(0x505050))
            .size(px(500.0))
            .justify_center()
            .items_center()
            .shadow_lg()
            .border_1()
            .border_color(rgb(0x0000ff))
            .text_xl()
            .text_color(rgb(0xffffff))
            .child(format!("Barcode Generator"))
            .child(
                div()
                    .flex()
                    .flex_col()
                    .gap_2()
                    .child(div().child("Enter text to encode:"))
                    .child(div().child(format!("{}", &self.text)))
                    .child(div().child("Select barcode format:")), // You can add a dropdown or list here if needed
            )
            .child(
                div()
                    .flex()
                    .gap_2()
                    .child(
                        Button::new("generate_png")
                            .label("Generate PNG")
                            .on_click(|_, _, _| {
                                // Handle PNG generation
                            }),
                    )
                    .child(Button::new("generate_svg").label("Generate SVG").on_click(
                        |_, _, _| {
                            // Handle SVG generation
                        },
                    )),
            )
            .child(div().child("Generated barcode will appear here"))
    }
}

pub struct HelloWorld {
    pub text: SharedString,
}

impl Render for HelloWorld {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .gap_3()
            .bg(rgb(0x505050))
            .size(px(500.0))
            .justify_center()
            .items_center()
            .shadow_lg()
            .border_1()
            .border_color(rgb(0x0000ff))
            .text_xl()
            .text_color(rgb(0xffffff))
            .child(format!("Hello, {}!", &self.text))
            .child(
                div()
                    .flex()
                    .gap_2()
                    .child(div().size_8().bg(gpui::red()))
                    .child(div().size_8().bg(gpui::green()))
                    .child(div().size_8().bg(gpui::blue()))
                    .child(div().size_8().bg(gpui::yellow()))
                    .child(div().size_8().bg(gpui::black()))
                    .child(div().size_8().bg(gpui::white())),
            )
    }
}
