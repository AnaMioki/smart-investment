//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package school.sptech;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        ExecutarLog logInfo = new ExecutarLog();
        Scanner sc = new Scanner(System.in);
        System.out.println("Bem vindo(a) a Smart Investment! \n\n  Insira a quantidade de arquivos a serem processadas:");

        try {
            Thread.sleep(1000L);
            Integer numero = sc.nextInt();
            logInfo.carregarLog(numero);
        } catch (InterruptedException var4) {
            System.err.println("Erro ao inciar o arquivo!");
        }

    }
}
