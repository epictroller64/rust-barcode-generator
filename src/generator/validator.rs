use zxingcpp::BarcodeFormat;

use crate::generator::barcode_config::{BarcodeConfig, BarcodeConfigInternal};

// Different barcodes have different requirements
// For example QR code needs square dimensions
// Some barcodes need values limited to certain characters

// Validates internal config

// Ignore it for now, create rules in frontend instead

pub fn validate_barcode_config(config: &BarcodeConfigInternal) -> anyhow::Result<()> {
    if config.texts.is_empty() {
        return Err(anyhow::anyhow!("No texts provided"));
    }

    Ok(())
}

fn validate_code_bar_config(config: &BarcodeConfigInternal) -> anyhow::Result<()> {
    if config.format == BarcodeFormat::Codabar {
        if config.data.len() > 16 {
            return Err(anyhow::anyhow!(
                "Codabar barcode can only have 16 characters"
            ));
        }
    }

    Ok(())
}

fn validate_databar_config(config: &BarcodeConfigInternal) -> anyhow::Result<()> {
    if config.format == BarcodeFormat::DataBar {
        if config.data.len() > 99 {
            return Err(anyhow::anyhow!(
                "DataBar barcode can only have 99 characters"
            ));
        }
    }

    Ok(())
}

fn validate_databar_expanded_config(config: &BarcodeConfigInternal) -> anyhow::Result<()> {
    if config.format == BarcodeFormat::DataBarExpanded {
        // DataBar Expanded data must only contain ISO/IEC 8859-1 characters.
        // This corresponds to Unicode code points U+0000 to U+00FF.
        if config.data.chars().any(|c| c as u32 > 255) {
            return Err(anyhow::anyhow!(
                "Invalid character in DataBar Expanded data: only ISO/IEC 8859-1 characters are supported."
            ));
        }
    }
    Ok(())
}

fn validate_code39_config(config: &BarcodeConfigInternal) -> anyhow::Result<()> {
    if config.format == BarcodeFormat::Code39 {
        if config.data.len() > 99 {
            return Err(anyhow::anyhow!(
                "Code39 barcode can only have 99 characters"
            ));
        }
    }

    Ok(())
}

fn validate_upce_config(config: &BarcodeConfigInternal) -> anyhow::Result<()> {
    if config.format == BarcodeFormat::UPCE {
        if config.data.len() > 8 {
            return Err(anyhow::anyhow!("UPCE barcode can only have 8 characters"));
        }
    }

    Ok(())
}
