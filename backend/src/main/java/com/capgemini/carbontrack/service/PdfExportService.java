package com.capgemini.carbontrack.service;

import com.capgemini.carbontrack.dto.response.SiteResponse;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PdfExportService {

    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(109, 40, 217);
    private static final DeviceRgb LIGHT_GRAY = new DeviceRgb(248, 250, 252);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final SiteService siteService;

    public byte[] exportSiteReport(SiteResponse site) {
        var baos = new ByteArrayOutputStream();
        try (var pdf = new PdfDocument(new PdfWriter(baos));
             var doc = new Document(pdf)) {

            addTitle(doc, site.name());
            addSection(doc, "Informations du site");
            addInfoTable(doc, site);
            addSection(doc, "Empreinte Carbone");
            addKpiTable(doc, site);
            if (site.materials() != null && !site.materials().isEmpty()) {
                addSection(doc, "Matériaux de construction");
                addMaterialsTable(doc, site);
            }
            addFooter(doc);
        }
        return baos.toByteArray();
    }

    private void addTitle(Document doc, String siteName) {
        doc.add(new Paragraph("RAPPORT EMPREINTE CARBONE")
            .setFontSize(20)
            .setBold()
            .setFontColor(PRIMARY_COLOR)
            .setTextAlignment(TextAlignment.CENTER));
        doc.add(new Paragraph(siteName)
            .setFontSize(14)
            .setTextAlignment(TextAlignment.CENTER)
            .setMarginBottom(20));
    }

    private void addSection(Document doc, String title) {
        doc.add(new Paragraph(title)
            .setFontSize(13)
            .setBold()
            .setFontColor(PRIMARY_COLOR)
            .setMarginTop(15)
            .setMarginBottom(5));
    }

    private void addInfoTable(Document doc, SiteResponse site) {
        var table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
            .setWidth(UnitValue.createPercentValue(100));
        addRow(table, "Surface", formatValue(site.surfaceM2()) + " m²");
        addRow(table, "Ville", site.city() != null ? site.city() : "-");
        addRow(table, "Places de parking", String.valueOf(site.parkingSpaces() != null ? site.parkingSpaces() : 0));
        addRow(table, "Employés", String.valueOf(site.employeesCount() != null ? site.employeesCount() : 0));
        addRow(table, "Postes de travail", String.valueOf(site.workstationsCount() != null ? site.workstationsCount() : 0));
        addRow(table, "Consommation énergétique", formatValue(site.annualEnergyKwh()) + " kWh/an");
        addRow(table, "Année de construction", String.valueOf(site.buildingYear() != null ? site.buildingYear() : "-"));
        doc.add(table);
    }

    private void addKpiTable(Document doc, SiteResponse site) {
        if (site.latestCalculation() == null) {
            doc.add(new Paragraph("Aucun calcul effectué").setItalic().setFontColor(ColorConstants.GRAY));
            return;
        }
        var calc = site.latestCalculation();
        var table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
            .setWidth(UnitValue.createPercentValue(100));
        addRow(table, "CO₂ Construction", formatTonnes(calc.constructionCo2Kg()) + " tCO₂e");
        addRow(table, "CO₂ Exploitation (annuel)", formatTonnes(calc.exploitationCo2Kg()) + " tCO₂e/an");
        addRow(table, "CO₂ Total (sur durée de vie)", formatTonnes(calc.totalCo2Kg()) + " tCO₂e");
        addRow(table, "CO₂ par m²", formatValue(calc.co2PerM2()) + " kgCO₂e/m²");
        addRow(table, "CO₂ par employé", formatValue(calc.co2PerEmployee()) + " kgCO₂e/employé");
        addRow(table, "Calculé le", calc.calculatedAt() != null ? calc.calculatedAt().format(DATE_FMT) : "-");
        doc.add(table);
    }

    private void addMaterialsTable(Document doc, SiteResponse site) {
        var table = new Table(UnitValue.createPercentArray(new float[]{30, 20, 20, 15, 15}))
            .setWidth(UnitValue.createPercentValue(100));
        table.addHeaderCell(headerCell("Matériau"));
        table.addHeaderCell(headerCell("Catégorie"));
        table.addHeaderCell(headerCell("Quantité (kg)"));
        table.addHeaderCell(headerCell("Facteur (kgCO₂e/kg)"));
        table.addHeaderCell(headerCell("CO₂ (kgCO₂e)"));
        site.materials().forEach(m -> {
            table.addCell(m.materialName());
            table.addCell(m.category() != null ? m.category() : "-");
            table.addCell(formatValue(m.quantityKg()));
            table.addCell(formatValue(m.emissionFactor()));
            table.addCell(formatValue(m.co2Kg()));
        });
        doc.add(table);
    }

    private void addFooter(Document doc) {
        doc.add(new Paragraph("\nFacteurs d'émission: ADEME Base Carbone 2023 | Électricité: 0.0567 kgCO₂e/kWh")
            .setFontSize(8)
            .setFontColor(ColorConstants.GRAY)
            .setTextAlignment(TextAlignment.CENTER)
            .setMarginTop(20));
    }

    private void addRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()).setBackgroundColor(LIGHT_GRAY));
        table.addCell(new Cell().add(new Paragraph(value)));
    }

    private Cell headerCell(String text) {
        return new Cell().add(new Paragraph(text).setBold().setFontColor(ColorConstants.WHITE))
            .setBackgroundColor(PRIMARY_COLOR);
    }

    private String formatValue(BigDecimal value) {
        if (value == null) return "-";
        return value.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    private String formatTonnes(BigDecimal kgValue) {
        if (kgValue == null) return "-";
        return kgValue.divide(BigDecimal.valueOf(1000), 2, RoundingMode.HALF_UP).toPlainString();
    }
}
