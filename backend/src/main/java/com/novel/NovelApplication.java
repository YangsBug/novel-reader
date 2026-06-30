package com.novel;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
@MapperScan("com.novel.mapper")
public class NovelApplication {
    public static void main(String[] args) {
        SpringApplication.run(NovelApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        System.out.println("\n========================================");
        System.out.println("  启动成功！");
        System.out.println("========================================\n");
    }
}
