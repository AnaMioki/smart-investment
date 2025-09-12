//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package school.sptech;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

public class ExecutarLog {
    void carregarLog(Integer quantidade) {
        LocalDateTime dataAtual = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yy HH:mm:ss:SS");
        dataAtual.format(formatter);

        try {
            for(int i = 1; i <= quantidade; ++i) {
                dataAtual = LocalDateTime.now();
                String dataFormatada = dataAtual.format(formatter);
                Integer numAleatorio = ThreadLocalRandom.current().nextInt(1, quantidade);
                System.out.println(dataFormatada + "  -  Lendo o " + i + "º arquivo:   ");
                Thread.sleep(1000L);

                for(int j = 1; j <= numAleatorio; ++j) {
                    dataAtual = LocalDateTime.now();
                    dataFormatada = dataAtual.format(formatter);
                    Thread.sleep(100L);
                    System.out.println(dataFormatada + " -  " + i + "º arquivo: " + j + "º instância processada.  ");
                }

                System.out.println("\n \n ");
            }
        } catch (InterruptedException var8) {
            System.err.println("Deu pau");
        }

        System.err.println("Programa finalizou com erro no arquivo final!");
    }
}
