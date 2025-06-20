use image::Rgb;
use zxingcpp::BarcodeFormat;

#[derive(Clone)]
pub struct BarcodeConfig {
    pub format: BarcodeFormat,
    pub texts: Vec<BarcodeTextStyleConfig>,
    pub scale: i32,
    pub quiet_zones: bool,
    pub dimensions: BarcodeDimensions,
}

#[derive(Clone)]
pub struct BarcodeDimensions {
    pub height_percentage: f32,
    pub width_percentage: f32,
    pub width_mm: f32,
    pub height_mm: f32,
}

impl BarcodeDimensions {
    pub fn new() -> Self {
        Self {
            height_percentage: 100.0,
            width_percentage: 100.0,
            width_mm: 48.5, // Default for code39
            height_mm: 16.9,
        }
    }

    pub fn resize_height_mm(&self, height: f32) -> Self {
        Self {
            height_mm: height,
            ..*self
        }
    }
    pub fn resize_width_mm(&self, width: f32) -> Self {
        Self {
            width_mm: width,
            ..*self
        }
    }

    pub fn resize_height_percentage(&self, percentage: f32) -> Self {
        Self {
            height_percentage: percentage,
            ..*self
        }
    }

    pub fn resize_width_percentage(&self, percentage: f32) -> Self {
        Self {
            width_percentage: percentage,
            ..*self
        }
    }
}

#[derive(Clone)]
pub struct BarcodeTextStyleConfig {
    pub text: String,
    pub text_color: Rgb<u8>,
    pub text_size: u32,
    pub text_position: TextPosition,
    pub font: String,
    pub margin: u32,
}

#[derive(Clone)]
pub enum TextPosition {
    Upper,
    Lower,
    None,
    UpperCenter,
    LowerCenter,
}

pub struct BarcodeConfigBuilder {
    config: BarcodeConfig,
}

impl BarcodeConfigBuilder {
    pub fn new() -> Self {
        Self {
            config: Self::default_config(),
        }
    }

    fn default_config() -> BarcodeConfig {
        BarcodeConfig {
            format: BarcodeFormat::Code128,
            texts: vec![],
            scale: 10,
            quiet_zones: true,
            dimensions: BarcodeDimensions::new(),
        }
    }

    pub fn set_format(&self, format: BarcodeFormat) -> Self {
        Self {
            config: BarcodeConfig {
                format,
                ..self.config.clone()
            },
        }
    }

    pub fn set_scale(&self, scale: i32) -> Self {
        Self {
            config: BarcodeConfig {
                scale,
                ..self.config.clone()
            },
        }
    }

    pub fn add_text(
        &self,
        text: &str,
        text_color: Rgb<u8>,
        text_size: u32,
        text_position: TextPosition,
    ) -> Self {
        let mut texts = self.config.texts.clone();
        texts.push(BarcodeTextStyleConfig {
            text: text.to_string(),
            text_color,
            text_size,
            text_position,
            margin: 5,
            font: "DejaVuSans".to_string(),
        });
        Self {
            config: BarcodeConfig {
                texts,
                ..self.config.clone()
            },
        }
    }

    pub fn resize_height_percentage(&self, percentage: f32) -> Self {
        Self {
            config: BarcodeConfig {
                dimensions: self.config.dimensions.resize_height_percentage(percentage),
                ..self.config.clone()
            },
        }
    }

    pub fn resize_width_percentage(&self, percentage: f32) -> Self {
        Self {
            config: BarcodeConfig {
                dimensions: self.config.dimensions.resize_width_percentage(percentage),
                ..self.config.clone()
            },
        }
    }

    pub fn build(&self) -> BarcodeConfig {
        self.config.clone()
    }
}
