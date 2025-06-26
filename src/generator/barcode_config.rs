use image::Rgb;
use serde::{Deserialize, Serialize};
use zxingcpp::BarcodeFormat;

// nOt serializable
pub struct BarcodeConfigInternal {
    pub format: BarcodeFormat,
    pub texts: Vec<BarcodeTextStyleConfigInternal>,
    pub scale: i32,
    pub quiet_zones: bool,
    pub dimensions: BarcodeDimensions,
    pub data: String,
}

pub struct BarcodeTextStyleConfigInternal {
    pub text: String,
    pub text_color: Rgb<u8>,
    pub text_size: u32,
    pub text_position: TextPosition,
    pub font: String,
    pub margin: u32,
}

// Serializable config for  tauri frontend
#[derive(Clone, Serialize, Deserialize)]
pub struct BarcodeConfig {
    pub format: BarcodeFormatWrapper,
    pub texts: Vec<BarcodeTextStyleConfig>,
    pub scale: i32,
    pub quiet_zones: bool,
    pub dimensions: BarcodeDimensions,
    pub data: String,
}

impl From<BarcodeConfig> for BarcodeConfigInternal {
    fn from(config: BarcodeConfig) -> Self {
        BarcodeConfigInternal {
            format: config.format.into(),
            texts: config
                .texts
                .into_iter()
                .map(|text| BarcodeTextStyleConfigInternal {
                    text: text.text,
                    text_color: text.text_color.into(),
                    text_size: text.text_size,
                    text_position: text.text_position,
                    font: text.font,
                    margin: text.margin,
                })
                .collect(),
            scale: config.scale,
            quiet_zones: config.quiet_zones,
            dimensions: config.dimensions,
            data: config.data,
        }
    }
}

// Manuallty create wrapper for BarcodeFormat to be serializable
#[derive(Clone, Serialize, Deserialize)]
pub struct BarcodeFormatWrapper {
    pub format: String,
}

impl From<BarcodeFormatWrapper> for BarcodeFormat {
    fn from(wrapper: BarcodeFormatWrapper) -> Self {
        match wrapper.format.as_str() {
            "Code128" => BarcodeFormat::Code128,
            "Code39" => BarcodeFormat::Code39,
            "QRCode" => BarcodeFormat::QRCode,
            "EAN13" => BarcodeFormat::EAN13,
            "EAN8" => BarcodeFormat::EAN8,
            "UPCA" => BarcodeFormat::UPCA,
            "UPCE" => BarcodeFormat::UPCE,
            "DataMatrix" => BarcodeFormat::DataMatrix,
            "PDF417" => BarcodeFormat::PDF417,
            "Aztec" => BarcodeFormat::Aztec,
            _ => BarcodeFormat::Code128, // Default fallback
        }
    }
}

impl From<BarcodeFormat> for BarcodeFormatWrapper {
    fn from(format: BarcodeFormat) -> Self {
        let format_str = match format {
            BarcodeFormat::Code128 => "Code128",
            BarcodeFormat::Code39 => "Code39",
            BarcodeFormat::QRCode => "QRCode",
            BarcodeFormat::EAN13 => "EAN13",
            BarcodeFormat::EAN8 => "EAN8",
            BarcodeFormat::UPCA => "UPCA",
            BarcodeFormat::UPCE => "UPCE",
            BarcodeFormat::DataMatrix => "DataMatrix",
            BarcodeFormat::PDF417 => "PDF417",
            BarcodeFormat::Aztec => "Aztec",
            BarcodeFormat::Codabar => "Codabar",
            BarcodeFormat::Code93 => "Code93",
            BarcodeFormat::DataBar => "DataBar",
            BarcodeFormat::DataBarExpanded => "DataBarExpanded",
            BarcodeFormat::DataBarLimited => "DataBarLimited",
            BarcodeFormat::ITF => "ITF",
            BarcodeFormat::MaxiCode => "MaxiCode",
            BarcodeFormat::MicroQRCode => "MicroQRCode",
            BarcodeFormat::RMQRCode => "RMQRCode",
            BarcodeFormat::DXFilmEdge => "DXFilmEdge",
            BarcodeFormat::LinearCodes => "LinearCodes",
            BarcodeFormat::MatrixCodes => "MatrixCodes",
            BarcodeFormat::Any => "Any",
            BarcodeFormat::None => "None",
        };
        BarcodeFormatWrapper {
            format: format_str.to_string(),
        }
    }
}

#[derive(Clone, Serialize, Deserialize)]
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

#[derive(Clone, Serialize, Deserialize)]
pub struct BarcodeTextStyleConfig {
    pub text: String,
    pub text_color: RgbWrapper,
    pub text_size: u32,
    pub text_position: TextPosition,
    pub font: String,
    pub margin: u32,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct RgbWrapper {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

impl From<RgbWrapper> for Rgb<u8> {
    fn from(wrapper: RgbWrapper) -> Self {
        Rgb([wrapper.r, wrapper.g, wrapper.b])
    }
}

impl From<Rgb<u8>> for RgbWrapper {
    fn from(rgb: Rgb<u8>) -> Self {
        RgbWrapper {
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
        }
    }
}

#[derive(Clone, PartialEq, Serialize, Deserialize)]
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
            format: BarcodeFormatWrapper {
                format: "Code128".to_string(),
            },
            texts: vec![],
            scale: 10,
            quiet_zones: true,
            dimensions: BarcodeDimensions::new(),
            data: String::new(),
        }
    }

    pub fn set_format(&mut self, format: BarcodeFormat) -> &mut Self {
        self.config.format = format.into();
        self
    }

    pub fn set_scale(&mut self, scale: i32) -> &mut Self {
        self.config.scale = scale;
        self
    }

    pub fn add_text(
        &mut self,
        text: &str,
        text_color: Rgb<u8>,
        text_size: u32,
        text_position: TextPosition,
    ) -> &mut Self {
        self.config.texts.push(BarcodeTextStyleConfig {
            text: text.to_string(),
            text_color: text_color.into(),
            text_size,
            text_position,
            font: "DejaVuSans".to_string(),
            margin: 5,
        });
        self
    }

    pub fn resize_height_percentage(&mut self, percentage: f32) -> &mut Self {
        self.config.dimensions = self.config.dimensions.resize_height_percentage(percentage);
        self
    }

    pub fn resize_width_percentage(&mut self, percentage: f32) -> &mut Self {
        self.config.dimensions = self.config.dimensions.resize_width_percentage(percentage);
        self
    }

    pub fn build(&self) -> BarcodeConfig {
        self.config.clone()
    }
}
