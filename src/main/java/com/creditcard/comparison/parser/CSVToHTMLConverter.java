package com.creditcard.comparison.parser;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;

import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class CSVToHTMLConverter {

    @PostConstruct
    public void convertCSVtoHTML() {

        String csvPath = "src/main/resources/data/credit_cards.csv";
        String htmlPath = "src/main/resources/data/cards.html";

        try (BufferedReader br = new BufferedReader(new FileReader(csvPath));
             FileWriter fw = new FileWriter(htmlPath)) {

            StringBuilder html = new StringBuilder();
            html.append("<html><body>");

            String line;
            boolean firstLine = true;

            while ((line = br.readLine()) != null) {

                if (line.trim().isEmpty()) continue;

                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                String[] data = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");

                if (data.length < 7) continue;

                html.append("<div class='card'>");
                html.append("<h2>").append(data[0]).append("</h2>");
                html.append("<p class='text'>")
                    .append(data[5]).append(" ").append(data[6])
                    .append("</p>");
                html.append("</div>");
            }

            html.append("</body></html>");

            fw.write(html.toString());

            System.out.println("✅ HTML file created from CSV");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}